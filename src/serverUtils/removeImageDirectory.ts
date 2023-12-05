import { execa } from "execa";

export async function removeImageDirectory(
  imageDiretory: string
): Promise<void> {
  try {
    await execa("rm", ["-rf", imageDiretory]);
  } catch (error) {
    console.error("Error removing directory:", error);
  }
}
