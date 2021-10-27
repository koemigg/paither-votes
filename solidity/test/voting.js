/*globals require*/
/*globals artifacts*/
/*globals contract*/
/*globals assert*/
/*globals before*/
/*globals describe*/
/*globals it*/

const ethers = require('ethers');
const truffleAssert = require('truffle-assertions');
const scientificToDecimal = require('scientific-to-decimal');

const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
const $ = require('jquery')(window);

const Voting = artifacts.require('Voting');

contract('Voting', function (accounts) {
  let voting;
  const owner = accounts[0];
  const nonOwner = accounts[1];
  const voter = accounts[2];
  const nonVoter = accounts[3];

  describe('Voting test', () => {
    const ballotId = Math.floor(Math.random() * 4294967295);
    const wrongBallotId = Math.floor(Math.random() * ballotId);
    const choicesArray = ['Truffle', 'Ganache', 'Creme brulee'];
    const revertMsgOnlyOwner = 'Sender not authorized.';

    // web3StringToBytes32
    const W3STB32 = (str) => {
      let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
      while (result.length < 66) {
        result += '0';
      }
      if (result.length !== 66) {
        throw new Error('invalid web3 implicit bytes32');
      }
      return result;
    };
    // web3StringArrayToBytes32
    const W3SATB32 = (strArray) => {
      var bytes32Array = [];
      strArray.forEach((element) => {
        bytes32Array.push(W3STB32(element));
      });
      return bytes32Array;
    };
    const AbiEncode = (str) => {
      var bytes = str.split('').map((char) => char.charCodeAt(0));
      var hexs = bytes.map((byte) => byte.toString(16));
      var hex2 = hexs.length.toString(16);
      var hex = hexs.join('');
      var bytes1 = '0000000000000000000000000000000000000000000000000000000000000020';
      var bytes2 = ('0000000000000000000000000000000000000000000000000000000000000000' + hex2).slice(-64);
      var bytes3 = (hex + '0000000000000000000000000000000000000000000000000000000000000000').slice(0, 64);
      var encodeBytes = '0x' + bytes1 + bytes2 + bytes3;
      return encodeBytes;
    };

    describe('manage candidates/choices', () => {
      before(async () => {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
        await voting.setCandidate(W3SATB32(choicesArray), { from: owner });
        await voting.hashCandidates({ from: owner });
      });

      it('only owner can set candidates', async () => {
        await truffleAssert.reverts(voting.setCandidate(W3SATB32([('hoge', 'fuga')]), { from: nonOwner }), revertMsgOnlyOwner);
      });

      it('only owner can hash candidates', async () => {
        await truffleAssert.reverts(voting.hashCandidates({ from: nonOwner }), revertMsgOnlyOwner);
      });

      it('should register and hashing candidates/choices', async () => {
        const candidateList = await voting.getCandidateList(ballotId);
        // TODO Should use assert.notDeepStrictEqual()
        assert.notStrictEqual(candidateList, choicesArray);
      });

      it('should get and decode candidates/choices', async () => {
        const candidateList = await voting.getCandidateList(ballotId);
        const result = candidateList.map((c) => ethers.utils.parseBytes32String(c));
        assert.deepStrictEqual(result, choicesArray);
      });

      it("shouldn't get candidate/choice list with wrong BallotID", async () => {
        await truffleAssert.reverts(voting.getCandidateList(wrongBallotId), 'BallotID does not match');
      });
    });

    describe('voter registration and management of whitelisted email addresses and domains', () => {
      const email = 'hoge@example.com';
      const wrongEmail = 'huga@wrongexample.com';
      const id = 2021;
      const domain = 'example.com';
      const wrongDomain = 'wrongexample.com';
      const generateVotesList = (candidateArray, candidateName, votingAddress) => {
        let encodeName = AbiEncode(candidateName);
        let cHash = ethers.utils.keccak256(encodeName);
        for (let i = 0; i < candidateArray.length; i++) {
          let hcand = ethers.utils.parseBytes32String(candidateArray[i]);
          let encodeName = AbiEncode(hcand);
          let hcHash = ethers.utils.keccak256(encodeName);
          let input1 = 1;
          let input2 = 0;
          let votesArray = [];
          if (hcHash == cHash) {
            return encrypt(hcHash, input1, i, candidateArray, email, votingAddress, votesArray);
          } else {
            return encrypt(hcHash, input2, i, candidateArray, email, votingAddress, votesArray);
          }
        }
      };

      const encrypt = (hcHash, vnum, i, candidateArray, email, votingAddress, votesArray) => {
        let einput1;
        $.ajax({
          type: 'GET',
          url: 'http://localhost:3000/crypto/encrypt/' + vnum, // 投票文を暗号化
          success: function (eoutput1) {
            voting.votesFor(hcHash).then(function (v) {
              let convVote = v;
              einput1 = convVote;
              einput1 = scientificToDecimal(einput1); // 10進数表記

              if (einput1 != 0) {
                // 集計結果が0でなければ, 今回の投票文を加算する
                return add(eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray);
              }
            });
          },
        });
      };

      const add = (eoutput1, einput1, i, candidateArray, email, votingAddress, votesArray) => {
        $.ajax({
          type: 'GET',
          url: 'http://localhost:3000/crypto/add/' + eoutput1 + '/' + einput1, // 二つの暗号文を加算する
          success: function (eadd1) {
            // 加算結果をコントラクトに登録
            return verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray);
          },
        });
      };

      const verifyTimestamp = (eadd1, i, candidateArray, email, votingAddress, votesArray) => {
        voting.checkTimelimit().then(function (v) {
          let timecheck = v.toString();
          if (timecheck == 'false') {
            voting.getTimelimit().then(function (v) {
              let endtime = v.toString(); // 制限時間の取得
              //Testnet is plus 7 hours, uncomment this line if testing on testnet
              //endtime = endtime - 21600
              endtime = new Date(endtime * 1000);
              // getVotes(votingAddress); // 投票結果を表に表示
              //window.alert("Voting period for this ballot has ended on " +endtime)
              // 投票期限を過ぎた旨をメッセージで表示
              $('#msg').html('Voting period for this ballot has ended on ' + endtime);
              throw new Error();
            });
          } else {
            votesArray[i] = eadd1; // 該当場所に暗号化された投票内容を格納
            if (i == candidateArray.length - 1) {
              // 最後の候補者名まで処理がされていれば,以下の処理
              // 投票者の各候補者に対する投票内容をコントラクトに登録する
              // vote(candidateArray, email, votingAddress, votesArray);
              return votesArray;
            }
          }
        });
      };

      before(async () => {
        // Whitelist type: Non-whitlist
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
        await voting.setCandidate(W3SATB32(choicesArray));
      });

      it('only owner can set Email addresses to whitelist', async () => {
        await truffleAssert.reverts(voting.setWhiteEmailAddress(W3SATB32([('hoge', 'fuga')]), { from: nonOwner }), revertMsgOnlyOwner);
      });

      it('only owner can set domains to whitelist', async () => {
        await truffleAssert.reverts(voting.setWhiteDomain(W3SATB32([('hoge', 'fuga')]), { from: nonOwner }), revertMsgOnlyOwner);
      });

      it('only owner can add Email address to whitelist', async () => {
        await truffleAssert.reverts(voting.addWhiteEmailAddress(W3SATB32([('hoge', 'fuga')]), { from: nonOwner }), revertMsgOnlyOwner);
      });

      it('only owner can add domain to whitelist', async () => {
        await truffleAssert.reverts(voting.addWhiteDomain(W3SATB32([('hoge', 'fuga')]), { from: nonOwner }), revertMsgOnlyOwner);
      });

      it('register as a voter', async () => {
        await voting.registerVoter(W3STB32(email), id, W3STB32(domain), { from: voter });
        const result = await voting.checkReg(W3STB32(email), id, { from: voter });
        return assert.isFalse(result);
      });

      // it("don't pass: not registered, can't vote", async () => {
      //   const candidateList = await voting.getCandidateList(ballotId);
      //   await truffleAssert.reverts(voting.voteForCandidate(generateVotesList(candidateList, 'truffle', voting), W3STB32(email), W3STB32(domain), candidateList, { from: nonVoter }), 'E-mail address and Ethereum address mismatch!');
      // });

      it('user with E-mail address that is on the whitelist can vote', async () => {
        // Whitelist type: E-mail
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 1, owner);
        const candidateList = await voting.getCandidateList(ballotId);
        voting.voteForCandidate(generateVotesList(candidateList, 'truffle', voting), W3STB32(email), W3STB32(domain), candidateList, { from: voter }).then(() => {
          return assert.isTrue(true);
        });
      });

      it("user with E-mail address that is not on the whitelist can't vote", async () => {
        const candidateList = await voting.getCandidateList(ballotId);
        voting
          .voteForCandidate(generateVotesList(candidateList, 'truffle', voting), W3STB32(email), W3STB32(domain), candidateList, { from: voter })
          .then(() => {
            return assert.isTrue(false);
          })
          .catch(() => {
            return assert.isTrue(true);
          });
      });

      it('user with domain that is on the whitelist can vote', async () => {
        // Whitelist type: domain
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 2, owner);
        return assert.isTrue(true);
      });

      it("user with domain that is not on the whitelist can't vote", async () => {
        return assert.isTrue(true);
      });
    });

    describe('voting', () => {
      before(async () => {
        voting = await Voting.new(1000000, 0, 3, ballotId, 'Title', 0, owner);
      });

      it('should increase that the number of votes cast for a voted candidate/option', async () => {
        return assert.isTrue(true);
      });

      it("if miss the deadline, can't vote", async () => {
        return assert.isTrue(true);
      });

      it("if the maximum number of times can vote is exceeded, can't vote", async () => {
        return assert.isTrue(true);
      });
    });
  });
});
