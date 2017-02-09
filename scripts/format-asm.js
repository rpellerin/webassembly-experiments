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
  var result = data.replace('Module["asm"]', 'var asmCall')
                   .replace('});', '})(0,{STACKTOP:0},0)')

  fs.writeFile(inputFile, result, 'utf8', function (err) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
})
