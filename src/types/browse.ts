import { ChainToken } from "@/providers/ProgramProvider/Statements";

export type MockedBrowseStrategy = {
  id: string;
  address: string;
  isMocked: true;
  name: string;
  description: string;
  image: string;
};

export type ProdBrowseStrategy = {
  id: string;
  address: string;
  name: string;
  description: string;
  isMocked: false;
  image: string;
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
  address: "0x1234",
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
  name: "Buy Dips and Hold",
  description:
    "When there is a bullish market trend generally, one trading approach is to purchase on dips and sell when the market recovers from a correction or consolidation. ",
  image: "/strategy-1.png",
};

export const strategy2: BrowseStrategy = {
  id: "2",
  address: "0x1234",
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
  name: "Day Trading Strategy",
  description:
    "Day trading is a strategy in which traders open and close positions during the same trading day. Day traders frequently enter and exit trading positions within the day and rarely hold positions overnight.",
  image: "/strategy-2.png",
};

export const strategy3: BrowseStrategy = {
  id: "3",
  address: "0x1234",
  isMocked: true,
  name: "Swing Trading Strategy",
  description:
    "Swing trading is a strategy in which traders hold positions for longer than a single day, but generally for less than a month. Swing traders often use technical analysis to look for trading opportunities.",
  image: "/strategy-3.png",
};

export const strategy4: BrowseStrategy = {
  id: "4",
  address: "0x1234",
  isMocked: true,
  name: "Scalping Strategy",
  description:
    "Scalping is a trading strategy in which traders profit off small price changes for a stock. Scalping relies on technical analysis, such as candlestick charts and MACD, for execution.",
  image: "/strategy-4.png",
};
