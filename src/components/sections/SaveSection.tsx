import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { useCallback, useMemo } from "react";
import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import {
  USDC_Optimism,
  USDC_Polygon,
  WETH_Optimism,
  WETH_Polygon,
} from "@/providers/ProgramProvider/Tokens";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  CircleIcon,
} from "@radix-ui/react-icons";
import {
  PublishStatus,
  StepStatusEnum,
  useStrategy,
} from "@/providers/StrategyProvider/StrategyProvider";
import {
  convertToPython,
  tryConvertToPython,
} from "@/clientUtils/convertToPython";
import { tryConvertToCircom } from "@/clientUtils/convertToCircom";
import {
  tryCreateSetTokenChainA,
  tryCreateSetTokenChainB,
} from "@/clientUtils/createSetTokenChain";
import { on } from "events";
import { tryRegisterVaultPair } from "@/clientUtils/registerVaultPair";
import { tryCreateDockerImage } from "@/clientUtils/createDockerImage";

export const SaveSection = () => {
  return (
    <Dialog.Root>
      <Flex className={styles.saveSection} p="4" direction="column" gap="4">
        <Flex gap="3">
          <Dialog.Trigger className={styles.trigger}>
            <Button>Create Strategy</Button>
          </Dialog.Trigger>
        </Flex>
        <CreateStrategyModal />
      </Flex>
    </Dialog.Root>
  );
};

/**
 * Gets the tokens and chains from the program.
 * TODO: This is hardcoded for now.
 * @param statements
 * @returns
 */
function getTokensAndChains(_statements: Statement[]): {
  tokenA_chainA: ChainToken;
  tokenB_chainA: ChainToken;
  tokenA_chainB: ChainToken;
  tokenB_chainB: ChainToken;
} {
  // Token A is USDC
  // Token B is WETH
  // Chain A is Optimism
  // Chain B is Polygon
  const tokenA_chainA = USDC_Optimism;
  const tokenB_chainA = WETH_Optimism;
  const tokenA_chainB = USDC_Polygon;
  const tokenB_chainB = WETH_Polygon;

  return { tokenA_chainA, tokenB_chainA, tokenA_chainB, tokenB_chainB };
}

function getIconFromStatus(status: StepStatusEnum) {
  switch (status) {
    case StepStatusEnum.SUCCESS:
      return <CheckCircledIcon height="20" width="20" />;
    case StepStatusEnum.FAILURE:
      return <CrossCircledIcon height="20" width="20" />;
    case StepStatusEnum.PENDING:
      return <Text>...</Text>;
    case StepStatusEnum.NOT_STARTED:
      return <CircleIcon height="20" width="20" />;
  }
}

const disabledStatuses = new Set([
  StepStatusEnum.PENDING,
  StepStatusEnum.SUCCESS,
]);

function getDisabledStatusForStep(
  step: keyof PublishStatus,
  publishStatus: PublishStatus
): boolean {
  switch (step) {
    case "convertToPython":
      return disabledStatuses.has(publishStatus[step].status);

    case "convertToCircom":
      if (publishStatus.convertToPython.status !== StepStatusEnum.SUCCESS) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);
    case "createSetTokenChainA":
      if (publishStatus.convertToCircom.status !== StepStatusEnum.SUCCESS) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);

    case "createSetTokenChainB":
      if (
        publishStatus.createSetTokenChainA.status !== StepStatusEnum.SUCCESS
      ) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);
    case "registerVaultPair":
      if (
        publishStatus.createSetTokenChainB.status !== StepStatusEnum.SUCCESS
      ) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);
    case "createDockerImage":
      if (publishStatus.registerVaultPair.status !== StepStatusEnum.SUCCESS) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);
  }
}

const CreateStrategyModal = () => {
  const { statements } = useProgram();
  const { publishStatus, publishDispatch } = useStrategy();

  const { tokenA_chainA, tokenA_chainB, tokenB_chainA, tokenB_chainB } =
    useMemo(() => getTokensAndChains(statements), [statements]);

  const tokens = [tokenA_chainA, tokenB_chainA, tokenA_chainB, tokenB_chainB];
  const isCreationFinished = useMemo(() => {
    return publishStatus.createDockerImage.status === StepStatusEnum.SUCCESS;
  }, [publishStatus.createDockerImage.status]);

  const onConvertToPython = useCallback(() => {
    tryConvertToPython(statements, publishDispatch);
  }, [publishDispatch, statements]);

  const onConvertToCircom = useCallback(() => {
    tryConvertToCircom(statements, publishDispatch);
  }, [publishDispatch, statements]);

  const onCreateSetTokenChainA = useCallback(() => {
    tryCreateSetTokenChainA(tokenA_chainA, tokenB_chainA, publishDispatch);
  }, [publishDispatch, tokenA_chainA, tokenB_chainA]);

  const onCreateSetTokenChainB = useCallback(() => {
    tryCreateSetTokenChainB(tokenA_chainB, tokenB_chainB, publishDispatch);
  }, [publishDispatch, tokenA_chainB, tokenB_chainB]);

  const onRegisterVaultPair = useCallback(() => {
    const { result: resultSetTokenChainA } = publishStatus.createSetTokenChainA;
    const { result: resultSetTokenChainB } = publishStatus.createSetTokenChainB;
    if (!resultSetTokenChainA || !resultSetTokenChainB) {
      return;
    }
    tryRegisterVaultPair(
      resultSetTokenChainA,
      resultSetTokenChainB,
      publishDispatch
    );
  }, [
    publishDispatch,
    publishStatus.createSetTokenChainA,
    publishStatus.createSetTokenChainB,
  ]);

  const onCreateDockerImage = useCallback(() => {
    const { result: pythonCode } = publishStatus.convertToPython;
    const { result: circomCode } = publishStatus.convertToCircom;
    if (!pythonCode || !circomCode) {
      return;
    }
    tryCreateDockerImage(pythonCode, circomCode, publishDispatch);
  }, [
    publishDispatch,
    publishStatus.convertToPython,
    publishStatus.convertToCircom,
  ]);

  return (
    <Dialog.Content>
      <Dialog.Title>Create Strategy</Dialog.Title>
      <Dialog.Description>
        <Flex p="4">
          Tokens in the Strategy:
          <Flex>{tokens.map((token) => token.name).join(", ")}</Flex>
        </Flex>
        <Flex>
          <Flex p="4" direction="column" gap="4">
            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "convertToPython",
                  publishStatus
                )}
                onClick={onConvertToPython}
              >
                Convert to Python
              </Button>
              {getIconFromStatus(publishStatus.convertToPython.status)}
            </Flex>

            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "convertToCircom",
                  publishStatus
                )}
                onClick={onConvertToCircom}
              >
                Convert to Circom
              </Button>
              {getIconFromStatus(publishStatus.convertToCircom.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "createSetTokenChainA",
                  publishStatus
                )}
                onClick={onCreateSetTokenChainA}
              >
                Create SetToken on ChainA
              </Button>
              {getIconFromStatus(publishStatus.createSetTokenChainA.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "createSetTokenChainB",
                  publishStatus
                )}
                onClick={onCreateSetTokenChainB}
              >
                Create SetToken on ChainB
              </Button>
              {getIconFromStatus(publishStatus.createSetTokenChainB.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "registerVaultPair",
                  publishStatus
                )}
                onClick={onRegisterVaultPair}
              >
                Register Vault Pair
              </Button>
              {getIconFromStatus(publishStatus.registerVaultPair.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button
                disabled={getDisabledStatusForStep(
                  "createDockerImage",
                  publishStatus
                )}
                onClick={onCreateDockerImage}
              >
                Create Docker Image
              </Button>
              {getIconFromStatus(publishStatus.createDockerImage.status)}
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Description>
      <Dialog.Close>
        {isCreationFinished ? (
          <Flex justify="start">
            <Button color="green">Continue</Button>
          </Flex>
        ) : (
          <Flex justify="end">
            <Button color="crimson">Cancel</Button>
          </Flex>
        )}
      </Dialog.Close>
    </Dialog.Content>
  );
};
