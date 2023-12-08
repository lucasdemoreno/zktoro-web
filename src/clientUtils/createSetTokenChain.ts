import { ChainToken } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { switchToNetworkIfNeeded } from "@/providers/WagmiProvider/wagmiUtils";
import { ManagerABI } from "@/transactions/abi";
import { getChainSC } from "@/transactions/contracts";
import { Dispatch, useCallback, useState } from "react";
import { trim } from "viem";
import { waitForTransaction, writeContract } from "wagmi/actions";

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

  const onCreateSetTokenChain = useCallback(async () => {
    try {
      publishDispatch({
        type: "UPDATE",
        payload: {
          step,
          status: StepStatusEnum.PENDING,
        },
      });

      const network = await switchToNetworkIfNeeded(tokenA.chainId);

      const writeResponse = await writeContract({
        address: chain.ManagerAddress as `0x${string}`,
        abi: ManagerABI,
        functionName: "createSetToken",
        args: [
          [tokenA.address as `0x${string}`, tokenB.address as `0x${string}`],
          [
            BigInt(5000 * 10 ** tokenA.decimals),
            BigInt(5000 * 10 ** tokenB.decimals),
          ],
          `Leonardo 02 - ${tokenA.symbol}:${tokenB.symbol}`,
          "LEO02",
        ],
      });

      const data = await waitForTransaction({
        hash: writeResponse.hash as `0x${string}`,
      });

      if (data?.status === "success") {
        console.log("transactionData settled", data?.status === "success");
        const result = data.logs[0].topics[1];
        console.log(result);
        if (result) {
          const parsedResult = trim(result);
          console.log(parsedResult);
          publishDispatch({
            type: "UPDATE",
            payload: {
              step,
              status: StepStatusEnum.SUCCESS,
              result: parsedResult,
            },
          });
        }
      } else {
        publishDispatch({
          type: "UPDATE",
          payload: {
            step,
            status: StepStatusEnum.FAILURE,
            result: new Error(data?.status),
          },
        });
      }
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
  }, [publishDispatch, step, tokenA, tokenB, chain]);

  if (tokenA.chainId !== tokenB.chainId) {
    throw new Error("Chain 1 and Chain 2 must be the same");
  }

  return {
    onCreateSetTokenChain,
  };
}
