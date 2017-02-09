importScripts('plain-javascript.js', 'build/build-asm.asm.js', 'load-wasm.js')
const asm_nbOfPrimesFound = asmCall._nbOfPrimesFound
const wasm_nbOfPrimesFound = () => 'Not loaded yet'

const functionsToBench = {plain_nbOfPrimesFound, asm_nbOfPrimesFound, wasm_nbOfPrimesFound}
var upperLimitPrime = null

const runHandler = function(data) {
  for(var name in functionsToBench) {
    const startTime = performance.now()
    const result = functionsToBench[name](upperLimitPrime)
    const timeTaken = Math.round(performance.now() - startTime)
    postMessage({actionType: 'results', name, timeTaken, result})
  }
}

const initHandler = function(data) {
  upperLimitPrime = data.upperLimitPrime
  loadWebAssembly('build/build-wasm.wasm')
    .then( instance => {
      var exports = instance.exports // the exports of that instance
      functionsToBench.wasm_nbOfPrimesFound = exports._nbOfPrimesFound // our function
    })
    .catch( error => {
      functionsToBench.wasm_nbOfPrimesFound = () => error.message
    })
    .then( () => {
      postMessage({actionType:'ready'})
    })
}

onmessage = function({data}) {
  switch(data.actionType){
    case 'init': return initHandler(data)
    case 'run': return runHandler(data)
  }
}
