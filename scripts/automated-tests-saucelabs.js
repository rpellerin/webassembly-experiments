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
 * This file runs tests on Saucelabs.com\
 *
 * To be run it requires the following environment variables
 * to exist:
 * - SAUCE_USERNAME
 * - SAUCE_ACCESS_KEY
 *
 * It tests 13 browsers on SauceLabs and outputs the results
 * in the terminal and in a file 'saucelabs.logs'.
 **/

const fs = require('fs')
const webdriver = require('selenium-webdriver')
const until = webdriver.until
const By = webdriver.By
const SauceLabs = require('saucelabs')
const username = process.env.SAUCE_USERNAME
const accessKey = process.env.SAUCE_ACCESS_KEY
const saucelabs = new SauceLabs({ username, password: accessKey })

const OUTPUT_FILE = `${__dirname}/saucelabs.log`

class Logger {
  constructor (separator = ',', borders = '') {
    this.logs = []
    this.separator = separator
    this.borders = borders
  }

  get allLogs () {
    return this.logs.map(line => {
      return this.borders + line.join(this.separator) + this.borders
    }).join('\n')
  }

  addObject (object) {
    const arrayToAdd = []
    const keys = Object.keys(object).sort() // sort alphabetically
    for (let i = 0; i < keys.length; i++) {
      arrayToAdd.push(object[keys[i]])
    }
    this.logs.push(arrayToAdd)
  }

  addArray (array) {
    this.logs.push(array)
  }
}

const executeTest = function (index, browserName, platform, version, username, accessKey) {
  console.log(`Running test ${index}...`)

  let driver = new webdriver.Builder()
    .withCapabilities({
      browserName,
      platform,
      version,
      username,
      accessKey,
      name: `Job ${index}`
    })
    .usingServer(`http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`)
    .build()

  return driver.getSession()
    .then(sessionid => {
      driver.sessionID = sessionid.id_
      return driver
    })
    .then(d => d.get('http://romainpellerin.eu/webassembly-experiments/automated-tests-saucelabs.html'))
    .then(() => driver.findElement({id: 'click'}))
    .then(runButton => runButton.click())
    .then(() => driver.wait(until.elementLocated(By.id('details')), 3000))
    .then(resultsDetails => resultsDetails.getText())
    .then(details => {
      const result = JSON.parse(details)
      result.browser = `${browserName} v${version}`
      result.platform = platform
      logger.addObject(result)
      return true
    })
    .catch(error => {
      console.log('Error', error)
      return false
    })
    .then(passed => {
      console.log('Exiting ' + index)
      driver.quit()
      saucelabs.updateJob(driver.sessionID, {
        passed: passed
      }, null)
    })
}

const browsers = [
  // { browserName: 'chrome', version: '48', platform: 'Linux' }, // does not support let, const, etc.
  { browserName: 'chrome', version: '56', platform: 'Windows 10' },
  { browserName: 'chrome', version: '56', platform: 'Mac 10.12' },
  { browserName: 'chrome', version: 'dev', platform: 'Windows 10' },
  { browserName: 'chrome', version: 'dev', platform: 'Mac 10.12' },
  { browserName: 'chrome', version: 'beta', platform: 'Windows 10' },
  { browserName: 'chrome', version: 'beta', platform: 'Mac 10.12' },
  { browserName: 'firefox', version: '45', platform: 'Linux' },
  { browserName: 'firefox', version: '51', platform: 'Windows 10' },
  { browserName: 'firefox', version: '51', platform: 'Mac 10.12' },
  { browserName: 'firefox', version: 'dev', platform: 'Windows 10' },
  { browserName: 'firefox', version: 'dev', platform: 'Mac 10.12' },
  { browserName: 'firefox', version: 'beta', platform: 'Windows 10' },
  { browserName: 'firefox', version: 'beta', platform: 'Mac 10.12' },
]

const promises = browsers.map((browser, index) => {
  return executeTest(
    index,
    browser.browserName,
    browser.platform,
    browser.version,
    username,
    accessKey)
})

// Script starts here
const logger = new Logger('|', '|')
logger.addArray(['Browser', 'Length of array', 'Number of loops', 'Plateform', 'Total encoding time', 'Total decoding time', 'Total running time'])
logger.addArray(['---', '---', '---', '---', '---', '---', '---'])

Promise.all(promises).then(values => {
  console.log('Finished all promises')
  const logs = logger.allLogs
  console.log(logs)
  fs.writeFile(OUTPUT_FILE, logs, {encoding: 'utf8', flag: 'w'}, (error) => {
    if (error) {
      throw error
    } else {
      console.log(`Results output to ${OUTPUT_FILE}`)
    }
  })
}).catch(error => console.log('Error all promises', error))
