"use client";

import { WagmiConfig, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import { PropsWithChildren } from "react";

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,

    transport: http(),
  }),
});

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
