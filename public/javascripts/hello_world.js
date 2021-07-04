var abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "newWord",
          "type": "string"
        }
      ],
      "name": "Set",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "word",
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
      "constant": true,
      "inputs": [],
      "name": "get",
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
          "internalType": "string",
          "name": "newWord",
          "type": "string"
        }
      ],
      "name": "set",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  var address = "0x82E07E7194Ab0F7c0f594f434b170f35B808bD20";
  var web3Local;

  window.onload = function() {
    // メタマスクがインストールされているかのチェック
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        alert("MetaMaskをインストールして下さい．");
    }

    // メタマスクのアドレスを取得する
    web3.eth.getAccounts(function(err, accounts) {
        coinbase = accounts[0];
        console.log("coinbase is " + coinbase);
        if (typeof coinbase === 'undefined') {
            alert("MetaMaskを起動してください．")
        }
    });


    var contract = web3.eth.contract(abi).at(address);
    contract.get((error, result) => {
      document.getElementById("contract_result").textContent = result;
    });

    web3Local = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    var eventContract = web3Local.eth.contract(abi).at(address);
    eventContract.Set((error, data) => {
        console.log("event callback.");
        document.getElementById("contract_result").textContent = data.args.newWord;
    });
 
    document.getElementById("button_set").onclick = () => {
        let time = Math.floor(new Date().getTime() / 1000);
        console.log(time);
        contract.set("" + time, 
        (error, txid) => {
            console.log(txid);
        });
    };
  };