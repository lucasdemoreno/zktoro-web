"use client";
import {
  WETH_Polygon,
  getChainById,
  getTokenByAddress,
} from "@/providers/ProgramProvider/Tokens";
import { switchToNetworkIfNeeded } from "@/providers/WagmiProvider/wagmiUtils";
import { IBasicIssuanceModuleABI, ISetTokenABI } from "@/transactions/abi";
import { WETH_POLYGON, getChainSC } from "@/transactions/contracts";
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

type CalculateHoldingsProps = {
  balance: bigint | undefined;
  positions:
    | readonly {
        component: `0x${string}`;
        module: `0x${string}`;
        unit: bigint;
        positionState: number;
        data: `0x${string}`;
      }[]
    | undefined;
};

function calculateHoldings({
  balance,
  positions,
}: CalculateHoldingsProps): string {
  return "--- 0";
}

function useChainHoldings(chainId: number, setToken: string): string {
  const [holdings, setHoldings] = useState<string>("---");
  const { address } = useAccount();

  const fetchHoldings = useCallback(async () => {
    console.log("chain", getChainById(chainId)?.name);
    const balanceOf = await readContract({
      address: setToken as `0x${string}`,
      chainId,
      abi: ISetTokenABI,
      functionName: "balanceOf",
      args: [setToken as `0x${string}`],
    });

    const balance = await fetchBalance({
      address: setToken as `0x${string}`,
      chainId,
    });
    const token = await fetchToken({
      address: setToken as `0x${string}`,
      chainId,
    });
    const positions = await readContract({
      address: setToken as `0x${string}`,
      chainId,
      abi: ISetTokenABI,
      functionName: "getPositions",
      // args: [],
    });
    // totalSupply()/10**18*getPositions() = Total no. of token inside

    console.log("chainId ===========", getChainById(chainId)?.name);
    console.log("balance", balance.formatted, balance.symbol);
    console.log("token", token.symbol, token.totalSupply.formatted);
    console.log("positions");
    positions?.map((position) => {
      console.log(
        "position",
        getTokenByAddress(position.component)?.name,
        position.unit
      );
    });
  }, [chainId, setToken]);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetchHoldings();
  }, [fetchHoldings, address]);

  return holdings;
}

const StrategyHoldings = ({ strategy }: { strategy: ProdBrowseStrategy }) => {
  // TODO: clean up this one.
  // const setTokenChainA = "0xE91d6553550dbC6c57F0FAaee21345aFbB597C62"; // Examples for now POLI
  // const setTokenChainB = "0xd2fcb441bda55a3f4c7dc10322a7c6193111933a"; // Examples for now AVAX
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
    <Flex direction="column">
      <Heading as="h2" size="5">
        Holdings
      </Heading>
      <Flex direction="column">
        {/* this is oing to be the holdings of each settoken */}
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
  const { address, isConnecting, isDisconnected } = useAccount();
  const tokenA_chainA = strategy.tokenA_chainA.address as `0x${string}`;
  const tokenB_chainA = strategy.tokenB_chainA.address as `0x${string}`;
  const tokenA_chainB = strategy.tokenA_chainB.address as `0x${string}`;
  const tokenB_chainB = strategy.tokenB_chainB.address as `0x${string}`;
  const setToken_chainA = strategy.setToken_chainA as `0x${string}`;
  const setToken_chainB = strategy.setToken_chainB as `0x${string}`;
  const chainSC = getChainSC(strategy.tokenA_chainA.chainId);
  const _quantityAA = BigInt(1 * 10 ** (strategy.tokenA_chainA.decimals - 3));
  const _quantityBA = BigInt(1 * 10 ** (strategy.tokenB_chainA.decimals - 3));
  const _quantityAB = BigInt(1 * 10 ** (strategy.tokenA_chainB.decimals - 3));
  const _quantityBB = BigInt(1 * 10 ** (strategy.tokenB_chainB.decimals - 3));

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
    console.log(data);
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
    console.log(data2);
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
    console.log(data3);
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
    console.log(data4);
  };

  const onIssue = async () => {
    const network = await switchToNetworkIfNeeded(
      strategy.tokenA_chainA.chainId
    );
    // Check that the setTokens are correct per chain.
    const data = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "issue",
      args: [setToken_chainA, _quantityAA, address as `0x${string}`],
    });
    console.log(data);

    const network2 = await switchToNetworkIfNeeded(
      strategy.tokenB_chainB.chainId
    );
    const chainSC2 = getChainSC(strategy.tokenB_chainB.chainId);
    // Check that the setTokens are correct per chain.
    const data2 = await writeContract({
      address: chainSC2.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "issue",
      args: [setToken_chainB, _quantityBB, address as `0x${string}`],
    });
    console.log(data2);
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
    console.log(data);

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
    console.log(data2);
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
          <Strong>Token A: </Strong> {strategy.tokenA_chainA.symbol}
        </Text>
        <Text as="p" size="3">
          <Strong>Token B: </Strong> {strategy.tokenB_chainA.symbol}
        </Text>
        <Text as="p" size="3">
          <Strong>Chain A: </Strong>{" "}
          {getChainById(strategy.tokenA_chainA.chainId)?.name}
        </Text>
        <Text as="p" size="3">
          <Strong>Chain B: </Strong>{" "}
          {getChainById(strategy.tokenA_chainB.chainId)?.name}
        </Text>
        <Text as="p" size="3">
          <Strong>Set Token in Chain A: </Strong> {strategy.setToken_chainA}
        </Text>
        <Text as="p" size="3">
          <Strong>Set Token in Chain B: </Strong> {strategy.setToken_chainB}
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
