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
 * when a user clicks on 'Show me'. It basically creates a worker,
 * waits for it to be ready, and has it run three tests. These tests
 * measure the run time of a function, always the same, executed in:
 * - Plain Javascript
 * - asm.js (built from C code)
 * - WebAssembly (built from C code)
 *
 * Then the results are displayed in HTML. The 'run' function can be
 * called several times.
 **/

function run () {
  if (!window.Worker) {
    alert('Your browser does not support Web Workers.')
    return
  }

  function attachTdTo (tr, val = 'Running...') {
    let td = document.createElement('td')
    td.innerHTML = val
    tr.appendChild(td)
    return td
  }

  const upperLimitPrime = document.getElementById('upper-limit-prime').value
  const tr = document.createElement('tr')
  const tds = {}
  tds.upperLimitPrime = attachTdTo(tr, upperLimitPrime)
  tds.plain_nbOfPrimesFound = attachTdTo(tr)
  tds.asm_nbOfPrimesFound = attachTdTo(tr)
  tds.wasm_nbOfPrimesFound = attachTdTo(tr)
  tds.wasm_imprecise_nbOfPrimesFound = attachTdTo(tr)
  document.getElementById('results-table').appendChild(tr)

  const resultHandler = data => {
    tds[data.name].innerHTML = data.error ? data.result : `<strong>${data.timeTaken}</strong> ms`
    tds[data.name].className = 'normalSpeed'
    console.log(data.result)
  }

  const readyHandler = data => worker.postMessage({actionType: 'run'})
  const timeResultsHandler = data => {
    if (data.slow) {
      tds[data.slow].className = 'slowSpeed'
    }
    if (data.fast) {
      tds[data.fast].className = 'fastSpeed'
    }
  }

  var worker = new Worker('worker.js')

  worker.onmessage = ({ data }) => {
    switch (data.actionType) {
      case 'ready' :
        return readyHandler(data)
      case 'result':
        return resultHandler(data)
      case 'timeResults':
        return timeResultsHandler(data)
    }
  }
  worker.postMessage({actionType: 'init', upperLimitPrime})
}
