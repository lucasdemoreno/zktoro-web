import { ChainToken } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { ManagerABI } from "@/transactions/abi";
import { getChainSC } from "@/transactions/contracts";
import { Dispatch, use, useCallback, useEffect, useState } from "react";
import { trim } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

type UseCreateTokenResult = {
  onCreateSetTokenChain: () => void;
};

export function useCreateSetTokenChain(
  tokenA: ChainToken,
  tokenB: ChainToken,
  step: "createSetTokenChainA" | "createSetTokenChainB",
  publishDispatch: Dispatch<PublishAction>
): UseCreateTokenResult {
  const chain = getChainSC(tokenA.chainId);
  const [setTokenCreated, setSetTokenCreated] = useState<string | null>(null);

  const { config } = usePrepareContractWrite({
    address: chain.ManagerAddress as `0x${string}`,
    abi: ManagerABI,
    functionName: "createSetToken",

    args: [
      [tokenA.address as `0x${string}`, tokenB.address as `0x${string}`],
      [BigInt(1 * 10 ** tokenA.decimals), BigInt(1 * 10 ** tokenB.decimals)],
      `Leonardo 02 - ${tokenA.symbol}:${tokenB.symbol}`,
      "LEO02",
    ],
  });
  const {
    data: writeResponse,
    isLoading,
    isSuccess,
    write,
    error,
  } = useContractWrite(config);

  const transactionData = useWaitForTransaction({
    hash: writeResponse?.hash as `0x${string}`,
    onSettled: (data) => {
      console.log(data);
      if (data?.status === "success") {
        console.log("transactionData settled", data?.status === "success");
        const result = data.logs[0].topics[1];
        console.log(result);
        if (result) {
          const parsedResult = trim(result);
          console.log(parsedResult);
          setSetTokenCreated(parsedResult);
        }
      }
    },
  });

  useEffect(() => {
    if (error) {
      console.log("error", error);
      publishDispatch({
        type: "UPDATE",
        payload: {
          step,
          status: StepStatusEnum.FAILURE,
          result: error,
        },
      });
      return;
    }

    if (isLoading) {
      console.log("loading");
      publishDispatch({
        type: "UPDATE",
        payload: {
          step,
          status: StepStatusEnum.PENDING,
        },
      });
      return;
    }

    if (!isLoading && isSuccess && !error && setTokenCreated) {
      console.log("success", setTokenCreated);
      publishDispatch({
        type: "UPDATE",
        payload: {
          step,
          status: StepStatusEnum.SUCCESS,
          result: setTokenCreated,
        },
      });

      console.log("response from setTokenCreate", writeResponse);
    }
  }, [
    writeResponse,
    isLoading,
    isSuccess,
    error,
    step,
    publishDispatch,
    setTokenCreated,
  ]);

  const onCreateSetTokenChain = useCallback(() => {
    try {
      console.log("calling write", write);
      write?.();
    } catch (e) {
      publishDispatch({
        type: "UPDATE",
        payload: {
          step,
          status: StepStatusEnum.FAILURE,
          result: e as any,
        },
      });
    }
  }, [publishDispatch, write, step]);

  if (tokenA.chainId !== tokenB.chainId) {
    throw new Error("Chain 1 and Chain 2 must be the same");
  }

  return {
    onCreateSetTokenChain,
  };
}
