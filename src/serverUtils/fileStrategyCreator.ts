import { StrategyToCreate } from "@/types/create";
import { execa } from "execa";

export async function createFileWithPythonCode(
  strategy: StrategyToCreate
): Promise<void> {
  // Writing pythonCode into ./qwe123-we123-qwe123.py file.
  // TODO: Check if we need to change permissions for this file.
  await execa("echo", [strategy.pythonCode]).pipeStdout?.(`${strategy.id}.py`);
}
