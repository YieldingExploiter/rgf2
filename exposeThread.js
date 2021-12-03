const { expose } = require('threads/worker')
expose({
  startThread: require('./thread')
})