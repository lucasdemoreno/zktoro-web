"use client";
import { WETH_Polygon, getChainById } from "@/providers/ProgramProvider/Tokens";
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
  // const { address } = useAccount();
  // const {
  //   data: balance,
  //   isError,
  //   isLoading,
  //   error,
  // } = useContractRead({
  //   address: setToken as `0x${string}`,
  //   abi: ISetTokenABI,
  //   functionName: "balanceOf",
  //   // @ts-ignore
  //   args: [address],
  // });

  // const { data: totalSupply } = useContractRead({
  //   address: setToken as `0x${string}`,
  //   abi: ISetTokenABI,
  //   functionName: "totalSupply",
  // });

  const fetchHoldings = useCallback(async () => {
    console.log("chain", getChainById(chainId)?.name);
    const balanceOf = 0;
    // const balanceOf = await readContract({
    //   address: setToken as `0x${string}`,
    //   chainId,
    //   abi: ISetTokenABI,
    //   functionName: "balanceOf",
    //   args: [setToken as `0x${string}`],
    // });

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

    console.log(balanceOf, balance, token, positions);
  }, [chainId, setToken]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return holdings;
}

const StrategyHoldings = ({ strategy }: { strategy: ProdBrowseStrategy }) => {
  // TODO: clean up this one.
  const setTokenChainA = "0xE91d6553550dbC6c57F0FAaee21345aFbB597C62"; // Examples for now POLI
  const setTokenChainB = "0xd2fcb441bda55a3f4c7dc10322a7c6193111933a"; // Examples for now AVAX
  const { tokenA_chainA, tokenB_chainB, setToken_chainA, setToken_chainB } =
    strategy;
  console.log(strategy);
  const chainAHoldings = useChainHoldings(
    tokenA_chainA.chainId,
    setTokenChainA
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

function useApproveAllowance(
  tokenA: string,
  tokenB: string,
  issuanceAddress: `0x${string}`,
  quantityA: bigint,
  quantityB: bigint
) {
  // const { config } = usePrepareContractWrite({
  //   address: tokenA as `0x${string}`,
  //   abi: erc20ABI,
  //   functionName: "approve",
  //   args: [issuanceAddress as `0x${string}`, quantityA],
  // });

  const { config: configB } = usePrepareContractWrite({
    address: tokenB as `0x${string}`,
    abi: erc20ABI,
    functionName: "approve",
    args: [issuanceAddress as `0x${string}`, quantityB],
  });

  // const {
  //   data: approveData,
  //   isLoading,
  //   isSuccess,
  //   write,
  //   error,
  // } = useContractWrite(config);

  const {
    data: approveDataB,
    isLoading: isLoadingB,
    isSuccess: isSuccessB,
    write: writeB,
    error: errorB,
  } = useContractWrite(configB);

  const onApproveAllowance = () => {
    console.log(errorB, writeB, approveDataB, isLoadingB);
    writeB?.();
    // write?.();
  };

  console.log("console.log(isLoading, isSuccess, approveData, error);");
  // console.log(isLoading, isSuccess, approveData, error);
  console.log(isLoadingB, isSuccessB, approveDataB, errorB);

  return {
    onApproveAllowance,
  };
}
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
  const setToken_chainA = strategy.setToken_chainA as `0x${string}`;
  const chainSC = getChainSC(strategy.tokenA_chainA.chainId);
  const _quantityA = BigInt(1 * 10 ** (strategy.tokenA_chainA.decimals - 3));
  const _quantityB = BigInt(1 * 10 ** (strategy.tokenA_chainB.decimals - 3));

  // const { onApproveAllowance } = useApproveAllowance(
  //   tokenA_chainA,
  //   tokenB_chainA,
  //   chainSC.BasicIssuanceModuleAddress as `0x${string}`,
  //   _quantityA,
  //   _quantityB
  // );

  // TODO: Clean up this.
  const onApproveAllowance = async () => {
    const data = await writeContract({
      address: tokenA_chainA as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [chainSC.BasicIssuanceModuleAddress as `0x${string}`, _quantityA],
    });
    console.log(data);
  };

  const onIssue = async () => {
    const data = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "issue",
      args: [setToken_chainA, _quantityA, address as `0x${string}`],
    });
    console.log(data);
  };

  const onRedeem = async () => {
    const data = await writeContract({
      address: chainSC.BasicIssuanceModuleAddress as `0x${string}`,
      abi: IBasicIssuanceModuleABI,
      functionName: "redeem",
      args: [setToken_chainA, _quantityA, address as `0x${string}`],
    });
    console.log(data);
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
          <Button>Invest in Strategy</Button>
        </Box>
        <Box mt="4">
          <Button onClick={onApproveAllowance}>Approve Allowance</Button>
        </Box>
        <Box mt="4">
          <Button onClick={onIssue}>Issue Token</Button>
        </Box>
        <Box mt="4">
          <Button onClick={onRedeem}>Redeem Token</Button>
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
