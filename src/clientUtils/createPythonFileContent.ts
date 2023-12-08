import { getChainById } from "@/providers/ProgramProvider/Tokens";

export function createPythonFileContent(
  strategyLines: string,
  setToken_chainA: string,
  setToken_chainB: string,
  chainAId: number,
  chainBId: number
): string {
  let tokenPolyLine = "";
  let tokenSepoliaLine = "";
  if (getChainById(chainAId)?.name === "Mumbai") {
    tokenPolyLine = `SetTokenPoly = web3Polygon.toChecksumAddress("${setToken_chainA}")`;
    tokenSepoliaLine = `SetTokenSepolia =  web3Sepolia.toChecksumAddress("${setToken_chainB}")`;
  } else if (getChainById(chainAId)?.name === "Sepolia") {
    tokenPolyLine = `SetTokenPoly = web3Polygon.toChecksumAddress("${setToken_chainB}")`;
    tokenSepoliaLine = `SetTokenSepolia =  web3Sepolia.toChecksumAddress("${setToken_chainA}")`;
  }

  return `
from web3 import Web3
import json
import time
import datetime
import requests

print('Hola')
abiStr = open('UniswapV3PoolABI.json')
abiStrERC20 = open('IERC20ABI.json')

ABI  = json.load(abiStr)
ERC20ABI = json.load(abiStrERC20)

node = "https://eth-sepolia.g.alchemy.com/v2/xgG70EO9jR4qvetrg-kyY5KDe0Ut1Xyg"
web3Sepolia = Web3(Web3.HTTPProvider(node))

node = "https://polygon-mumbai.g.alchemy.com/v2/oCg7K_rQwFRVdDpFHhBtm5OcH-FZV_kW"
web3Polygon = Web3(Web3.HTTPProvider(node))


${tokenPolyLine}
${tokenSepoliaLine}

lpAddress = web3Polygon.toChecksumAddress("0x83f585ab2ff318fd563b6d5d5e78ba966830b5bb")
lpContractPoly = web3Polygon.eth.contract(address = lpAddress, abi = ABI)

lpAddress = web3Sepolia.toChecksumAddress("0xeCb2CCa2Bde44f390366A0cd2CE7ce3d35c81c70")
lpContractSepolia = web3Sepolia.eth.contract(address = lpAddress, abi = ABI)


def swap(sourceChain, destChain, setTokenSourceChain, sendTokenSourceChain, sendQuantitySourceChain, receiveTokenSourceChain, minReceiveQuantitySourceChain, poolFeeSourceChain, circomProof, circomProofSignal):
    aaClientSwapEndpoint = 'http://43.156.147.65:8001/swap'
    swapBody = {
        "sourceChain": sourceChain,
        "destChain": destChain,

        "setTokenSourceChain": setTokenSourceChain,
        "sendTokenSourceChain": sendTokenSourceChain,
        "sendQuantitySourceChain": sendQuantitySourceChain,
        "receiveTokenSourceChain": receiveTokenSourceChain,
        "minReceiveQuantitySourceChain": minReceiveQuantitySourceChain,
        "poolFeeSourceChain": poolFeeSourceChain,
        "zkproof": circomProof,
        "zkproofSignal": circomProofSignal,
    }

    swapResponse = requests.post(aaClientSwapEndpoint, json = swapBody)
    return swapResponse.text

def send(sourceChain, destChain, setTokenDestChain, sendTokenDestChain, receiveTokenDestChain, sendQuantityDestChain, minReceiveTokenQuantityDestChain, poolFeeDestChain, lockReleaseTokenDestChain, lockReleaseQuantity, destActionType, setTokenSourceChain, lockReleaseTokenSourceChain, useLink, circomProof, circomProofSignal):
    aaClientSendEndpoint = 'http://43.156.147.65:8001/lockAndSend'
    sendBody = {
        "sourceChain": sourceChain,
        "destChain": destChain,

        "setTokenDestChain": setTokenDestChain,
        "sendTokenDestChain": sendTokenDestChain,
        "receiveTokenDestChain":receiveTokenDestChain,
        "sendQuantityDestChain": sendQuantityDestChain,
        "minReceiveTokenQuantityDestChain": minReceiveTokenQuantityDestChain,
        "poolFeeDestChain": poolFeeDestChain,
        "lockReleaseTokenDestChain": lockReleaseTokenDestChain,
        "lockReleaseQuantity": lockReleaseQuantity,

        "destActionType": destActionType,

        "setTokenSourceChain": setTokenSourceChain,
        "lockReleaseTokenSourceChain": lockReleaseTokenSourceChain,
        "zkproof": circomProof,
        "zkproofSignal": circomProofSignal,
        "useLink": useLink,
    }
    swapResponse = requests.post(aaClientSendEndpoint, json = sendBody)
    return swapResponse.text

def runcircom(deviation, threshold):
    circomEndpoint = 'http://43.156.147.65:8001/runcircom'
    circomBody = { "deviation": deviation, "threshold": threshold }

    circomResponse = requests.post(circomEndpoint, json = circomBody)
    print(circomResponse.status_code)
    return circomResponse.json()

setTokenPoly = web3Polygon.eth.contract(address = SetTokenPoly,abi =  ERC20ABI)
setTokenSepolia = web3Sepolia.eth.contract(address = SetTokenSepolia,abi =  ERC20ABI)

## Only if invested !
if setTokenPoly.functions.totalSupply().call() > 0 and setTokenSepolia.functions.totalSupply().call() > 0 :

    print("Check at ", datetime.datetime.now())
    ## Price Feed
    slot0 = lpContractPoly.functions.slot0().call()
    slot0 = lpContractPoly.functions.slot0().call()
    MumbaiPrice = 1/(slot0[0]/(2**96))**2

    print("Polygon Price: ",MumbaiPrice)
    slot0 = lpContractSepolia.functions.slot0().call()
    SepoliaPrice = (slot0[0]/(2**96))**2
    print("Sepolia price ",SepoliaPrice)

    ${strategyLines}
    `;
}
