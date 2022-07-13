/* global BigInt */
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button, Table, Space, Divider, Input, Layout, Typography, message } from 'antd'
import { Header } from './Header'
import { web3StringToBytes32, SolBigIntToBigInt, BigIntToSolBigInt } from './Functions'
import CreatorArtifacts from '../contracts/Creator.json'
import VotingArtifacts from '../contracts/Voting.json'
import * as paillier from 'paillier-bigint'

const { Content, Footer } = Layout
const { Title } = Typography
const { Search } = Input

/**
 * Main screen component.
 * @return {React.FunctionComponent} - React function component
 */
const Main = () => {
  const [keys, setKeys] = useState({
    publicKey: { n: 0n, _n2: 0n, g: 0n },
    privateKey: { lambda: 0n, mu: 0n, _p: 0n, _q: 0n, publicKey: { n: 0n, _n2: 0n, g: 0n } }
  })
  const [voting, setVoting] = useState()
  const [creator, setCreator] = useState()
  const [accounts, setAccounts] = useState('No account connected.')
  const [ballotTitle, setTitle] = useState()
  const [tableData, setTabledata] = useState([''])
  const [receptionEmail, setReceptionEmail] = useState()
  const [voteEmail, setVoteEmail] = useState('ho@ex.com')
  const [id, setId] = useState()
  const [ballotId, setBallotId] = useState()
  const [selectedRows, setSelectedRows] = useState()
  const [selectedRowKeys, setRowKeys] = useState([])

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
   * Voting contract setup.
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
   * @return {bool} - Is Metamask connected
   */
  const isMetaMaskConnected = () => accounts && accounts.length > 0

  /**
   * @param {Error} err - Error oject
   */
  const errorHandler = (err) => {
    const errorMessage = err.code == -32603 && err.data.message.split('revert ')[1] ? err.data.message.split('revert ')[1] : `Something went wrong 😕`
    message.error(errorMessage)
    console.error(err)
  }

  /**
   * Landing Voting Event.
   */
  const onLoadBallot = async () => {
    creator
      .getAddress(ballotId)
      .then(async (address) => {
        if (address === 0) {
          window.alert('Invalid Ballot ID')
          throw new Error('Invalid ballot ID.')
        } else {
          // TODO: Loading
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner(0)
          const voting_ = new ethers.Contract(address, VotingArtifacts.abi, signer)
          setVoting(voting_)
          voting_.getTitle().then((title) => {
            setTitle(title)
          })
          const publicKey_ = await (async () => {
            const arr = await voting_.getPublicKey()
            return new paillier.PublicKey(
              SolBigIntToBigInt([arr[0], arr[1], arr[2], arr[3]]),
              SolBigIntToBigInt([arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10], arr[11]])
            )
          })()
          setKeys({ ...keys, publicKey: publicKey_ })
          const cArr = await voting_.getCandidateList(ballotId)
          const tableData_ = cArr.map((c, i) => ({
            key: i + 1,
            name: ethers.utils.parseBytes32String(c)
          }))
          setTabledata(tableData_)
        }
      })
      .catch(function (error) {
        console.error('Failed to load the poll.')
        console.error(error)
      })
  }

  /**
   * Verify eligibility to vote and link your email to your ID and Ethereum address.
   */
  const onReception = async () => {
    if (voting) {
      voting
        .register(web3StringToBytes32(receptionEmail), Number(id), web3StringToBytes32(receptionEmail.split('@')[1]))
        .then(() => {
          message.success('Success reception', 10)
        })
        .catch((err) => {
          errorHandler(err)
        })
    } else {
      message.error('Please load ballot prior to reception')
    }
  }

  /**
   * Cast a voting (interface function).
   */
  const onVote = () => {
    if (voting) {
      if (selectedRows) {
        _OnVote()
      } else {
        message.info('Please select your choice prior to vote')
      }
    } else {
      message.error('Please load ballot prior to vote')
    }
  }

  /**
   * Cast a voting. Basically, it is executed only from OnVote().
   */
  const _OnVote = () => {
    const selectedCandidate = web3StringToBytes32(selectedRows[0].name)
    voting.getCandidateList(ballotId).then((candidateList) => {
      const nowVoteGettings = candidateList.map((c) => {
        return voting.getVotes(c)
      })
      Promise.all(nowVoteGettings).then((nowVotes) => {
        const newVotesBI = nowVotes.map((v, i) => {
          return keys.publicKey.addition(SolBigIntToBigInt(v), keys.publicKey.encrypt(selectedCandidate == candidateList[i] ? 1n : 0n))
        })
        console.log('newVotesBI:')
        console.dir(newVotesBI, { depth: null })
        let newVotes = []
        newVotesBI.forEach((v) => {
          console.log('newVotesBI[i]:')
          console.dir(v, { depth: null })
          newVotes = newVotes.concat(BigIntToSolBigInt(v, 2048))
        })
        console.log('newVotes:')
        console.dir(newVotes, { depth: null })
        voting
          .vote(newVotes, web3StringToBytes32(voteEmail), web3StringToBytes32(voteEmail.split('@')[1]))
          .then(() => {
            message.info('Vote successful 🎉', 10)
            setRowKeys([])
          })
          .catch((err) => {
            errorHandler(err)
          })
      })
    })
  }

  /**
   * Listener function for Ballot ID.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeBallotId = (e) => {
    console.log('Ballot ID set', e.target.value)
    setBallotId(e.target.value)
  }

  /**
   * Listener function for Email (for Reception).
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeReceptionEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setReceptionEmail(e.target.value)
  }

  /**
   * Listener function for ID.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeId = (e) => {
    console.log('ID set', e.target.value)
    setId(e.target.value)
  }

  /**
   * Listener function for Email (for Voteing).
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onChangeVoteEmail = (e) => {
    console.log('E-mail address set', e.target.value)
    setVoteEmail(e.target.value)
  }

  /**
   * Voting table column information.
   * @property {string} title - Title of this column.
   * @property {string} dataIndex - Display field of the data record.
   * @property {string} key - Unique key of this column.
   */
  const columns = [
    {
      title: 'Candidate/Choice',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  return (
    <Layout className="layout">
      <Header title={'🗳️ Vote'} />
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
                title={() => ballotTitle}
                pagination={{ hideOnSinglePage: true }}
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
              />
            </Space>
            <Space direction="vertical" size="small" align="center">
              <h2>Reception</h2>
              <div>Reception to vote.</div>
              <Input onChange={onChangeReceptionEmail} style={{ width: 300 }} placeholder="E-mail Adderess" allowClear />
              <Input onChange={onChangeId} style={{ width: 300 }} placeholder="Your BSU student/employee ID" allowClear />
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
          {/*
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
            <Button
              onClick={() => {
                voting.getId().then((res) => {
                  console.log(`ID: ${res}`)
                })
              }}
            >
              getId()
            </Button>
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
            <Button
              onClick={() => {
                voting.getVoteTimes().then((res) => {
                  console.log(`Now, ${res} Times voted.`)
                })
              }}
            >
              getVoteTimes()
            </Button>
            <Button
              onClick={() => {
                voting.getMaxVoteTimes().then((res) => {
                  console.log(`Max Votes: ${res}`)
                })
              }}
            >
              getMaxVoteTimes()
            </Button>
          </Space>
          <br />
          <br />
          <br />
            */}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }} className="footer">
        {/* Footer */}
      </Footer>
    </Layout>
  )
}

export default function Vote() {
  return <Main />
}
