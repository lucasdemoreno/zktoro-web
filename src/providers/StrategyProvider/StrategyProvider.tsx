"use client";
import React, { createContext } from "react";
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
};

export const StrategyContext = createContext<StrategyContextValue>({
  configuration: INITIAL_CONFIG,
  onConfigurationChange: () => {},
  backtestStatus: { loading: false },
  onBacktest: () => {},
});

export function useStrategy() {
  return useContext(StrategyContext);
}

export type BackTestStatus = {
  loading: boolean;
  error?: any;
  data?: any;
};

export const StrategyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [backtestStatus, setBacktestStatus] = React.useState<BackTestStatus>({
    loading: false,
  });

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
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};
