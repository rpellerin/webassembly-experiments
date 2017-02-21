const webdriver = require('selenium-webdriver')
const until = webdriver.until
const By = webdriver.By
const SauceLabs = require('saucelabs')
const username = process.env.SAUCE_USERNAME
const accessKey = process.env.SAUCE_ACCESS_KEY
const saucelabs = new SauceLabs({ username, password: accessKey })

const logResult = function(index, browserName, platform, version) {
  return function(results) {
    console.log(`Results test n°${index}`)

    results.browserName = browserName
    results.platform = platform
    results.browserVersion = version
    console.log(results)
  }
}

const executeTest = function(index, browserName, platform, version, username, accessKey) {
  console.log(`Running test ${index}...`)

  const logger = logResult(index, browserName, platform, version)

  let driver = new webdriver.Builder().
    withCapabilities({
      browserName,
      platform,
      version,
      username: username,
      accessKey: accessKey,
      name: 'Job '+index,
    })
    .usingServer(`http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`)
    .build()

  driver.getSession()
    .then( sessionid => {
      driver.sessionID = sessionid.id_
      return driver
    })
    .then( d => d.get('http://romainpellerin.eu/webassembly-experiments/tests-lodash/') )
    .then( () => driver.findElement({id: 'click'}) )
    .then( runButton => runButton.click() )
    .then( () => driver.wait(until.elementLocated(By.id('details')), 3000) )
    .then( resultsDetails => resultsDetails.getText() )
    .then( details => logger(JSON.parse(details)) )
    .then( () => true )
    .catch( error => {
      console.log('Error', error)
      return false
    }).
    then( passed => {
      console.log('Exiting '+index)
      driver.quit()
      saucelabs.updateJob(driver.sessionID, {
        passed: passed
      }, null)
    })

  return driver
}

const browsers = [
  //{ browserName: 'chrome', version: '48', platform: 'Linux' }, // does not support let, const, etc.
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

const promises = browsers.map( (browser, index) => {
  return executeTest(
    index,
    browser.browserName,
    browser.platform,
    browser.version,
    username,
    accessKey)
})

Promise.all(promises)
  .then(values => console.log('Finished all promises', values))
  .catch(error => console.log('Error all promises', error))
