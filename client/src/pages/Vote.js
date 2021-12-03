import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Table, Space, Divider, Input, Layout, Typography, message } from 'antd'
import { Header } from './Header'

import { Encrypt, Decrypt, Add, getTime, GenKeys } from './Crypto'
import { AbiEncode, web3StringToBytes32 } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'
import { keccak256 } from '@ethersproject/keccak256'

const scientificToDecimal = require('scientific-to-decimal')
const getRevertReason = require('eth-revert-reason')

const { Content, Footer } = Layout
const { Title } = Typography
const { Search } = Input

const Main = () => {
  const [keys, setKeys] = useState()
  const [voting, setVoting] = useState(null)
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [pollTitle, setTitle] = useState('Here is title')
  const [tableData, setTabledata] = useState([''])
  const [receptionEmail, setReceptionEmail] = useState()
  const [voteEmail, setVoteEmail] = useState('ho@ex.com')
  const [id, setId] = useState()
  const [ballotId, setBallotId] = useState(1887228275)
  const [selectedRows, setSelectedRows] = useState()

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })
    }
  })

  useEffect(() => {
    if (window.ethereum) {
      if (isMetaMaskConnected()) {
        window.ethereum
          .request({
            method: 'eth_requestAccounts'
          })
          .then((newAccounts) => {
            setAccounts(newAccounts)
          })
        setKeys(GenKeys())
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const deployedNetwork = CreatorArtifacts.networks[5777]
        const contractAddress = deployedNetwork.address
        const signer = provider.getSigner(0)
        const instance = new ethers.Contract(contractAddress, CreatorArtifacts.abi, signer)
        setCreator(instance)
        console.log('Setting up Creator contract.')
      } else {
        console.log('Metamask is not connected.')
      }
    } else {
      message.error('Please install Metamask.')
    }
  }, [])

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  const onLoadBallot = async (_ballotId) => {
    creator
      .getAddress(_ballotId)
      .then(async (address) => {
        if (address === 0) {
          window.alert('Invalid Ballot ID')
          throw new Error('Invalid ballot ID.')
        } else {
          // TODO: Loading
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          const voting = new ethers.Contract(address, VotingArtifacts.abi, signer)
          setVoting(voting)
          voting.getTitle().then((title) => {
            setTitle(title)
          })
          const cArr = await voting.getCandidateList(_ballotId)
          const vArrPromise = cArr.map((c) => {
            return voting.totalVotesFor(keccak256(AbiEncode(ethers.utils.parseBytes32String(c))))
          })
          Promise.all(vArrPromise).then((vArr) => {
            const tableData_ = cArr.map((c, i) => ({
              key: i + 1,
              name: ethers.utils.parseBytes32String(c),
              vote: Decrypt(scientificToDecimal(vArr[i]), keys)
            }))
            setTabledata(tableData_)
          })
        }
      })
      .catch(function (error) {
        console.error('Failed to load the poll.')
        console.error(error)
      })
  }

  const onReception = async () => {
    if (voting) {
      voting
        .registerVoter(
          web3StringToBytes32(receptionEmail),
          Number(id),
          web3StringToBytes32(receptionEmail.split('@')[1])
        )
        .then(function () {
          message.success('Success reception', 10)
        })
        .catch(async function (res) {
          // console.log('txhash', res)
          // console.log(await getRevertReason(0xd7cdd5a470e38de45e2bc30369d664db4acaf5d6b5c020e868efab4ed869f429))
          message.error('An error occurd', 10)
          // message.error(await getRevertReason(res))
        })
    } else {
      message.error('Please load ballot prior to reception')
    }
  }

  const onVote = () => {
    if (voting) {
      if (selectedRows) {
        _onVote()
      } else {
        message.info('Please select your choice prior to vote')
      }
    } else {
      message.error('Please load ballot prior to vote')
    }
  }

  const __onVote = () => {
    // const selectedHashedCandidate = AbiEncode(keccak256(selectedRows[0].name))
    const selectedHashedCandidate = keccak256(AbiEncode(selectedRows[0].name))
    console.log('selectedHashedCandidate: ', selectedHashedCandidate)
    const newVArrPromises = []
    voting
      .getCandidateList(ballotId)
      .then((cArr) => {
        cArr.forEach((c) => {
          const hashedCandidate = keccak256(AbiEncode(ethers.utils.parseBytes32String(c)))
          console.log('hashedCandidate: ', hashedCandidate)
          const voteNum = hashedCandidate == selectedHashedCandidate ? 1 : 0
          console.log('voteNum: ', voteNum)
          const encryptedVoteNum = Encrypt(voteNum, keys)
          console.log('encryptedVoteNum: ', encryptedVoteNum)
          const newVotePromise = new Promise((resolve, reject) => {
            voting.votesFor(hashedCandidate).then((currentVoteNum_) => {
              console.log('currentVoteNum: ', currentVoteNum_)
              const currentVoteNum = scientificToDecimal(currentVoteNum_)
              console.log('scientificToDecimal(currentVoteNum_): ', currentVoteNum)
              // if (currentVoteNum != 0) {
              // console.log('in if statement currentVoteNum != 0')
              // newVArr[index] = Add(encryptedInput, encryptedOutput, keys)
              resolve(Add(currentVoteNum + encryptedVoteNum, keys))
              // } else {
              //   console.log('in else statement encryptedInput != 0')
              //   newVotePromise = Encrypt(0, keys)
              // }
            })
          })
          newVArrPromises.push(newVotePromise)
        })
        // .then(() => {
        Promise.all(newVArrPromises).then((newVArr) => {
          console.log(`newVArr: ${newVArr}`)
          console.log(`typeof newVArr: ${typeof newVArr}`)
          console.log(`voteEmail: ${voteEmail}`)
          console.log(`cArr: ${cArr}`)
          voting
            .voteForCandidate(
              newVArr,
              web3StringToBytes32(voteEmail),
              web3StringToBytes32(voteEmail.split('@')[1]),
              cArr
            )
            .then(() => {
              message.info('Vote successful 🎉', 10)
            })
            .catch((res) => {
              console.log('An error occurred during the execution of voteForcandidate(). Output: ')
              message.error('Something went wrong 😕', 10)
              console.error(res)
            })
        })
      })
      .catch((res) => {
        console.log('An error occurred during the execution of getCandidateList(). Output: ')
        message.error('Something went wrong 😕', 10)
        console.error(res)
      })
  }

  const input1 = 1
  const input2 = 0

  const _onVote = () => {
    let candidateName = selectedRows[0].name
    let email = voteEmail

    let encodeName = AbiEncode(candidateName)
    let cHash = ethers.utils.keccak256(encodeName)
    let votesArray = []

    // 投票した候補者名が今回の候補者リストに存在するかチェック
    voting.validCandidate(cHash).then(function (v) {
      let canValid = v.toString()

      if (canValid == 'false') {
        window.alert('Invalid Candidate!')
        //$("#msg").html("Invalid Candidate!")
        throw new Error()
      }

      // 投票回数の上限に達しているかをチェック
      voting.checkVoteattempts().then(function (v) {
        let attempCheck = v.toString()

        if (attempCheck == 'false') {
          window.alert('You have reached your voting limit for this ballot/poll!')
          //$("#msg").html("You have reached your voting limit for this ballot/poll!")
          throw new Error()
        }

        voting.getCandidateList(ballotId).then(function (candidateArray) {
          for (let i = 0; i < candidateArray.length; i++) {
            let hcand = ethers.utils.parseBytes32String(candidateArray[i])
            console.log('hcand=' + hcand)
            let encodeName = AbiEncode(hcand)

            let hcHash = ethers.utils.keccak256(encodeName)

            if (hcHash == cHash) {
              encrypt(hcHash, input1, i, candidateArray, email, votesArray)
            } else {
              encrypt(hcHash, input2, i, candidateArray, email, votesArray)
            }
          }
        })
      })
    })
  }

  function encrypt(hcHash, vnum, i, candidateArray, email, votesArray) {
    let einput1
    let eoutput1 = Encrypt(vnum, keys)
    voting.votesFor(hcHash).then(function (v) {
      let convVote = v
      einput1 = convVote
      console.log('einput1=' + einput1)
      einput1 = scientificToDecimal(einput1) // 10進数表記

      if (einput1 != 0) {
        // 集計結果が0でなければ, 今回の投票文を加算する
        add(eoutput1, einput1, i, candidateArray, email, votesArray)
      }
    })
  }

  function add(eoutput1, einput1, i, candidateArray, email, votesArray) {
    let eadd1 = Add(eoutput1, einput1, keys)
    // 加算結果をコントラクトに登録
    verifyTimestamp(eadd1, i, candidateArray, email, votesArray)
  }

  function verifyTimestamp(eadd1, i, candidateArray, email, votesArray) {
    voting.checkTimelimit().then(function (v) {
      let timecheck = v.toString()
      if (timecheck == 'false') {
        voting.getTimelimit().then(function (v) {
          let endtime = v.toString() // 制限時間の取得
          //Testnet is plus 7 hours, uncomment this line if testing on testnet
          //endtime = endtime - 21600
          endtime = new Date(endtime * 1000)
          // getVote) // 投票結果を表に表示
          //window.alert("Voting period for this ballot has ended on " +endtime)
          // 投票期限を過ぎた旨をメッセージで表示
          // $('#msg').html('Voting period for this ballot has ended on ' + endtime)
          window.alert('Voting period for this ballot has ended on ' + endtime)
          throw new Error()
        })
      } else {
        votesArray[i] = eadd1 // 該当場所に暗号化された投票内容を格納
        if (i == candidateArray.length - 1) {
          // 最後の候補者名まで処理がされていれば,以下の処理
          // 投票者の各候補者に対する投票内容をコントラクトに登録する
          vote(candidateArray, email, votesArray)
        }
      }
    })
  }

  function vote(candidateArray, email, votesArray) {
    voting
      .voteForCandidate(
        votesArray,
        web3StringToBytes32(email),
        web3StringToBytes32(email.split('@')[1]),
        candidateArray
      )
      .then(function () {
        // getVotes(votingAddress) // 投票結果を表に表示
        // $('#msg').html('')
        window.alert('Your vote has been verified!')
      })
  }

  const onChangeBallotId = (e) => {
    console.log('Ballot ID set', e.target.value)
    setBallotId(e.target.value)
  }

  const onChangeReceptionEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setReceptionEmail(e.target.value)
  }

  const onChangeId = (e) => {
    console.log('ID set', e.target.value)
    setId(e.target.value)
  }

  const onChangeVoteEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setVoteEmail(e.target.value)
  }

  const columns = [
    {
      title: 'Candidate/Choice',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Vote',
      dataIndex: 'vote',
      key: 'vote'
    }
  ]

  return (
    <Layout className="layout">
      <Header title={'Vote 🗳️'} />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Space direction="vertical" size="small" align="center" split={<Divider type="horizontal" />}>
            <div>
              <Title>Vote on this page.</Title>
              Follow the instructions below to cast your vote!
            </div>
            <div>
              <h2>Status</h2>
              Account: <i>{accounts}</i>
            </div>
          </Space>
          <br />
          <br />
          <br />
          <div>
            {voting ? (
              <Table
                rowSelection={{
                  type: 'radio',
                  columnWidth: 20,
                  onChange: (selectedRowKeys, selectedRows_) => {
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows_)
                    setSelectedRows(selectedRows_)
                  }
                }}
                columns={columns}
                dataSource={tableData}
                size="default"
                // TODO Set rowKey
                // rowkey={}
                title={() => pollTitle}
              />
            ) : null}
          </div>
          <br />
          <br />
          <br />
          <Space size="large" align="top" split={<Divider type="vertical" />}>
            <Space direction="vertical" size="small" align="center">
              <h2>Load Ballot</h2>
              <div>Load Ballot.</div>
              <Search
                style={{ width: 300 }}
                placeholder="input Ballot ID"
                allowClear
                enterButton="Load"
                size="middle"
                onSearch={onLoadBallot}
                onChange={onChangeBallotId}
                defaultValue={1887228275}
              />
            </Space>
            <Space direction="vertical" size="small" align="center">
              <h2>Reception</h2>
              <div>Reception to vote.</div>
              <Input
                onChange={onChangeReceptionEmail}
                style={{ width: 300 }}
                placeholder="E-mail Adderess"
                allowClear
              />
              <Input
                onChange={onChangeId}
                style={{ width: 300 }}
                placeholder="Your BSU student/employee ID"
                allowClear
              />
              <Button onClick={onReception} type="primary">
                Reception
              </Button>
            </Space>
            <Space direction="vertical" size="small" align="center">
              <h2>Vote</h2>
              <div>Vote for your choice (Load Ballot prior to this.).</div>
              <Search
                onChange={onChangeVoteEmail}
                style={{ width: 300 }}
                placeholder="E-mail adderess"
                allowClear
                enterButton="Vote"
                size="middle"
                onSearch={onVote}
              />
            </Space>
          </Space>
          <br />
          <br />
          <br />
          <h2>Debug Tool</h2>
          <br />
          <Space size="large" align="top" split={<Divider type="vertical" />}>
            <Button
              onClick={() => {
                voting.usingWhiteDomain().then((res) => {
                  console.log(res)
                })
              }}
            >
              usingWhiteDomain()
            </Button>
            <Search
              // style={{ width: 300 }}
              allowClear
              enterButton="whiteDomainsIncludes()"
              size="middle"
              onSearch={(str) => {
                voting.whiteDomainsIncludes(web3StringToBytes32(str)).then((res) => {
                  console.log(res)
                })
              }}
            />
          </Space>
          <br />
          <br />
          <br />
          <Space size="large" align="top" split={<Divider type="vertical" />}>
            <Button
              onClick={() => {
                voting.usingWhiteEmailAddress().then((res) => {
                  console.log(res)
                })
              }}
            >
              usingWhiteEmailAddress()
            </Button>
            <Search
              // style={{ width: 300 }}
              allowClear
              enterButton="whiteEmailAddressesIncludes()"
              size="middle"
              onSearch={(str) => {
                voting.whiteEmailAddressesIncludes(web3StringToBytes32(str)).then((res) => {
                  console.log(res)
                })
              }}
            />
          </Space>
          <br />
          <br />
          <br />
          <Space size="large" align="top" split={<Divider type="vertical" />}>
            <Button
              onClick={() => {
                voting.getWhiteDomains().then((res) => {
                  console.log(res)
                })
              }}
            >
              getWhiteDomains()
            </Button>
            <Button
              onClick={() => {
                voting.getWhiteEmailAddresses().then((res) => {
                  console.log(res)
                })
              }}
            >
              getWhiteEmailAddresses()
            </Button>
          </Space>
          <br />
          <br />
          <br />
          <Space size="large" align="top" split={<Divider type="vertical" />}>
            <Search
              allowClear
              enterButton="getId()"
              size="middle"
              onSearch={(id) => {
                voting.getId(web3StringToBytes32(id)).then((res) => {
                  console.log(`BSU ID: ${res}`)
                })
              }}
            />
            <Search
              allowClear
              enterButton="getEmail()"
              size="middle"
              onSearch={(str) => {
                voting.getEmail(str).then((res) => {
                  console.log(`Email: ${ethers.utils.parseBytes32String(res)}`)
                })
              }}
            />
          </Space>
          <br />
          <br />
          <br />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }} className="footer">
        Footer
      </Footer>
    </Layout>
  )
}

export default function Vote() {
  return <Main />
}
