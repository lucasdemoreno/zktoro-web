import { ChainToken } from "@/providers/ProgramProvider/Statements";

export type MockedBrowseStrategy = {
  id: string;
  isMocked: true;
  name: string;
  description: string;
};

export type ProdBrowseStrategy = {
  id: string;
  name: string;
  description: string;
  isMocked: false;
  tokenA_chainA: ChainToken;
  tokenB_chainA: ChainToken;
  tokenA_chainB: ChainToken;
  tokenB_chainB: ChainToken;
  setToken_chainA: string;
  setToken_chainB: string;
};

export type BrowseStrategy = ProdBrowseStrategy | MockedBrowseStrategy;

export const strategy1: BrowseStrategy = {
  id: "1",
  isMocked: false,
  tokenA_chainA: {
    name: "USDC (Mumbai)",
    chainId: 80001,
    decimals: 6,
    address: "0x26fE521ae8424902055732ec5dcdbf4AB47cC9a0",
    symbol: "USDC",
  },
  tokenB_chainA: {
    name: "WETH (Mumbai)",
    chainId: 80001,
    decimals: 18,
    address: "0xf471d9D3AEe379Ed024D796413503527a3Be12ad",
    symbol: "WETH",
  },
  tokenA_chainB: {
    name: "USDC (Sepolia)",
    chainId: 11155111,
    decimals: 6,
    address: "0xf607B132550Af445B049DD85Df36A0676332d545",
    symbol: "USDC",
  },
  tokenB_chainB: {
    name: "WETH (Sepolia)",
    chainId: 11155111,
    decimals: 18,
    address: "0x3722df51cD13F0393d239761591C296c8733DE15",
    symbol: "WETH",
  },
  setToken_chainA: "0xEC553087B96e5cE90c19187B1F85A7EF75FA30bB",
  setToken_chainB: "0xA443A48dfA97FC86ddEc44A5edD485F9F4211548",
  name: "Arbitrage Bot",
  description:
    "Capitalize on price differences between USDC and WETH on Mumbai and Sepolia, executing swift trades for maximum profitability.",
};

export const strategy2: BrowseStrategy = {
  id: "2",
  isMocked: false,
  tokenA_chainA: {
    name: "USDC (Mumbai)",
    chainId: 80001,
    decimals: 6,
    address: "0x26fE521ae8424902055732ec5dcdbf4AB47cC9a0",
    symbol: "USDC",
  },
  tokenB_chainA: {
    name: "WETH (Mumbai)",
    chainId: 80001,
    decimals: 18,
    address: "0xf471d9D3AEe379Ed024D796413503527a3Be12ad",
    symbol: "WETH",
  },
  tokenA_chainB: {
    name: "USDC (Sepolia)",
    chainId: 11155111,
    decimals: 6,
    address: "0xf607B132550Af445B049DD85Df36A0676332d545",
    symbol: "USDC",
  },
  tokenB_chainB: {
    name: "WETH (Sepolia)",
    chainId: 11155111,
    decimals: 18,
    address: "0x3722df51cD13F0393d239761591C296c8733DE15",
    symbol: "WETH",
  },
  setToken_chainA: "0x670EcAD39ED80d0af15050eE7119Bb53f8F702Ce",
  setToken_chainB: "0x6603821B365A86d578Ce04DEA116262D8726331E",
  name: "Automated Rebalancing",
  description:
    "Implement an algorithm for continuous portfolio rebalancing, optimizing USDC and WETH allocations between Mumbai and Sepolia for maximum returns",
};

export const strategy3: BrowseStrategy = {
  id: "3",
  isMocked: true,
  name: "Price Delta Arbitrage Bot",
  description:
    "Seize opportunities in USDC and WETH price variations between Mumbai and Sepolia, executing rapid trades to maximize profits.",
};

export const strategy4: BrowseStrategy = {
  id: "4",
  isMocked: true,
  name: "Dynamic Portfolio Rebalancer",
  description:
    "Employ an algorithm for ongoing portfolio optimization, fine-tuning allocations of USDC and WETH between Mumbai and Sepolia to enhance overall returns.",
};
