import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import { getChainById } from "@/providers/ProgramProvider/Tokens";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { StrategyToCreate } from "@/types/create";
import { Dispatch } from "react";

/**
 * TODO: This function should create the docker image
 *
 * @returns a promise that resolves to a success string from
 * the docker image creation
 */
export async function createDockerImage(
  pythonCode: string,
  setToken_chainA: string,
  setToken_chainB: string,
  tokenA_chainA: ChainToken,
  tokenB_chainA: ChainToken,
  tokenA_chainB: ChainToken,
  tokenB_chainB: ChainToken
): Promise<string> {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  const tokenStrings = `${tokenA_chainA.symbol}, ${tokenB_chainA.symbol}`;
  const chainStrings = `${getChainById(tokenA_chainA.chainId)?.name}, ${
    getChainById(tokenB_chainB.chainId)?.name
  }`;
  const strategyToCreate: StrategyToCreate = {
    id: "",
    isMocked: false,
    pythonCode: pythonCode,
    setToken_chainA,
    setToken_chainB,
    tokenA_chainA,
    tokenB_chainA,
    tokenA_chainB,
    tokenB_chainB,
    name: `New Strategy ${dateString} ${timeString}`,
    description: `with ${tokenStrings} between ${chainStrings}`,
  };

  // This is the request to the Next.js API route
  const response = await fetch("/api/upload-strategy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...strategyToCreate,
    }),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);

  return jsonResponse.message;
}

export async function tryCreateDockerImage(
  pythonCode: string,
  setToken_chainA: string,
  setToken_chainB: string,
  tokenA_chainA: ChainToken,
  tokenB_chainA: ChainToken,
  tokenA_chainB: ChainToken,
  tokenB_chainB: ChainToken,
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "createDockerImage",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const strategyId = await createDockerImage(
      pythonCode,
      setToken_chainA,
      setToken_chainB,
      tokenA_chainA,
      tokenB_chainA,
      tokenA_chainB,
      tokenB_chainB
    );
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createDockerImage",
        status: StepStatusEnum.SUCCESS,
        result: strategyId,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createDockerImage",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}
