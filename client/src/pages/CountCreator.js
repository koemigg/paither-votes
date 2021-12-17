/* global BigInt */
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Descriptions, Button, Tabs, Input, Layout, Typography, message, Steps, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as paillierBigint from 'paillier-bigint'
import { Header } from './Header'
import { VotingTable } from './VotingTable'

import { AbiEncode, web3StringToBytes32, Num2FracStr } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'
import { keccak256 } from '@ethersproject/keccak256'

const scientificToDecimal = require('scientific-to-decimal')

const { Content, Footer } = Layout
const { Title, Paragraph, Text, Link } = Typography
const { Search } = Input
const { Step } = Steps
const { Dragger } = Upload

const stepsContentStyle = {
  // minHeight: '200px',
  marginTop: '40px',
  // paddingLeft: '32px',
  // paddingRight: '32px',
  textAlign: 'left'
}

const stepsAction = {
  marginTop: '24px',
  textAlign: 'left'
}

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

  const parametersFileProps = {
    name: 'parametersFile',
    multiple: false,
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        console.log(info.file)
        let reader = new FileReader()
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result)
          console.log('DATA\n', data.title, data.ballotId, JSON.parse(data.publicKey), JSON.parse(data.privateKey))
          setTitle(data.title)
          setBallotId(data.ballotId)
          const pk = new paillierBigint.PublicKey(BigInt(JSON.parse(data.publicKey).n), BigInt(JSON.parse(data.publicKey).g))
          const sk = new paillierBigint.PrivateKey(BigInt(JSON.parse(data.privateKey).lambda), BigInt(JSON.parse(data.privateKey).mu), pk)
          setKeys({ ...keys, privateKey: sk, publicKey: pk })
          // setKeys({
          //   ...keys,
          //   publicKey: { n: BigInt(JSON.parse(data.publicKey).n), g: BigInt(JSON.parse(data.publicKey).g) },
          //   privateKey: { lambda: BigInt(JSON.parse(data.privateKey).lambda), mu: BigInt(JSON.parse(data.privateKey).mu) }
          // })
          next()
        }
        reader.readAsText(info.file.originFileObj)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  const steps = [
    {
      title: 'Uploading',
      subtitle: 'Parameters file',
      description: 'JSON file saved when creating the ballot.',
      content: (
        <Dragger {...parametersFileProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single upload. only json files are supported.</p>
        </Dragger>
      )
    },
    {
      title: 'Inspection',
      subtitle: '',
      description: 'Check the validity of the file and the ballot timelimit.',
      content: (
        <Descriptions title="Ballot Info" layout="verical" size="middle">
          <Descriptions.Item label="Title">{title}</Descriptions.Item>
          {/* <Descriptions.Item label="Timelimit" span={2}>
            {timelimit}
          </Descriptions.Item> */}
          <Descriptions.Item label="Ballot ID" span={2}>
            {ballotId}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Contract Address" span={3}>
            {voting}
          </Descriptions.Item> */}
          <Descriptions.Item label="Public Key" span={2}>
            n:{Num2FracStr(keys.publicKey.n)},<br />
            g: {Num2FracStr(keys.publicKey.g)}
          </Descriptions.Item>
          <Descriptions.Item label="Private Key" span={2}>
            λ: {Num2FracStr(keys.privateKey.lambda)},<br />
            μ: {Num2FracStr(keys.privateKey.mu)}
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      title: 'Counting',
      subtitle: '',
      description: 'Register your private key and publish toal vote count.',
      // content: viewTable ? (
      content: true ? (
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
      ) : (
        'Last-content'
      )
    }
  ]

  const onValidate = () => {
    isValidFile()
  }

  const isValidFile = () => {
    creator
      .getAddress(ballotId)
      .then((address) => {
        console.log('address: ', address)
        if (address == 0x0000000000000000000000000000000000000000) {
          message.error('Invalid Ballot ID')
        } else {
          message.success('Valid Ballot ID')
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          const voting_ = new ethers.Contract(address, VotingArtifacts.abi, signer)
          setVoting(voting_)
          next()
        }
      })
      .catch(function (error) {
        console.error('Failed to load the poll.')
        console.error(error)
      })
  }

  const onCount = () => {
    console.log('keys', keys)
    console.log('[keys.privateKey.lambda, keys.privateKey.mu]', [keys.privateKey.lambda, keys.privateKey.mu])
    voting
      .setPrivateKey([keys.privateKey.lambda, keys.privateKey.mu])
      .then(async () => {
        console.log('Success set private key.')
        const cArr = await voting.getCandidateList(ballotId)
        const vArrPromise = cArr.map((c) => {
          return voting.totalVotesFor(keccak256(AbiEncode(ethers.utils.parseBytes32String(c))))
        })
        Promise.all(vArrPromise).then((vArr) => {
          const tableData_ = cArr.map((c, i) => ({
            key: i + 1,
            name: ethers.utils.parseBytes32String(c),
            vote: Number(keys.privateKey.decrypt(BigInt(vArr[i])))
          }))
          setTabledata(tableData_)
        })
        setViewTable(true)
      })
      .catch((error) => {
        message.error(error.data.message.split('revert ')[1])
      })
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <Layout className="layout">
      <Header title={'📊 Count'} subTitle={'for owners'} />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <>
            <Title>Counting the votes.</Title>
            <Paragraph>Follow the instructions below to count votes of your ballot!</Paragraph>
            <Paragraph>
              Account: <i>{accounts}</i>
            </Paragraph>
          </>
          <br />
          <br />
          <br />
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} subtitle={item.subtitle} description={item.description} />
            ))}
          </Steps>
          <div style={stepsContentStyle}>{steps[current].content}</div>
          <div style={stepsAction}>
            {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
            {/* {current < steps.length - 1 && (
              <Button style={{ margin: '0 8 0 0px' }} onClick={() => next()}>
                Next
              </Button>
            )} */}
            {current === 1 && (
              <Button type="primary" style={{ margin: '0 8px' }} onClick={() => onValidate()}>
                Validate the file
              </Button>
            )}
            {current === 2 && (
              <Button type="primary" style={{ margin: '0 8px' }} onClick={() => onCount()}>
                Count
              </Button>
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }} className="footer"></Footer>
    </Layout>
  )
}

export default function CountCreator() {
  return <Main />
}
