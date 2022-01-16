/* global BigInt */
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Space, Descriptions, Button, Tabs, Input, Layout, Typography, message, Steps, Upload, PageHeader } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as paillierBigint from 'paillier-bigint'
import { Header } from './Header'
import { VotingTable } from './VotingTable'

import { AbiEncode, web3StringToBytes32, Num2FracStr } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'
import { keccak256 } from '@ethersproject/keccak256'

const { Content, Footer } = Layout
const { Title, Paragraph, Text, Link } = Typography
const { Search } = Input
const { Step } = Steps
const { Dragger } = Upload

const Main = () => {
  const [creator, setCreator] = useState()
  const [voting, setVoting] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [ballotId, setBallotId] = useState()
  const [ballotType, setBallotType] = useState(0)
  const [title, setTitle] = useState()
  const [choices, setChoices] = useState('A, B, C, D')
  const [limitCount, setLimitCount] = useState('3')
  const [whitelistType, setWhitelistType] = useState(0)
  const [whitlistedEmail, setWhitlistedEmail] = useState()
  const [whitlistedDomain, setWhitlistedDomain] = useState()
  const [limitDate, setLimitDate] = useState(moment(new Date(2021, 12, 31, 23, 59, 59, 59)))
  const [limitTime, setLimitTime] = useState(moment(new Date(2021, 12, 31, 23, 59, 59, 59)))
  const [keys, setKeys] = useState({
    publicKey: { n: 0n, _n2: 0n, g: 0n },
    privateKey: { lambda: 0n, mu: 0n, _p: 0n, _q: 0n, publicKey: { n: 0n, _n2: 0n, g: 0n } }
  })
  const [viewTable, setViewTable] = useState(false)
  const [current, setCurrent] = useState(0)
  const [tableData, setTabledata] = useState()

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

  const onChangeBallotId = (e) => {
    e.preventDefault()
    console.log('Ballot ID set', e.target.value)
    setBallotId(e.target.value)
  }

  const onLoadResult = (v, e) => {
    e.preventDefault()
    creator
      .getAddress(ballotId)
      .then(async (address) => {
        console.log('address: ', address)
        if (address == 0x0000000000000000000000000000000000000000) {
          message.error('Invalid Ballot ID')
        } else {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          const voting_ = new ethers.Contract(address, VotingArtifacts.abi, signer)
          setVoting(voting_)
          const pkSeed = await voting_.getPublicKey()
          const pk = new paillierBigint.PublicKey(BigInt(pkSeed[0]), BigInt(pkSeed[1]))
          setKeys({ ...keys, publicKey: pk })
          voting_
            .getPrivateKey()
            .then(async (data) => {
              const sk = new paillierBigint.PrivateKey(BigInt(data[0]), BigInt(data[1]), pk)
              setKeys({ ...keys, privateKey: sk })
              const cArr = await voting_.getCandidateList(ballotId)
              const vArrPromise = cArr.map((c) => {
                return voting_.totalVotesFor(keccak256(AbiEncode(ethers.utils.parseBytes32String(c))))
              })
              Promise.all(vArrPromise).then((vArr) => {
                const tableData_ = cArr.map((c, i) => ({
                  key: i + 1,
                  name: ethers.utils.parseBytes32String(c),
                  vote: Number(sk.decrypt(vArr[i].toBigInt()))
                }))
                setTabledata(tableData_)
              })
            })
            .catch((error) => {
              // if (error.data.message) {
              message.error(error.data.message.split('revert ')[1])
              // }
              console.error(error)
            })
        }
      })
      .catch((error) => {
        message.error('Failed to load the poll.')
        console.error(error)
      })
  }

  return (
    <div>
      <Layout className="layout">
        <Header title={'📊 Count'} subTitle={'for voters'} />
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <>
              <Title>Counting the votes.</Title>
              <Paragraph>
                Account: <i>{accounts}</i>
              </Paragraph>
            </>
            <br />
            <br />
            <br />
            <Space direction="vertical" size="small" align="center">
              <h2>View Results</h2>
              <div>View the final results of the poll.</div>
              <Search
                style={{ width: 300 }}
                placeholder="input Ballot ID"
                enterButton="View"
                size="middle"
                onSearch={onLoadResult}
                onChange={onChangeBallotId}
              />
            </Space>
            <VotingTable
              columns={[
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
              ]}
              data={tableData}
              title={title}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }} className="footer"></Footer>
      </Layout>
    </div>
  )
}

export default function CountVoter() {
  return <Main />
}
