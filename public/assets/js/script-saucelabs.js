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
 * This script contains one function 'run' which is executed
 * when a user clicks on 'Run the test' on the HTML page
 * 'automated-tests-saucelabs.html'. If a variable `USE_WORKER` exists
 * and has been set to `true`, a worker is created and a message is sent
 * to it. Otherwise, a function from 'worker-saucelabs.js' is called.
 * Basically, when the worker receives a message, the same function is
 * called.
 *
 * We offer a worker because one might not want the function to run
 * on the main thread. Should you decide to instantiate the worker
 * or call the function directly, under the hood the same function gets
 * called.
 *
 * This script instantiates a new array of size N and initializes each
 * value at its index number. Thus, the array is like [0, 1, 2, .... N-1].
 * The array and a variable `numberOfTimes` are passed to the function being
 * called. This function encodes the payload (the array) using 'bufferio.js',
 * passes it the a C function compiled in ASM.js, gets the result and decodes
 * it. And that is done `numberOfTimes` times. Then the function returns the
 * encoding, decoding and running times to this script, which in turn will
 * display them on the current HTML page.
 *
 **/

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
