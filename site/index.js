let display = null;

let tabs = {
	elements: {},
	show: {
		shareholders: () => {
			display.innerHTML = `todo: show ranked share balances and trading options`;
		},
		proposal: () => {
			display.innerHTML = `todo: show current proposal and options`;
		},
		upcoming: () => {
			display.innerHTML = `todo: show proposed proposals and options`;
		}
	}
};

function main(){
	console.log("hello!");

	display = document.getElementById("current-tab");
	
	tabs.elements.shareholders = document.getElementById("shareholders");
	tabs.elements.proposal = document.getElementById("active-proposal");
	tabs.elements.upcoming = document.getElementById("pending-proposals");
	
	console.log(tabs);

	for(let tabName in tabs.elements){
		tabs.elements[tabName].addEventListener("click",	tabs.show[tabName]);
	}
}

onload = main;

