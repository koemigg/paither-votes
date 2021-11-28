import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import {
  Button,
  Space,
  Divider,
  Input,
  Radio,
  DatePicker,
  TimePicker,
  InputNumber,
  Layout,
  Typography,
  message
} from 'antd'
import { Header } from './Header'
import moment from 'moment'

import { web3StringArrayToBytes32, genLimitUnixTime } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'

const { Content, Footer } = Layout
const { Title } = Typography

function Main() {
  // for release
  // const [contract, setContract] = useState()
  // const [accounts, setAccounts] = useState('No account connected.')
  // const [ballotId, setballotId] = useState(Math.floor(Math.random() * 4294967295))
  // const [email, setEmail] = useState()
  // const [ballotType, setBallotType] = useState()
  // const [title, setTitle] = useState()
  // const [choices, setChoices] = useState()
  // const [limitCount, setLimitCount] = useState()
  // const [whitelistType, setWhitelistType] = useState()
  // const [whitlistedEmail, setWhitlistedEmail] = usestate()
  // const [whitlistedDomain, setWhitlistedDomain] = useState()
  // const [limitDate, setLimitDate] = useState()
  // const [limitTime, setLimitTime] = useState()
  // for develop
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [ballotId, setballotId] = useState(Math.floor(Math.random() * 4294967295))
  const [ballotType, setBallotType] = useState(0)
  const [title, setTitle] = useState('Test Poll')
  const [choices, setChoices] = useState('A, B, C, D')
  const [limitCount, setLimitCount] = useState('3')
  const [whitelistType, setWhitelistType] = useState(0)
  const [whitlistedEmail, setWhitlistedEmail] = useState()
  const [whitlistedDomain, setWhitlistedDomain] = useState()
  const [limitDate, setLimitDate] = useState(moment(new Date(2021, 12, 31, 23, 59, 59, 59)))
  const [limitTime, setLimitTime] = useState(moment(new Date(2021, 12, 31, 23, 59, 59, 59)))

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

  function genBallotId() {
    const _ballotId = Math.floor(Math.random() * 4294967295)
    setballotId(_ballotId)
    return _ballotId
  }

  const onChangeBallotType = (e) => {
    console.log('Ballot type checked', e.target.value)
    setBallotType(e.target.value)
  }

  const onChangeTitle = (e) => {
    console.log('Title set', e.target.value)
    setTitle(e.target.value)
  }

  const onChangeChoices = (e) => {
    console.log('Choices set', e.target.value)
    setChoices(e.target.value)
  }

  const onChangeLimitCount = (value) => {
    console.log('maximum number set', value)
    setLimitCount(value)
  }

  const onChangeWhitelistType = (e) => {
    console.log('Whitelist type checked', e.target.value)
    setWhitelistType(Number(e.target.value))
  }

  const onChangeWhitlistEmail = (e) => {
    console.log('Whitelisted E-mail set', e.target.value)
    setWhitlistedEmail(e.target.value)
  }

  const onChangeWhitlistDomain = (e) => {
    console.log('Whitelisted domain set', e.target.value)
    setWhitlistedDomain(e.target.value)
  }

  const onChangeDate = (date, dateString) => {
    console.log('Limit date set', date, dateString)
    setLimitDate(date)
  }

  const onChangeTime = (time, timeString) => {
    console.log('Limit time set', time, timeString)
    setLimitTime(time)
  }

  /**
   * Create a poll.
   * @note Testnet is plus 7 hours.
   */
  const onClickCreate = () => {
    const whiteStuff = (() => {
      if (whitelistType === 0) {
        console.log('ホワイトリストなし')
        return ''
      } else if (whitelistType === 1) {
        return whitlistedEmail
      } else if (whitelistType === 2) {
        return whitlistedDomain
      } else {
        console.log('ホワイトリストの形式が正しくありません')
        return null
      }
    })()

    if (whiteStuff) {
      creator
        .createBallot(
          genLimitUnixTime(limitDate, limitTime),
          ballotType,
          limitCount,
          ballotId,
          title,
          whitelistType,
          web3StringArrayToBytes32(choices.split(/\s*,\s*/)),
          web3StringArrayToBytes32(whiteStuff.split(/\s*,\s*/))
        )
        .then(() => {
          message.success('Voting contract has been deployed 🎉', 10)
          console.log(title, "'s Ballot ID: ", ballotId)
          genBallotId()
        })
    }
  }

  return (
    <Layout className="layout">
      <Header title={'Create Poll ⚖️'} />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Space direction="vertical" size="small" align="center" split={<Divider type="horizontal" />}>
            <div>
              <Title>Create poll on this page.</Title>
              Follow the instructions below to create your ballot!
            </div>
            <div>
              <h2>Status</h2>
              Account: <i>{accounts}</i>
            </div>
          </Space>
          <br />
          <br />
          <br />
          <Space direction="vertical" size="small" align="center">
            <h2>Create Ballot</h2>
            <h3>Select ballot type</h3>
            <Radio.Group onChange={onChangeBallotType} value={ballotType}>
              <Space direction="vertical">
                <Radio value={0}>
                  <b>Poll</b> (results are displayed live)
                </Radio>
                <Radio value={1}>
                  <b>Election</b> (results are displayed after end date)
                </Radio>
              </Space>
            </Radio.Group>
            <br />
            <h3>Enter title of your ballot</h3>
            <Input onChange={onChangeTitle} style={{ width: 400 }} placeholder="Title" allowClear />
            <br />
            <h3>Seperate each candidate/choice with a comma</h3>
            <Input onChange={onChangeChoices} style={{ width: 400 }} placeholder="Candidates/Choices" />
            <br />
            <h3>Number of votes allowed per person</h3>
            <InputNumber min={1} defaultValue={3} onChange={onChangeLimitCount} />
            <br />
            <h3>Select whitelist type</h3>
            <Radio.Group onChange={onChangeWhitelistType} value={whitelistType}>
              <Space direction="vertical">
                <Radio value={0}>
                  <b>None</b> (all e-mails are allowed to vote)
                </Radio>
                <Radio value={1}>
                  <b>Email</b> (only certain E-mails are allowed to vote)
                </Radio>
                {whitelistType === 1 ? (
                  <Input
                    onChange={onChangeWhitlistEmail}
                    style={{ width: 400 }}
                    placeholder="Whitelisted E-mail addresses (if applicable)"
                  />
                ) : null}
                <Radio value={2}>
                  <b>Domain</b> (only E-mails having certain domain are allowed to vote)
                </Radio>
                {whitelistType === 2 ? (
                  <Input
                    onChange={onChangeWhitlistDomain}
                    style={{ width: 400 }}
                    placeholder="Whitelisted domains (if applicable)"
                  />
                ) : null}
              </Space>
            </Radio.Group>
            <br />
            <h3>Select Poll End Date and Time</h3>
            <Input.Group compact>
              <DatePicker onChange={onChangeDate} />
              <TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={onChangeTime} />
            </Input.Group>
            <br />
            <Button type="primary" onClick={onClickCreate}>
              Create poll
            </Button>
          </Space>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }} className="footer">
        Footer
      </Footer>
    </Layout>
  )
}

export default function Create() {
  return <Main />
}
