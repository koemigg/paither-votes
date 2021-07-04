const web3 = new Web3()

// the size of a character in a hex string in bytes
const HEX_CHAR_SIZE = 4

// the size to hash an integer if not explicity provided
const DEFAULT_SIZE = 256

/** Encodes a value in hex and adds padding to the given size if needed. Tries to determine whether it should be encoded as a number or string. Curried args. */
const encodeWithPadding = size => value => {
  return typeof value === 'string'
    // non-hex string
    ? web3.toHex(value)
    // numbers, big numbers, and hex strings
    : encodeNum(size)(value)
}

/** Encodes a number in hex and adds padding to the given size if needed. Curried args. */
const encodeNum = size => value => {
  return leftPad(web3.toHex(value < 0 ? value >>> 0 : value).slice(2), size / HEX_CHAR_SIZE, value < 0 ? 'F' : '0')
}

const sha3withsize = (value, size) => {
  const paddedArgs = encodeWithPadding(size)(value)
  return web3.sha3(paddedArgs, { encoding: 'hex' })
}

function StringToBytes32(str) {
  var bytes = str.split('').map(char => char.charCodeAt(0));
  var hexs = bytes.map(byte => byte.toString(16));
  var hex = hexs.join('');
  var bytes32 = (hex+'0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
  return "0x"+bytes32;
  
}

function StringArrayToBytes32(strArray){
  var bytes32Array = [];
  strArray.forEach(element => {
      console.log(element);
      bytes32Array.push(this.StringToBytes32(element));
  });

  return bytes32Array;
}

function AbiEncode(str){
  var bytes = str.split('').map(char => char.charCodeAt(0));
  var hexs = bytes.map(byte => byte.toString(16));
  var hex2 = hexs.length.toString(16);
  console.log(hex2);
  var hex = hexs.join('');
  var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020';
  var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64);
  var bytes3 = (hex+'0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
  var encodeBytes = '0x' + bytes1 + bytes2 + bytes3;
  return encodeBytes;
}

var str = ["iwata", "tanahashi", "haneda", "hirakawa"]
var bytes32 = StringArrayToBytes32(str);

let encodeName = AbiEncode("iwata");
let cvHash = ethers.utils.keccak256(encodeName) // 候補者名を32bitサイズでハッシュ化
console.log(cvHash);

bytes32.forEach(element => {
  console.log(element);
})
console.log(sha3withsize("iwata", 32))
console.log(web3.toUtf8("0x6977617461000000000000000000000000000000000000000000000000000000"))
console.log(scientificToDecimal("0x0B4dc07E87b1966Be5"))

$.ajax({
  type: "GET", 
  url: "http://localhost:3000/crypto/encrypt/1234", 
  success: function(eoutput1) {
    console.log(eoutput1);
  }
})

$.ajax({
  type: "GET", 
  url: "http://localhost:3000/crypto/encrypt/1", 
  success: function(eoutput1) {
    console.log(eoutput1);
    console.log(scientificToDecimal(eoutput1));
  }
})

function encrypt(hcHash, vnum, i, candidateArray, email, votingAddress, votesArray) {
  var einput1
  $.ajax({
      type: "GET",
      url: "http://localhost:3000/encrypt/" + vnum,   // 投票文を暗号化
      success: function(eoutput1) {
          Voting.at(votingAddress).then(function(contract) {
              // 候補者名に対応する途中集計結果(暗号化された)を取得
              contract.votesFor.call(hcHash).then(function(v) {
                  einput1 = v.toString()  // 暗号化された集計結果を取得
                  einput1 = scientificToDecimal(einput1)  // 10進数表記

                  if (einput1 != 0) { // 集計結果が0でなければ, 今回の投票文を加算する
                      add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray)
                  }
              })
          })
      }
  })
}

function add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray) {
  $.ajax({
      type: "GET",
      url: "http://localhost:3000/add/" + eoutput1 + "/" + einput1,   // 二つの暗号文を加算する
      success: function(eadd1) {
          // 加算結果をコントラクトに登録
          verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray)
      }
  })
}

// convVoteを復号し, id=nameのセルに復号結果を表示
function decrypt(convVote, name) {
  $.ajax({
      type: "GET",
      url: "http://localhost:3000/decrypt/" + convVote,
      success: function(eoutput) {
          var voteNum = eoutput   // 復号結果を格納
          $("#" + candidates[name]).html(voteNum.toString())  // 該当idに投票結果を表示
      }
  })
}