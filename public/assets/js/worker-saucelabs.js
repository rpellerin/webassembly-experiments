/**
 * NOTICE OF LICENSE
 *
 * This source file is licensed exclusively to Inovia Team.
 *
 * @copyright   Copyright (c) 2017 Inovia Team (http://www.inovia.fr)
 * @license     MIT
 * @author      The Inovia Dev Team
 */

/**
 * Worker which calls a function in ASM.js and measures:
 * - Encoding time
 * - Running time
 * - Decoding time
 **/

if (typeof importScripts !== 'undefined') { // If we are in the context of a worker
  importScripts('../../build/build-lodash.js', 'bufferio.js')
}

const callCFunction = function(name) {
  return function(objectToSerialize, args) {
    const stack = Runtime.stackSave() // Returns STACKTOP

    // Serialize on HEAP32 from offset 'stack >> 2', same as serializing on HEAPU8 from offset 'stack'
    let startTime = performance.now()
    const length = encode(objectToSerialize, HEAP32, stack >> 2)
    const encodingTime = performance.now() - startTime

    // Allocates 'length << 2' bytes of memory, because we need 4 bytes per unit since we use HEAP32
    const offset = Runtime.stackAlloc(length << 2) // Returns old STACKTOP and increases STACKTOP

    startTime = performance.now()
    const returnedValue = Module.asm['_'+name](offset, ...args) // The value returned by our function (a reference on HEAP)
    const runningTime = performance.now() - startTime

    Runtime.stackRestore(stack) // Reset STACKTOP to stack
    return {returnedValue, encodingTime, runningTime}
  }
}

const runTest = function(objectToSerialize, numberOfTimes) {
  const results = {
    totalEncodingTime: 0,
    totalRunningTime: 0,
    totalDecodingTime: 0,
  }

  while (numberOfTimes--) {
    let result = callCFunction('identity')(objectToSerialize, [])
    const startTime = performance.now()
    const decodedArray = decode(HEAP32, result.returnedValue >> 2) // identity needs >> 2
    result.decodingTime = performance.now() - startTime

    // assert(decodedArray == objectToSerialize, 'Decoded object doesn\'t match encoded object')

    results.totalEncodingTime += result.encodingTime
    results.totalRunningTime  += result.runningTime
    results.totalDecodingTime += result.decodingTime
  }

  return results
}

onmessage = function({data}) {
  const results = runTest(data.objectToSerialize, data.numberOfTimes)
  postMessage(results)
}
