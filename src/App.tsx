import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import { Eth } from 'web3-eth';

export interface CustomGlobalThis {
  [any: string]: any;
}

const App: React.FC<any> = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedAddress, setAddress] = useState<string | null>(null);
  const [ethInstance, SetEthInstance] = useState<Eth | null>(null);
  const [balance, setBalance] = useState<string>('')

  // Inialize empty web3
  let web3: Web3 = new Web3();

  useEffect(() => {
    tryConnect();
    getAccountBalances();
  }, []);

  const tryConnect = async () => {
    if ('ethereum' in window) {
      web3 = new Web3((window as CustomGlobalThis).ethereum);
      try {
        // Request access
        await (window as CustomGlobalThis).ethereum.enable();
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

  const getAccountBalances = async () => {
    if (isConnected && ethInstance && connectedAddress) {
      const balance = await ethInstance.getBalance(connectedAddress);
      setBalance(Web3.utils.fromWei(balance, 'ether'))
    }
  }

  return (
    <div className="App">
      {isConnected ?
        (
          <div>
            Address: {connectedAddress}
            <br></br>
            Balance: { balance }
          </div>
        ):
        (
          <button style={{ marginTop: 50 }} onClick={() => tryConnect()}>
            Connect metamask
          </button>
        )}
    </div>
  )
}

export default App;
