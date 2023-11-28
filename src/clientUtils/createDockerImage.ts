import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";

/**
 * TODO: This function should create the docker image
 *
 * @returns a promise that resolves to a success string from
 * the docker image creation
 */
export async function createDockerImage(
  pythonCode: string,
  circomCode: string
): Promise<string> {
  // TODO: Replace this with the actual call to create the docker image
  const result = `${pythonCode}, ${circomCode}`;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

export async function tryCreateDockerImage(
  pythonCode: string,
  circomCode: string,
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
    const setTokenCreated = await createDockerImage(pythonCode, circomCode);
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "createDockerImage",
        status: StepStatusEnum.SUCCESS,
        result: setTokenCreated,
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
