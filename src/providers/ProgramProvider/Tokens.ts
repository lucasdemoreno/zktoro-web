import { ChainToken } from "./Statements";

export type Chain = {
  name: string;
  chainId: number;
};

export const Polygon: Chain = {
  name: "Polygon",
  chainId: 137,
};

export const Optimism: Chain = {
  name: "Optimism",
  chainId: 10,
};

export const USDC_Polygon: ChainToken = {
  name: "USDC Polygon",
  chainId: 137,
  address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  symbol: "USDC.e",
};

export const USDC_Optimism: ChainToken = {
  name: "USDC Optimism",
  chainId: 10,
  address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  symbol: "USDC.e",
};

// Same for Wrapper Ether on Polygon Mainnet
export const WETH_Polygon: ChainToken = {
  name: "WETH Polygon",
  chainId: 137,
  address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  symbol: "WETH.e",
};

// Same for Wrapper Ether on Optimism Mainnet
export const WETH_Optimism: ChainToken = {
  name: "WETH Optimism",
  chainId: 10,
  address: "0x4200000",
  symbol: "WETH.e",
};

export const CHAIN_LIST: Chain[] = [Polygon, Optimism];

// This is a hardcoded list of tokens that we support
export const TOKEN_LIST: ChainToken[] = [
  USDC_Polygon,
  USDC_Optimism,
  WETH_Polygon,
  WETH_Optimism,
];

export function getTokenByName(name: string): ChainToken | undefined {
  return TOKEN_LIST.find((token) => token.name === name);
}

export function getChainByName(name: string): Chain | undefined {
  return CHAIN_LIST.find((chain) => chain.name === name);
}
