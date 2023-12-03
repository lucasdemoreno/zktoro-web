export function createPythonFileContent(
  strategyLines: string,
  setToken_chainA: string,
  setToken_chainB: string
): string {
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

def swap(sourceChain, destChain, setTokenSourceChain, sendTokenSourceChain, sendQuantitySourceChain, receiveTokenSourceChain, minReceiveQuantitySourceChain, poolFeeSourceChain):
    aaClientSwapEndpoint = 'http://43.156.169.122/swap'
    swapBody = {
        sourceChain: sourceChain,
        destChain: destChain,

        setTokenSourceChain: setTokenAvalanche,
        sendTokenSourceChain: sendTokenSourceChain,
        sendQuantitySourceChain: sendQuantitySourceChain,
        receiveTokenSourceChain: receiveTokenSourceChain,
        minReceiveQuantitySourceChain: minReceiveQuantitySourceChain,
        poolFeeSourceChain: poolFeeSourceChain,
    }

    swapResponse = requests.post(aaClientSwapEndpoint, json = swapBody)
    return swapResponse.text

def send(sourceChain, destChain, setTokenDestChain, sendTokenDestChain, receiveTokenDestChain, sendQuantityDestChain, minReceiveTokenQuantityDestChain, poolFeeDestChain, lockReleaseTokenDestChain, lockReleaseQuantity, destActionType, setTokenSourceChain, lockReleaseTokenSourceChain, useLink):
    aaClientSendEndpoint = 'http://43.156.169.122/lockAndSend'
    sendBody = {
        sourceChain: sourceChain,
        destChain: destChain,

        setTokenDestChain: setTokenDestChain,
        sendTokenDestChain: sendTokenDestChain,
        receiveTokenDestChain:receiveTokenDestChain,
        sendQuantityDestChain: sendQuantityDestChain,
        minReceiveTokenQuantityDestChain: minReceiveTokenQuantityDestChain,
        poolFeeDestChain: poolFeeDestChain,
        lockReleaseTokenDestChain: lockReleaseTokenDestChain,
        lockReleaseQuantity: lockReleaseQuantity,

        destActionType: destActionType,

        setTokenSourceChain: setTokenSourceChain,
        lockReleaseTokenSourceChain: lockReleaseTokenSourceChain,
        useLink: useLink,
    }
    swapResponse = requests.post(aaClientSendEndpoint, json = sendBody)
    return swapResponse.text

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

        ${strategyLines}
        `;
}
