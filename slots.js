window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
		web3.reset();
        try {
            // Request account access if needed
            await ethereum.enable();
			
			let netId = await promisify(cb => web3.version.getNetwork(cb));
			switch (netId) {
			case "1":
				setup('0x399529C2a759dE7D84Fa8FAa4642cE7D5CA911e1', '0x349fD87eAf9FBA5d24e16bbB1d211B9203157A63', '000000000000000000000000349fd87eaf9fba5d24e16bbb1d211b9203157a6300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020');
				break;
			case "3":
				setup('0x00da8015c6726Df2D5928A348572c0E12297C45D', '0x507823eF6bc72f5976b35C2D43Db8f19125c3257', '0000000000000000000000002778fe166e0fb29166c8427f1999b2bc5d7366a200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020');
				break;																																																																							   											
			default:																																																																							   										
				alert('Switch to Mainnet or Rinkeby to play PLincSlots!');
			}
			gameLoop();
			
			var filter = web3.eth.filter('latest');
			filter.watch(function(error, result){
			  gameLoop();
			});
			
			} catch (error) {
					console.log(error);
					alert('Reload this page and enable access to use this dapp!');
			}
    }
    // Non-dapp browsers...
    else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

let el = function(id){ return document.querySelector(id);};
let address;
let hubInstance;
let forHonorContract;
let forHonorInstance;
let bytes;
let bytes0 = '000000000000000000000000000000000000000000000000002386f26fc10000';
let bytes1 = '00000000000000000000000000000000000000000000000000b1a2bc2ec50000';
let bytes2 = '000000000000000000000000000000000000000000000000016345785d8a0000';

let txHash;

let numberOfBets;
let finished;
let index = 0;
let reel1;
let reel2;
let reel3;
let result1;
let result2;
let result3;

function gameLoop() {
	createUnitCards();
}

async function createUnitCards() {
	const beings = await promisify(cb => forHonorInstance.getAliveBeings(0, cb));
	//let firstAliveId = beings[0];
	let creator = beings[1];
	let honor = beings[2];
	let fighting = beings[3];
	
	for(let i = 0; i < creator.length; i++) {
		console.log(creator[i].toNumber() + " " + honor[i].toNumber() + " " + fighting[i].toNumber());
	}
}

async function checkButtons() {
	if(txHash != null) {
		const mined = await isMined(txHash);
		if(!mined) {
			return;
		}
	}
	
	const hasActiveSpin = await promisify(cb => forHonorInstance.hasActiveSpin(cb));
	if(hasActiveSpin && !finished) {
		el('#play').hidden = true;
		el('#spin').hidden = false;
	} else {
		el('#play').hidden = false;
		el('#spin').hidden = true;
	}
}

function play() {
	el('#vaultSwitch').checked ? playBank() : playWallet();
}

function playWallet() {
	hubInstance.playGame('0x' + getBytes(), {value:web3.toWei(getTotalAmount(), 'ether')}, function(error, result){
		if(!error) {
			onTxSent(result);
		}
	})
}

function playBank() {
	forHonorInstance.playWithBalance(web3.toWei(getTotalAmount(), 'ether'), web3.toWei(getSelectedAmount(), 'ether'), function(error, result){
		if(!error) {
			onTxSent(result);
		}
	})
}

function onTxSent(result) {
	el('#result').innerHTML  = "Waiting for transaction ...";
	txHash = result;
	index = 0;
	el('#play').hidden = true;
	el('#validate').hidden = true;
}

async function isMined() {
	const txInfo = await promisify(cb => web3.eth.getTransaction(txHash, cb));
	if (txInfo != null && txInfo.blockNumber != null) {
		const blockNumber = await promisify(cb => web3.eth.getBlockNumber(cb));
		el('#result').innerHTML  = "Waiting for next block ...";
		if(blockNumber > txInfo.blockNumber) {
			finished = false;
			txHash = null;
			el('#result').innerHTML  = "";
			return true;
		}
	} 
	return false;
}

async function spin() {
	el('#spin').disabled = true;
	if(index == 0) {
		finished = false;
		const spin = await promisify(cb => forHonorInstance.mySpin(cb));
		numberOfBets = spin[0];
		reel1 = spin[1];
		reel2 = spin[2];
		reel3 = spin[3];
	}

	el('#result').innerHTML  = "";
	
	result1 = reel1[index].toNumber();
	result2 = reel2[index].toNumber();
	result3 = reel3[index].toNumber();
	
	index++;
	
	startSpin();
}

function withdraw() {
	hubInstance.withdrawBalance(function(error, result){
	})
}

function withdrawFunds() {
	hubInstance.withdrawFundingBalancePartial(web3.toWei(el('#fund').value, 'ether'), function(error, result){
	})
}

function validate() {
	forHonorInstance.resolveSpin(function(error, result){
		if(!error) {
			el('#validate').hidden = true;
			el('#result').innerHTML  = "Validating...";
		}
	})
}

function buyName() {
	hubInstance.registerName(el('#vanity').value, {value:web3.toWei(0.01, 'ether')}, function(error, result){
	})
}

function fund() {
	hubInstance.fund({value:web3.toWei(el('#fund').value, 'ether')}, function(error, result){
	})
}

function getSelectedAmount() {
	return el('#dotone').checked ? 0.1 : el('#dotzerofive').checked ? 0.05 : 0.01;
}

function getTotalAmount() {
	return getSelectedAmount() * el('#games').value;
}

function getBytes() {
	return bytes + (el('#dotone').checked ? bytes2 : (el('#dotzerofive').checked ? bytes1 : bytes0));
}

function calcWin() {
	let multiplier = 0;
	if(result1 + result2 + result3 == 0) {
		multiplier = 20;
    } else if(result1 == result2 && result1 == result3) {
		multiplier = 7;
    } else if(result1 + result2 == 0 || result1 + result3 == 0 || result2 + result3 == 0) {
       multiplier = 2;
    } else if(result1 == 0 || result2 == 0 || result3 == 0) {
       multiplier = 1;
    }
	
	if(multiplier != 0) {
		el('#result').innerHTML = "WIN: " + ((multiplier * 10) * (getSelectedAmount() * 10) / (100)) + " ETH!";
	} else {
		el('#result').innerHTML = "";
	}
	
	if(index == numberOfBets) {
		finished = true;
		el('#play').hidden = false;
		el('#spin').hidden = true;
		el('#validate').hidden = false;
	}
}

async function populateField() {
	const accounts = await promisify(cb => web3.eth.getAccounts(cb));
	const playerBalance = await promisify(cb => web3.eth.getBalance(accounts[0], cb));
	
	el('#playerWallet').innerHTML = web3.fromWei(playerBalance).toFixed(4) + ' ETH';
	
	const player = await promisify(cb => hubInstance.players(accounts[0], cb));
	
	el('#playerBank').innerHTML = web3.fromWei(player[0]).toFixed(2) + ' ETH';
	if(player[0] > 0) {
		el('#withdraw').hidden = false;
	} else {
		el('#withdraw').hidden = true;
	}
	
	el('#playername').innerHTML = player[1] != "" ? player[1] : "---";
	
	el('#contribution').innerHTML = web3.fromWei(player[2]).toFixed(2) + ' ETH';
	
	const totalFundingBalances = await promisify(cb => hubInstance.totalFundingBalances(cb));
	
	el('#fundedtotal').innerHTML = web3.fromWei(totalFundingBalances).toFixed(2) + ' ETH';
	
	if(player[2] > 0) {
		el('#withdrawfundsbutton').hidden= false;
	} else {
		el('#withdrawfundsbutton').hidden= true;
	}
}

async function getLatestWins() {
	const events = await promisify(cb => forHonorInstance.Win({}, { fromBlock: 'latest' - 10000, toBlock: 'latest' }).get(cb));
	for(let i = 0; i < events.length && i < 7; i++) {
		const theEvent = events[events.length - 1 - i].args;
		const playerAddress = theEvent.player;
		const player = await promisify(cb => hubInstance.players(playerAddress, cb));
		if(player[1] != "") {
				el('#w' + i).innerHTML = player[1];
		} else {
				el('#w' + i).innerHTML = playerAddress.substring(0, 10);
		}
		el('#a' + i).innerHTML = web3.fromWei(theEvent.amount).toFixed(2) + ' ETH';
		
		el('#w' + i + 'r1').className = "payoutInner slot" + theEvent.reel1 + "_s";
		el('#w' + i + 'r2').className = "payoutInner slot" + theEvent.reel2 + "_s";
		el('#w' + i + 'r3').className = "payoutInner slot" + theEvent.reel3 + "_s";
	}
}

function enableFundWithdraw() {
	if(el('#fund').value > 0) {
		el('#fundbutton').disabled = false;
		el('#withdrawfundsbutton').disabled = false;
	} else {
		el('#fundbutton').disabled = true;
		el('#withdrawfundsbutton').disabled = true;
	}
}

function enableBuyName() {
	if(el('#vanity').value != "") {
		el('#buyname').disabled = false;
	} else {
		el('#buyname').disabled = true;
	}
}

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  );

function setup(hubAddress, forHonorAddress, data) {
	bytes = data;
	
	address = hubAddress;
	hubContract = web3.eth.contract([ { "constant": false, "inputs": [], "name": "piggyToWallet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newName", "type": "string" } ], "name": "registerName", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "howMuch", "type": "uint256" } ], "name": "withdrawBalancePartial", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "subPlayerBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "percentage", "type": "uint256" } ], "name": "setAuto", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawFundingBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "plincHub", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "games", "outputs": [ { "name": "registered", "type": "bool" }, { "name": "amountGiven", "type": "uint256" }, { "name": "amountTaken", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalPlayerBalances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "string" } ], "name": "names", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "addPlayerBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "value", "type": "uint256" } ], "name": "buyBonds", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "fillBonds", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "fund", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "gameAddress", "type": "address" } ], "name": "removeGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "fetchBonds", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "data", "type": "bytes" } ], "name": "playGame", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "vaultToWallet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "howMuch", "type": "uint256" } ], "name": "withdrawFundingBalancePartial", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "value", "type": "uint256" } ], "name": "setPLincDivisor", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "gameAddress", "type": "address" } ], "name": "addGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "players", "outputs": [ { "name": "balance", "type": "uint256" }, { "name": "name", "type": "string" }, { "name": "fundingBalance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFundingBalances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numberOfGames", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "bondsOutstanding", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "plicHubAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "game", "type": "address" } ], "name": "AddGame", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "game", "type": "address" } ], "name": "RemoveGame", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": true, "name": "name", "type": "string" } ], "name": "RegisterName", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Withdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "funder", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Fund", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "WithdrawFunding", "type": "event" } ]);
	hubInstance = hubContract.at(address);
	
	forHonorContract = web3.eth.contract([ { "constant": true, "inputs": [], "name": "beingsAlive", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalDividendPoints", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "beings", "outputs": [ { "name": "creator", "type": "address" }, { "name": "honor", "type": "uint256" }, { "name": "alive", "type": "bool" }, { "name": "fighting", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creations", "outputs": [ { "name": "numberOfBeings", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "openBattles", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "COST_PER_BEING", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "resolveCreation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalHonor", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "battles", "outputs": [ { "name": "numberOfFights", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "attackerIds", "type": "uint256[]" }, { "name": "defenderIds", "type": "uint256[]" } ], "name": "createBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "battlesCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creators", "outputs": [ { "name": "totalHonor", "type": "uint256" }, { "name": "bloodlust", "type": "uint256" }, { "name": "lastDividendPoints", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beingsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "removeME", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "battleId", "type": "uint256" } ], "name": "resolveBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "startId", "type": "uint256" } ], "name": "getAliveBeings", "outputs": [ { "name": "creator", "type": "address[]" }, { "name": "honor", "type": "uint256[]" }, { "name": "fighting", "type": "bool[]" }, { "name": "firstAliveId", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "gameHubAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfBeings", "type": "uint256" } ], "name": "StartCreation", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "honor", "type": "uint256" } ], "name": "CreateBeing", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfFights", "type": "uint256" } ], "name": "CreateBattle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "winningPlayer", "type": "address" }, { "indexed": true, "name": "losingPlayer", "type": "address" }, { "indexed": false, "name": "winnerId", "type": "uint256" }, { "indexed": false, "name": "attackerId", "type": "uint256" } ], "name": "ResolveFight", "type": "event" } ]);
	forHonorInstance = forHonorContract.at(forHonorAddress);
}