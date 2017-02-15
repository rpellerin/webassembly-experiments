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
 * This is a worker script. It runs the following "benchmarks" one by one, sequentially:
 * - Plain Javascript
 * - asm.js
 * - WebAssembly
 *
 * All these benchmarks run the same function, but compiled differently.
 * The last two benchmarks were build from a C function, the same function as
 * the one run in 'Plain Javascript'.
 *
 * The worker measures the run time of each function and returns it
 * (by posting a message).
 **/

importScripts('plain-javascript.js', 'build/build-asm.asm.js', 'load-wasm.js')
const asm_nbOfPrimesFound = (typeof asmCall != 'undefined') ? asmCall._nbOfPrimesFound : ( str => Pointer_stringify(Module._reverseString(allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL))) )
const wasm_nbOfPrimesFound = () => 'Not loaded yet'
const wasm_imprecise_nbOfPrimesFound = () => 'Not loaded yet'

const functionsToBench = {plain_nbOfPrimesFound, asm_nbOfPrimesFound, wasm_nbOfPrimesFound, wasm_imprecise_nbOfPrimesFound}
var upperLimitPrime = null

const runHandler = function(data) {
  const timeTaken = {}
  for(var name in functionsToBench) {
    const startTime = performance.now()
    const result  = functionsToBench[name](upperLimitPrime)
    if (isNaN(result)) { // We got an error message
      timeTaken[name] = Infinity
      var error = true
    }
    else {
      timeTaken[name] = Math.round(performance.now() - startTime)
      var error = false
    }
    postMessage({actionType: 'result', name, timeTaken: timeTaken[name], result, error})
  }

  var min = {value: Infinity, name: null}
  for (var name in timeTaken) {
    if (min.value > timeTaken[name]) {
      min = {value: timeTaken[name], name}
    }
  }
  var max = {value: 0, name: null}
  for (var name in timeTaken) {
    if (max.value < timeTaken[name]) {
      max = {value: timeTaken[name], name}
    }
  }
  postMessage({actionType: 'timeResults', slow: max.name, fast: min.name})
}

const loadWASM = function(file, functionTested) {
  return loadWebAssembly(file)
    .then( instance => {
      var exports = instance.exports // the exports of that instance
      functionsToBench[functionTested] = exports._nbOfPrimesFound // our function
    })
    .catch( error => {
      functionsToBench[functionTested] = () => error.message
    })
}

const initHandler = function(data) {
  upperLimitPrime = data.upperLimitPrime

  const buildWasm          = loadWASM('build/build-wasm.wasm', wasm_nbOfPrimesFound.name)
  const buildWasmImprecise = loadWASM('build/build-wasm-imprecise.wasm', wasm_imprecise_nbOfPrimesFound.name)

  Promise.all([buildWasm, buildWasmImprecise]).then( values => {
      postMessage({actionType:'ready'})
    })
}

onmessage = function({data}) {
  switch(data.actionType){
    case 'init': return initHandler(data)
    case 'run': return runHandler(data)
  }
}
