import { ChainToken } from "./Statements";

export type Chain = {
  name: string;
  chainId: number;
};

export const Polygon: Chain = {
  name: "Polygon",
  chainId: 137,
};

export const Avalanche: Chain = {
  name: "Avalanche",
  chainId: 43114,
};

export const USDC_Polygon: ChainToken = {
  name: "USDC (Polygon)",
  chainId: 137,
  decimals: 6,
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  symbol: "USDC",
};

export const USDC_Avalanche: ChainToken = {
  name: "USDC (Avalanche)",
  chainId: 43114,
  decimals: 6,
  address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  symbol: "USDC",
};

// Same for Wrapper Ether on Polygon Mainnet
export const WETH_Polygon: ChainToken = {
  name: "WETH (Polygon)",
  chainId: 137,
  decimals: 18,
  address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  symbol: "WETH",
};

// Same for Wrapper Ether on Avalanche Mainnet
export const WETH_Avalanche: ChainToken = {
  name: "WETH (Avalanche)",
  chainId: 43114,
  decimals: 18,
  address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  symbol: "WETH",
};

export const CHAIN_LIST: Chain[] = [Polygon, Avalanche];

// This is a hardcoded list of tokens that we support
export const TOKEN_LIST: ChainToken[] = [
  USDC_Polygon,
  USDC_Avalanche,
  WETH_Polygon,
  WETH_Avalanche,
];

export function getTokenByName(name: string): ChainToken | undefined {
  return TOKEN_LIST.find((token) => token.name === name);
}

export function getChainByName(name: string): Chain | undefined {
  return CHAIN_LIST.find((chain) => chain.name === name);
}

export function getChainById(chainId: number): Chain | undefined {
  return CHAIN_LIST.find((chain) => chain.chainId === chainId);
}
