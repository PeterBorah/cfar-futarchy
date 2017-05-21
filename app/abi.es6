var Web3 =require('web3')

const ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://138.197.103.96:8545"));
var smartContractAddress =  '0x118f0ed1334cb0d98d91bfa6fdde4ba1426fd55d';
var smartContractAbi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "description",
          "type": "string"
        }
      ],
      "name": "getProposalByDesc",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "description",
          "type": "string"
        }
      ],
      "name": "createProposal",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "getProposals",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getProposalByCount",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "oracle",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "getCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_oracle",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "constructor"
    }
    ]

ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[0];
const smartContract = ETHEREUM_CLIENT.eth.contract(smartContractABI).at(smartContractAddress);
export {ETHEREUM_CLIENT, smartContract};