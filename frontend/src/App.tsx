import { ReactElement, useEffect, useState, useMemo } from "react";
import "./App.css";
import { IDL } from "./idl";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  Idl,
  Wallet,
} from "@coral-xyz/anchor";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const programId = new PublicKey("E9JvpKoPBCFP8Y5h2XLnRk8EintPJE43AF7Rk5G6DnKx");
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
  // this waits for out node to confirm our trasaction
};
const { SystemProgram } = web3;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);

  const getProvider = useMemo(() => {
    if (walletAddress) {
      const connection = new Connection(network, opts.preflightCommitment);
      return new AnchorProvider(
        connection,
        (window as any).solana as Wallet,
        AnchorProvider.defaultOptions()
      );
    }
    return null;
  }, [walletAddress]);

  useEffect(() => {
    setProvider(getProvider || null);
  }, [getProvider]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window as any;
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
    const { solana } = window as any;
    if (solana) {
      const response = await solana.connect();
      console.log("Wallet connected", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const createCampaign = async () => {
    try {
      if (!provider) {
        console.error("Provider is not available");
        return;
      }

      console.log("IDL", IDL, "programId", programId, "provider", provider);
      const program = new Program(IDL as Idl, provider);

      console.log("program", program);

      const [campaign] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      console.log("campaign", campaign);

      // await program.rpc.create("campaign name", "campaign description", {
      //   accounts: {
      //     campaign,
      //     user: provider.wallet.publicKey,
      //     systemProgram: SystemProgram.programId,
      //   },
      // });

      await program.methods
        .create("Campaign Name", "Campaign Description")
        .accounts({
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

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
