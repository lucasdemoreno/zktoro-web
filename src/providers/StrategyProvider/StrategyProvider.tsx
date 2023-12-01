"use client";
import React, { createContext, useReducer, useState } from "react";
import { useContext } from "react";

const INITIAL_CONFIG: Configuration = {
  lifespan: "1 year",
  maxLiquidity: "1000",
  author: "username",
  sharpeRatio: "0",
  standardDeviation: "0",
  maxDrawdown: "0",
  frequency: "0",
};

export type Configuration = {
  lifespan: string;
  maxLiquidity: string;
  author: string;
  sharpeRatio: string;
  standardDeviation: string;
  maxDrawdown: string;
  frequency: string;
};

export type StrategyContextValue = {
  configuration: Configuration;
  onConfigurationChange: (config: Configuration) => void;
  backtestStatus: BackTestStatus;
  onBacktest: () => void;
  publishStatus: PublishStatus;
  publishDispatch: React.Dispatch<PublishAction>;
};

export function useStrategy() {
  return useContext(StrategyContext);
}

export type BackTestStatus = {
  loading: boolean;
  error?: any;
  data?: any;
};

export enum StepStatusEnum {
  SUCCESS = "success",
  FAILURE = "failure",
  PENDING = "pending",
  NOT_STARTED = "not-started",
}

type StepStatus = {
  status: StepStatusEnum;
  // TODO: for now, all the results are strings.
  // We should change this to be more specific
  result?: string;
};

export type PublishStatus = {
  convertToPython: StepStatus;
  convertToCircom: StepStatus;
  createSetTokenChainA: StepStatus;
  createSetTokenChainB: StepStatus;
  registerVaultPair: StepStatus;
  createDockerImage: StepStatus;
};

const INITIAL_PUBLISH_STATUS: PublishStatus = {
  convertToPython: { status: StepStatusEnum.NOT_STARTED },
  convertToCircom: { status: StepStatusEnum.NOT_STARTED },
  createSetTokenChainA: { status: StepStatusEnum.NOT_STARTED },
  createSetTokenChainB: { status: StepStatusEnum.NOT_STARTED },
  registerVaultPair: { status: StepStatusEnum.NOT_STARTED },
  createDockerImage: { status: StepStatusEnum.NOT_STARTED },
};

export type PublishAction = {
  type: "UPDATE";
  payload: {
    step: keyof PublishStatus;
    status: StepStatusEnum;
    result?: any;
  };
};

function publishReducer(
  state: PublishStatus,
  action: PublishAction
): PublishStatus {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.payload.step]: {
          status: action.payload.status,
          result: action.payload.result,
        },
      };
    default:
      return state;
  }
}

export const StrategyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [backtestStatus, setBacktestStatus] = useState<BackTestStatus>({
    loading: false,
  });
  const [publishStatus, publishDispatch] = useReducer(
    publishReducer,
    INITIAL_PUBLISH_STATUS
  );

  const [configuration, setConfiguration] =
    React.useState<Configuration>(INITIAL_CONFIG);

  const onBacktest = async () => {
    setBacktestStatus({ loading: true });
    try {
      // Make API call here somewhere
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setBacktestStatus({ loading: false, error: null, data: "Some new data" });
    } catch (error) {
      setBacktestStatus({ loading: false, error });
    }
  };

  return (
    <StrategyContext.Provider
      value={{
        configuration,
        onConfigurationChange: setConfiguration,
        backtestStatus,
        onBacktest,
        publishStatus,
        publishDispatch,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

export const StrategyContext = createContext<StrategyContextValue>({
  configuration: INITIAL_CONFIG,
  onConfigurationChange: () => {},
  backtestStatus: { loading: false },
  onBacktest: () => {},
  publishStatus: INITIAL_PUBLISH_STATUS,
  publishDispatch: () => {},
});
