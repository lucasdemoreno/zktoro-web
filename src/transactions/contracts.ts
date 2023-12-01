export const WETH_AVALANCHE = "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB";
export const USDC_AVALANCHE = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
export const WETH_POLYGON = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
export const USDC_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

export function getChainSC(chainId: number) {
  switch (chainId) {
    case 137:
      return POLYGON_SMART_CONTRACTS;
    case 43114:
      return AVALANCHE_SMART_CONTRACTS;
    default:
      throw new Error("Chain not supported");
  }
}

export const POLYGON_SMART_CONTRACTS = {
  name: "Polygon",
  WETH: WETH_POLYGON,
  USDC: USDC_POLYGON,
  SetTokenExample1Address:
    "0x670EcAD39ED80d0af15050eE7119Bb53f8F702Ce" as `0x${string}`, // This is a created one
  LockReleaseModuleAddress: "0x6Ec9E796b7AE7020D0fb32CD53cF684c649dFc81",
  BasicIssuanceModuleAddress: "0x3Ca4FcD8239576F35cE8dc242ba7Bd740c3472c1",
  TradeModuleAddress: "0x376F3FD475765b2D2Fef3BC362CDafb01686f3ea",
  IntegrationsAddress: "0x307E3a426bc295C6dd86edF80361e66D84198cb7",
  SetTokenCreatorAddress: "0x3cCB840fAe596926C5Ebc5369E0c3AB4a7e92389",
  ManagerAddress: "0x7295CEE2CfDEBa4451dF11e4d42ad4E0Bf476b6A",
  ControllerAddress: "0x6A23D813739801E34E961c2a91C43881dD5C43cc",
};

export const AVALANCHE_SMART_CONTRACTS = {
  name: "Avalanche",
  WETH: WETH_AVALANCHE,
  USDC: USDC_AVALANCHE,
  SetTokenExample1Address: "0x6603821B365A86d578Ce04DEA116262D8726331E", // This is a created one
  LockReleaseModuleAddress: "0x376F3FD475765b2D2Fef3BC362CDafb01686f3ea",
  BasicIssuanceModuleAddress: "0x3cCB840fAe596926C5Ebc5369E0c3AB4a7e92389",
  TradeModuleAddress: "0x307E3a426bc295C6dd86edF80361e66D84198cb7",
  IntegrationsAddress: "0xB20087b690E817ce47f63c1f431397Bd40CE1c54",
  SetTokenCreatorAddress: "0x6A23D813739801E34E961c2a91C43881dD5C43cc",
  ManagerAddress: "0x3Ca4FcD8239576F35cE8dc242ba7Bd740c3472c1",
  ControllerAddress: "0x4349aA3A85127a63C34608a64e6F46ffadAbD614",
};
