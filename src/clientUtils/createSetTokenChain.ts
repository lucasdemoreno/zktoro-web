import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";

/**
 * TODO: This function should convert create the set token on chain A
 *
 * @returns a promise that resolves to a success string from
 * the set token creation
 */
export async function createSetTokenChain(
  tokenA: ChainToken,
  tokenB: ChainToken
): Promise<string> {
  // TODO: Replace this with the actual set token creation
  const result = `${tokenA.name}, ${tokenB.name} set token created on chain A`;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

export async function tryCreateSetTokenChainA(
  tokenA: ChainToken,
  tokenB: ChainToken,
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "createSetTokenChainA",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const setTokenCreated = await createSetTokenChain(tokenA, tokenB);
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createSetTokenChainA",
        status: StepStatusEnum.SUCCESS,
        result: setTokenCreated,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createSetTokenChainA",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}

export async function tryCreateSetTokenChainB(
  tokenA: ChainToken,
  tokenB: ChainToken,
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "createSetTokenChainB",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const setTokenCreated = await createSetTokenChain(tokenA, tokenB);
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createSetTokenChainB",
        status: StepStatusEnum.SUCCESS,
        result: setTokenCreated,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createSetTokenChainB",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}
