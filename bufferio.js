// Size of the serialized object
const maxSize = 20000
// activate or deactivate the debug function
const IS_DEBUG_ACTIVE = true
const debug = IS_DEBUG_ACTIVE ? console.log : () => {}

// Supported types
const TYPE_STRING = 1, TYPE_ARRAY = 2, TYPE_INT = 3, TYPE_BOOL = 4, TYPE_OBJECT = 5

/**
 * StringPacket
 *
 * Structure of the packet
 * [Type, Length, Payload]
 *
 * Positions
 * Type := offset
 * Length := offset + 1
 * Payload := offset + 2
 *
 */
class StringPacket {
    static encode(stringToConvert, typedArray, offset) {
        typedArray[offset] = TYPE_STRING
        typedArray[offset + 1] = stringToConvert.length
        for (var i = 0; i < stringToConvert.length; i++) {
            // charCodeAt returns the representing UTF-16 code unit
            typedArray[offset + 2 + i] = stringToConvert.charCodeAt(i)
        }
        return stringToConvert.length + 2
    }

    static decode(typedArray, offset) {
        const lengthOfString = typedArray[offset]
        const payloadStart = offset + 1
        return String.fromCharCode(...typedArray.slice(payloadStart, payloadStart + lengthOfString))
    }
}

/**
 * ArrayPacket
 *
 * Structure of the Packet
 * [ Type, Length, Ref0, Ref1, ..., Ref N-1, Payload 0, Payload 0, ..., Payload N-1]
 *
 * Positions
 * Type := offset
 * Length := offset + 1
 * Ref X := offset + 2 + X
 * Payload 0 := offset + 2 + N
 * Payload X := Length(Payload X - 1) + Payload X - 1
 *
 */
class ArrayPacket {
    static encode(inputArray, typedArray, offset) {
        typedArray[offset] = TYPE_ARRAY
        typedArray[offset + 1] = inputArray.length
        let payloadOffset = offset + 2 + inputArray.length
        for (var x = 0; x < inputArray.length; x++) {
            typedArray[offset + 2 + x] = payloadOffset
            payloadOffset += encode(inputArray[x], typedArray, payloadOffset)
        }
        return payloadOffset - offset
    }

    static decode(typedArray, offset) {
        const lengthOfArray = typedArray[offset]
        let output = []
        for (var index = 0; index < lengthOfArray; index++) {
            output.push(decode(typedArray, typedArray[offset + index + 1]))
        }
        return output
    }
}

/**
 * IntPacket
 *
 * Structure of the packet
 * [Type, Payload]
 *
 * Positions
 * Type := offset
 * Payload := offset + 1
 *
 */
class IntPacket {
    static encode(input, typedArray, offset) {
        typedArray[offset] = TYPE_INT
        typedArray[offset + 1] = input
        return 2
    }

    static decode(typedArray, offset) {
        return typedArray[offset]
    }
}

/**
 * BoolPacket
 *
 * Structure of the packet
 * [Type, Payload]
 *
 * Positions
 * Type := offset
 * Payload := offset + 1
 *
 */
class BoolPacket {
    static encode(input, typedArray, offset) {
        typedArray[offset] = TYPE_BOOL
        typedArray[offset + 1] = input
        return 2
    }

    static decode(typedArray, offset) {
        return typedArray[offset] ? true : false
    }
}

/**
 * ObjectPacket
 *
 * Structure of the Packet
 * [ Type, RefKeys, RefValues, [ Key1, Key2, ... ], [ Val1, Val2, ... ] ]
 *
 * Positions
 * Type := offset
 * RefKeys := offset + 1
 * RefValues := offset + 2
 */
class ObjectPacket {
    static encode(inputObject, typedArray, offset) {
        let payloadOffset = offset + 3

        typedArray[offset] = TYPE_OBJECT

        typedArray[offset + 1] = payloadOffset
        payloadOffset += encode(Object.keys(inputObject), typedArray, payloadOffset)
        typedArray[offset + 2] = payloadOffset
        payloadOffset += encode(Object.values(inputObject), typedArray, payloadOffset)

        return payloadOffset - offset
    }

    static decode(typedArray, offset) {
        const keys = decode(typedArray, typedArray[offset])
        const values = decode(typedArray, typedArray[offset + 1])
        let output = {}
        for (var index = 0; index < keys.length; index++) {
            output[keys[index]] = values[index]
        }
        return output
    }
}

/**
 * Dispatcher
 */
function encode(input, typedArray, offset){
    if (typeof input === 'string') return StringPacket.encode(input, typedArray, offset)
    if (typeof input === 'number') return IntPacket.encode(input, typedArray, offset)
    if (typeof input === 'boolean') return BoolPacket.encode(input, typedArray, offset)
    if (typeof input === 'object' && !Array.isArray(input)) return ObjectPacket.encode(input, typedArray, offset)
    else return ArrayPacket.encode(input, typedArray, offset)
}

function decode(typedArray, offset) {
    switch (typedArray[offset]) {
        case TYPE_STRING: return StringPacket.decode(typedArray, offset + 1)
        case TYPE_INT: return IntPacket.decode(typedArray, offset + 1)
        case TYPE_BOOL: return BoolPacket.decode(typedArray, offset + 1)
        case TYPE_OBJECT: return ObjectPacket.decode(typedArray, offset + 1)
        case TYPE_ARRAY: return ArrayPacket.decode(typedArray, offset + 1)
        default: throw new Error('Unknown type ' + typedArray[offset] + ' at offset '+ offset)
    }
}

//let testBuffer = new ArrayBuffer(maxSize)
//let writableBuffer = new Uint8Array(testBuffer)
//
//let objectToSerialize = [{a: 1}, true, false, 34, {a:{b:2,c:4}}]
//encode(objectToSerialize, writableBuffer, 0)
////debug(writableBuffer)
//let result = decode(writableBuffer, 0)
//debug(result)
