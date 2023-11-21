import { ChainToken } from "./Statements";

const USDC_Polygon: ChainToken = {
  id: "USDC_Polygon",
  name: "USDC Polygon",
  symbol: "USDC",
};

const USDC_Optimism: ChainToken = {
  id: "USDC_Optimism",
  name: "USDC Optimism",
  symbol: "USDC",
};

const WETH_Polygon: ChainToken = {
  id: "WETH_Polygon",
  name: "WETH Polygon",
  symbol: "WETH",
};

const WETH_Optimism: ChainToken = {
  id: "WETH_Optimism",
  name: "WETH Optimism",
  symbol: "WETH",
};

// This is a hardcoded list of tokens that we support
export const TOKEN_LIST: ChainToken[] = [
  USDC_Polygon,
  USDC_Optimism,
  WETH_Polygon,
  WETH_Optimism,
];
