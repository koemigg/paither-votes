import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Table, Space, Divider, Input, Layout, Typography, message } from 'antd'
import { Header } from './Header'

import { Encrypt, Decrypt, Add, getTime, GenKeys } from './Crypto'
import { AbiEncode, web3StringToBytes32 } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'

const scientificToDecimal = require('scientific-to-decimal')
const getRevertReason = require('eth-revert-reason')

const { Content, Footer } = Layout
const { Title } = Typography
const { Search } = Input

function Main() {
  const [keys, setKeys] = useState()
  const [voting, setVoting] = useState(null)
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [pollTitle, setTitle] = useState('Here is title')
  const [tableData, setTabledata] = useState([''])
  const [email, setEmail] = useState()
  const [id, setId] = useState()

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

  const onLoadBallot = async (ballotId) => {
    creator
      .getAddress(ballotId)
      .then(async (address) => {
        if (address == 0) {
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
          const cArr = await voting.getCandidateList(ballotId)
          const vArrPromise = cArr.map((c) => {
            return voting.totalVotesFor(ethers.utils.keccak256(AbiEncode(ethers.utils.parseBytes32String(c))))
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
        .registerVoter(web3StringToBytes32(email), Number(id), web3StringToBytes32(email.split('@')[1]))
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
      message.error('Please load ballot prior to reception', 10)
    }
  }

  const onVote = (_email) => {
    if (voting) {
      voting.voteForCandidate()
    } else {
      message.error('Please load ballot prior to vote', 10)
    }
  }

  const onChangeEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setEmail(e.target.value)
  }

  const onChangeId = (e) => {
    console.log('ID set', e.target.value)
    setId(e.target.value)
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
                  onChange: (selectedRowKeys, selectedRows) => {
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
                  }
                }}
                columns={columns}
                dataSource={tableData}
                size="default"
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
              />
            </Space>
            <Space direction="vertical" size="small" align="center">
              <h2>Reception</h2>
              <div>Reception to vote.</div>
              <Input onChange={onChangeEmail} style={{ width: 300 }} placeholder="E-mail Adderess" allowClear />
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
