import { ReactElement, useEffect, useState } from "react";
import "./App.css";
import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils, BN } from "@coral-xyz/anchor";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );

    return provider;
  };
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phamtom wallet found");
          const response = await solana.connect({ onlyIfTrusted: true });

          console.log(
            "Connected with public key:" + response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Get a phamtom wallet");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Wallet connected", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const RenderNotConnectedContainer = (): ReactElement => {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  };
  useEffect(() => {
    const onload = async () => {
      await checkIfWalletIsConnected();
    };

    window.addEventListener("load", onload);

    return () => window.removeEventListener("load", onload);
  }, []);
  return (
    <div className="App">
      {!walletAddress && <RenderNotConnectedContainer />}
    </div>
  );
};

export default App;
