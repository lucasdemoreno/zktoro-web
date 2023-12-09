import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { MouseEventHandler, useCallback, useEffect, useMemo } from "react";
import {
  ChainToken,
  ComplexExpression,
  IfElseStatement,
  Statement,
  StatementType,
  SwapStatement,
} from "@/providers/ProgramProvider/Statements";
import {
  TOKEN_LIST,
  USDC_Sepolia,
  USDC_Mumbai,
  WETH_Sepolia,
  WETH_Mumbai,
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
import { useCreateSetTokenChain } from "@/clientUtils/createSetTokenChain";
import { tryCreateDockerImage } from "@/clientUtils/createDockerImage";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";

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

function getTokensFromCondition(ifStatement?: IfElseStatement | null): {
  tokenA_chainA: ChainToken;
  tokenB_chainA: ChainToken;
  tokenA_chainB: ChainToken;
  tokenB_chainB: ChainToken;
} | null {
  const statements = ifStatement?.data?.ifStatements;
  if (!statements) {
    return null;
  }

  const statement = statements.find((s) => s.type === StatementType.SWAP);
  if (!statement) {
    return null;
  }
  const swapStatement = statement as SwapStatement;

  const { chain } = swapStatement?.data!;

  if (chain.name === "Mumbai") {
    return {
      tokenA_chainA: WETH_Mumbai,
      tokenB_chainA: USDC_Mumbai,
      tokenA_chainB: WETH_Sepolia,
      tokenB_chainB: USDC_Sepolia,
    };
  }

  return {
    tokenA_chainA: WETH_Sepolia,
    tokenB_chainA: USDC_Sepolia,
    tokenA_chainB: WETH_Mumbai,
    tokenB_chainB: USDC_Mumbai,
  };
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
  const tokenA_chainA = WETH_Mumbai;
  const tokenB_chainA = USDC_Mumbai;
  const tokenA_chainB = WETH_Sepolia;
  const tokenB_chainB = USDC_Sepolia;
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

  const tokens = getTokensFromCondition(firstIfStatement as IfElseStatement);

  // For now, we only allow 2 tokens in the first condition.
  // We can do more but tricky to find the correct tokens to send.
  if (!tokens) {
    return defaultTokens;
  }

  return tokens;
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

function isLoadingDeploy(publishStatus: PublishStatus): boolean {
  return publishStatus.createDockerImage.status === StepStatusEnum.PENDING;
}

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
    if (
      !publishStatus.createSetTokenChainA.result ||
      !publishStatus.createSetTokenChainB.result
    ) {
      return;
    }

    tryConvertToPython(
      statements,
      publishStatus.createSetTokenChainA.result,
      publishStatus.createSetTokenChainB.result,
      tokenA_chainA.chainId,
      tokenA_chainB.chainId,
      publishDispatch
    );
  }, [
    publishDispatch,
    statements,
    publishStatus.createSetTokenChainA.result,
    publishStatus.createSetTokenChainB.result,
    tokenA_chainA.chainId,
    tokenA_chainB.chainId,
  ]);

  const onDeploy = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (event) => {
      event.preventDefault();
      const pythonCode = publishStatus.convertToPython.result;
      let setTokenChainA = publishStatus.createSetTokenChainA.result;
      let setTokenChainB = publishStatus.createSetTokenChainB.result;

      // // if (!setTokenChainA || !setTokenChainB) {
      // if (!setTokenChainA || !setTokenChainB) {
      //   setTokenChainA = MUMBAI_SMART_CONTRACTS.SetTokenExample1Address; // Examples for now POLI
      //   setTokenChainB = SEPOLIA_SMART_CONTRACTS.SetTokenExample1Address; // Examples for now AVAX
      // }
      if (!pythonCode || !setTokenChainA || !setTokenChainB) {
        return;
      }
      // This is create Docker image + save in database.
      tryCreateDockerImage(
        pythonCode,
        setTokenChainA,
        setTokenChainB,
        tokenA_chainA,
        tokenB_chainA,
        tokenA_chainB,
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
                {`Create Vault on ${getChainById(tokenA_chainA.chainId)?.name}`}
              </Button>
              {getIconFromStatus(publishStatus.createSetTokenChainA.status)}
            </Flex>
            <Flex align="center" gap="4">
              <Button onClick={onCreateSetTokenChainB}>
                {`Create Vault on ${getChainById(tokenA_chainB.chainId)?.name}`}
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
          <Flex gap="2">
            <Button
              disabled={getDisabledStatusForStep(
                "createDockerImage",
                publishStatus
              )}
              onClick={onDeploy}
            >
              Deploy
            </Button>
            {isLoadingDeploy(publishStatus) && <LoadingSpinner />}
          </Flex>

          <Button color="crimson">Cancel</Button>
        </Flex>
      </Dialog.Close>
    </Dialog.Content>
  );
};
