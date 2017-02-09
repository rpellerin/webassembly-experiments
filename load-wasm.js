console.log(global.Math)

var info = {
  'global': null,
  'global.Math': global.Math,
  'env': {
    'NaN': NaN,
    'Infinity': Infinity
  },
  'asm2wasm': asm2wasmImports,
  'parent': {}
};

console.log("yo")

fetch('build-wasm.wasm').then(function(response) {
  console.log("yo")
  response.arrayBuffer().then(function(bytes) {
    var binary = new Uint8Array(bytes)
    console.log("yo")
    WebAssembly.instantiate(binary, info).then(function(obj) {
      console.log("yay")
      obj.instance.exports.nbOfPrimesFound(40000);
      console.log("yo")
    })
    .catch( (e) => console.log(e) )
  })
});
