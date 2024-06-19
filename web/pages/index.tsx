import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import { useReadContract, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";

import abi from "../utils/abi";

const Home: NextPage = () => {
  const account = useAccount();
  const [accBalance, setAccBalance] = useState(0);
  const { writeContract } = useWriteContract();
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);

  const { data }: any = useReadContract({
    address: "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
    functionName: "balanceOf",
    abi: abi,
    args: [account.address],
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      setAccBalance(data.toString());
    }
  }, [data]);

  function buyTokens() {
    if (buyAmount <= 0) return;
    if (buyAmount > 1000) {
      return alert("You can't buy more than 1000 tokens at once");
    }

    console.log("Buying tokens");
    writeContract({
      address: "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
      functionName: "buy",
      abi: abi,
      args: [buyAmount],
    });
  }

  function sendTokens() {
    console.log("Sending tokens");
    writeContract({
      address: "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
      functionName: "transfer",
      abi: abi,
      args: [receiver, amount],
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>A7X Token exchange</title>
        <meta content="A7X Token exchange" name="A7X Token exchange" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <div className={styles.ConnectButton}>
          <ConnectButton />
        </div>

        <h1 className={styles.title}>A7X Token exchange </h1>

        <p className={styles.description}>
          Current address connected: <code>{account.address}</code>
        </p>

        <p className={styles.description}>
          Your balance of A7X Tokens: <code> {accBalance} </code>
        </p>

        <div>
          <p className={styles.description}>
            Send A7X Tokens to another address: <br></br>
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setReceiver(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <button onClick={sendTokens}>Send</button>
          </p>
          <p className={styles.description}>
            Buy A7X Tokens: <br></br>
            <input
              type="number"
              placeholder="Buy Amount"
              onChange={(e) => setBuyAmount(parseInt(e.target.value))}
            />
            <button onClick={buyTokens}>Buy</button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
