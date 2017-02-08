importScripts('plain-javascript.js', 'build-asm.asm.js')

onmessage = function(e) {
  [plain_nbOfPrimesFound, asmCall._nbOfPrimesFound].forEach((curr, index, array) => {
    var t0 = performance.now()
    var res = curr(e.data[0])
    var t1 = performance.now()

    var timeTaken = t1 - t0;

    var msg = new Array(array.length)
    msg[index] = {timeTaken, result: res}
    postMessage(msg)
  })
}
