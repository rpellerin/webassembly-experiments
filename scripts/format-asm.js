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
 * This file edits an AMS.js file and makes it callable
 * from a variable `asmCall`. The file to edit must be provided
 * as an argument to this script.
 *
 **/

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
