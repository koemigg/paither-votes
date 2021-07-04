var creatorABI = [
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_timeLimit",
          "type": "uint32"
        },
        {
          "internalType": "uint8",
          "name": "_ballotType",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "_voteLimit",
          "type": "uint8"
        },
        {
          "internalType": "uint32",
          "name": "_ballotId",
          "type": "uint32"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_whitelisted",
          "type": "uint8"
        }
      ],
      "name": "createBallot",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint32",
          "name": "id",
          "type": "uint32"
        }
      ],
      "name": "getAddress",
      "outputs": [
        {
          "internalType": "contract Voting",
          "name": "contractAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  var registrarABI = [
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "domainList",
          "type": "bytes32[]"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "email",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "idnum",
          "type": "uint16"
        },
        {
          "internalType": "bytes32",
          "name": "_domain",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "_permreq",
          "type": "uint8"
        }
      ],
      "name": "registerVoter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "email",
          "type": "bytes32"
        }
      ],
      "name": "givePermission",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_domain",
          "type": "bytes32"
        }
      ],
      "name": "addDomains",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "domain",
          "type": "bytes32"
        }
      ],
      "name": "domainCheck",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "email",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "idnum",
          "type": "uint16"
        }
      ],
      "name": "checkReg",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "email",
          "type": "bytes32"
        }
      ],
      "name": "checkVoter",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_ballotAddr",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_ballotID",
          "type": "uint32"
        }
      ],
      "name": "setAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_ballotID",
          "type": "uint32"
        }
      ],
      "name": "getAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_email",
          "type": "bytes32"
        }
      ],
      "name": "getPermission",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  var votingABI = [
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "_timeLimit",
          "type": "uint32"
        },
        {
          "internalType": "uint8",
          "name": "_ballotType",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "_voteLimit",
          "type": "uint8"
        },
        {
          "internalType": "uint32",
          "name": "_ballotId",
          "type": "uint32"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_whitelist",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "_candidates",
          "type": "bytes32[]"
        }
      ],
      "name": "setCandidates",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "_emails",
          "type": "bytes32[]"
        }
      ],
      "name": "setWhitelisted",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "hashCandidates",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_votes",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes32",
          "name": "_email",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32[]",
          "name": "_candidates",
          "type": "bytes32[]"
        }
      ],
      "name": "voteForCandidate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "cHash",
          "type": "bytes32"
        }
      ],
      "name": "votesFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "cHash",
          "type": "bytes32"
        }
      ],
      "name": "totalVotesFor",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "x",
          "type": "bytes32"
        }
      ],
      "name": "bytes32ToString",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "cHash",
          "type": "bytes32"
        }
      ],
      "name": "validCandidate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint64",
          "name": "_ballotID",
          "type": "uint64"
        }
      ],
      "name": "candidateList",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkTimelimit",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkBallottype",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint64",
          "name": "ballotID",
          "type": "uint64"
        }
      ],
      "name": "checkballotID",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkVoteattempts",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "checkWhitelist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "email",
          "type": "bytes32"
        }
      ],
      "name": "checkifWhitelisted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTimelimit",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTitle",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  var creatorAddress    = "0x0B4dc07E87b1966Be5898898F094bF778707d99F";
  var registrarAddress = "0x2b936eA94597EB2245309EE7Cb404Cb6C6922C2D";
  var creatorContract;
  var registrarContract;

  var input1 = 1
  var input2 = 0
  var timestamp

  var ballotID    // 投票用紙ID

  let candidates = {} // 候補者   

  var strTobyterser = new StringToBytes();

  window.onload = async function() {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log("accounts="+accounts);
  }

    window.loadBallot = function() {
        $("#candidate-rows tr").remove()    // 該当テーブルの要素を削除
        ballotID = $("#ballotid").val()     // 該当idの値を取得
        candidates = {}                     // 候補者リストの初期化

        creatorContract.getAddress(ballotID, (error, result) => {
            var votingAddress = result.toString();
            if(votingAddress == 0) {
                window.alert("Invalid ballot ID!");
                throw new Error();
            } else {
                $("#msg4").html("Setting up ballot...");
                getCandidates(votingAddress, ballotID);
                console.log("votingAddress="+votingAddress);
            }
        });
    }

    window.registerToVote = function() {
        var t0 = performance.now();
        let idNumber = $("#idnum").val();    // 入力された学生/従業員ID番号を取得
        let email = $("#email").val();   // 入力されたe-mailアドレスを取得
        let permreq = $("input[name=permreq]:checked").val();  // checkされているかを取得 

        if (permreq != 1) { // 1でなければ0を格納
            permreq = 0;
        }

        var emailToBytes = strTobyterser.StringToBytes32(email);
        var domain = strTobyterser.StringToBytes32(email.replace(/.*@/, ""));

        registrarContract.domainCheck(domain, (error, v) => {
            var domainValid = v.toString(); 

            if(domainValid == "false"){
                window.alert("Invalid e-mail address!")
                throw new Error();
            }

            registrarContract.checkReg(emailToBytes, idNumber, (error, v) => {
                var emailValid = v.toString();

                if(emailValid == "false"){
                    window.alert("E-mail/ID Number already registered to vote!");
                    throw new Error();
                }

                $("#idnum").val("") // id入力欄をリセット
                $("#email").val("") // メールアドレス入力欄をリセット

                registrarContract.registerVoter(emailToBytes, idNumber, domain, permreq, (error, result) => {
                    window.alert("Account ready to vote!");
                    var t1 = performance.now();
                    window.alert("It took" + (t1 = t0) + "ms to finish");
                });

                $("#msg2").html("Registration attempt successful! Please wait for verification.");
            });
        });
    }

    window.ballotSetup = function() {
        let cemail = $("#cemail").val() 

        var emailToBytes = strTobyterser.StringToBytes32(cemail);

        registrarContract.checkVoter(emailToBytes, (error, v) => {
            var voterCheck = v.toString();

            if (voterCheck == 1) {  // 未登録のためエラーを表示
                window.alert("E-mail address not registered!")
                //$("#msg").html("E-mail address not registered!")
                throw new Error()
            } else if (voterCheck == 2) {   // e-mailアドレスとコントラクトアドレスがマッチしなためエラーを表示
                window.alert("E-mail address and Ethereum address mismatch!")
                //$("#msg").html("E-mail address and Ethereum address mismatch!")
                throw new Error()
            } else {
                registrarContract.getPermission(emailToBytes, (error, v) => {
                    let emailCheck = v.toString();
                    if (emailCheck == 0) {  // 作成権限がないためエラーを表示
                        //$("#msg3").html("You are not authorized to create ballots! Please contact admin to request authorization.")
                        window.alert("You are not authorized to create ballots! Please contact admin to request authorization.")
                        throw new Error()
                    } else {
                        let date = $("#date").val() // 入力された投票期限の日にちを取得
                        var enddate = (Date.parse(date).getTime() / 1000)
                        let time = $("#time").val() // 入力された投票期限時刻を取得
                        //Testnet is plus 7 hours
                        //-21600 to get original end date and time on testnet
                        var timeArray = time.split(':') // 時刻を配列で格納
                        //Testnet is plus 7 hours, uncomment this line if testing on testnet
                        //var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60) + 21600
                        var seconds = ((timeArray[0]*60)*60) + (timeArray[1]*60)    // 秒数表示
                        enddate += seconds  // 投票期限を取得
                        let ballottype = $("input[name=ballottype]:checked").val()  // 投票形式を取得 poll or election
                        let title = $("#vtitle").val()  // 投票タイトルを取得
                        let choices = $("#choices").val()   // 候補者名一覧を取得
                        var choicesArray = choices.split(/\s*,\s*/) // 候補社名をリストで取得
                        let votelimit = $("#votelimit").val()   // 投票回数を取得
                        let whitelist = $("input[name=whitelist]:checked").val()    // ホワイトリストの形式を取得
                        let whitelisted = $("#whitelisted").val()   // ホワイトリストに登録したいメールアドレスを取得
                        var whitelistedArray = whitelisted.split(/\s*,\s*/) // ホワイトリストをリスト形式で取得
                        let ballotid = Math.floor(Math.random() * 4294967295)   // 投票用紙IDをランダムで生成

                        creatorContract.createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist, (error, result) => {
                            creatorContract.getAddress(ballotid, (error, v) => {
                                console.log("作成したvotingアドレス="+v);
                                var votingAddress = v.toString();
                                fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid)
                                registerBallot(votingAddress, ballotid)
                            });
                        });
                    }
                });
            }
        });
    }

                        // Votingコントラクトのアドレスと投票用紙idをRegistrarコントラクトに登録
    function registerBallot(votingaddress, ballotid) {
        registrarContract.setAddress(votingaddress, ballotid, (error, result) => {
            window.alert("Ballot creation successful! Ballot ID: " + ballotid + "\nPlease write the down the Ballot ID because it will be used to load your ballot allowing users to vote")
        });
    }

    // 候補者リストやホワイトリストをコントラクトに登録
    function fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid) {
        fillCandidates(votingAddress, choicesArray) 
        if (whitelist == 1) {
            fillWhitelisted(votingAddress, whitelistedArray)
        }
    }

    function fillCandidates(votingAddress, choicesArray) {
        votingContract = web3.eth.contract(votingABI).at(votingAddress);
        votingContract.setCandidates(strTobyterser.StringArrayToBytes32(choicesArray), (error, result) => {
            votingContract.hashCandidates((error, result) => {

            });
        });
    }

    // ホワイトリストを該当コントラクトに登録
    function fillWhitelisted(votingAddress, whitelistedArray) {
        votingContract = web3.eth.contract(votingABI).at(votingAddress);
        votingContract.setWhitelisted(strTobyterser.StringArrayToBytes32(whitelistedArray), (error, result) => {

        });
    }

    window.AddDomain = function() {
        var domain = $("#domainAdress").val();
        console.log("登録ドメイン="+domain);
        var domainBytes32 = strTobyterser.StringToBytes32(domain);

        registrarContract.addDomains(domainBytes32, (error, result) => {
            console.log(result);
        });
    }

// votingAddress : Votingコントラクトのコントラクトアドレス
// ballotID : votingAddressに対応する投票用紙ID
// 二つの入力に紐づいているコントラクトから投票情報を受け取る. 
function getCandidates(votingAddress, ballotID) {
    var votingContract = web3.eth.contract(votingABI).at(votingAddress);

    // 入力されたコントラクトアドレスに対応したVotingコントラクトを使用
    votingContract.getTitle((error, title) => {
        $("#btitle").html(title)    // 該当idにタイトルを設定

        votingContract.candidateList(ballotID, (error, candidateArray) => {
            for (let i = 0; i < candidateArray.length; i++) {
                // 連想配列candidatesのkeyに候補者名, valueに候補者名のidを設定
                candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i
            }

            setupTable()
            // getVotes(votingAddress)
        });
    });
}

// テーブルの表示をする
function setupTable() {
    Object.keys(candidates).forEach(function(candidate) {
        // 該当テーブルにcandidatesのkeyを一覧表示して, 各要素にidを設定する
        $("#candidate-rows").append("<tr><td>" + candidate + "</td><td id='" + candidates[candidate] + "'></td></tr>");
    })
}


function getVotes(votingAddress) {
    let candidateNames = Object.keys(candidates)    // 候補者名リストを格納
    for (var i = 0; i < candidateNames.length; i++) {
        let name = candidateNames[i]        // i番目の候補者名を格納
        let cvHash = sha3withsize(name, 32) // 候補者名を32bitサイズでハッシュ化

        votingContract = web3.eth.contract(votingABI).at(votingAddress);
        votingContract.totalVotesFor(cvHash, (error, v) => {
            var convVote = v.toString();
            if(convVote == 0){
                votingContract.getTimelimit((error, v) =>{
                    var endtime = v.toString()
                    endtime = new Date(endtime * 1000);
                    $("#msg").html("Results will be displayed once the voting period has ended (" + endtime + ")")
                });
                
            } else {
                convVote = scientificToDecimal(convVote);    // 10進数に変換
                $("#" + candidates[name]).html(convVote);  // 該当idに投票結果を表示
                // decrypt(convVote, name) // convVoteを復号し, 結果を該当テーブルに表示
            }
        });
    }
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
  
