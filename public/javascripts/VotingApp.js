import '../stylesheets/app.css'

import {
    default as Web3
} from 'web3'
import {
    default as contract
} from 'truffle-contract'
import {
    sha3withsize
} from 'solidity-sha3'
import {
    default as HookedWeb3Provider
} from 'hooked-web3-provider'
import {
    default as lightwallet
} from 'eth-lightwallet'


import registrar_artifacts from '../../build/contracts/Registrar.json'
import voting_artifacts from '../../build/contracts/Voting.json'
import creator_artifacts from '../../build/contracts/Creator.json'

var Registrar = contract(registrar_artifacts)   // レジストラコントラクトを変数に格納
var Voting = contract(voting_artifacts)         // Votingコントラクトを変数に格納
var Creator = contract(creator_artifacts)       // Creatorコントラクトを変数に格納
var input1 = 1
var input2 = 0
var timestamp

var ballotID    // 投票用紙ID

let candidates = {} // 候補者

//Set Web3 on page load

$(document).ready(function() {

    /*var provider = new HookedWeb3Provider({
        host: "http://localhost:8545",
        transaction_signer: ks
    });*/

    //window.web3 = provider;
    //window.web3.setProvider(provider);
    //window.web3 = new Web3(provider);

    if (typeof web3 !== "undefined") {
        window.web3 = new Web3(web3.currentProvider)
    } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    }

    Registrar.setProvider(web3.currentProvider)
    Voting.setProvider(web3.currentProvider)
    Creator.setProvider(web3.currentProvider)

    //Register.setProvider(provider);
    //Voting.setProvider(provider);

})

//End page load setup

//Load ballot using user input ballot ID

window.loadBallot = function() {
    $("#candidate-rows tr").remove()    // 該当テーブルの要素を削除
    ballotID = $("#ballotid").val()     // 該当idの値を取得
    candidates = {}                     // 候補者リストの初期化

    Registrar.deployed().then(function(contract) {  
        // レジストラコントラクトから投票用紙IDに対応するコントラクトアドレスを取得
        // vにコントラクトアドレスが格納
        contract.getAddress.call(ballotID).then(function(v) {   
            var votingAddress = v.toString();   // コントラクトアドレスを文字列に変換
            if (votingAddress == 0) {   // コントラクトアドレスがゼロであれば, エラーを表示
                window.alert("Invalid ballot ID!")
                //$("#msg4").html("Invalid ballot ID!")
                throw new Error()
            } else {    // コントラクトアドレスが設定されている場合
                $("#msg4").html("Setting up ballot...") // セッティング中であることを表示
                //$("#ballotid").val("")
                getCandidates(votingAddress, ballotID) // 投票用紙とコントラクトアドレスから, 候補者名等の選挙情報をwebページに表示

            }
        })
    })
}


//End load ballot

//Register voter using ballot id and e-mail address
// ユーザが登録
window.registerToVote = function() {
    var t0 = performance.now()  // ページ表示をされてからの経過時間
    let idNumber = $("#idnum").val()    // 入力された学生/従業員ID番号を取得
    let email = $("#email").val()   // 入力されたe-mailアドレスを取得
    let permreq = $("input[name=permreq]:checked").val()  // checkされているかを取得 

    if (permreq != 1) { // 1でなければ0を格納
        permreq = 0;
    }

    var domain = email.replace(/.*@/, "")   // ドメイン部分だけを格納

    Registrar.deployed().then(function(contract) {
        // 入力されたe-mailアドレスのドメインがホワイトリストに登録されているかをチェック
        contract.domainCheck.call(domain).then(function(v) {
            var domainValid = v.toString()  // true or false

            if (domainValid == "false") {   // 登録されていなければエラーを表示
                window.alert("Invalid e-mail address!")
                //$("#msg2").html("Invalid e-mail address!")
                throw new Error()
            }

            // ユーザが既に登録済みかをチェックする
            contract.checkReg.call(email, idNumber).then(function(v) {
                var emailValid = v.toString()   // true or false

                if (emailValid == "false") {    // 既に登録済みであればエラーを表示する
                    window.alert("E-mail/ID Number already registered to vote!")
                    //$("#msg2").html("E-mail already registered to vote!")
                    throw new Error()
                }

                $("#idnum").val("") // id入力欄をリセット
                $("#email").val("") // メールアドレス入力欄をリセット

                // コントラクトに投票者情報を登録
                contract.registerVoter(email, idNumber, domain, permreq, {
                    gas: 2500000,
                    from: web3.eth.accounts[0]
                }).then(function() {    // 登録に成功したことと, 登録にかかった時間を表示
                    //$("#msg2").html("Account ready to vote!")
                    window.alert("Account ready to vote!")
                    var t1 = performance.now()
                    window.alert('It took' + (t1 - t0) + 'ms to finish')
                })
            })
        })
        $("#msg2").html("Registration attempt successful! Please wait for verification.")
    })
}

//End voter registration

//Vote for user input choice
// 投票
window.voteForCandidate = function(candidate) {
    let candidateName = $("#candidate").val()   // 入力された候補者名を取得
    let email = $("#e-mail").val()  // 入力されたe-mailアドレスを取得
    $("#msg2").html("") // 該当場所のメッセージを初期化
    $("#msg4").html("") 

    var domain = email.replace(/.*@/, "")   // e-mailのドメイン部分を格納
    var cHash = sha3withsize(candidateName, 32) // 候補者名を32byteでハッシュ化

    var votesArray = []

    Registrar.deployed().then(function(contract) {
        // 投票者の投票状況などをチェック
        contract.checkVoter(email, {    
            gas: 2500000,
            from: web3.eth.accounts[0]
        }).then(function(v) {
            var voterCheck = v.toString()

            if (voterCheck == 1) {  // 未登録であればエラーを表示
                window.alert("E-mail address not registered!")
                //$("#msg").html("E-mail address not registered!")
                throw new Error()
            } else if (voterCheck == 2) {   // メールアドレスとコントラクトアドレスが適合していなければエラーを表示
                window.alert("E-mail address and Ethereum address mismatch!")
                //$("#msg").html("E-mail address and Ethereum address mismatch!")
                throw new Error()
            }
            // 投票用紙IDに紐づいているコントラクトアドレスを取得
            contract.getAddress.call(ballotID).then(function(v) {
                var votingAddress = v.toString();   // コントラクトアドレスを文字列に変換
                Voting.at(votingAddress).then(function(contract) {
                    // ホワイトリストが作成されているかをチェック
                    contract.checkWhitelist.call().then(function(v) {
                        let wc1 = v.toString()  // true or false
                        // 投票者のメールアドレスがホワイトリストに登録されているかをチェック
                        contract.checkifWhitelisted.call(email).then(function(v) {
                            let wc2 = v.toString()
                            if (wc1 == "true" && wc2 == "false") {  // 作成されているホワイトリストにアドレスがなければエラーを表示
                                window.alert("You're are not authorized to vote on this ballot!")
                                //$("#msg").html("You're are not authorized to vote on this ballot!")
                                throw new Error()
                            } else {
                                // 投票した候補者名が今回の候補者リストに存在するかチェック
                                contract.validCandidate.call(cHash).then(function(v) {
                                    var candValid = v.toString()    // true or false

                                    if (candValid == "false") { // 候補者リストになければエラーを表示
                                        window.alert("Invalid Candidate!")
                                        //$("#msg").html("Invalid Candidate!")
                                        throw new Error()
                                    }
                                    // 投票回数の上限に達しているかをチェック
                                    contract.checkVoteattempts.call().then(function(v) {
                                        var attempCheck = v.toString()  // true or false

                                        if (attempCheck == "false") {   // 投票回数上限に達していればエラーを表示
                                            window.alert("You have reached your voting limit for this ballot/poll!")
                                            //$("#msg").html("You have reached your voting limit for this ballot/poll!")
                                            throw new Error()
                                        }
                                        // 投票処理中メッセージを表示, 入力欄の初期化
                                        $("#msg").html("Your vote attempt has been submitted. Please wait for verification.")
                                        $("#candidate").val("")
                                        $("#e-mail").val("")
                                        
                                        // 設定されている候補者リストを出力
                                        contract.candidateList.call(ballotID).then(function(candidateArray) {
                                            for (let i = 0; i < candidateArray.length; i++) {
                                                let hcand = (web3.toUtf8(candidateArray[i]))
                                                let hcHash = sha3withsize(hcand, 32)    // 候補者名をハッシュ化

                                                if (hcHash == cHash) {  // 投票した候補者名の時, input1=1を入力とし暗号化を処理を行う
                                                    encrypt(hcHash, input1, i, candidateArray, email, votingAddress, votesArray)
                                                } else {    // 投票していない候補者名の時, input2=0を入力とし暗号化処理を行う
                                                    encrypt(hcHash, input2, i, candidateArray, email, votingAddress, votesArray)
                                                }
                                            }
                                        })
                                    })
                                })
                            }
                        })
                    })
                })
            })
        })
    })
}

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

function verifyTimestamp(eadd1, i, candidateArray, email, votingAddress, votesArray) {
    Voting.at(votingAddress).then(function(contract) {
        contract.checkTimelimit.call().then(function(v) {   // 投票時間に達しているか
            var timecheck = v.toString()    // true or false
            if (timecheck == "false") { // タイムリミットに達していた場合
                contract.getTimelimit.call().then(function(v) {
                    var endtime = v.toString()  // 制限時間の取得
                    //Testnet is plus 7 hours, uncomment this line if testing on testnet
                    //endtime = endtime - 21600
                    endtime = new Date(endtime * 1000)
                    getVotes(votingAddress) // 投票結果を表に表示
                    //window.alert("Voting period for this ballot has ended on " +endtime)
                    // 投票期限を過ぎた旨をメッセージで表示
                    $("#msg").html("Voting period for this ballot has ended on " + endtime)
                    throw new Error()
                })
            } else {
                votesArray[i] = eadd1   // 該当場所に暗号化された投票内容を格納
                if (i == candidateArray.length - 1) {   // 最後の候補者名まで処理がされていれば,以下の処理
                    // 投票者の各候補者に対する投票内容をコントラクトに登録する
                    vote(i, candidateArray, email, votingAddress, votesArray)
                }
            }
        })
    })
}

function vote(i, candidateArray, email, votingAddress, votesArray) {
    Voting.at(votingAddress).then(function(contract) {
        contract.voteForCandidate(votesArray, email, candidateArray, {
            gas: 2500000,
            from: web3.eth.accounts[0]
        }).then(function() {
            getVotes(votingAddress) // 投票結果を表に表示
            $("#msg").html("")
            window.alert("Your vote has been verified!")
        })
    })
}

//End voting process

//Start ballot creation process using user input data

window.ballotSetup = function() {
    let cemail = $("#cemail").val() // 該当場所に入力されたe-mailアドレスを取得

    Registrar.deployed().then(function(contract) {
        contract.checkVoter.call(cemail).then(function(v) {
            var voterCheck = v.toString()   // 投票用紙作成者の登録状況を取得

            if (voterCheck == 1) {  // 未登録のためエラーを表示
                window.alert("E-mail address not registered!")
                //$("#msg").html("E-mail address not registered!")
                throw new Error()
            } else if (voterCheck == 2) {   // e-mailアドレスとコントラクトアドレスがマッチしなためエラーを表示
                window.alert("E-mail address and Ethereum address mismatch!")
                //$("#msg").html("E-mail address and Ethereum address mismatch!")
                throw new Error()
            } else {

                contract.getPermission.call(cemail).then(function(v) {
                    let emailCheck = v.toString()   // 作成者の権限状況を取得
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

                        Creator.deployed().then(function(contract) {
                            // Votingコントラクトを作成
                            contract.createBallot(enddate, ballottype, votelimit, ballotid, title, whitelist, {
                                gas: 2500000,
                                from: web3.eth.accounts[0]
                            }).then(function() {
                                contract.getAddress.call(ballotid).then(function(v) {
                                    var votingAddress = v.toString()    // 作成されたコントラクトのアドレスを取得
                                    //window.alert(votingAddress)
                                    fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid)
                                    registerBallot(votingAddress, ballotid)
                                })
                            })
                        })
                    }
                })
            }
        })
    })
}

// Votingコントラクトのアドレスと投票用紙idをRegistrarコントラクトに登録
function registerBallot(votingaddress, ballotid) {
    Registrar.deployed().then(function(contract) {
        contract.setAddress(votingaddress, ballotid, {
            gas: 2500000,
            from: web3.eth.accounts[0]
        }).then(function() {
            window.alert("Ballot creation successful! Ballot ID: " + ballotid + "\nPlease write the down the Ballot ID because it will be used to load your ballot allowing users to vote")
        })
    })
}

// 候補者リストやホワイトリストをコントラクトに登録
function fillSetup(votingAddress, choicesArray, whitelistedArray, whitelist, ballotid) {
    fillCandidates(votingAddress, choicesArray) 
    if (whitelist == 1) {
        fillWhitelisted(votingAddress, whitelistedArray)
    }
}
//候補者リストを該当コントラクトに登録
function fillCandidates(votingAddress, choicesArray) {
    Voting.at(votingAddress).then(function(contract) {
        contract.setCandidates(choicesArray, {
            gas: 2500000,
            from: web3.eth.accounts[0]
        }).then(function() {
            contract.hashCandidates({
                gas: 2500000,
                from: web3.eth.accounts[0]
            }).then(function() {
                //
            })
        })
    })
}

// ホワイトリストを該当コントラクトに登録
function fillWhitelisted(votingAddress, whitelistedArray) {
    Voting.at(votingAddress).then(function(contract) {
        contract.setWhitelisted(whitelistedArray, {
            gas: 2500000,
            from: web3.eth.accounts[0]
        }).then(function() {
            //
        })
    })
}

//End ballot creation process
// votingAddress : Votingコントラクトのコントラクトアドレス
// ballotID : votingAddressに対応する投票用紙ID
// 二つの入力に紐づいているコントラクトから投票情報を受け取る. 
function getCandidates(votingAddress, ballotID) {
    // 入力されたコントラクトアドレスに対応したVotingコントラクトを使用
    Voting.at(votingAddress).then(function(contract) {
        contract.getTitle.call().then(function(title) { // タイトルを取得
            $("#btitle").html(title)    // 該当idにタイトルを設定

            contract.candidateList.call(ballotID).then(function(candidateArray) {   // 候補者リストを取得
                for (let i = 0; i < candidateArray.length; i++) {
                    // 連想配列candidatesのkeyに候補者名, valueに候補者名のidを設定
                    candidates[web3.toUtf8(candidateArray[i])] = "candidate-" + i
                }

                setupTable()
                getVotes(votingAddress)
            })
        })
    })
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

        Voting.at(votingAddress).then(function(contract) {
            // 候補者名に対応する投票状況を取得する
            contract.totalVotesFor.call(cvHash).then(function(v) {
                var convVote = v.toString() // コントラクトから出力された投票状況を文字列に変換
                if (convVote == 0) {    // 選挙期間が終了していない場合
                    // コントラクトに終了時刻を問い合わせる
                    contract.getTimelimit.call().then(function(v) { 
                        var endtime = v.toString()  // 終了時刻を文字列に変換
                        //Testnet is plus 7 hours, uncomment this line if testing on testnet
                        //endtime = endtime - 21600
                        endtime = new Date(endtime * 1000); 
                        // 該当id位置に終了時刻を表示
                        $("#msg").html("Results will be displayed once the voting period has ended (" + endtime + ")")
                        //window.alert("Results will be displayed once the voting period has ended (" + endtime + ")")
                    })
                } else {
                    convVote = scientificToDecimal(convVote)    // 10進数に変換
                    decrypt(convVote, name) // convVoteを復号し, 結果を該当テーブルに表示
                }
            })
        })
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