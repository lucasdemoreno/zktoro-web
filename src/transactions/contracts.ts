export const WETH_SEPOLIA = "0x3722df51cD13F0393d239761591C296c8733DE15";
export const USDC_SEPOLIA = "0xf607B132550Af445B049DD85Df36A0676332d545";
export const WETH_MUMBAI = "0xf471d9D3AEe379Ed024D796413503527a3Be12ad";
export const USDC_MUMBAI = "0x26fE521ae8424902055732ec5dcdbf4AB47cC9a0";

export function getChainSC(chainId: number) {
  switch (chainId) {
    case 80001:
      return MUMBAI_SMART_CONTRACTS;
    case 11155111:
      return SEPOLIA_SMART_CONTRACTS;
    default:
      throw new Error("Chain not supported");
  }
}

export const MUMBAI_SMART_CONTRACTS = {
  name: "Mumbai",
  WETH: WETH_MUMBAI,
  USDC: USDC_MUMBAI,
  SetTokenExample1Address:
    "0x11c68Ad7E3524Cf58921f35D527E076dF4fE8B21" as `0x${string}`, // This is a created one
  LockReleaseModuleAddress: "0x69CC2594f99df2Ff3BaDb2de6d1E864f71737977",
  BasicIssuanceModuleAddress: "0x1Fa54Ed4a4F4E0110DC398D77160eC30A49439A1",
  TradeModuleAddress: "0x79963cC1240909010c57C528F6A9fD52467156FE",
  IntegrationsAddress: "0x761334654788D3963Ef493bD3c01bDd20d405481",
  SetTokenCreatorAddress: "0x2dF0e853e40938542f10C6C9FFdCDb6bD005Ef3B",
  ManagerAddress: "0x72723E18D14F49741ef76aD2ca536B3c3c94864B",
  ControllerAddress: "0x072059A3B2f5C4ab480484184E2324Cdb2B00416",
};

export const SEPOLIA_SMART_CONTRACTS = {
  name: "Sepolia",
  WETH: WETH_SEPOLIA,
  USDC: USDC_SEPOLIA,
  SetTokenExample1Address: "0xBDd84D7d91f75CEA64Ba2e1D46704090444aBAde", // This is a created one
  LockReleaseModuleAddress: "0x983545d1fAF554aAf8C12a66A4E18CDeD1CBa4B4",
  BasicIssuanceModuleAddress: "0x2C0B3f31E13454E01ccC8f62F86c2c03B97Ac0e8",
  TradeModuleAddress: "0x69D3b34aB349d903E6947Ab89bB54c26bA511676",
  IntegrationsAddress: "0x0407BC8B41775EC42096E0F6614d9C28AFC107BA",
  SetTokenCreatorAddress: "0xbf91526883A661F6ef7952539521f681fBb0Ab59",
  ManagerAddress: "0xfcF81aE7AAa3c451F71F834F6D502f7c2A3cd8CC",
  ControllerAddress: "0xF1f42e72B515E12A69B3504a637E0a28e30A7549",
};
