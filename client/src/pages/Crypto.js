import 'datejs'
const paillier = require('jspaillier')

const KEY_MODULES_BITS = 128

/**
 * Generate a key pair for the Pailier cipher.
 * @return {{ pub: paillier.publicKey, sec: paillier.privateKey }}
 */
export function GenKeys() {
  return paillier.generateKeys(KEY_MODULES_BITS)
}

/**
 * Pailier encryptinon
 */
export function Encrypt(id, keys) {
  return keys.pub.encrypt(keys.pub.convertToBn(id)).toString()
}

/**
 * Pailier decryptinon
 */
export function Decrypt(id, keys) {
  return keys.sec.decrypt(keys.pub.convertToBn(id)).toString()
}

/**
 * Pailier addition (homomorphic addition)
 */
export function Add(id1, id2, keys) {
  return keys.pub.add(keys.pub.convertToBn(id1), keys.pub.convertToBn(id2)).toString()
}

// TODO: Remove
export function getTime() {
  return '' + Math.round(new Date().getTime() / 1000)
}
