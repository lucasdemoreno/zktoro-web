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
  ComparisonOperator,
  ComplexExpression,
  IfElseStatement,
  MathOperator,
  SendStatement,
  Statement,
  SwapStatement,
} from "@/providers/ProgramProvider/Statements";
import { USDC_Polygon } from "@/providers/ProgramProvider/Tokens";

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
        p="4"
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
    return <Text>{statement.label}</Text>;
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
  return (
    <>
      <Text>{statement.label}</Text>
      {/* This would be a more complex expression */}
      <TextField.Input size="1" placeholder="USDC" />
      <Text>to</Text>
      <TextField.Input size="1" placeholder="WETH" />
      <Text>on</Text>
      {/* This would be a more complex expression */}
      <TextField.Input size="1" placeholder="Optimism" />
    </>
  );
};

const SendBlock = ({ statement }: { statement: SendStatement }) => {
  return (
    <>
      <Text>{statement.label}</Text>
      {/* This would be a more complex expression */}
      <TextField.Input size="1" placeholder="WETH" />
      <Text>from</Text>
      <TextField.Input size="1" placeholder="Polygon" />
      <Text>to</Text>
      {/* This would be a more complex expression */}
      <TextField.Input size="1" placeholder="Optimism" />
    </>
  );
};

function updateCondition(
  statement: IfElseStatement,
  operator: ComparisonOperator
): IfElseStatement {
  return {
    ...statement,
    data: {
      ...statement.data!,
      condition: {
        ...statement.data?.condition,
        operator,
        ...({} as any),
      },
    },
  };
}

const IFBlock = ({ statement }: { statement: IfElseStatement }) => {
  const { onStatementUpdate } = useProgram();
  const handleOperatorChange = useCallback(
    (value: string) => {
      if (!statement.data?.condition) {
        return;
      }

      const newStatement = updateCondition(
        statement,
        value as ComparisonOperator
      );
      console.log(newStatement);

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
      <IfExpression expression={condition.left} />

      <Select.Root
        defaultValue={condition.operator}
        onValueChange={handleOperatorChange}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value={ComparisonOperator.EQUAL}>==</Select.Item>
          <Select.Item value={ComparisonOperator.GREATER_THAN}>
            {">"}
          </Select.Item>
          <Select.Item value={ComparisonOperator.LESS_THAN}>{"<"}</Select.Item>
        </Select.Content>
      </Select.Root>
      {/* This would be a more complex expression */}
      <IfExpression expression={condition.right} />
    </>
  );
};

const IfExpression = ({ expression }: { expression: ComplexExpression }) => {
  const [selectedExpression, setSelectedExpression] =
    useState<ComplexExpression>(expression);

  const handleDropdownChange = useCallback(
    (optionType: string) => () => {
      if (optionType === "complex expression") {
        setSelectedExpression({
          operator: MathOperator.DIVIDE,
          left: 2,
          right: 1,
        });
      }
      if (optionType === "number") {
        setSelectedExpression(1);
      }
      if (optionType === "token price") {
        setSelectedExpression(USDC_Polygon);
      }
    },
    [setSelectedExpression]
  );

  const ExpressionValue = useMemo(
    () =>
      function ExpressionValueComponent() {
        if (selectedExpression === null) {
          return (
            <Text size="1" placeholder="1">
              Choose
            </Text>
          );
        }

        if (typeof selectedExpression === "number") {
          return <TextField.Input size="1" placeholder="1" />;
        }

        if ("symbol" in selectedExpression) {
          return <TextField.Input size="1" placeholder="token" />;
        }

        if ("operator" in selectedExpression) {
          return (
            <Flex gap="1">
              <IfExpression expression={selectedExpression.left} />
              <Text>{selectedExpression.operator}</Text>
              <IfExpression expression={selectedExpression.right} />
            </Flex>
          );
        }

        return null;
      },
    [selectedExpression]
  );

  return (
    <>
      <ExpressionValue />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="surface" size="1">
            <CaretDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onSelect={handleDropdownChange("complex expression")}
          >
            token price operator token price
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDropdownChange("number")}>
            number
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDropdownChange("token price")}>
            token price
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};
