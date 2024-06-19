import { useReadContract, useWriteContract } from "wagmi";
import abi from "../utils/abi"; // Ensure the path to abi is correct
import { useEffect, useState } from "react";
import parseTime from "../utils/parseTime";

export default function Staking({ address }) {
  const smartContractAddress =
    process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS.slice(2);

  // Use useWriteContract hook
  const { writeContract } = useWriteContract();

  // State variables
  const [stakeAmount, setStakeAmount] = useState(0);
  const [currentStake, setCurrentStake] = useState(null);
  const [stakingTime, setStakingTime] = useState(null);

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
  const {
    data: currentStakeData,
    error: currentStakeError,
    isLoading: isCurrentStakeLoading,
  } = useReadContract({
    address: `0x${smartContractAddress}`,
    functionName: "checkStake",
    args: [address],
    abi: abi,
  });

  useEffect(() => {
    console.log("Stake Data:", currentStakeData);
    if (currentStakeData !== undefined) {
      setCurrentStake(currentStakeData.toString());
      console.log("Current stake:", currentStakeData.toString());
    } else if (currentStakeError) {
      console.error("Error fetching stake:", currentStakeError);
    }
  }, [currentStakeData, currentStakeError]);

  // Fetch the current staking time
  const {
    data: stakingTimeData,
    error: stakingTimeError,
    isLoading: isStakingTimeLoading,
  } = useReadContract({
    address: `0x${smartContractAddress}`,
    functionName: "checkStakingTime",
    args: [address],
    abi: abi,
  });

  useEffect(() => {
    if (stakingTimeData !== undefined) {
      console.log("Staking Time:", stakingTimeData.toString());
      // Assuming there's a function to handle setting the staking time
      setStakingTime(stakingTimeData.toString());
    } else if (stakingTimeError) {
      console.error("Error fetching staking time:", stakingTimeError);
    }
  }, [stakingTimeData, stakingTimeError]);

  function withdrawStake() {
    writeContract({
      address: `0x${smartContractAddress}`,
      functionName: "withdrawStake",
      abi: abi,
    });
  }

  return (
    <div>
      <h1>Staking</h1>
      <p>Stake your tokens to earn more tokens</p>
      {currentStake > 0 ? (
        <>
          <p>Your current stake: {currentStake}</p>
          <p>Stake Placed on : {parseTime(stakingTime)}</p>{" "}
          <button onClick={withdrawStake}>Withdraw Stake</button>
        </>
      ) : (
        <div>
          {" "}
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setStakeAmount(parseInt(e.target.value))}
          />
          <button onClick={placeStake}>Add Stake</button>
        </div>
      )}
    </div>
  );
}
