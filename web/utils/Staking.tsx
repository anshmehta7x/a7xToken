import { useReadContract, useWriteContract } from "wagmi";
import abi from "../utils/abi"; // Ensure the path to abi is correct
import { useEffect, useState } from "react";

export default function Staking({ address }) {
  const smartContractAddress =
    process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS.slice(2);

  // Use useWriteContract hook
  const { writeContract } = useWriteContract();

  // State variables
  const [stakeAmount, setStakeAmount] = useState(0);
  const [currentStake, setCurrentStake] = useState(null);

  // Function to place stake
  const placeStake = async () => {
    try {
      const response = await writeContract({
        address: `0x${smartContractAddress}`,
        functionName: "stake",
        abi: abi,
        args: [stakeAmount],
      });
      console.log("Stake placed:", response);
    } catch (error) {
      console.error("Error placing stake:", error);
    }
  };

  // Fetch the current stake amount
  const { data, error, isLoading } = useReadContract({
    address: `0x${smartContractAddress}`,
    functionName: "checkStake",
    args: [address],
    abi: abi,
  });

  useEffect(() => {
    console.log("Data:", data);
    if (data !== undefined) {
      setCurrentStake(data.toString());
      console.log("Current stake:", data.toString());
    } else if (error) {
      console.error("Error fetching stake:", error);
    }
  }, [data, error]);

  return (
    <div>
      <h1>Staking</h1>
      <p>Stake your tokens to earn more tokens</p>
      <p>Your current stake: {isLoading ? "Loading..." : currentStake}</p>
      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setStakeAmount(parseInt(e.target.value))}
      />
      <button onClick={placeStake}>Add Stake</button>
    </div>
  );
}
