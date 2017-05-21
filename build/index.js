

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Web3 = require('web3');

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://138.197.103.96:8545"));
var smartContractAddress = '0x118f0ed1334cb0d98d91bfa6fdde4ba1426fd55d';
var smartContractAbi = [{
  "constant": false,
  "inputs": [{
    "name": "description",
    "type": "string"
  }],
  "name": "getProposalByDesc",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "description",
    "type": "string"
  }],
  "name": "createProposal",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "getProposals",
  "outputs": [{
    "name": "",
    "type": "address[]"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "index",
    "type": "uint256"
  }],
  "name": "getProposalByCount",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "oracle",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "getCount",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "type": "function"
}, {
  "inputs": [{
    "name": "_oracle",
    "type": "address"
  }],
  "payable": false,
  "type": "constructor"
}];

ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[0];
var smartContract = ETHEREUM_CLIENT.eth.contract(smartContractABI).at(smartContractAddress);
exports.ETHEREUM_CLIENT = ETHEREUM_CLIENT;
exports.smartContract = smartContract;

let display = null;

let tabs = {
	elements: {},
	selected: null,
	show: {
		shareholders: () => {
			/*
			get current user address
			get list of shareholders {name, address, amount, staked}
			sort list of shareholders
			display total, personal details, then ranked list of all shareholder details
			*/
			let currentUser = "0xfakeaddresspoorlydisguisedashex";
			let shareholders = [
				["0xdeadbeef", "moohaha", 255, 127],
				["0xfakeaddresspoorlydisguisedashex", "notsatoshi", 2, 2],
				["0x1234", null, 5000, 2],
				["0x314159cake", "dessertier.eth", 7007, 7]
			]; //! demo placeholder
			let userShareInfo = null;
			let totalShareInfo = {
				count: 0,
				staked: 0
			};
			let listHtml = ``;
			for(let hodler in shareholders){
				currentHodlerHtml = `
					<div class="rowbox">
						address: ${shareholders[hodler][0]},
						nickname: ${shareholders[hodler][1]},
						shares: ${shareholders[hodler][2]},
						shares staked: ${shareholders[hodler][3]}
					</div>
				`;
				listHtml += currentHodlerHtml;
				totalShareInfo.count += shareholders[hodler][2];
				totalShareInfo.staked += shareholders[hodler][3];
				if(shareholders[hodler][0] == currentUser){
					userShareInfo = shareholders[hodler];
				}
			}
			display.innerHTML = `
				Shareholders
				<div class="colbox">
					<div class="colbox">
						Your Info
						<div class="rowbox">
							address: ${userShareInfo[0]},
							nickname: ${userShareInfo[1]},
							shares: ${userShareInfo[2]},
							shares staked: ${userShareInfo[3]}
						</div>
						Total Info
						<div class="rowbox">
							shares: ${totalShareInfo.count},
							staked: ${totalShareInfo.staked}
						</div>
					</div>
				${listHtml}
				</div>
			`;
		},
		proposal: () => {
			/*
			get current proposal {title, text, options, open/closed}
			display current proposal
				and if open voting options to stake on
				else outcome
			*/
			let currentProposal = {
				title: "Should citizens of New Zealand be banned?",
				ipfsHash: "sha256-this-is-not-what-ipfs-hashes-look-like.lolnope",
				weightedOutcome: 0.95,
				yes: [[true, 3, 10], [true, 2, 20], [true, 1, 30], [false, 4, 10], [false, 5, 20], [false, 6, 30]],
				no: [[true, 3, 10], [true, 2, 20], [true, 1, 30], [false, 4, 10], [false, 5, 20], [false, 6, 30]],
				yourYes: [[true, 3, 1], [true, 2, 2], [true, 1, 3]],
				yourNo: [[false, 4, 1], [false, 5, 2], [false, 6, 3]]
			}; //! example placeholder
			
			let strifeBar = `
				<div class="strife">
					<h1>No</h1>
					<div class="strifeBar">
						<div style="background-color:#00f;height:100%;width:${currentProposal.weightedOutcome*100}%"></div>
					</div>
					<h1>Yes</h1>
				</div>
			`;
			
			let yourActiveYesOrders = `<div class="colbox">Yes`;
			for(let orderNum in currentProposal.yourYes){
				yourActiveYesOrders += `
					<div class="rowbox">
						Type: ${currentProposal.yourYes[orderNum][0] ? "Buy" : "Sell"},
						Price: ${currentProposal.yourYes[orderNum][1]},
						Volume: ${currentProposal.yourYes[orderNum][2]}
						&nbsp;&nbsp;
						<button>Cancel</button>
					</div>
				`;
			}
			yourActiveYesOrders += `</div>`;

			let yourActiveNoOrders = `<div class="colbox">No`;
			for(let orderNum in currentProposal.yourNo){
				yourActiveNoOrders += `
					<div class="rowbox">
						Type: ${currentProposal.yourNo[orderNum][0] ? "Buy" : "Sell"},
						Price: ${currentProposal.yourNo[orderNum][1]},
						Volume: ${currentProposal.yourNo[orderNum][2]}
						&nbsp;&nbsp;
						<button>Cancel</button>
					</div>
				`;
			}
			yourActiveNoOrders += `</div>`;
			
			// prepare html of your active orders for display
			let yourActiveOrders = `
				<div class="rowbox">
					${yourActiveYesOrders}
					${yourActiveNoOrders}
				</div>
			`

			let yourOrders = `
				<div class="colbox">
					Your Orders
					<div class="rowbox">
						<form class="rowbox">
							Order Type
							<input name="orderType" type="radio">Buy</input>
							<input name="orderType" type="radio">Sell</input>
						</form>
						<input placeholder="price"></input>
						<input placeholder="volume (in ether)"></input>
						<button>Create Order</button>
					</div>
					${yourActiveOrders}<br>
				</div>
			`;

			let activeYesOrders = `<div class="colbox">Yes`;
			for(let orderNum in currentProposal.yes){
				activeYesOrders += `
					<div class="rowbox">
						Type: ${currentProposal.yes[orderNum][0] ? "Buy" : "Sell"},
						Price: ${currentProposal.yes[orderNum][1]},
						Volume: ${currentProposal.yes[orderNum][2]}
					</div>
				`;
			}
			activeYesOrders += `</div>`;

			let activeNoOrders = `<div class="colbox">No`;
			for(let orderNum in currentProposal.no){
				activeNoOrders += `
					<div class="rowbox">
						Type: ${currentProposal.no[orderNum][0] ? "Buy" : "Sell"},
						Price: ${currentProposal.no[orderNum][1]},
						Volume: ${currentProposal.no[orderNum][2]}
					</div>
				`;
			}
			activeNoOrders += `</div>`;

			let orderBooks = `
				<div class="colbox">
					Order Books
					<div class="rowbox">
						${activeYesOrders}
						${activeNoOrders}
					</div>
				</div>
			`;

			display.innerHTML = `
				<h1>${currentProposal.title}</h1>
				<h3><a href="${currentProposal.ipfsHash}">details</a></h3><br><br>
				${strifeBar}<br><br>
				${yourOrders}
				${orderBooks}
			`;
		},
		upcoming: () => {
			/*
			get available proposals {[proposals], open/closed}
			display available proposals
			display option to add proposal
			*/
			let proposals = [
				["Should we call Kim Jong Un mean names and then tell China he started it?", 47],
				["Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?", 1],
				["UASF for free money?", 0],
				["Convert to Anarcho-Statism?", 1984]
			]; //! demo placeholder
			
			let listHtml = `<div class="colbox">`;
			for(i in proposals){
				listHtml += `
					<div class="rowbox">
						Title: ${proposals[i][0]},
						Shares staked: ${proposals[i][1]}
						&nbsp;&nbsp;
						<button>Stake</button>
					</div>
				`;
			}
			listHtml += `</div>`;

			display.innerHTML = `
				Upcoming Proposals
				${listHtml}
			`;
		},
		past: () => {
			/*
			get history of proposals {[history]}
			display ordered history
			*/
			let proposals = [
				["Are we sure overthrowing democracy was a good idea?", true],
				["Are we forgetting something?", true],
				["Change utility function to expected probability of successfully creating Roko's Basilisk?", true],
				["Outlaw black markets?", false]
			]; //! demo placeholder
			
			let listHtml = `<div class="colbox">`;
			for(i in proposals){
				listHtml += `
					<div class="rowbox">
						Title: ${proposals[i][0]},
						Outcome: ${proposals[i][1]}
					</div>
				`;
			}
			listHtml += `</div>`;

			display.innerHTML = `
				Past Proposals
				${listHtml}
			`;
		},
		reporting: () => {
			/*
			get history of scores {[history]}
			display ordered score history
			*/
			let reports = [
				[4, 12.5],
				[3, 25],
				[2, 50],
				[1, 100]
			]; //! demo placeholder
			
			let listHtml = `<div class="colbox">`;
			for(i in reports){
				listHtml += `
					<div class="rowbox">
						Week: ${reports[i][0]},
						Performance: ${reports[i][1]}
					</div>
				`;
			}
			listHtml += `</div>`;

			display.innerHTML = `
				<div class="rowbox">
					Report Performance:
					<input placeholder="utility"></input>
					<button>Report</button>
				</div>
				Past Reports
				${listHtml}
			`;
		}
	}
};

function main(){
	console.log("hello!");

	display = document.getElementById("current-tab");
	
	tabs.elements.shareholders = document.getElementById("shareholders");
	tabs.elements.proposal = document.getElementById("active-proposal");
	tabs.elements.upcoming = document.getElementById("pending-proposals");
	tabs.elements.past = document.getElementById("past-proposals");
	tabs.elements.reporting = document.getElementById("reporting");
	
	for(let tabName in tabs.elements){
		tabs.elements[tabName].addEventListener("click",	() => {
			tabs.selected = tabName;
			tabs.show[tabName]();
		});
	}
}

onload = main;

