
from web3 import Web3
import json
import time
import datetime
import requests

# Sampl URL
url = "https://jsonplaceholder.typicode.com/posts/1"
response = requests.get(url)
response_json = response.json()
print(response_json)


node = "https://polygon-mainnet.infura.io/v3/137b9b70028244619ced61045692f077"
web3Polygon = Web3(Web3.HTTPProvider(node))

lpAddress = web3Polygon.toChecksumAddress("0x45dDa9cb7c25131DF268515131f647d726f50608")
print(lpAddress)
