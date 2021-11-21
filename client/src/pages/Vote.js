import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Button, Table, Space, Divider, Input, Layout, Typography } from 'antd'
import { Header } from './Header'
import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'

const { Content, Footer } = Layout
const { Title } = Typography
const { Search } = Input

function Main() {
  const [voting, setVoting] = useState()
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [pollTitle, setTitle] = useState('Here is title')
  const [tableData, setTabledata] = useState([''])

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

  const onLoadBallot = async (_ballotId) => {
    creator
      .getAddress(_ballotId)
      .then(function (_address) {
        if (_address == 0) {
          window.alert('Invalid Ballot ID')
          throw new Error('Invalid ballot ID.')
        } else {
          // TODO: Loading
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          const _voting = new ethers.Contract(_address, VotingArtifacts.abi, signer)
          setVoting(_voting)
          _voting.getTitle().then(function (_title) {
            setTitle(_title)
            _voting.getCandidateList(_ballotId).then(function (cArr) {
              // TODO: 得票数を取得する
              const _tableData = cArr.map((c, i) => ({
                key: i + 1,
                name: ethers.utils.parseBytes32String(c),
                vote: Math.floor(Math.random() * 10)
              }))
              setTabledata(_tableData)
            })
          })
        }
      })
      .catch(function (error) {
        console.error('投票の読み込みに失敗しました')
        console.error(error)
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
              <h2>Register</h2>
              <div>Register to vote.</div>
              <Input style={{ width: 300 }} placeholder="E-mail Adderess" allowClear />
              <Input style={{ width: 300 }} placeholder="Your BSU student/employee ID" allowClear />
              <Button type="primary">Register</Button>
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
