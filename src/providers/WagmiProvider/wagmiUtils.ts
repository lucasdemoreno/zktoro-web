import { getNetwork, switchNetwork } from "wagmi/actions";

export async function switchToNetworkIfNeeded(chainId: number) {
  const network = await getNetwork();
  if (network.chain?.id === chainId) {
    return;
  }

  const switchResult = await switchNetwork({ chainId });
  return switchResult;
}
