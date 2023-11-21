import { PropsWithChildren, createContext, useContext, useState } from "react";

export type ChainToken = {
  id: string;
  name: string;
  symbol: string;
};

// Send tokens from one chain to another.
export type SendStatement = {
  type: StatementType.SEND;
  label: string;
  id: string;
  data: null | {
    from: ChainToken;
    to: ChainToken;
    amount: number;
  };
};

// Swap between tokens inside the same chain.
export type SwapStatement = {
  type: StatementType.SWAP;
  label: string;
  id: string;
  data: null | {
    from: ChainToken;
    to: ChainToken;
    amount: number;
  };
};

export enum MathOperator {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
}

export enum ComparisonOperator {
  EQUAL = "EQUAL",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
}

export type Expression = ChainToken | number;

export type Condition = {
  // left and right values could be a number or a token.
  left: Expression;
  right: Expression;
  operator: ComparisonOperator;
};

export type IfElseStatement = {
  type: StatementType.IF_ELSE;
  label: string;
  id: string;
  data: null | {
    condition: null | Condition;
    // For referencing each other when deleting
    elseStatement: null | ElseStatement;
    ifStatements: Statement[];
  };
};

export type ElseStatement = {
  type: StatementType.ELSE;
  label: string;
  id: string;
  data: null | {
    // For referencing each other when deleting
    ifStatement: null | IfElseStatement;
    elseStatements: Statement[];
  };
};

export type Statement =
  | SendStatement
  | SwapStatement
  | IfElseStatement
  | ElseStatement;

export enum StatementType {
  SEND = "SEND",
  SWAP = "SWAP",
  IF_ELSE = "IF_ELSE",
  ELSE = "ELSE",
}

export function isEventStatement(
  eventData?: Record<string, any>
): eventData is Statement {
  return (
    eventData?.type === StatementType.SEND ||
    eventData?.type === StatementType.SWAP ||
    eventData?.type === StatementType.IF_ELSE ||
    eventData?.type === StatementType.ELSE
  );
}

export const emptySendStatement: SendStatement = {
  type: StatementType.SEND,
  label: "Send",
  id: "empty-send-statement",
  data: null,
};

export const emptySwapStatement: SwapStatement = {
  type: StatementType.SWAP,
  label: "Swap",
  id: "empty-swap-statement",
  data: null,
};

export const emptyIfElseStatement: IfElseStatement = {
  type: StatementType.IF_ELSE,
  label: "If/Else",
  id: "empty-if-else-statement",
  data: null,
};
