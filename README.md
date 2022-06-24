# PaitherVote: Voting System on Ethereum's Blockchain

Voting system running on Ethereum  Brockchain with improved [BroncoVotes](https://github.com/pmarella2/BroncoVotes).

## Description

Electronic voting systems that have been developed so far have been mainly implemented in a client-server manner. This has led to a vicious cycle in which a dedicated server is required to verify the validity of the server, which inevitably increases the number of entities.
In this study, we aimed to protect the privacy of voters by using blockchain for e-voting while maintaining the transparency, security, and cost-effectiveness of the voting system by eliminating the servers that play a centralized role from the components of the system. To the best of the author's knowledge, the only prior work whose source code is publicly available so far is BroncoVote by Dagher et al[^1]. Specifically, BroncoVote requires a dedicated server for encryption of votes, which means that the validity of the server must be trusted, the voter whitelist does not work, and the key size is too small.
In this study, we propose an improved protocol to solve these problems as a voting system called "PaitherVotes" and implement it on Ethereum using Solidity and on the client side using JavaScript (React). The paper link is in preparation.

[^1]: Dagher, G. G., Marella, P. B., Milojkovic, M., and Mohler, J. (2018). Broncovote: Secure voting system using ethereum’s blockchain. ICISSP 2018: Proceedings of the 4th International Conference on Information Systems Security and Privacy, 96–107. doi:10.5220/0006609700960107

## Requirement
 
- Node.js
- Truffle
- Ganache
- MetaMask
 
## Installation

Assuming Linux/MacOS.

**Node.js** (via [asdf](https://asdf-vm.com/))
```bash
brew install asdf
echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.zshrc
echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.zshrc
asdf plugin add nodejs
asdf install nodejs latest
```

**Truffle** (via [npm](https://npmjs.com/))
```bash
npm install -g truffle
```

**Ganache**

Install and Launch [Ganache](https://trufflesuite.com/ganache/).

**MetaMask**

Install [MetaMask](https://metamask.io/) in your browser.

## Usage

**Terminal 1**

```bash
git clone git@github.com:Harxxki/paither-votes.git
cd paither-votes/client
asdf install nodejs # v14.15.4
npm i
npm run migrate
```

Now Backend (Blockchain) will be launched, press `⌘T` or `Ctrl`+`T` to open a new tab.

**Terminal 2**

```bash
npm run start
```

Now Frontend will be started.  
Access http://localhost:3000/.

## Troubleshooting

Open an issue.
 
## Author

Haruki MORI ([@Harxxki](https://github.com/Harxxki))

## Acknowledgements

I want to thank to the members of Mishima Laboratory and Dr. Mishima for their cooperation in conducting this research. We would also like to thank Dagher, G. G., Marella, P. B., Milojkovic, M., and Mohler, J. for their prior work, and the Truffle team for providing excellent tools for Dapp development.

## License

MIT