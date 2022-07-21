/* global BigInt */
import { ethers } from 'ethers'
import 'datejs'
import moment from 'moment'

/**
 * Convert string to Byes32.
 * @param {string} text - The short string to convert
 * @returns {string} result - Bytes32 string
 * @see {@link https://github.com/ethers-io/ethers.js/issues/66}
 */
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

/**
 * Convert string array to Byes32 array.
 * @param {Array<string>} strArray - The short string array to convert
 * @returns {Array<string>} result - Bytes32 string array
 * @see {@link https://github.com/ethers-io/ethers.js/issues/66}
 */
export function web3StringArrayToBytes32(strArray) {
  let bytes32Array = []
  strArray.forEach((element) => {
    bytes32Array.push(web3StringToBytes32(element))
  })
  return bytes32Array
}

/**
 * Convert the date and time to UNIX time.
 * @param {moment} date - date
 * @param {moment} time - time
 * @return {moment} - Unix Timestamp in seconds
 */
export function genLimitUnixTime(date, time) {
  const dateTime = new moment([date.year(), date.month(), date.date(), time.hours(), time.minutes(), time.seconds()])
  return dateTime.unix()
}

/**
 * Zero padding from backward.
 * @param {number} number - target number
 * @param {number} length - Bit length
 * @return {int} - Zero paddinged number
 */
function zeroPadding(number, length) {
  return (Array(length).join('0') + number).slice(-length)
}

/**
 * Count bit length.
 * @param {number} value - target number
 * @return {number} - Bit length
 */
function bitlengthCount(value) {
  return value.toString(2).length
}

/**
 * Divide huge values and return them in an array.
 * @param {BigInt} value - target number
 * @param {number} [bitLength = 1024] - Bit length upper limit
 * @param {number} [size = 256] - Split size (bit)
 * @return {Array<number>} result - Converted numbers
 * @description Since Solidity cannot handle values larger than 256 bits, the solution is to split huge values into smaller values: convert Javascript's BigInt to binary, split it into arbitrary sizes (default is 256 bits), convert the individual binary numbers that were split into decimal numbers, and The divided individual binary numbers are converted to decimal numbers and stored in an array.
 */
export function BigIntToSolBigInt(value, bitLength = 1024, size = 256) {
  console.assert(bitlengthCount(value) <= bitLength, `Value is up to ${bitLength}bit`)
  console.assert(bitLength % size == 0, `bitLength is divisible by ${size}`)
  const iterations = bitLength / size
  const result = []
  const binaryString = zeroPadding(value.toString(2), bitLength)
  let offset = 0
  for (let i = 0; i < iterations; i++) {
    const item = Number(binaryString.slice(offset, offset + size)) == 0 ? 0n : BigInt('0b' + binaryString.slice(offset, offset + size))
    result.unshift(item)
    offset += size
  }
  return result
}

/**
 * Inverse function of BigIntToSolBigInt()
 * @param {Array<number>} values
 * @param {number} [size = 256] - Split size (bit)
 * @return {BigInt} result - Inverse converted numbers
 */
export function SolBigIntToBigInt(values, size = 256) {
  let result = 0n
  values.forEach((value, index) => {
    const multiplier = BigInt(size) * BigInt(index)
    result += BigInt(value) * 2n ** multiplier
  })
  return BigInt(result)
}
