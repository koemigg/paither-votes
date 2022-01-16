import 'datejs'
const paillier = require('jspaillier')

const KEY_MODULES_BITS = 128

/**
 * Generate keys.
 * @return {keys: {
 *  pub: paillier.publicKey;
 *  sec: paillier.privateKey;
 * }}
 */
export function GenKeys() {
  return paillier.generateKeys(KEY_MODULES_BITS)
}

export function Encrypt(id, keys) {
  return keys.pub.encrypt(keys.pub.convertToBn(id)).toString()
}

export function Decrypt(id, keys) {
  return keys.sec.decrypt(keys.pub.convertToBn(id)).toString()
}

export function Add(id1, id2, keys) {
  return keys.pub.add(keys.pub.convertToBn(id1), keys.pub.convertToBn(id2)).toString()
}

export function getTime() {
  return '' + Math.round(new Date().getTime() / 1000)
}
// var keys = paillier.generateKeys(128)

// var router = express.Router()

// router.get('/encrypt/:id', function (req, res) {
//   var ekey = req.params.id
//   ekey = keys.pub.encrypt(keys.pub.convertToBn(ekey)).toString()
//   res.send(ekey)
// })

// router.get('/decrypt/:id', function (req, res) {
//   var dkey = req.params.id
//   dkey = keys.sec.decrypt(keys.pub.convertToBn(dkey)).toString()
//   res.send(dkey)
// })

// router.get('/add/:id/:id2', function (req, res) {
//   var ein1 = req.params.id
//   var ein2 = req.params.id2
//   eadd = keys.pub.add(keys.pub.convertToBn(ein1), keys.pub.convertToBn(ein2)).toString()
//   res.send(eadd)
// })

// router.get('/getTime', function (req, res) {
//   var timestamp = Math.round(new Date().getTime() / 1000)
//   res.send('' + timestamp)
// })

// module.exports = router
