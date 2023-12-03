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
    name: "USDC (Polygon)",
    chainId: 137,
    decimals: 6,
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    symbol: "USDC",
  },
  tokenB_chainA: {
    name: "WETH (Polygon)",
    chainId: 137,
    decimals: 18,
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    symbol: "WETH",
  },
  tokenA_chainB: {
    name: "USDC (Avalanche)",
    chainId: 43114,
    decimals: 6,
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    symbol: "USDC",
  },
  tokenB_chainB: {
    name: "WETH (Avalanche)",
    chainId: 43114,
    decimals: 18,
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    symbol: "WETH",
  },
  setToken_chainA: "0xEC553087B96e5cE90c19187B1F85A7EF75FA30bB",
  setToken_chainB: "0xA443A48dfA97FC86ddEc44A5edD485F9F4211548",
  name: "Arbitrage Bot",
  description:
    "Capitalize on price differences between USDC and WETH on Polygon and Avalanche, executing swift trades for maximum profitability.",
};

export const strategy2: BrowseStrategy = {
  id: "2",
  isMocked: false,
  tokenA_chainA: {
    name: "USDC (Polygon)",
    chainId: 137,
    decimals: 6,
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    symbol: "USDC",
  },
  tokenB_chainA: {
    name: "WETH (Polygon)",
    chainId: 137,
    decimals: 18,
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    symbol: "WETH",
  },
  tokenA_chainB: {
    name: "USDC (Avalanche)",
    chainId: 43114,
    decimals: 6,
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    symbol: "USDC",
  },
  tokenB_chainB: {
    name: "WETH (Avalanche)",
    chainId: 43114,
    decimals: 18,
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    symbol: "WETH",
  },
  setToken_chainA: "0x670EcAD39ED80d0af15050eE7119Bb53f8F702Ce",
  setToken_chainB: "0x6603821B365A86d578Ce04DEA116262D8726331E",
  name: "Automated Rebalancing",
  description:
    "Implement an algorithm for continuous portfolio rebalancing, optimizing USDC and WETH allocations between Polygon and Avalanche for maximum returns",
};

export const strategy3: BrowseStrategy = {
  id: "3",
  isMocked: true,
  name: "Price Delta Arbitrage Bot",
  description:
    "Seize opportunities in USDC and WETH price variations between Polygon and Avalanche, executing rapid trades to maximize profits.",
};

export const strategy4: BrowseStrategy = {
  id: "4",
  isMocked: true,
  name: "Dynamic Portfolio Rebalancer",
  description:
    "Employ an algorithm for ongoing portfolio optimization, fine-tuning allocations of USDC and WETH between Polygon and Avalanche to enhance overall returns.",
};
