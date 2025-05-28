"use client";

import {
  useChainId,
  useReadContract,
  useAccount,
  useWriteContract,
  useSendTransaction,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { chainsToTSender, erc20Abi } from "../constants";
import config from "@/rainbowKitConfig";
import { anvil } from "@wagmi/core/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";

const TestWagmi = () => {
  const chainId = useChainId();
  const account = useAccount();
  const { sendTransaction } = useSendTransaction();
  const {
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract();
  // console.log({ chainId, account });

  const tsenderAddress = chainsToTSender[chainId]["tsender"];

  const handleApprove = async () => {
    console.log({ tsenderAddress, erc20Abi, chainId });
    const approvedHash = await writeContractAsync({
      abi: erc20Abi,
      address: tsenderAddress as `0x${string}`,
      functionName: "approve",
      args: [tsenderAddress, BigInt(1)],
    });
    console.log({ approvedHash });
    const approveResponse = await waitForTransactionReceipt(config, {
      chainId: anvil.id,
      hash: approvedHash,
    });
    console.log({ approveResponse });
  };

  const handleGetApproved = async () => {
    const approvedAmount = await readContract(config, {
      abi: erc20Abi,
      address: tsenderAddress as `0x${string}`,
      functionName: "allowance",
      args: [account?.address, tsenderAddress as `0x${string}`],
    });
    console.log({ approvedAmount });
  };

  const handleCheckBalance = async () => {
    const balance = await readContract(config, {
      abi: erc20Abi,
      address: tsenderAddress as `0x${string}`,
      functionName: "balanceOf",
      args: [account?.address],
    });
    console.log({ balance });
  };

  const handleSendEther = async () => {
    const transaction = sendTransaction({
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`,
      value: parseEther("1"),
    });
    console.log({ transaction });
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ConnectButton />
      <div
        className="text-2xl bg-orange-300 p-3 rounded-md"
        onClick={handleApprove}
      >
        {" "}
        approve{" "}
      </div>
      <div
        className="text-2xl bg-violet-300 p-3 rounded-md"
        onClick={handleGetApproved}
      >
        {" "}
        getApprovedAmount
      </div>
      <div
        className="text-2xl bg-red-300 p-3 rounded-md"
        onClick={handleCheckBalance}
      >
        getBalance
      </div>
      <div
        className="text-2xl bg-green-300 p-3 rounded-md"
        onClick={handleSendEther}
      >
        SendEther
      </div>
    </div>
  );
};

export default TestWagmi;
