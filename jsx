// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MyNFTContract from './contracts/MyNFT.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [mintAmount, setMintAmount] = useState(1);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const netId = await web3Instance.eth.net.getId();
          setNetworkId(netId);
          const deployedNetwork = MyNFTContract.networks[netId];
          const contractInstance = new web3Instance.eth.Contract(
            MyNFTContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        }
      } catch (error) {
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const switchToNetwork = async (chainId) => {
    try {
      const provider = window.ethereum;
      if (provider) {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chainId.toString(16)}` }] });
        // Refresh page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const mintNFT = async () => {
    try {
      if (contract && account) {
        for (let i = 0; i < mintAmount; i++) {
          await contract.methods.mint(account, parseInt(tokenId) + i).send({ from: account });
        }
        alert(`${mintAmount} NFT(s) minted successfully!`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>NFT Minting Web App</h1>
      <div>
        <button onClick={() => switchToNetwork(1)}>Ethereum Mainnet</button>
        <button onClick={() => switchToNetwork(10)}>Optimism</button>
        <button onClick={() => switchToNetwork(42161)}>Arbitrum</button>
        <button onClick={() => switchToNetwork(69)}>Optimistic Ethereum</button>
      </div>
      <input
        type="text"
        placeholder="Enter Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Mint Amount"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
      />
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}

export default App;
