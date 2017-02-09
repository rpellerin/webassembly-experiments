importScripts('plain-javascript.js', 'build/build-asm.asm.js', 'load-wasm.js')
const asm_nbOfPrimesFound = asmCall._nbOfPrimesFound
const wasm_nbOfPrimesFound = () => 'Not loaded yet'

const functionsToBench = {plain_nbOfPrimesFound, asm_nbOfPrimesFound, wasm_nbOfPrimesFound}
var upperLimitPrime = null

const runHandler = function(data) {
  const timeTaken = {}
  for(var name in functionsToBench) {
    const startTime = performance.now()
    const result  = functionsToBench[name](upperLimitPrime)
    timeTaken[name] = Math.round(performance.now() - startTime)
    postMessage({actionType: 'result', name, timeTaken: timeTaken[name], result})
  }

  var min = {value: Infinity, name: null}
  console.log(min)
  for (var name in timeTaken) {
    if (min.value > timeTaken[name]) {
      min = {value: timeTaken[name], name}
    }
  }
  var max = {value: -1, name: null}
  for (var name in timeTaken) {
    if (max.value < timeTaken[name]) {
      max = {value: timeTaken[name], name}
    }
  }
  postMessage({actionType: 'timeResults', slow: max.name, fast: min.name})
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
