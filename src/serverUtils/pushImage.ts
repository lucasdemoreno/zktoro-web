import { StrategyToCreate } from "@/types/create";
import { execa } from "execa";

export async function pushImage(
  strategy: StrategyToCreate,
  imageName: string = "zktoro/default_name"
): Promise<void> {
  const dockerfilePath = "images/Dockerfile";
  const dockerHubApiUrl = "https://hub.docker.com/v2/";

  // Docker Hub credentials
  const username = process.env.DOCKER_HUB_USERNAME;
  const password = process.env.DOCKER_HUB_PASSWORD;

  // Directory with strategies to dockerize
  const contextPath = `images/.`;

  await execa("docker", [
    "build",
    "-f",
    dockerfilePath,
    "--build-arg",
    `SCRIPT_NAME=${strategy.id}`,
    "-t",
    imageName,
    contextPath,
  ]);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Image built successfully: ${imageName}`);

  // try {
  //   // Authenticate with Docker Hub
  //   const responseLogin = await fetch(`${dockerHubApiUrl}users/login/`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ username, password }),
  //   });

  //   const data = await responseLogin.json();
  //   console.log("Authentication successful with Docker Hub");

  //   // Push the image to Docker Hub using execa
  //   await execa("docker", ["push", imageName]);
  //   console.log(`Image push successful to Docker Hub: ${imageName}`);
  // } catch (e) {
  //   const error = e as Error;
  //   console.error(
  //     `Error in authenticating with Docker Hub or pushing the image: ${error.message}`
  //   );
  // }
}
