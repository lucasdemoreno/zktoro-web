import { PropsWithChildren, createContext, useContext, useState } from "react";

type ChainToken = {
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

type Condition = {
  // left and right values could be a number or a token.
  left: any;
  right: any;
  operator: string;
};

export type IfElseStatement = {
  type: StatementType.IF_ELSE;
  label: string;
  id: string;
  data: null | {
    condition: Condition;
    ifStatements: Statement[];
    elseStatements: Statement[];
  };
};

export type Statement = SendStatement | SwapStatement | IfElseStatement;

export enum StatementType {
  SEND = "SEND",
  SWAP = "SWAP",
  IF_ELSE = "IF_ELSE",
}

export function isEventStatement(
  eventData?: Record<string, any>
): eventData is Statement {
  return (
    eventData?.type === StatementType.SEND ||
    eventData?.type === StatementType.SWAP ||
    eventData?.type === StatementType.IF_ELSE
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
