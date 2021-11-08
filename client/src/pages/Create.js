import React from 'react'
import SimpleStorageContract from '../contracts/SimpleStorage.json'
import { ethers } from 'ethers'
import { Button, Space, Divider, Input, Radio, DatePicker, TimePicker, InputNumber, Layout, Typography } from 'antd'
import { Header } from './Header'
import moment from 'moment'

const { Content, Footer } = Layout
const { Title } = Typography

function Main() {
  const [contract, setContract] = React.useState()
  const [accounts, setAccounts] = React.useState('No account connected.')

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  const onClickConnect = async () => {
    const ethereum = window.ethereum
    const newAccounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })
    setAccounts(newAccounts)
  }

  const onClickGetContract = async () => {
    try {
      if (isMetaMaskConnected()) {
        // Get the contract instance.
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const { networkId } = await provider.getNetwork();
        const deployedNetwork = SimpleStorageContract.networks[5777]
        const signer = provider.getSigner(0)
        const instance = new ethers.Contract(deployedNetwork.address, SimpleStorageContract.abi, signer)
        setContract(instance)
        console.log('Setting up contract.')
      } else {
        console.log('Metamask is not connected.')
      }
    } catch (error) {
      console.error(error)
    }
  }

  // const onSearch = (value) => console.log(value);
  // const { Search } = Input;

  const [ballotType, setBallotType] = React.useState()
  const [whitelistType, setWhitelistType] = React.useState()

  const onChangeBallotType = (e) => {
    console.log('radio checked', e.target.value)
    setBallotType(e.target.value)
  }

  const onChangeWhitelistType = (e) => {
    console.log('radio checked', e.target.value)
    setWhitelistType(e.target.value)
    console.log(whitelistType)
  }

  const onChangeTime = (time, timeString) => {
    console.log(time, timeString)
  }

  const onChangeVotesNumber = (value) => {
    console.log('changed', value)
  }

  return (
    <Layout className="layout">
      <Header title={'Create Poll ⚖️'} backPageName={''} />
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
            <Space direction="horizontal" size="large" align="center" split={<Divider type="vertical" />}>
              <Button type="primary" onClick={onClickConnect}>
                Connect
              </Button>
              <Button type="primary" onClick={onClickGetContract}>
                Get Contract
              </Button>
            </Space>
          </Space>
          <br />
          <br />
          <br />
          <Space direction="vertical" size="small" align="center">
            <h2>Create Ballot</h2>
            <h3>Enter your E-mail Address</h3>
            <Input style={{ width: 300 }} placeholder="E-mail Adderess" allowClear />
            <br />
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
            <Input style={{ width: 400 }} placeholder="Title" allowClear />
            <br />
            <h3>Seperate each candidate/choice with a comma</h3>
            <Input style={{ width: 400 }} placeholder="Candidates/Choices" />
            <br />
            <h3>Number of votes allowed per person</h3>
            <InputNumber min={1} defaultValue={3} onChange={onChangeVotesNumber} />
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
                  <Input style={{ width: 400 }} placeholder="Whitelisted E-mail addresses (if applicable)" />
                ) : null}
                <Radio value={2}>
                  <b>Domain</b> (only E-mails having certain domain are allowed to vote)
                </Radio>
                {whitelistType === 2 ? (
                  <Input style={{ width: 400 }} placeholder="Whitelisted domains (if applicable)" />
                ) : null}
              </Space>
            </Radio.Group>
            <br />
            <h3>Select Poll End Date and Time</h3>
            <Input.Group compact>
              <DatePicker />
              <TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={onChangeTime} />
            </Input.Group>
            <br />
            <Button type="primary">Create poll</Button>
          </Space>
          <br />
          <br />
          <br />
          <div>The selected contract is: {contract}</div>
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
