import React from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import { ethers } from "ethers";
import { Button, Table, Space, Divider, Input } from "antd";
import { Header } from "./Header";

function Main() {
  const [storageValue, setStorageValue] = React.useState("0");
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

  const onClickExcute = async () => {
    await contract.set(5);
    const response = await contract.get();
    setStorageValue(response.toString());
  };

  const columns = [
    {
      title: "Candidate/Choice",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vote",
      dataIndex: "vote",
      key: "vote",
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      vote: 32,
    },
    {
      key: "2",
      name: "Jim Green",
      vote: 42,
    },
    {
      key: "3",
      name: "Joe Black",
      vote: 32,
    },
  ];

  const onSearch = (value) => console.log(value);
  const { Search } = Input;

  return (
    <main>
      <div className="container">
        <Header title={"Vote 🗳️"} backPageName={""} />
        <h1>Vote on this page.</h1>
        <h3>This is Test Phase.</h3>
        <h2>Status</h2>
        <p>
          Account: <i>{accounts}</i>
        </p>
        <p>
          <Table
            rowSelection={{
              type: "radio",
              columnWidth: 20, // not working ?
            }}
            columns={columns}
            dataSource={data}
            size="default"
            title={() => "Here is Title"}
          />
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
          <p>
            <Button type="primary" onClick={onClickExcute}>
              Excute
            </Button>
          </p>
        </Space>
        <br />
        <br />
        <br />
        <Space size="large" align="top" split={<Divider type="vertical" />}>
          <Space direction="vertical" size="small" align="center">
            <h2>Register</h2>
            <div>Register to vote.</div>
            <Button type="primary">Register</Button>
          </Space>
          <Space direction="vertical" size="small" align="center">
            <h2>Load Ballot</h2>
            <div>Load Ballot.</div>
            <Search
              style={{ width: 300 }}
              placeholder="input Ballot ID"
              allowClear
              enterButton="Load"
              size="middle"
              onSearch={onSearch}
            />
          </Space>
          <Space direction="vertical" size="small" align="center">
            <h2>Vote</h2>
            <div>Vote for your choice. Load Ballot prior to this.</div>
            <Search
              style={{ width: 300 }}
              placeholder="your E-mail Adderess"
              allowClear
              enterButton="Vote"
              size="middle"
              onSearch={onSearch}
            />
          </Space>
        </Space>
        <br />
        <br />
        <br />
        <div>The stored value is: {storageValue}</div>
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
