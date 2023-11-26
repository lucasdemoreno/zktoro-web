import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Chain } from "./Tokens";

export type ChainToken = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
};

// Send tokens from one chain to another.
export type SendStatement = {
  type: StatementType.SEND;
  label: string;
  id: string;
  data: null | {
    token: ChainToken;
    from: Chain;
    to: Chain;
    amount: string;
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
    chain: Chain;
    amount: string;
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

export type MathExpression = {
  operator: MathOperator;
  left: ComplexExpression;
  right: ComplexExpression;
};

export type ComplexExpression = ChainToken | string | MathExpression | null;

export type Condition = {
  // left and right values could be a number (string before parsing) or a token.
  left: ComplexExpression;
  right: ComplexExpression;
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
