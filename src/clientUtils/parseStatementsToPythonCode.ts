import { ChainToken, Statement } from "@/providers/ProgramProvider/Statements";
import {
  USDC_Avalanche,
  WETH_Avalanche,
} from "@/providers/ProgramProvider/Tokens";
import { USDC_AVALANCHE, WETH_AVALANCHE } from "@/transactions/contracts";

function getTokensFromStatements(statements: Statement[]): {
  tokenA: ChainToken;
  tokenB: ChainToken;
} {
  console.log(statements);
  return {
    tokenA: USDC_Avalanche,
    tokenB: WETH_Avalanche,
  };
}

export function parseStatementsToPythonCode(
  statements: Statement[],
  setToken_chainA: string,
  setToken_chainB: string
): string {
  const { tokenA, tokenB } = getTokensFromStatements(statements);
  /**
     * Also consider [USDC_AVALANCHE, WETH_AVALANCHE] in Polygon
    if(![USDC_AVALANCHE, WETH_AVALANCHE].includes(tokenA) || ![USDC_AVALANCHE, WETH_AVALANCHE].includes(tokenB)) {
        throw Error('Not supported yet')
    }
     */

  // chainA, in this case is Polygon
  // chainB in this case is

  return `
from web3 import Web3
import json
import time
import datetime
abiStr = open('UniswapV3PoolABI.json')
abiStrERC20 = open('IERC20ABI.json')

ABI  = json.load(abiStr)
ERC20ABI = json.load(abiStrERC20)


SetTokenPoly = "${setToken_chainA}"
SetTokenAvalanche = "${setToken_chainB}"

node = "https://polygon-mainnet.infura.io/v3/137b9b70028244619ced61045692f077"
web3Polygon = Web3(Web3.HTTPProvider(node))

lpAddress = web3Polygon.toChecksumAddress("0x45dDa9cb7c25131DF268515131f647d726f50608")
lpContractPoly = web3Polygon.eth.contract(address = lpAddress, abi = ABI)


node = "https://avalanche-mainnet.infura.io/v3/137b9b70028244619ced61045692f077"
web3Avalanche = Web3(Web3.HTTPProvider(node))

# https://info.uniswap.org/#/avax/pools/0x43fb9c3fd6715e872272b0caab968a97692726eb
# to know more check it here
lpAddress = web3Avalanche.toChecksumAddress("0x43fb9c3fd6715e872272b0caab968a97692726eb")
lpContractAvalanche = web3Avalanche.eth.contract(address = lpAddress, abi = ABI)


polyBlock = web3Polygon.eth.block_number
AvalancheBlock = web3Avalanche.eth.block_number



setTokenPoly = web3Polygon.eth.contract(address = SetTokenPoly,abi =  ERC20ABI)
setTokenAvalanche = web3Polygon.eth.contract(address = SetTokenAvalanche,abi =  ERC20ABI)


while True:
    newPolyBlock = web3Polygon.eth.block_number
    newAvalancheBlock =  web3Avalanche.eth.block_number
    if (newPolyBlock != polyBlock):
        polyBlock = newPolyBlock
        print("New Polygon Block triggered!")
    elif (newAvalancheBlock  != AvalancheBlock):
        AvalancheBlock = newAvalancheBlock
        print("New Avalanche Block triggered!")
    else:
        time.sleep(10)
        continue
    
    ## Only if invested !
    if setTokenPoly.functions.totalSupply().call() > 0 and setTokenAvalanche.functions.totalSupply().call() > 0 :

        print("Check at ", datetime.datetime.now())
        ## Price Feed
        slot0 = lpContractPoly.functions.slot0().call()
        polygonPrice = 10**12/(slot0[0]/(2**96))**2
        
        print("Polygon Price: ",polygonPrice)
        slot0 = lpContractAvalanche.functions.slot0().call()
        AvalanchePrice = (slot0[0]/(2**96))**2*10**12
        print("Avalanche price ",AvalanchePrice)

        deviation = AvalanchePrice/polygonPrice - 1 
        print("Current Deviation ",deviation)

        ## Price Feed Done

        /*
        if( (weth_avax / weth_polygon) > 1.0005):
            
            print("Trade Signal [Signal, to, From, Token] : ",tradeSignal)
        elif ( (weth_avax / weth_polygon) <  0.9995):
            
            print("Trade Signal [Signal, to, From, Token] : ",tradeSignal)

        */

        threshold = 0.0005
        tradeSignal = 0
        if deviation > threshold:
            # Change this to a http call
            tradeSignal = [1,'Avalanche','Polygon','WETH']  # buy from Polygon sell to Avalanche
            print("Trade Signal [Signal, to, From, Token] : ",tradeSignal)
        elif deviation <  -threshold:
            # Change this to a http call
            tradeSignal = [-1,'Polygon','Avalanche','WETH']  # buy from Avalanche and sell to Polygon
            print("Trade Signal [Signal, to, From, Token] : ",tradeSignal)
    `;
}
