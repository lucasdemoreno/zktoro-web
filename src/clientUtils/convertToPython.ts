import { parse } from "@/parser/parser";
import { Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";
import { createPythonFileContent } from "./createPythonFileContent";

/**
 * TODO: This function should convert the statements to Python
 *
 * @returns a promise that resolves to a success string from
 * the Python conversion
 */
export function convertToPython(
  statements: Statement[],
  setToken_chainA: string,
  setToken_chainB: string
): string {
  // TODO: Replace this with the actual convertion to Python
  const result = parse(statements);
  const fileContent = createPythonFileContent(
    result,
    setToken_chainA,
    setToken_chainB
  );
  return fileContent;
}

export async function tryConvertToPython(
  statements: Statement[],
  setToken_chainA: string = "0xEC553087B96e5cE90c19187B1F85A7EF75FA30bB", // Examples for now POLI
  setToken_chainB: string = "0xA443A48dfA97FC86ddEc44A5edD485F9F4211548", // Examples for now AVAX
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
    const pythonConvertion = convertToPython(
      statements,
      setToken_chainA,
      setToken_chainB
    );
    console.log(pythonConvertion);
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
