import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { Transaction, TransactionReceipt } from 'web3-core';

import NftMmorpgJson from './contracts/NftMmorpg.json';
import { Contract } from 'web3-eth-contract';

export interface CustomGlobalThis {
  [any: string]: any;
}

const App: React.FC<any> = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedAddress, setAddress] = useState<string | null>(null);

  const [ethInstance, SetEthInstance] = useState<Eth | null>(null);
  const [myToken, setMyToken] = useState<Contract | null>(null);

  const [balance, setBalance] = useState<string>('');
  const [sentTransactions, setTransactions] = useState<TransactionReceipt[]>([]);
  const [history, setHistory] = useState<Transaction[]>([]);

  // Inialize empty web3
  let web3: Web3 = new Web3();

  useEffect(() => {
    tryConnect();
  }, []);

  useEffect(() => {
    if (connectedAddress) {
      getBalance();
      retrieveTransactions();
    }
  }, [connectedAddress]);

  const tryConnect = async () => {
    if ('ethereum' in window) {
      web3 = new Web3((window as CustomGlobalThis).ethereum);
      try {
        // Request access
        await (window as CustomGlobalThis).ethereum.request({
          method: 'eth_requestAccounts'
        });

        const networkId = await web3.eth.net.getId(); 
        const networkData = (NftMmorpgJson.networks as any)[networkId as any];
        if (networkData) {
          const NftMmorpgToken = new web3.eth.Contract(NftMmorpgJson.abi as any, networkData.address);
          setMyToken(NftMmorpgToken);
        }

        SetEthInstance(web3.eth);
        setIsConnected(true);
        setAddress((window as CustomGlobalThis).ethereum.selectedAddress);
      } catch (e) {
        setIsConnected(false);
        setAddress(null);
        alert('Metamask not found');
        return;
      }
    }
  }

  const getBalance = async () => {
    if (isConnected && ethInstance && connectedAddress) {
      const balanceWei = await ethInstance.getBalance(connectedAddress);
      setBalance(Web3.utils.fromWei(balanceWei, 'ether'));
    }
  }

  const retrieveTransactions = async () => {
    if (isConnected && ethInstance && connectedAddress) {
      const block = await ethInstance.getTransactionCount(connectedAddress);
      console.log(block)

      const current: Transaction[] = [];
      for (let i = 25; i < +block; i++) {
        current.push(await ethInstance.getTransactionFromBlock(i, 0));
      }

      setHistory(current);
    }
  }

  const send1ETH = async () => {
    if (isConnected && ethInstance && connectedAddress) {
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
        gas: '0x2710', // customizable by user during MetaMask confirmation.
        to: '0x2CE0e11F6417CeD3feDabc8E9D33FB7bA9C42d02', // Required except during contract publications.
        from: connectedAddress, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data:
          '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
        chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      try {
        const hash = await ethInstance.sendTransaction({
          nonce: 0,
          from: connectedAddress,
          to: "0x2CE0e11F6417CeD3feDabc8E9D33FB7bA9C42d02",
          value: Web3.utils.toWei(Web3.utils.toBN(1), 'ether') // This means 1 ETH
        });
        const newTransactions = [...sentTransactions, hash];
        setTransactions(newTransactions)
      } catch (e) {
        console.log(e);
        alert(e.message);
      }
    }
  }

  const callMint = async () => {
    if (isConnected && myToken) {
      // 0 ?
      // await myToken.methods.mint('TestNFT', 100, 100).call();
      console.log(await myToken.methods.getCurrentId().call())
      // console.log(await myToken.methods.getCharacter(10).call());
    }
  }

  return (
    <div className="App" style={{ padding: 40 }}>
      {isConnected ?
        (
          <div>
            Address: {connectedAddress}<br></br>
            Balance: {balance}<br></br>

            <button onClick={send1ETH} style={{ marginTop: 20 }}>
              Send 1 ETH
            </button>

            <button onClick={callMint} style={{ marginTop: 20 }}>
              Call mint
            </button>

            <h1>Last transactions</h1>
            <ul>
              {sentTransactions.map(t => (
                <div key={t.transactionHash}>
                  Block: {t.blockNumber}
                  Hash: <li key={t.transactionHash}>{ t.transactionHash }</li>
                </div>
              ))}
            </ul>

            <h1>History</h1>
            <ul>
              {history.map(t => (
                <div key={t.hash} style={{ marginTop: 20 }}>
                  <div>Block: {t.blockNumber}</div>
                  <div>Hash: {t.hash}</div>
                </div>
              ))}
            </ul>
          </div>
        ):
        (
          <button style={{ marginTop: 50 }} onClick={tryConnect}>
            Connect metamask
          </button>
        )}
    </div>
  )
}

export default App;
