import React from 'react'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import { ethers } from 'ethers'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import './App.css'

function Main() {
  const [storageValue, setStorageValue] = React.useState('0')
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

  const onClickExcute = async () => {
    await contract.set(5)
    const response = await contract.get()
    setStorageValue(response.toString())
  }

  return (
    <main>
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
        <p>
          Account: <i>{accounts}</i>
        </p>
        <p>
          <Button type="primary" onClick={onClickConnect}>
            Connect
          </Button>
        </p>
        <p>
          <Button type="primary" onClick={onClickGetContract}>
            Get Contract
          </Button>
        </p>
        <p>
          <Button type="primary" onClick={onClickExcute}>
            Excute
          </Button>
        </p>
        <div>The stored value is: {storageValue}</div>
      </div>
    </main>
  )
}

export default function App() {
  return <Main />
}
