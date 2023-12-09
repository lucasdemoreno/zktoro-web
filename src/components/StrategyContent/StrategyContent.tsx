"use client";
import {
  getChainById,
  getTokenByAddress,
} from "@/providers/ProgramProvider/Tokens";
import { switchToNetworkIfNeeded } from "@/providers/WagmiProvider/wagmiUtils";
import { IBasicIssuanceModuleABI, ISetTokenABI } from "@/transactions/abi";
import { getChainSC } from "@/transactions/contracts";
import {
  BrowseStrategy,
  MockedBrowseStrategy,
  ProdBrowseStrategy,
} from "@/types/browse";
import {
  Text,
  Flex,
  Button,
  Box,
  Heading,
  Strong,
  Section,
} from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  fetchBalance,
  fetchToken,
  getNetwork,
  readContract,
  writeContract,
} from "wagmi/actions";

type StrategyContentProps = {
  strategy: BrowseStrategy | null;
};

type HoldingsResult = {
  balance: string | null;
  totalSupply: string | null;
  positions: { tokenName: string; balance: string }[];
};

async function fetchMyBalance(
  address: `0x${string}`,
  chainId: number,
  setToken: string
): Promise<string | null> {
  if (!address) {
    return null;
  }
  const balanceResult = await fetchBalance({
    address: address,
    chainId,
    token: setToken as `0x${string}`,
  });

  const balance = Number(balanceResult.value / BigInt(10 ** 18));

  return balance.toString();
}

async function fetchVaultToken(
  setToken: `0x${string}`,
  chainId: number
): Promise<string | null> {
  const token = await fetchToken({
    address: setToken as `0x${string}`,
    chainId,
  });

  const tokensInside = Number(token.totalSupply.value / BigInt(10 ** 18));

  return tokensInside.toString();
}

function useChainHoldings(chainId: number, setToken: string): HoldingsResult {
  const [holdings, setHoldings] = useState<HoldingsResult>({
    balance: null,
    totalSupply: null,
    positions: [],
  });
  const { address: ad } = useAccount();
  const address = ad as `0x${string}`;

  const fetchHoldings = useCallback(async () => {
    const balance = await fetchMyBalance(address, chainId, setToken);
    const tokensInside = await fetchVaultToken(
      setToken as `0x${string}`,
      chainId
    );
    const positionsResult = await readContract({
      address: setToken as `0x${string}`,
      chainId,
      abi: ISetTokenABI,
      functionName: "getPositions",
    });
    const positions = positionsResult?.map((position) => {
      return {
        tokenName: getTokenByAddress(position.component)?.name || "",
        balance: Number(position.unit / BigInt(10 ** 18)).toString(),
      };
    });
    setHoldings({
      balance: balance,
      totalSupply: tokensInside,
      positions: positions,
    });
  }, [chainId, setToken, address]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings, address]);

  return holdings;
}

const ChainHoldings = ({
  chainId,
  chainHoldings,
}: {
  chainId: number;
  chainHoldings: HoldingsResult;
}) => {
  return (
    <Flex direction="column" py="3">
      <Heading size="3">{getChainById(chainId)?.name}</Heading>
      <Flex direction="column" px="4">
        {chainHoldings.totalSupply ? (
          <>
            <Text>Total Supply in Vault: {chainHoldings.totalSupply}</Text>
            <Text>Invested: {chainHoldings.balance || 0}</Text>
            {chainHoldings.positions?.length && <Text>Positions:</Text>}
            <Flex direction="column" px="2">
              {chainHoldings.positions?.map((pos) => (
                <Text key={pos.tokenName}>
                  {pos.balance} {pos.tokenName}
                </Text>
              ))}
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};

const StrategyHoldings = ({ strategy }: { strategy: ProdBrowseStrategy }) => {
  const { tokenA_chainA, tokenB_chainB, setToken_chainA, setToken_chainB } =
    strategy;
  const chainAHoldings = useChainHoldings(
    tokenA_chainA.chainId,
    setToken_chainA
  );
  const chainBHoldings = useChainHoldings(
    tokenB_chainB.chainId,
    setToken_chainB
  );

  return (
    <Flex direction="column" py="5">
      <Heading as="h2" size="5">
        Vault Holdings
      </Heading>
      <Flex direction="column">
        <ChainHoldings
          chainId={tokenA_chainA.chainId}
          chainHoldings={chainAHoldings}
        />
        <ChainHoldings
          chainId={tokenB_chainB.chainId}
          chainHoldings={chainBHoldings}
        />
      </Flex>
    </Flex>
  );
};

// "0x36f6f87376ed363cf08524be282dcce129b64985b1a677f4c6c3106ba8b5bc14"
// from the approve allowance

const ProdStrategyContent = ({
  strategy,
}: {
  strategy: ProdBrowseStrategy;
}) => {
  const { address } = useAccount();
  const [_refresh, setRefresh] = useState(0);
  const tokenA_chainA = strategy.tokenA_chainA.address as `0x${string}`;
  const tokenB_chainA = strategy.tokenB_chainA.address as `0x${string}`;
  const tokenA_chainB = strategy.tokenA_chainB.address as `0x${string}`;
  const tokenB_chainB = strategy.tokenB_chainB.address as `0x${string}`;
  const setToken_chainA = strategy.setToken_chainA as `0x${string}`;
  const setToken_chainB = strategy.setToken_chainB as `0x${string}`;
  const chainSC = getChainSC(strategy.tokenA_chainA.chainId);
  const _quantityAA = BigInt(1 * 10 ** 24);
  const _quantityBA = BigInt(1 * 10 ** 24);
  const _quantityAB = BigInt(1 * 10 ** 24);
  const _quantityBB = BigInt(1 * 10 ** 24);

  // TODO: Clean up this.
  const onApproveAllowance = async () => {
    const network = await switchToNetworkIfNeeded(
      strategy.tokenA_chainA.chainId
    );
    const chainSC = getChainSC(strategy.tokenA_chainA.chainId);
    const data = await writeContract({
      address: tokenA_chainA as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [chainSC.BasicIssuanceModuleAddress as `0x${string}`, _quantityAA],
    });
    const network2 = await switchToNetworkIfNeeded(
      strategy.tokenB_chainA.chainId
    );
    const chainSC2 = getChainSC(strategy.tokenB_chainA.chainId);
    const data2 = await writeContract({
      address: tokenB_chainA as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [chainSC2.BasicIssuanceModuleAddress as `0x${string}`, _quantityBA],
    });
    const network3 = await switchToNetworkIfNeeded(
      strategy.tokenA_chainB.chainId
    );
    const chainSC3 = getChainSC(strategy.tokenA_chainB.chainId);
    const data3 = await writeContract({
      address: tokenA_chainB as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [chainSC3.BasicIssuanceModuleAddress as `0x${string}`, _quantityAB],
    });
    const network4 = await switchToNetworkIfNeeded(
      strategy.tokenB_chainB.chainId
    );
    const chainSC4 = getChainSC(strategy.tokenB_chainB.chainId);
    const data4 = await writeContract({
      address: tokenB_chainB as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [chainSC4.BasicIssuanceModuleAddress as `0x${string}`, _quantityBB],
    });
  };

  const onIssue = async () => {
    const network = await switchToNetworkIfNeeded(
      strategy.tokenA_chainA.chainId
    );

    const amount1 = BigInt(1 * 10 ** 18);
    // Check that the setTokens are correct per chain.
    const data = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "issue",
      args: [setToken_chainA, amount1, address as `0x${string}`],
    });

    const network2 = await switchToNetworkIfNeeded(
      strategy.tokenB_chainB.chainId
    );
    const amount2 = BigInt(1 * 10 ** 18);
    const chainSC2 = getChainSC(strategy.tokenB_chainB.chainId);
    // Check that the setTokens are correct per chain.
    const data2 = await writeContract({
      address: chainSC2.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "issue",
      args: [setToken_chainB, amount2, address as `0x${string}`],
    });
    new Promise((resolve) => setTimeout(resolve, 1000));
    setRefresh(_refresh + 1);
  };

  const onRedeem = async () => {
    const network = await switchToNetworkIfNeeded(
      strategy.tokenA_chainA.chainId
    );
    // Check that the setTokens are correct per chain.
    const data = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "redeem",
      args: [setToken_chainA, _quantityAA, address as `0x${string}`],
    });

    const network2 = await switchToNetworkIfNeeded(
      strategy.tokenB_chainB.chainId
    );
    // Check that the setTokens are correct per chain.
    const data2 = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "redeem",
      args: [setToken_chainB, _quantityBB, address as `0x${string}`],
    });
    new Promise((resolve) => setTimeout(resolve, 1000));
    setRefresh(_refresh + 1);
  };

  return (
    <Section p="2">
      <Flex direction="column">
        <Heading as="h1" size="6">
          {strategy.name}
        </Heading>
        <Text as="p" size="3">
          {strategy.description}
        </Text>
        <Text as="p" size="3">
          <Strong>Vault in Chain A: </Strong>{" "}
          {getChainById(strategy.tokenA_chainA.chainId)?.name}
        </Text>
        <Text as="p" size="3">
          <Strong>Vault in Chain B: </Strong>{" "}
          {getChainById(strategy.tokenA_chainB.chainId)?.name}
        </Text>
        <StrategyHoldings strategy={strategy} />
        <Box mt="4">
          <Button onClick={onApproveAllowance}>Approve Allowance</Button>
        </Box>
        <Box mt="4">
          <Button onClick={onIssue}>Invest in Strategy</Button>
        </Box>
        <Box mt="4">
          <Button onClick={onRedeem}>Withdraw</Button>
        </Box>
      </Flex>
    </Section>
  );
};

const MockedStrategyContent = ({
  strategy,
}: {
  strategy: MockedBrowseStrategy;
}) => {
  return (
    <Section p="2">
      <Flex direction="column">
        <Heading as="h1" size="6">
          {strategy.name}
        </Heading>
        <Text as="p" size="3">
          {strategy.description}
        </Text>
        <Box mt="4">
          <Button>Invest in Strategy</Button>
        </Box>
      </Flex>
    </Section>
  );
};

export const StrategyContent = ({ strategy }: StrategyContentProps) => {
  if (!strategy) {
    return null;
  }

  if (strategy.isMocked) {
    return <MockedStrategyContent strategy={strategy} />;
  }

  return <ProdStrategyContent strategy={strategy} />;
};
