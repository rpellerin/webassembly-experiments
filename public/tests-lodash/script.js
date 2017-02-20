function run() {
    let N = 3840
    let objectToSerialize = new Array(N)
    for (var i = 0; i < N; i++) {
        objectToSerialize[i] = i
    }
    let numberOfTimes = 2160

    if (USE_WORKER) {
        var worker = new Worker('worker.js')
    }

    const callback =  ({data}) => {
        document.getElementById('results').innerHTML +=
           `<ul>
                <li>Total encoding time for ${numberOfTimes} cycles: ${data.totalEncodingTime} ms</li>
                <li>Total running time for ${numberOfTimes} cycles: ${data.totalRunningTime} ms</li>
                <li>Total decoding time for ${numberOfTimes} cycles: ${data.totalDecodingTime} ms</li>
            </ul>`;
    }
    if (USE_WORKER) {
        worker.onmessage = callback
        worker.postMessage({objectToSerialize, numberOfTimes})
    }
    else {
        const data = runTest(objectToSerialize, numberOfTimes)
        callback({data})
    }
}
