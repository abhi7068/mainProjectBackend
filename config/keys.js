const devKeys = require('./keys.dev.js');
const localKeys = require('./keys.local.js');
const qaKeys = require('./keys.prod.js');

if (process.env.NODE_ENV.trim() == 'production') {
  module.exports = qaKeys;
} else if (process.env.NODE_ENV.trim() == 'development') {
  module.exports = devKeys;
} else {
  module.exports = localKeys;
}
