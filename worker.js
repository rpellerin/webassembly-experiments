importScripts('plain-javascript.js', 'build/build-asm.asm.js', 'load-wasm.js')
const asm_nbOfPrimesFound = asmCall._nbOfPrimesFound

const functionsToBench = {plain_nbOfPrimesFound, asm_nbOfPrimesFound}

const listenerBenchmarks = function({data}) {
  for(var name in functionsToBench) {
    const startTime = performance.now()
    const result = functionsToBench[name](data)
    const timeTaken = Math.round(performance.now() - startTime)
    postMessage({name, timeTaken, result})
  }
}

const listenerStart = function() {
  loadWebAssembly('build/build-wasm.wasm')
    .then( instance => {
      var exports = instance.exports // the exports of that instance
      functionsToBench.wasm_nbOfPrimesFound = exports._nbOfPrimesFound // our function
    }
    )
    .catch( error => {
      const wasm_nbOfPrimesFound = () => error.message
      functionsToBench.wasm_nbOfPrimesFound = wasm_nbOfPrimesFound
    })
    .then( () => {
      this.onmessage = listenerBenchmarks
      postMessage({ ready: true })
    })
}

onmessage = listenerStart
