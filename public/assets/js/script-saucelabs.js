function run() {
    let N = 3840
    let objectToSerialize = new Array(N)
    for (var i = 0; i < N; i++) {
        objectToSerialize[i] = i
    }
    let numberOfTimes = 2160

    if (USE_WORKER) {
        var worker = new Worker('assets/js/worker-saucelabs.js')
    }

    const callback =  ({data}) => {
        data.numberOfTimes = numberOfTimes
        data.lengthArray = N
        console.log(data)
        document.getElementById('results').innerHTML =
           `<pre id="details">${JSON.stringify(data, null, '\t')}</pre>`
    }
    if (USE_WORKER) {
        worker.onmessage = callback
        worker.postMessage({objectToSerialize, numberOfTimes})
   }
    else {
      try {
        const data = runTest(objectToSerialize, numberOfTimes)
        callback({data})
      }
      catch (exception) {
       document.getElementById('results').innerHTML = `<span id="details">${exception}</span>`
      }
    }
}
