import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
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
    name: "New Strategy Title",
    description: "Strategy Description",
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
