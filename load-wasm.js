// https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab

function loadWebAssembly (filename, imports) {
  // Fetch the file and compile it
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      // Create the imports for the module, including the
      // standard dynamic library imports
      imports = imports || {}
      imports.env = imports.env || {}
      imports.env.memoryBase = imports.env.memoryBase || 0
      imports.env.tableBase = imports.env.tableBase || 0
      if (!imports.env.memory) {
        imports.env.memory = new WebAssembly.Memory({ initial: 256 })
      }
      if (!imports.env.table) {
        imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
      }
      // Create the instance.
      return new WebAssembly.Instance(module, imports)
    })
}
// Main part of this example, loads the module and uses it.
const pouet = loadWebAssembly('build/build-wasm.wasm')
  .then(instance => {
    var exports = instance.exports // the exports of that instance
    return exports._nbOfPrimesFound // our function
  }
);
