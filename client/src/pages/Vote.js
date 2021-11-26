import React, { useState } from 'react'
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
  const [voting, setVoting] = useState()
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [pollTitle, setTitle] = useState('Here is title')
  const [tableData, setTabledata] = useState([''])
  const [email, setEmail] = useState()
  const [id, setId] = useState()

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

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  const onClickInit = async () => {
    const ethereum = window.ethereum
    const newAccounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })
    setAccounts(newAccounts)
    getCreator()
    setKeys(GenKeys())
  }

  const getCreator = async () => {
    try {
      if (isMetaMaskConnected()) {
        // Get the contract instance.
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const { networkId } = await provider.getNetwork();
        const deployedNetwork = CreatorArtifacts.networks[5777]
        const signer = provider.getSigner(0)
        const instance = new ethers.Contract(deployedNetwork.address, CreatorArtifacts.abi, signer)
        setCreator(instance)
        console.log('Setting up creator contract.')
      } else {
        console.log('Metamask is not connected.')
      }
    } catch (error) {
      console.error(error)
    }
  }

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

  const onChangeEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setEmail(e.target.value)
  }

  const onChangeId = (e) => {
    console.log('ID set', e.target.value)
    setId(e.target.value)
  }

  const onReception = async () => {
    console.log('email', email)
    console.log('domain', email.split('@')[1])
    voting
      .registerVoter(web3StringToBytes32(email), id, web3StringToBytes32(email.split('@')[1]))
      .then(function () {
        message.success('Success reception')
      })
      .catch(async function (res) {
        // console.log('txhash', res)
        // console.log(await getRevertReason(0xd7cdd5a470e38de45e2bc30369d664db4acaf5d6b5c020e868efab4ed869f429))
        message.error('An error occurd')
        // message.error(await getRevertReason(res))
      })
  }

  const onVote = (_email) => console.log(_email)

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
            <Space direction="horizontal" size="large" align="center" split={<Divider type="vertical" />}>
              <Button type="primary" onClick={onClickInit}>
                Connect
              </Button>
            </Space>
          </Space>
          <br />
          <br />
          <br />
          <div>
            <Table
              rowSelection={{
                type: 'radio',
                columnWidth: 20
              }}
              columns={columns}
              dataSource={tableData}
              size="default"
              title={() => pollTitle}
            />
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
