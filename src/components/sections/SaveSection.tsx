import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { MouseEventHandler, useCallback, useEffect, useMemo } from "react";
import {
  ChainToken,
  ComplexExpression,
  Condition,
  IfElseStatement,
  Statement,
  StatementType,
} from "@/providers/ProgramProvider/Statements";
import {
  TOKEN_LIST,
  USDC_Avalanche,
  USDC_Polygon,
  WETH_Avalanche,
  WETH_Polygon,
  getChainById,
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
import { tryConvertToPython } from "@/clientUtils/convertToPython";
import { tryConvertToCircom } from "@/clientUtils/convertToCircom";
import { useCreateSetTokenChain } from "@/clientUtils/createSetTokenChain";
import { tryRegisterVaultPair } from "@/clientUtils/registerVaultPair";
import { tryCreateDockerImage } from "@/clientUtils/createDockerImage";
import { useWaitForTransaction } from "wagmi";
import { useRouter } from "next/navigation";

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

function getTokensFromExpression(expression: ComplexExpression): ChainToken[] {
  if (!expression || typeof expression === "string") {
    return [];
  } else if ("operator" in expression) {
    const { left, right } = expression;
    const leftTokens = getTokensFromExpression(left);
    const rightTokens = getTokensFromExpression(right);
    return [...leftTokens, ...rightTokens];
  } else if ("symbol" in expression) {
    return [expression];
  }
  return [];
}

function getTokensFromCondition(condition?: Condition | null): ChainToken[] {
  if (!condition) {
    return [];
  }

  const { left, right } = condition;
  const leftTokens = getTokensFromExpression(left);
  const rightTokens = getTokensFromExpression(right);
  return [...leftTokens, ...rightTokens];
}

function getOtherTokenFromChain(token: ChainToken): ChainToken {
  const otherToken = TOKEN_LIST.find(
    (t) => t.chainId === token.chainId && t.address !== token.address
  );
  // We know it will exists.
  return otherToken!;
}

/**
 * Gets the tokens and chains from the program.
 * TODO: This is hardcoded for now.
 * @param statements
 * @returns
 */
function getTokensAndChains(statements: Statement[]): {
  tokenA_chainA: ChainToken;
  tokenB_chainA: ChainToken;
  tokenA_chainB: ChainToken;
  tokenB_chainB: ChainToken;
} {
  // Token A is USDC
  // Token B is WETH
  // Chain A is USDC_Avalanche
  // Chain B is Polygon
  const tokenA_chainA = USDC_Polygon;
  const tokenB_chainA = WETH_Polygon;
  const tokenA_chainB = USDC_Avalanche;
  const tokenB_chainB = WETH_Avalanche;
  const defaultTokens = {
    tokenA_chainA,
    tokenB_chainA,
    tokenA_chainB,
    tokenB_chainB,
  };

  if (statements.length === 0) {
    return defaultTokens;
  }

  const firstIfStatement = statements.find(
    (statement) => statement.type === StatementType.IF_ELSE
  );
  if (!firstIfStatement || firstIfStatement.id !== statements[0].id) {
    return defaultTokens;
  }

  const tokens = getTokensFromCondition(
    (firstIfStatement as IfElseStatement).data?.condition
  );

  // For now, we only allow 2 tokens in the first condition.
  // We can do more but tricky to find the correct tokens to send.
  if (tokens.length === 0 || tokens.length !== 2) {
    return defaultTokens;
  }

  return {
    tokenA_chainA: tokens[0],
    tokenB_chainA: getOtherTokenFromChain(tokens[0]),
    tokenA_chainB: tokens[1],
    tokenB_chainB: getOtherTokenFromChain(tokens[1]),
  };
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
    case "convertToPython":
      return disabledStatuses.has(publishStatus[step].status);
    case "createDockerImage":
      if (publishStatus.convertToPython.status !== StepStatusEnum.SUCCESS) {
        return true;
      }
      return disabledStatuses.has(publishStatus[step].status);
  }
  return true;
}

const CreateStrategyModal = () => {
  const { statements } = useProgram();
  const router = useRouter();
  const { publishStatus, publishDispatch } = useStrategy();
  const { tokenA_chainA, tokenA_chainB, tokenB_chainA, tokenB_chainB } =
    useMemo(() => getTokensAndChains(statements), [statements]);
  const tokens = [tokenA_chainA, tokenB_chainA, tokenA_chainB, tokenB_chainB];
  const isCreationFinished = useMemo(() => {
    return publishStatus.createDockerImage.status === StepStatusEnum.SUCCESS;
  }, [publishStatus.createDockerImage.status]);

  const { onCreateSetTokenChain: onCreateSetTokenChainA } =
    useCreateSetTokenChain(
      tokenA_chainA,
      tokenB_chainA,
      "createSetTokenChainA",
      publishDispatch
    );

  const { onCreateSetTokenChain: onCreateSetTokenChainB } =
    useCreateSetTokenChain(
      tokenA_chainB,
      tokenB_chainB,
      "createSetTokenChainB",
      publishDispatch
    );

  const onConvertToPython = useCallback(() => {
    tryConvertToPython(
      statements,
      publishStatus.createSetTokenChainA.result,
      publishStatus.createSetTokenChainB.result,
      publishDispatch
    );
  }, [
    publishDispatch,
    statements,
    publishStatus.createSetTokenChainA.result,
    publishStatus.createSetTokenChainB.result,
  ]);

  const onDeploy = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (event) => {
      event.preventDefault();
      const pythonCode = publishStatus.convertToPython.result;
      let setTokenChainA = publishStatus.createSetTokenChainA.result;
      let setTokenChainB = publishStatus.createSetTokenChainB.result;

      // if (!setTokenChainA || !setTokenChainB) {
      if (!setTokenChainA || !setTokenChainB) {
        setTokenChainA = "0xE91d6553550dbC6c57F0FAaee21345aFbB597C62"; // Examples for now POLI
        setTokenChainB = "0xd2fcb441bda55a3f4c7dc10322a7c6193111933a"; // Examples for now AVAX
      }
      if (!pythonCode) {
        return;
      }
      // This is create Docker image + save in database.
      tryCreateDockerImage(
        pythonCode,
        setTokenChainA,
        setTokenChainB,
        tokenA_chainA,
        tokenA_chainB,
        tokenB_chainA,
        tokenB_chainB,
        publishDispatch
      );
    },
    [
      publishDispatch,
      publishStatus.convertToPython,
      publishStatus.createSetTokenChainA,
      publishStatus.createSetTokenChainB,
      tokenA_chainA,
      tokenA_chainB,
      tokenB_chainA,
      tokenB_chainB,
    ]
  );

  useEffect(() => {
    console.log(publishStatus);
    if (publishStatus.createDockerImage.status === StepStatusEnum.SUCCESS) {
      // If we created the docker, that means we are done.
      const strategyId = publishStatus.createDockerImage.result;
      if (strategyId) {
        console.log(strategyId);
        router.push(`/strategy/${strategyId}`);
      }
    }
  }, [publishStatus, router]);

  return (
    <Dialog.Content>
      <Dialog.Title>Create Strategy</Dialog.Title>
      <Dialog.Description>
        <Flex py="4">
          <Text>Tokens in the Strategy:</Text>
          <Flex>{tokens.map((token) => token.name).join(", ")}</Flex>
        </Flex>
        <Flex py="4" direction="column">
          <Flex direction="column" gap="4">
            <Flex align="center" gap="4">
              <Button onClick={onCreateSetTokenChainA}>
                {`Create SetToken on ${
                  getChainById(tokenA_chainA.chainId)?.name
                }`}
              </Button>
              {getIconFromStatus(publishStatus.createSetTokenChainA.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button onClick={onCreateSetTokenChainB}>
                {`Create SetToken on ${
                  getChainById(tokenA_chainB.chainId)?.name
                }`}
              </Button>
              {getIconFromStatus(publishStatus.createSetTokenChainB.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button onClick={onConvertToPython}>Convert to Python</Button>
              {getIconFromStatus(publishStatus.convertToPython.status)}
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Description>
      <Dialog.Close>
        <Flex justify="between" mt="4">
          <Button
            disabled={getDisabledStatusForStep(
              "createDockerImage",
              publishStatus
            )}
            onClick={onDeploy}
          >
            Deploy
          </Button>
          <Button color="crimson">Cancel</Button>
        </Flex>
      </Dialog.Close>
    </Dialog.Content>
  );
};
