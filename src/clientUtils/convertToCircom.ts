import { Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";

/**
 * TODO: This function should convert the statements to Circom
 *
 * @returns a promise that resolves to a success string from
 * the Circom conversion
 */
export async function convertToCircom(
  statements: Statement[]
): Promise<string> {
  // TODO: Replace this with the actual convertion to Circom
  const result = JSON.stringify(statements);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

export async function tryConvertToCircom(
  statements: Statement[],
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "convertToCircom",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const CircomConvertion = await convertToCircom(statements);
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "convertToCircom",
        status: StepStatusEnum.SUCCESS,
        result: CircomConvertion,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "convertToCircom",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}
