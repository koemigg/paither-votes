import React from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import { ethers } from "ethers";
import { Button, Space, Divider, Input } from "antd";
import { Header } from "./Header";

function Main() {
  const [contract, setContract] = React.useState();
  const [accounts, setAccounts] = React.useState("No account connected.");

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickConnect = async () => {
    const ethereum = window.ethereum;
    const newAccounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccounts(newAccounts);
  };

  const onClickGetContract = async () => {
    try {
      if (isMetaMaskConnected()) {
        // Get the contract instance.
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const { networkId } = await provider.getNetwork();
        const deployedNetwork = SimpleStorageContract.networks[5777];
        const signer = provider.getSigner(0);
        const instance = new ethers.Contract(
          deployedNetwork.address,
          SimpleStorageContract.abi,
          signer
        );
        setContract(instance);
        console.log("Setting up contract.");
      } else {
        console.log("Metamask is not connected.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //   const onSearch = (value) => console.log(value);
  //   const { Search } = Input;

  return (
    <main>
      <div className="container">
        <Header title={"Create Poll ⚖️"} backPageName={""} />
        <h1>Create on this page.</h1>
        <h3>This is Test Phase.</h3>
        <h2>Status</h2>
        <p>
          Account: <i>{accounts}</i>
        </p>
        <Space
          direction="horizontal"
          size="large"
          align="center"
          split={<Divider type="vertical" />}
        >
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
        </Space>
        <br />
        <br />
        <br />
        <p>
          <p>
            <h2>Create Ballot</h2>
            <Space direction="vertical" size="small" align="center">
              <div>Vote for your choice. Load Ballot prior to this.</div>
              <Input
                style={{ width: 200 }}
                placeholder="candidate name"
                allowClear
              />
              <Input
                style={{ width: 200 }}
                placeholder="your E-mail Adderess"
                allowClear
              />
              <Button type="primary">Vote</Button>
            </Space>
          </p>
        </p>
        <div>The selected contract is: {contract}</div>
      </div>
    </main>
  );
}

export default function Vote() {
  return (
    <div>
      <Main />
    </div>
  );
}
