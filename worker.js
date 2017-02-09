importScripts('plain-javascript.js', 'build/build-asm.asm.js', 'load-wasm.js')
const asm_nbOfPrimesFound = asmCall._nbOfPrimesFound
const wasm_nbOfPrimesFound = () => 'not implemented'

const functionsToBench = {plain_nbOfPrimesFound, asm_nbOfPrimesFound, wasm_nbOfPrimesFound}
onmessage = function({data}) {
  for(var name in functionsToBench) {
    const startTime = performance.now()
    const result = functionsToBench[name](data)
    const timeTaken = Math.round(performance.now() - startTime)
    postMessage({name, timeTaken, result})
  }
}
