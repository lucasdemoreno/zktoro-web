import { parse } from "@/parser/parser";
import { Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";

/**
 * TODO: This function should convert the statements to Python
 *
 * @returns a promise that resolves to a success string from
 * the Python conversion
 */
export async function convertToPython(
  statements: Statement[]
): Promise<string> {
  // TODO: Replace this with the actual convertion to Python
  const result = parse(statements);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

export async function tryConvertToPython(
  statements: Statement[],
  publishDispatch: Dispatch<PublishAction>
): Promise<void> {
  publishDispatch({
    type: "UPDATE",
    payload: {
      step: "convertToPython",
      status: StepStatusEnum.PENDING,
    },
  });
  try {
    const pythonConvertion = await convertToPython(statements);
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "convertToPython",
        status: StepStatusEnum.SUCCESS,
        result: pythonConvertion,
      },
    });
  } catch (e) {
    publishDispatch({
      type: "UPDATE",
      payload: {
        step: "convertToPython",
        status: StepStatusEnum.FAILURE,
        result: e as any,
      },
    });
  }
}
