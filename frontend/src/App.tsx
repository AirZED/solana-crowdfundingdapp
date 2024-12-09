import { ReactElement, useEffect, useState, useMemo } from "react";
import "./App.css";
import { IDL } from "./idl";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
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
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
window.Buffer = buffer.Buffer;

const programId = new PublicKey("E9JvpKoPBCFP8Y5h2XLnRk8EintPJE43AF7Rk5G6DnKx");
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
  // this waits for out node to confirm our trasaction
};

const { SystemProgram } = web3;

type Campaign = {
  pubkey: string;
  name: string;
  description: string;
  amountDonated: number;
  admin: PublicKey;
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [campaigns, setCampaigns] = useState([]);

  const getProvider = useMemo(() => {
    if (walletAddress) {
      const connection = new Connection(
        network,
        opts.preflightCommitment as web3.Commitment
      );
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

  const getCampaigns = async () => {
    const connection = new Connection(
      network,
      opts.preflightCommitment as web3.Commitment
    );
    if (!provider) {
      console.error("Provider is not available");
      return;
    }

    const program = new Program(IDL as Idl, provider);
    const accounts = await connection.getProgramAccounts(programId);

    console.log(accounts);

    const campaigns = await Promise.all(
      accounts.map(async (campaign) => {
        const campaignData = await program.account.campaign.fetch(
          campaign.pubkey
        );
        return {
          ...campaignData,
          pubkey: campaign.pubkey.toString(), // Ensure public key is a string for easier use
        };
      })
    );

    console.log(campaigns);

    setCampaigns(campaigns as any);
  };

  const createCampaign = async () => {
    try {
      if (!provider) {
        console.error("Provider is not available");
        return;
      }

      console.log("IDL", IDL, "programId", programId, "provider", provider);
      const program = new Program(IDL as Idl, provider);
      // since the program Id is in the Idl, anchor auto detects it.

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

  const donate = async (publicKey: string) => {
    try {
      if (!provider) {
        console.error("Provider is not available");
        return;
      }

      const program = new Program(IDL as Idl, provider);
      await program.methods
        .donate(new BN(0.2 * LAMPORTS_PER_SOL))
        .accounts({
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Donated to campaign", publicKey);
      getCampaigns();
    } catch (error) {
      console.error("Error donating campaign", error);
    }
  };

  const withdraw = async (publicKey: string) => {
    try {
      if (!provider) {
        console.error("Provider is not available");
        return;
      }

      const program = new Program(IDL as Idl, provider);
      await program.methods
        .withdraw(new BN(0.1 * LAMPORTS_PER_SOL))
        .accounts({
          campaign: publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      console.log("WIthrawn successfully", publicKey);
      getCampaigns();
    } catch (error) {
      console.error("Error withdrawing from campaign", error);
    }
  };
  const RenderNotConnectedContainer = (): ReactElement => {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  };

  const RenderConnectedContainer = () => {
    return (
      <>
        <button onClick={createCampaign}>Create Campaign</button>{" "}
        <button onClick={getCampaigns}>Get Campaigns</button>
        <div>
          <h1>Campaigns</h1>
          {campaigns.map((campaign: Campaign) => {
            return (
              <div key={campaign.pubkey.toString()}>
                <p>Campaign Id: {campaign.pubkey.toString()}</p>
                <p>
                  Balance{" "}
                  {(campaign.amountDonated / LAMPORTS_PER_SOL).toString()}
                </p>
                <p>Campaign Name: {campaign.name}</p>
                <p>Campaign Description: {campaign.description}</p>
                <button onClick={() => donate(campaign.pubkey)}>Donate</button>
                <button onClick={() => withdraw(campaign.pubkey)}>
                  Withdraw
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
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
