import { useReadContract, useWriteContract } from "wagmi";
import abi from "../utils/abi"; // Ensure the path to abi is correct
import { useEffect, useState } from "react";
import parseTime from "../utils/parseTime";

export default function Staking({ address }) {
  const smartContractAddress =
    process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS.slice(2);

  const { writeContract } = useWriteContract();
  const [stakeAmount, setStakeAmount] = useState(0);
  const [currentStake, setCurrentStake] = useState(null);
  const [stakingTime, setStakingTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [currentStakedPool, setCurrentStakedPool] = useState(0);

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
    if (currentStakeData !== undefined) {
      setCurrentStake(currentStakeData.toString());
      console.log("Current stake:", currentStakeData.toString());
    } else if (currentStakeError) {
      console.error("Error fetching stake:", currentStakeError);
    }
  }, [currentStakeData, currentStakeError]);

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
      setStakingTime(parseInt(stakingTimeData.toString()) * 1000); // Convert to milliseconds
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateReward = () => {
    if (currentStake && stakingTime) {
      const timeStaked = (currentTime - stakingTime) / 1000; // Time staked in seconds
      return (currentStake * timeStaked) / 100;
    }
    return 0;
  };

  const {
    data: currentStakedPoolData,
    error: currentStakedPoolError,
    isLoading: isCurrentStakedPoolLoading,
  } = useReadContract({
    address: `0x${smartContractAddress}`,
    functionName: "totalStakedPool",
    abi: abi,
  });

  useEffect(() => {
    if (currentStakedPoolData !== undefined) {
      setCurrentStakedPool(currentStakedPoolData.toString());
    } else if (currentStakedPoolError) {
      console.error("Error fetching staked pool:", currentStakedPoolError);
    }
  }, [currentStakedPoolData, currentStakedPoolError]);

  return (
    <div>
      <h1>Staking</h1>
      <p>Current staked pool : {currentStakedPool}</p>
      <p>Stake your tokens to earn more tokens</p>
      {currentStake > 0 ? (
        <>
          <p>Your current stake: {currentStake}</p>
          <p>Stake Placed on: {parseTime(stakingTime)}</p>
          <p>Estimated reward ≈ {calculateReward()}</p>
          <button onClick={withdrawStake}>Withdraw Stake</button>
        </>
      ) : (
        <div>
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
