/* global BigInt */
 
import { ethers } from 'ethers'
import 'datejs'
import moment from 'moment'

export function web3StringToBytes32(text) {
  let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text))
  while (result.length < 66) {
    result += '0'
  }
  if (result.length !== 66) {
    throw new Error('invalid web3 implicit bytes32')
  }
  return result
}

export function web3StringArrayToBytes32(strArray) {
  var bytes32Array = []
  strArray.forEach((element) => {
    // console.log(element)
    bytes32Array.push(web3StringToBytes32(element))
  })
  return bytes32Array
}

export function AbiEncode(str) {
  var bytes = str.split('').map((char) => char.charCodeAt(0))
  var hexs = bytes.map((byte) => byte.toString(16))
  var hex2 = hexs.length.toString(16)
  // console.log(hex2)
  var hex = hexs.join('')
  var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020'
  var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64)
  var bytes3 = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64)
  var encodeBytes = '0x' + bytes1 + bytes2 + bytes3
  return encodeBytes
}

/**
 * Convert the retrieved date and time to UNIX time.
 * @param {moment} _limitDate
 * @param {moment} kimitTime
 */
export function genLimitUnixTime(_limitDate, _limitTime) {
  const limit = new moment([_limitDate.year(), _limitDate.month(), _limitDate.date(), _limitTime.hours(), _limitTime.minutes(), _limitTime.seconds()])
  return limit.unix()
}

function zeroPadding(NUM, LEN) {
  return (Array(LEN).join('0') + NUM).slice(-LEN)
}

function bitlengthCount(value) {
  return value.toString(2).length
}

export function BigIntToSolBigInt(value, bitLength = 1024, size = 256) {
  console.assert(bitlengthCount(value) <= bitLength, `Value is up to ${bitLength}bit`)
  console.assert(bitLength % size == 0, `bitLength is divisible by ${size}`)
  const iterations = bitLength / size
  const result = []
  const value_bin_str = zeroPadding(value.toString(2), bitLength)
  let offset = 0
  for (let i = 0; i < iterations; i++) {
    const item = Number(value_bin_str.slice(offset, offset + size)) == 0 ? 0n : BigInt('0b' + value_bin_str.slice(offset, offset + size))
    result.unshift(item)
    offset += size
  }
  return result
}

export function SolBigIntToBigInt(values, size = 256) {
  let result = 0n
  values.forEach((value, index) => {
    const multiplier = BigInt(size) * BigInt(index)
    result += BigInt(value) * 2n ** multiplier
  })
  return BigInt(result)
}
