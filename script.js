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
  document.getElementById('results-table').appendChild(tr)

  const resultHandler = data => {
    tds[data.name].innerHTML = data.error ? data.result : `<strong>${data.timeTaken}</strong> ms`
    tds[data.name].className = 'normalSpeed'
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
