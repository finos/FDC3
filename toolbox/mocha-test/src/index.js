import Mocha from 'mocha'
import { initTests } from './test/init-tests.js'

var mocha = new Mocha()

initTests()

mocha.run().on('test', function(test) {
  console.log(`Test started: ${test.title}`)
})
