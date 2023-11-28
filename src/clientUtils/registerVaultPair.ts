import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";

/**
 * TODO: This function should register the vault pair
 *
 * @returns a promise that resolves to a success string from
 * the vault pair registration
 */
export async function registerVaultPair(
  // strings for now
  setTokenChainA: string,
  setTokenChainB: string
): Promise<string> {
  // TODO: Replace this with the actual vault pair creation
  const result = `registerVaultPair result: ${setTokenChainA} ${setTokenChainB}`;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

export async function tryRegisterVaultPair(
  setTokenChainA: string,
  setTokenChainB: string,
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "registerVaultPair",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const setTokenCreated = await registerVaultPair(
      setTokenChainA,
      setTokenChainB
    );
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "registerVaultPair",
        status: StepStatusEnum.SUCCESS,
        result: setTokenCreated,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "registerVaultPair",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}
