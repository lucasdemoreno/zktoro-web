import { parse } from "@/parser/parser";
import { Statement } from "@/providers/ProgramProvider/Statements";
import {
  PublishAction,
  StepStatusEnum,
} from "@/providers/StrategyProvider/StrategyProvider";
import { Dispatch } from "react";
import { createPythonFileContent } from "./createPythonFileContent";
import {
  MUMBAI_SMART_CONTRACTS,
  SEPOLIA_SMART_CONTRACTS,
} from "@/transactions/contracts";

/**
 * TODO: This function should convert the statements to Python
 *
 * @returns a promise that resolves to a success string from
 * the Python conversion
 */
export function convertToPython(
  statements: Statement[],
  setToken_chainA: string,

  setToken_chainB: string,
  chainAId: number,
  chainBId: number
): string {
  const result = parse(statements);
  const fileContent = createPythonFileContent(
    result,
    setToken_chainA,
    setToken_chainB,
    chainAId,
    chainBId
  );
  console.log(fileContent);
  return fileContent;
}

export async function tryConvertToPython(
  statements: Statement[],
  setToken_chainA: string, // Examples for now POLI
  setToken_chainB: string, // Examples for now AVAX
  chainAId: number,
  chainBId: number,
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
      setToken_chainB,
      chainAId,
      chainBId
    );
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
