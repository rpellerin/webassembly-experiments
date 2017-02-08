const fs = require('fs')
const inputFile = process.argv[2]

if (!inputFile) {
  console.error('No input file specified.')
  process.exit(1)
}

fs.readFile(inputFile, 'utf8', function (err, data) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  var result = data.replace('Module["asm"] = (function', 'function asmCall')
                   .replace('});', '}')

  fs.writeFile(inputFile, result, 'utf8', function (err) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
})
