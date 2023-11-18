"use client";
import { Canvas } from "@/components/Canvas/Canvas";
import { Topbar } from "@/components/Topbar/Topbar";
import { Flex, Section } from "@radix-ui/themes";
import { useState } from "react";

export type StrategyConfiguration = {
  lifespan: string;
  maxLiquidity: string;
  author: string;
  profitability: string;
  sharpeRatio: string;
  standardDeviation: string;
  maxDrawdown: string;
  frequency: string;
};

const INITIAL_CONFIG: StrategyConfiguration = {
  lifespan: "1 year",
  maxLiquidity: "1000",
  author: "username",
  profitability: "0",
  sharpeRatio: "0",
  standardDeviation: "0",
  maxDrawdown: "0",
  frequency: "0",
};

export default function Workspace() {
  const [strategyConfig, setStrategyConfig] =
    useState<StrategyConfiguration>(INITIAL_CONFIG);
  return (
    <main>
      <Topbar />
      <Section p="2">
        <Flex direction="column" align="center">
          <Canvas
            configuration={strategyConfig}
            setConfiguration={setStrategyConfig}
          />
        </Flex>
      </Section>
    </main>
  );
}
