"use server";

import { StrategyToCreate } from "@/types/create";
import { createFileWithPythonCode } from "./fileStrategyCreator";
import { pushImage } from "./pushImage";
import { removeImageDirectory } from "./removeImageDirectory";

/**
 * TODO: This function should upload the image to the docker
 *
 * @returns a promise that resolves to a success string from
 * the docker upload image command
 */
export async function uploadImage(strategy: StrategyToCreate): Promise<string> {
  const imageName = `zktoro/${strategy.id}`;
  console.log("uploading", imageName);

  const imageDirectory = await createFileWithPythonCode(strategy);
  await pushImage(strategy, imageName);

  await removeImageDirectory(imageDirectory);
  return imageName;
}
