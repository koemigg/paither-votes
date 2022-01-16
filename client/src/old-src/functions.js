/*globals ethers*/

class Functions {
  web3StringToBytes32(text) {
    let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
    while (result.length < 66) {
      result += '0';
    }
    if (result.length !== 66) {
      throw new Error('invalid web3 implicit bytes32');
    }
    return result;
  }

  web3StringArrayToBytes32(strArray) {
    var bytes32Array = [];
    strArray.forEach((element) => {
      console.log(element);
      bytes32Array.push(this.web3StringToBytes32(element));
    });
    return bytes32Array;
  }

  AbiEncode(str) {
    var bytes = str.split('').map((char) => char.charCodeAt(0));
    var hexs = bytes.map((byte) => byte.toString(16));
    var hex2 = hexs.length.toString(16);
    console.log(hex2);
    var hex = hexs.join('');
    var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020';
    var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64);
    var bytes3 = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
    var encodeBytes = '0x' + bytes1 + bytes2 + bytes3;
    return encodeBytes;
  }
}
