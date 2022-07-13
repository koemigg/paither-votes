import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Space, Divider, Input, Radio, DatePicker, TimePicker, InputNumber, Layout, Typography, message } from 'antd'
import { Header } from './Header'
import { CreateResult } from './CreateResult'
import moment from 'moment'
import * as paillierBigint from 'paillier-bigint'

import { web3StringArrayToBytes32, genLimitUnixTime, BigIntToSolBigInt } from './Functions'

import CreatorArtifacts from '../contracts/Creator.json'

const { Content } = Layout
const { Title } = Typography

/**
 * Create Voting Event Page Component.
 * @return {React.FunctionComponent} - Create voting event page component
 */
const Main = () => {
  // for release
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [ballotId, setballotId] = useState(Math.floor(Math.random() * 4294967295))
  const [ballotType, setBallotType] = useState()
  const [title, setTitle] = useState()
  const [choices, setChoices] = useState()
  const [limitCount, setLimitCount] = useState()
  const [whitelistType, setWhitelistType] = useState()
  const [whitlistedEmail, setWhitlistedEmail] = useState()
  const [whitlistedDomain, setWhitlistedDomain] = useState()
  const [limitDate, setLimitDate] = useState()
  const [limitTime, setLimitTime] = useState()
  const [keys, setKeys] = useState()
  const [isCreateBallot, setIsCreateBallot] = useState()

  // for develop
  // const [creator, setCreator] = useState()
  // const [accounts, setAccounts] = useState('No account connected.')
  // const [ballotId, setballotId] = useState(Math.floor(Math.random() * 4294967295))
  // const [ballotType, setBallotType] = useState(1)
  // const [title, setTitle] = useState('Test Poll')
  // const [choices, setChoices] = useState('A, B, C, D')
  // const [limitCount, setLimitCount] = useState('3')
  // const [whitelistType, setWhitelistType] = useState(0)
  // const [whitlistedEmail, setWhitlistedEmail] = useState()
  // const [whitlistedDomain, setWhitlistedDomain] = useState()
  // const [limitDate, setLimitDate] = useState(moment(new Date(2022, 12, 31, 23, 59, 59, 59)))
  // const [limitTime, setLimitTime] = useState(moment(new Date(2022, 12, 31, 23, 59, 59, 59)))
  // const [keys, setKeys] = useState()
  // const [isCreateBallot, setIsCreateBallot] = useState(false)

  const KEY_BITS = 1024

  /**
   * Chain and account listener
   */
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

  /**
   * Creator contract setup.
   */
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

  /**
   * Re create encryption key and Ballot ID.
   */
  useEffect(() => {
    ;(async () => {
      _renewKeys()
      _renewBallotId()
    })()
  }, [])

  /**
   * @return {bool} - Is Metamask connected
   */
  const isMetaMaskConnected = () => accounts && accounts.length > 0

  /**
   * Re create encryption key.
   */
  const _renewKeys = async () => {
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(KEY_BITS)
    setKeys({ publicKey: publicKey, privateKey: privateKey })
    console.log('Setting up new keys.')
    console.log(publicKey, privateKey)
  }

  /**
   * Re create Ballot ID.
   */
  function _renewBallotId() {
    const _ballotId = Math.floor(Math.random() * 4294967295)
    setballotId(_ballotId)
    console.log('Setting up new Ballot ID.')
    console.log(_ballotId)
    return _ballotId
  }

  /**
   * Listener function for title.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeTitle = (e) => {
    console.log('Title set', e.target.value)
    setTitle(e.target.value)
  }

  /**
   * Listener function for choices.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeChoices = (e) => {
    console.log('Choices set', e.target.value)
    setChoices(e.target.value)
  }

  /**
   * Listener function for maximum voting number.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeLimitCount = (value) => {
    console.log('maximum number set', value)
    setLimitCount(value)
  }

  /**
   * Listener function for whitelist type.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeWhitelistType = (e) => {
    console.log('Whitelist type checked', e.target.value)
    setWhitelistType(Number(e.target.value))
  }

  /**
   * Listener function for whitelist Email.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeWhitlistEmail = (e) => {
    console.log('Whitelisted E-mail set', e.target.value)
    setWhitlistedEmail(e.target.value)
  }

  /**
   * Listener function for whitelist domain.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeWhitlistDomain = (e) => {
    console.log('Whitelisted domain set', e.target.value)
    setWhitlistedDomain(e.target.value)
  }

  /**
   * Listener function for limit date.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeDate = (date, dateString) => {
    console.log('Limit date set', date, dateString)
    setLimitDate(date)
  }

  /**
   * Listener function for limit time.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeTime = (time, timeString) => {
    console.log('Limit time set', time, timeString)
    setLimitTime(time)
  }

  /**
   * Create a voting event.
   * @note Testnet is plus 7 hours
   */
  const onClickCreate = () => {
    const whiteStuff = (() => {
      if (whitelistType === 0) {
        console.log('No whitelist.')
        return ','
      } else if (whitelistType === 1) {
        return whitlistedEmail
      } else if (whitelistType === 2) {
        return whitlistedDomain
      } else {
        console.log('Incorrect whitelist format.')
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
          web3StringArrayToBytes32(whiteStuff.split(/\s*,\s*/)),
          BigIntToSolBigInt(keys.publicKey.n),
          BigIntToSolBigInt(keys.publicKey.g, 2048)
        )
        .then(() => {
          // message.success('Voting contract has been deployed 🎉', 10)
          // console.log(title, "'s Ballot ID: ", ballotId)
          setIsCreateBallot(true)
        })
        .catch((res) => {
          const errorMessage =
            res.code == -32603 && res.data.message.split('revert ')[1] ? res.data.message.split('revert ')[1] : 'Something went wrong 😕'
          message.error(errorMessage)
          console.error(`response:`)
          console.dir(res, { depth: null })
        })
    }
  }

  // TODO: EventをListenしてVotingのAddressをCreateResultに渡す
  return (
    <>
      {!isCreateBallot ? (
        <Layout className="layout">
          <Header title={'⚖️ Create Ballot'} />
          <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content">
              <Space direction="vertical" size="small" align="center" split={<Divider type="horizontal" />}>
                <div>
                  <Title>Create ballot on this page.</Title>
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
                {/* TODO: Refactor */}
                {/* <h3>Select ballot type</h3>
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
                <br /> */}
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
                      <Input onChange={onChangeWhitlistEmail} style={{ width: 400 }} placeholder="Whitelisted E-mail addresses (if applicable)" />
                    ) : null}
                    <Radio value={2}>
                      <b>Domain</b> (only E-mails having certain domain are allowed to vote)
                    </Radio>
                    {whitelistType === 2 ? (
                      <Input onChange={onChangeWhitlistDomain} style={{ width: 400 }} placeholder="Whitelisted domains (if applicable)" />
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
        </Layout>
      ) : (
        <CreateResult result={'Success'} ballotId={ballotId} title={title} publicKey={keys.publicKey} privateKey={keys.privateKey} />
      )}
    </>
  )
}

export default function Create() {
  return <Main />
}
