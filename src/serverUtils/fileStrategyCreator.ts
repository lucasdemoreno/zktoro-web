import { StrategyToCreate } from "@/types/create";
import { execa } from "execa";
import * as path from "path";

export async function createFileWithPythonCode(
  strategy: StrategyToCreate
): Promise<string> {
  try {
    // Creates a directory inside root/images with strategyId if doesnt exists.
    const dirPath = path.join(process.cwd(), `/images/`, strategy.id);
    await execa("mkdir", ["-p", dirPath]);

    const filePath = path.join(dirPath, `${strategy.id}.py`);

    await execa("bash", [
      "-c",
      `echo "${strategy.pythonCode.replace(/"/g, '\\"')}" > "${filePath}"`,
    ]);
    console.log(`File created at: ${filePath}`);

    return dirPath;
  } catch (error) {
    console.error("Error creating file:", error);
    return "";
  }
}
