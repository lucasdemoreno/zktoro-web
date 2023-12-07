"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import {
  Badge,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { CaretDownIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  ChainToken,
  ComparisonOperator,
  ComplexExpression,
  Condition,
  IfElseStatement,
  MathExpression,
  MathOperator,
  SendStatement,
  Statement,
  SwapStatement,
} from "@/providers/ProgramProvider/Statements";
import {
  CHAIN_LIST,
  Chain,
  TOKEN_LIST,
  USDC_Polygon,
  getChainByName,
  getTokenByName,
} from "@/providers/ProgramProvider/Tokens";
import { on } from "events";

export const Droppable = ({
  children,
  id,
  nestedLevel = 0,
}: PropsWithChildren<{ id: string; nestedLevel?: number }>) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  const marginLeft = nestedLevel * 20;
  const style = {
    marginLeft: marginLeft,
  };

  return (
    <Box m="2">
      <Box
        ref={setNodeRef}
        style={style}
        className={styles.droppable}
        display="inline-block"
        py="1"
        px="4"
      >
        {children}
      </Box>
    </Box>
  );
};

type DraggableStatementProps = {
  statement: Statement;
  canRemove?: boolean;
  nestedLevel?: number;
};

function getTranslateValue(
  transform: { x: number; y: number } | null
): string | undefined {
  return transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;
}

export const DraggableStatement = ({
  statement,
  canRemove = false,
  nestedLevel = 0,
}: PropsWithChildren<DraggableStatementProps>) => {
  const { onStatementRemove } = useProgram();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: statement.id,
    data: statement,
  });

  const handleRemove = useCallback(() => {
    onStatementRemove(statement);
  }, [onStatementRemove, statement]);
  const transformValue = getTranslateValue(transform);
  const marginLeft = nestedLevel * 20;
  const style = {
    transform: transformValue,
    marginLeft: marginLeft,
  };

  return (
    <Box m="2">
      <Badge
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.draggable}
        variant="solid"
        size="2"
      >
        <StatementBlock statement={statement} canUpdate={canRemove} />
        {canRemove && (
          <Button
            onClick={handleRemove}
            className={styles.removeButton}
            variant="solid"
            size="1"
          >
            <TrashIcon />
          </Button>
        )}
      </Badge>
    </Box>
  );
};

const StatementBlock = ({
  statement,
  canUpdate,
}: {
  statement: Statement;
  canUpdate: boolean;
}) => {
  if (!canUpdate) {
    return <Text style={{ paddingInline: "20px" }}>{statement.label}</Text>;
  }
  if (statement.type === "SEND") {
    return <SendBlock statement={statement} />;
  }

  if (statement.type === "SWAP") {
    return <SwapBlock statement={statement} />;
  }

  if (statement.type === "IF_ELSE") {
    return <IFBlock statement={statement} />;
  }

  if (statement.type === "ELSE") {
    return <Text>{statement.label}</Text>;
  }
};

const SwapBlock = ({ statement }: { statement: SwapStatement }) => {
  const { onStatementUpdate } = useProgram();

  const onTokenChange = useCallback(
    (direction: "from" | "to") => (newToken: ChainToken) => {
      if (!statement.data) {
        return;
      }

      const newStatement = {
        ...statement,
        data: {
          ...statement.data,
          [direction]: newToken,
        },
      };
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  const onChainChange = useCallback(
    (newChain: Chain) => {
      if (!statement.data) {
        return;
      }

      const newStatement = {
        ...statement,
        data: {
          ...statement.data,
          chain: newChain,
        },
      };
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  const onAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!statement.data) {
        return;
      }
      const newStatement: SwapStatement = {
        ...statement,
        data: {
          ...statement.data,
          amount: event.target.value,
        },
      };
      onStatementUpdate(newStatement);
      // event.preventDefault();
      // event.stopPropagation();
    },
    [onStatementUpdate, statement]
  );

  if (!statement.data) {
    return null;
  }

  return (
    <>
      <Text>{statement.label}</Text>
      <TextField.Input
        size="1"
        value={statement.data.amount}
        onChange={onAmountChange}
        style={{ maxWidth: "60px", minWidth: "40px" }}
      />

      <SwapTokenOption
        tokenSelected={statement.data.from}
        onTokenChange={onTokenChange("from")}
      />

      <Text>to</Text>
      <SwapTokenOption
        tokenSelected={statement.data.to}
        onTokenChange={onTokenChange("to")}
      />
      <Text>on</Text>

      <SwapChainOption
        chainSelected={statement.data.chain}
        onChainChange={onChainChange}
      />
    </>
  );
};

const SendBlock = ({ statement }: { statement: SendStatement }) => {
  const { onStatementUpdate } = useProgram();

  const onAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!statement.data) {
        return;
      }
      const newStatement: SendStatement = {
        ...statement,
        data: {
          ...statement.data,
          amount: event.target.value,
        },
      };
      onStatementUpdate(newStatement);
      // event.preventDefault();
      // event.stopPropagation();
    },
    [onStatementUpdate, statement]
  );

  const onChainChange = useCallback(
    (direction: "from" | "to") => (newChain: Chain) => {
      if (!statement.data) {
        return;
      }

      const newStatement = {
        ...statement,
        data: {
          ...statement.data,
          chain: newChain,
        },
      };
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  const onTokenChange = useCallback(
    (newToken: ChainToken) => {
      if (!statement.data) {
        return;
      }

      const newStatement: SendStatement = {
        ...statement,
        data: {
          ...statement.data,
          token: newToken,
        },
      };
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  if (!statement.data) {
    return null;
  }

  return (
    <>
      <Text>{statement.label}</Text>
      <TextField.Input
        size="1"
        value={statement.data.amount}
        onChange={onAmountChange}
        style={{ maxWidth: "60px", minWidth: "40px" }}
      />
      <SwapTokenOption
        tokenSelected={statement.data.token}
        onTokenChange={onTokenChange}
      />
      <Text>from</Text>
      <SwapChainOption
        chainSelected={statement.data.from}
        onChainChange={onChainChange("from")}
      />
      <Text>to</Text>
      {/* This would be a more complex expression */}
      <SwapChainOption
        chainSelected={statement.data.to}
        onChainChange={onChainChange("to")}
      />
    </>
  );
};

function updateCondition(
  statement: IfElseStatement,
  newCondition: Condition
): IfElseStatement {
  return {
    ...statement,
    data: {
      ...statement.data!,
      condition: {
        ...newCondition,
      },
    },
  };
}

const IFBlock = ({ statement }: { statement: IfElseStatement }) => {
  const { onStatementUpdate } = useProgram();
  const handleOperatorChange = useCallback(
    (newOperator: ComparisonOperator) => {
      if (!statement.data?.condition) {
        return;
      }

      const newCondition: Condition = {
        ...statement.data.condition,
        operator: newOperator,
      };

      const newStatement = updateCondition(statement, newCondition);
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  const handleExpressionChange = useCallback(
    (side: "left" | "right") => (newExpression: ComplexExpression) => {
      if (!statement.data?.condition) {
        return;
      }

      const newCondition = {
        ...statement.data.condition,
        [side]: newExpression,
      };

      const newStatement = updateCondition(statement, newCondition);
      onStatementUpdate(newStatement);
    },
    [onStatementUpdate, statement]
  );

  if (!statement.data?.condition) {
    return null;
  }

  const condition = statement.data.condition;

  return (
    <>
      <Text>{statement.label}</Text>
      {/* This would be a more complex expression */}
      <IfExpression
        expression={condition.left}
        onExpressionChange={handleExpressionChange("left")}
      />

      <ComparatorComponent
        operator={condition.operator}
        onOperatorChange={handleOperatorChange}
      />

      {/* This would be a more complex expression */}
      <IfExpression
        expression={condition.right}
        onExpressionChange={handleExpressionChange("right")}
      />
    </>
  );
};

const ComparatorComponent = ({
  operator,
  onOperatorChange,
}: {
  operator: ComparisonOperator;
  onOperatorChange: (operator: ComparisonOperator) => void;
}) => {
  const handleOperatorChange = useCallback(
    (value: string) => {
      onOperatorChange(value as ComparisonOperator);
    },
    [onOperatorChange]
  );
  return (
    <Select.Root
      defaultValue={operator}
      onValueChange={handleOperatorChange}
      size="1"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value={ComparisonOperator.EQUAL}>==</Select.Item>
        <Select.Item value={ComparisonOperator.GREATER_THAN}>{">"}</Select.Item>
        <Select.Item value={ComparisonOperator.LESS_THAN}>{"<"}</Select.Item>
      </Select.Content>
    </Select.Root>
  );
};

function isMathOperation(
  expression: ComplexExpression
): expression is MathExpression {
  if (!expression || typeof expression === "string" || "symbol" in expression) {
    return false;
  }
  return "operator" in expression;
}

const IfExpression = ({
  expression,
  onExpressionChange,
}: {
  expression: ComplexExpression;
  onExpressionChange: (newExpression: ComplexExpression) => void;
}) => {
  const handleDropdownChange = useCallback(
    (optionType: string) => () => {
      if (optionType === "complex expression") {
        onExpressionChange({
          operator: MathOperator.DIVIDE,
          left: "2",
          right: "1",
        });
      }
      if (optionType === "string") {
        onExpressionChange("1");
      }
      if (optionType === "token price") {
        onExpressionChange(USDC_Polygon);
      }
    },
    [onExpressionChange]
  );

  const handleNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onExpressionChange(event.target.value);
      event.preventDefault();
      event.stopPropagation();
    },
    [onExpressionChange]
  );

  const handleRecursiveExpressionChange = useCallback(
    (side: "left" | "right") => (newExpression: ComplexExpression) => {
      if (!isMathOperation(expression)) {
        throw new Error("Expression should not be null");
      }

      const expressionChanged: ComplexExpression = {
        ...expression,
        [side]: newExpression,
      };

      onExpressionChange(expressionChanged);
    },
    [expression, onExpressionChange]
  );

  const handleMathOperatorChange = useCallback(
    (newOperator: MathOperator) => {
      if (!isMathOperation(expression)) {
        throw new Error("Expression should be math operation");
      }

      const newExpression: MathExpression = {
        ...expression,
        operator: newOperator,
      };

      onExpressionChange(newExpression);
    },
    [expression, onExpressionChange]
  );

  const expressionValue = useMemo(() => {
    if (expression === null) {
      return (
        <Text size="1" placeholder="1">
          Choose
        </Text>
      );
    }

    if (typeof expression === "string") {
      return (
        <TextField.Input
          size="1"
          onChange={handleNumberChange}
          value={expression}
          style={{ maxWidth: "60px", minWidth: "40px" }}
        />
      );
    }

    if ("symbol" in expression) {
      return (
        <TokenExpression
          expression={expression}
          onExpressionChange={onExpressionChange}
        />
      );
    }

    if ("operator" in expression) {
      return (
        <Flex gap="1">
          <IfExpression
            expression={expression.left}
            onExpressionChange={handleRecursiveExpressionChange("left")}
          />
          <MathOperatorComponent
            operator={expression.operator}
            onOperatorChange={handleMathOperatorChange}
          />
          <IfExpression
            expression={expression.right}
            onExpressionChange={handleRecursiveExpressionChange("right")}
          />
        </Flex>
      );
    }

    return null;
  }, [
    expression,
    handleNumberChange,
    handleRecursiveExpressionChange,
    handleMathOperatorChange,
    onExpressionChange,
  ]);

  return (
    <>
      {expressionValue}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Box>
            <Button variant="surface" size="1">
              <CaretDownIcon />
            </Button>
          </Box>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={handleDropdownChange("complex expression")}
          >
            Deviation
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDropdownChange("number")}>
            Number
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDropdownChange("token price")}>
            tokenPrice
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

const MathOperatorComponent = ({
  operator,
  onOperatorChange,
}: {
  operator: MathOperator;
  onOperatorChange: (operator: MathOperator) => void;
}) => {
  const handleOperatorChange = useCallback(
    (value: string) => {
      onOperatorChange(value as MathOperator);
    },
    [onOperatorChange]
  );
  return (
    <Flex align="center">
      <Select.Root
        defaultValue={operator}
        onValueChange={handleOperatorChange}
        size="1"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value={MathOperator.ADD}>+</Select.Item>
          <Select.Item value={MathOperator.SUBTRACT}>-</Select.Item>
          <Select.Item value={MathOperator.MULTIPLY}>x</Select.Item>
          <Select.Item value={MathOperator.DIVIDE}>/</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

const TokenExpression = ({
  expression,
  onExpressionChange,
}: {
  expression: ChainToken;
  onExpressionChange: (newExpression: ComplexExpression) => void;
}) => {
  const handleTokenChange = useCallback(
    (value: string) => {
      const tokenSelected = getTokenByName(value);
      if (!tokenSelected) {
        throw new Error("Token not found");
      }
      onExpressionChange(tokenSelected);
    },
    [onExpressionChange]
  );
  return (
    <Select.Root
      defaultValue={expression.name}
      onValueChange={handleTokenChange}
      size="1"
    >
      <Select.Trigger />
      <Select.Content>
        {TOKEN_LIST.map((token) => (
          <Select.Item key={token.name} value={token.name}>
            {token.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

const SwapTokenOption = ({
  tokenSelected,
  onTokenChange,
}: {
  tokenSelected: ChainToken;
  onTokenChange: (newToken: ChainToken) => void;
}) => {
  const handleTokenChange = useCallback(
    (value: string) => {
      const tokenSelected = getTokenByName(value);
      if (!tokenSelected) {
        throw new Error("Token not found");
      }
      onTokenChange(tokenSelected);
    },
    [onTokenChange]
  );
  return (
    <Select.Root
      defaultValue={tokenSelected.name}
      onValueChange={handleTokenChange}
      size="1"
    >
      <Select.Trigger />
      <Select.Content>
        {TOKEN_LIST.map((token) => (
          <Select.Item key={token.name} value={token.name}>
            {token.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

const SwapChainOption = ({
  chainSelected,
  onChainChange,
}: {
  chainSelected: Chain;
  onChainChange: (newChain: Chain) => void;
}) => {
  const handleChainChange = useCallback(
    (value: string) => {
      const chainSelected = getChainByName(value);
      if (!chainSelected) {
        throw new Error("Chain not found");
      }
      onChainChange(chainSelected);
    },
    [onChainChange]
  );
  return (
    <Select.Root
      defaultValue={chainSelected.name}
      onValueChange={handleChainChange}
      size="1"
    >
      <Select.Trigger />
      <Select.Content>
        {CHAIN_LIST.map((chain) => (
          <Select.Item key={chain.name} value={chain.name}>
            {chain.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
