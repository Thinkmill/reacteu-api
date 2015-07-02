var createHash = require('create-hash')
var createHmac = require('create-hmac')

function hmac (str, secret) {
	return createHmac('sha256', secret).update(str).digest('base64')
}

function hash (str) {
	return createHash('sha256').update(str).digest('base64')
}

module.exports = {
	hmac: hmac,
	hash: hash
}
