import { ReactElement, useEffect, useState } from "react";
import "./App.css";
import IDL from "./idl";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils, BN } from "@coral-xyz/anchor";

const programId = new PublicKey(IDL.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
  // this waits for out node to confirm our trasaction
};
const { SystemProgram } = web3;

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

  const createCampaign = async () => {
    try {
      const provider = getProvider();

      const program = new Program(IDL, programId, provider);

      // Generate a unique seed for the campaign
      const uniqueSeed = Math.random().toString();

      const [campaign] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer(),
          utils.bytes.utf8.encode(uniqueSeed), // Add unique seed
        ],
        program.programId
      );

      await program.rpc.create("campaign name", "campaign description", {
        accounts: {
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });

      console.log("Created a new campaign", campaign.toString());
    } catch (error) {
      console.error("Error creating campaign", error);
    }
  };

  const RenderNotConnectedContainer = (): ReactElement => {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  };

  const RenderConnectedContainer = () => {
    return <button onClick={createCampaign}>Create Campaign</button>;
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
      {walletAddress && <RenderConnectedContainer />}
    </div>
  );
};

export default App;
