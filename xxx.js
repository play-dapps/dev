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
			//case "1":
				//setup('', '', '000000000000000000000000349fd87eaf9fba5d24e16bbb1d211b9203157a6300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020');
			//	break;
			case "3":
				setup('0x12618e2653f6606763e4d9f92D2F7777B5c2bc0F', '0xF172F9c06BdcF82524bc972FdCd1eF3a78726c86', '0000000000000000000000002778fe166e0fb29166c8427f1999b2bc5d7366a200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020');
				break;																																																																							   											
			default:																																																																							   										
				alert('Switch to Ropsten to play XXX!');
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
	const accounts = await promisify(cb => web3.eth.getAccounts(cb));
	
	let startId = 0;
	const beings = await promisify(cb => forHonorInstance.getAliveBeings(startId, cb));
	//let firstAliveId = beings[0];
	let ids = beings[1];
	let creator = beings[2];
	let honor = beings[3];
	let fighting = beings[4];
	
	let othercards ='';
	let mycards ='';
	for(let i = 0; i < creator.length; i++) {
		let cardString =
		`
		<div class="column">
			<div class="card bg-primary text-white" style="width:200px">
				<div class="card-body">Being
					<p class="card-text">Creator: ${creator[i]}</p>
					<p class="card-text">Honor: ${honor[i]}</p>
					<p class="card-text">Fighting: ${fighting[i]}</p>
				</div>
			</div>
		</div>
		`;
		
		if(creator[i] = accounts[0]) {
			mycards += cardString;
		} else {
			othercards += cardString;
		}
	}
	el('#otherbeings').innerHTML = othercards;
	el('#mybeings').innerHTML = mycards;
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
	hubContract = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]);
	hubInstance = hubContract.at(address);
	
	forHonorContract = web3.eth.contract([ { "constant": true, "inputs": [], "name": "beingsAlive", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalDividendPoints", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beingsDied", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "value", "type": "uint256" } ], "name": "playWithBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "beings", "outputs": [ { "name": "creator", "type": "address" }, { "name": "honor", "type": "uint256" }, { "name": "alive", "type": "bool" }, { "name": "fighting", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creations", "outputs": [ { "name": "numberOfBeings", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "openBattles", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "COST_PER_BEING", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "resolveCreation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalHonor", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalRefunds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "battles", "outputs": [ { "name": "numberOfFights", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "attackerIds", "type": "uint256[]" }, { "name": "defenderIds", "type": "uint256[]" } ], "name": "createBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "battlesCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creators", "outputs": [ { "name": "totalHonor", "type": "uint256" }, { "name": "lastDividendPoints", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beingsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "battleId", "type": "uint256" } ], "name": "resolveBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "refunds", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "startId", "type": "uint256" } ], "name": "getAliveBeings", "outputs": [ { "name": "firstAliveId", "type": "uint256" }, { "name": "ids", "type": "uint256[]" }, { "name": "creator", "type": "address[]" }, { "name": "honor", "type": "uint256[]" }, { "name": "fighting", "type": "bool[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "uiDevAddress", "type": "address" } ], "name": "setUiDev", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "gameHubAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfBeings", "type": "uint256" } ], "name": "StartCreation", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "honor", "type": "uint256" } ], "name": "CreateBeing", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfFights", "type": "uint256" } ], "name": "CreateBattle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "winningPlayer", "type": "address" }, { "indexed": true, "name": "losingPlayer", "type": "address" }, { "indexed": false, "name": "winnerId", "type": "uint256" }, { "indexed": false, "name": "attackerId", "type": "uint256" } ], "name": "ResolveFight", "type": "event" } ]);
	forHonorInstance = forHonorContract.at(forHonorAddress);
}