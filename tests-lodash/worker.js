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
 * TODO
 **/

importScripts('lodash.js', 'bufferio.js')

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
    details: []
  }
  while (numberOfTimes--) {
    let result = callCFunction('identity')(objectToSerialize, [])
    const startTime = performance.now()
    const decodedArray = decode(HEAP32, result.returnedValue >> 2) // identity needs >> 2
    result.decodingTime = performance.now() - startTime

    // assert(decodedArray == objectToSerialize, 'Decoded object doesn\'t match encoded object')
    results.details.push(result)
  }

  let totalEncodingTime = 0
  let totalRunningTime = 0
  let totalDecodingTime = 0

  for (let i = 0; i < results.details.length; i++) {
    totalEncodingTime += results.details[i].encodingTime
    totalRunningTime  += results.details[i].runningTime
    totalDecodingTime += results.details[i].decodingTime
  }

  results.totalEncodingTime = totalEncodingTime
  results.totalRunningTime  = totalRunningTime
  results.totalDecodingTime = totalDecodingTime

  return results
}

onmessage = function({data}) {
  const results = runTest(data.objectToSerialize, data.numberOfTimes)
  postMessage(results)
}
