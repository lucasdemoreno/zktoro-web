import {
  USDC_MUMBAI,
  USDC_SEPOLIA,
  WETH_MUMBAI,
  WETH_SEPOLIA,
} from "@/transactions/contracts";
import { ChainToken } from "./Statements";

export type Chain = {
  name: string;
  chainId: number;
};

export const Mumbai: Chain = {
  name: "Mumbai",
  chainId: 80001,
};

export const Sepolia: Chain = {
  name: "Sepolia",
  chainId: 11155111,
};

export const USDC_Mumbai: ChainToken = {
  name: "USDC (Mumbai)",
  chainId: 80001,
  decimals: 18,
  address: USDC_MUMBAI,
  symbol: "USDC",
};

export const USDC_Sepolia: ChainToken = {
  name: "USDC (Sepolia)",
  chainId: 11155111,
  decimals: 18,
  address: USDC_SEPOLIA,
  symbol: "USDC",
};

// Same for Wrapper Ether on Mumbai Mainnet
export const WETH_Mumbai: ChainToken = {
  name: "WETH (Mumbai)",
  chainId: 80001,
  decimals: 18,
  address: WETH_MUMBAI,
  symbol: "WETH",
};

// Same for Wrapper Ether on Sepolia Mainnet
export const WETH_Sepolia: ChainToken = {
  name: "WETH (Sepolia)",
  chainId: 11155111,
  decimals: 18,
  address: WETH_SEPOLIA,
  symbol: "WETH",
};

export const CHAIN_LIST: Chain[] = [Mumbai, Sepolia];

// This is a hardcoded list of tokens that we support
export const TOKEN_LIST: ChainToken[] = [
  USDC_Mumbai,
  USDC_Sepolia,
  WETH_Mumbai,
  WETH_Sepolia,
];

export function getTokenByName(name: string): ChainToken | undefined {
  return TOKEN_LIST.find((token) => token.name === name);
}

export function getTokenByAddress(address: string): ChainToken | undefined {
  return TOKEN_LIST.find((token) => token.address === address);
}

export function getChainByName(name: string): Chain | undefined {
  return CHAIN_LIST.find((chain) => chain.name === name);
}

export function getChainById(chainId: number): Chain | undefined {
  return CHAIN_LIST.find((chain) => chain.chainId === chainId);
}
