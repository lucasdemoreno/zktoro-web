"use client";

import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import { PropsWithChildren } from "react";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { avalanche, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

const { publicClient, chains } = configureChains(
  [mainnet, polygon, avalanche],
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY || "" }),
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY || "" }),
    publicProvider(),
  ]
);

const config = createConfig({
  publicClient,
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
});

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
