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
				//setup('', '', '');
			//	break;
			case "3":
				setup('0x12618e2653f6606763e4d9f92D2F7777B5c2bc0F', '0xF172F9c06BdcF82524bc972FdCd1eF3a78726c86', '0xCD45A142d109BBC8b22Ff6028614027D1dB4E32F', '000000000000000000000000F172F9c06BdcF82524bc972FdCd1eF3a78726c8600000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020');
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
let gameContract;
let gameInstance;
let p3xContract;
let p3xInstance;
let bytes;

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
	checkButtons();
	//populateField();
	//getLatestWins();
}

async function createUnitCards() {
	let accounts = await promisify(cb => web3.eth.getAccounts(cb));
	
	let startId = 0;
	let beings = await promisify(cb => gameInstance.getAliveBeings(startId, cb));
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

function play() {
	el('#vaultSwitch').checked ? playBank() : playWallet();
}

function playWallet() {
	p3xInstance.transfer(address, web3.toWei(el('#games').value, 'ether'), '0x' + bytes + '0000000000000000000000000000000000000000000000000000000000000000', function(error, result){
		if(!error) {
			onTxSent(result);
		}
	})
}

function playBank() {
	gameInstance.playWithBalance(web3.toWei(el('#games').value, 'ether'), function(error, result){
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

async function checkButtons() {
	if(txHash != null) {
		let mined = await isMined(txHash);
		if(!mined) {
			return;
		}
	}
	let accounts = await promisify(cb => web3.eth.getAccounts(cb));
	let creation = await promisify(cb => gameInstance.creations(accounts[0], cb));
	if(creation[2] && !finished) {
		el('#play').hidden = true;
	} else {
		el('#play').hidden = false;
	}
}

async function isMined() {
	let txInfo = await promisify(cb => web3.eth.getTransaction(txHash, cb));
	if (txInfo != null && txInfo.blockNumber != null) {
		let blockNumber = await promisify(cb => web3.eth.getBlockNumber(cb));
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
		let spin = await promisify(cb => gameInstance.mySpin(cb));
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

function withdrawDividends() {
	hubInstance.withdrawDividends(function(error, result){
	})
}

function withdrawFunds() {
	hubInstance.withdrawFundingBalancePartial(web3.toWei(el('#fund').value, 'ether'), function(error, result){
	})
}

function validate() {
	gameInstance.resolveSpin(function(error, result){
		if(!error) {
			el('#validate').hidden = true;
			el('#result').innerHTML  = "Validating...";
		}
	})
}

function fund() {
	p3xInstance.transfer(address, web3.toWei(el('#fund').value, 'ether'), '', function(error, result){
	})
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
		el('#result').innerHTML = "WIN: " + ((multiplier * 10) * (getSelectedAmount() * 10) / (100)) + " P3X!";
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
	let accounts = await promisify(cb => web3.eth.getAccounts(cb));
	let playerBalance = await promisify(cb => p3xInstance.myBalance(cb));
	
	el('#playerWallet').innerHTML = web3.fromWei(playerBalance).toFixed(2) + ' P3X';
		
	let player = await promisify(cb => hubInstance.players(accounts[0], cb));
	
	el('#playerBank').innerHTML = web3.fromWei(player[0]).toFixed(2) + ' P3X';
	if(player[0] > 0) {
		el('#withdraw').hidden = false;
	} else {
		el('#withdraw').hidden = true;
	}
	
	el('#contribution').innerHTML = web3.fromWei(player[1]).toFixed(2) + ' P3X';
	
	let totalFundingBalances = await promisify(cb => hubInstance.totalFundingBalances(cb));
	
	el('#fundedtotal').innerHTML = web3.fromWei(totalFundingBalances).toFixed(2) + ' P3X';
	
	if(player[1] > 0) {
		el('#withdrawfundsbutton').hidden = false;
	} else {
		el('#withdrawfundsbutton').hidden = true;
	}
	
	let totalTokenBalance = await promisify(cb => hubInstance.totalSupply(cb));
	
	el('#tokenstotal').innerHTML = web3.fromWei(totalTokenBalance).toFixed(2);
	
	let shareholder = await promisify(cb => hubInstance.shareholders(accounts[0], cb));
	
	el('#mytokens').innerHTML = web3.fromWei(shareholder[0]).toFixed(2);
	
	el('#mydividends').innerHTML = web3.fromWei(shareholder[1]).toFixed(4) + ' ETH';
	
	if(shareholder[1] > 0) {
		el('#withdrawdividendsbutton').hidden = false;
	} else {
		el('#withdrawdividendsbutton').hidden = true;
	}
}

async function getLatestWins() {
	let events = await promisify(cb => gameInstance.Win({}, { fromBlock: 'latest' - 10000, toBlock: 'latest' }).get(cb));
	for(let i = 0; i < events.length && i < 7; i++) {
		let theEvent = events[events.length - 1 - i].args;
		let playerAddress = theEvent.player;
		let player = await promisify(cb => hubInstance.players(playerAddress, cb));
		el('#w' + i).innerHTML = playerAddress.substring(0, 10);
		el('#a' + i).innerHTML = web3.fromWei(theEvent.amount).toFixed(2) + ' P3X';
		
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

let promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
  );

function setup(hubAddress, gameAddress, p3xAddress, data) {
	bytes = data;
	
	address = hubAddress;
	hubContract = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]);
	hubInstance = hubContract.at(address);
	
	p3xContract = web3.eth.contract([ { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" } ], "name":"dividendsOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"withdrawAfter", "type":"bool" } ], "name":"sell", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"name", "outputs":[ { "name":"", "type":"string" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"spender", "type":"address" }, { "name":"value", "type":"uint256" } ], "name":"approve", "outputs":[ { "name":"", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"gauntletTypeOf", "outputs":[ { "name":"stakeAmount", "type":"uint256" }, { "name":"gType", "type":"uint256" }, { "name":"end", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"ethereumToSpend", "type":"uint256" } ], "name":"calculateTokensReceived", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"totalSupply", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"ethToReinvest", "type":"uint256" } ], "name":"reinvestPartial", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"tokensToSell", "type":"uint256" } ], "name":"calculateEthereumReceived", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"from", "type":"address" }, { "name":"to", "type":"address" }, { "name":"value", "type":"uint256" } ], "name":"transferFrom", "outputs":[ { "name":"success", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"to", "type":"address" }, { "name":"ignore", "type":"bool" } ], "name":"ignoreTokenFallback", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"decimals", "outputs":[ { "name":"", "type":"uint8" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myDividends", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"extGauntlet", "type":"address" } ], "name":"acquireExternalGauntlet", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"withdraw", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myGauntletType", "outputs":[ { "name":"stakeAmount", "type":"uint256" }, { "name":"gType", "type":"uint256" }, { "name":"end", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"referrerName", "type":"string" } ], "name":"buy", "outputs":[ { "name":"", "type":"uint256" } ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"allowIgnoreTokenFallback", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"stakingRequirement", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"includeReferralBonus", "type":"bool" } ], "name":"myDividends", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"r", "type":"uint256" } ], "name":"setReferralRequirement", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"lastTotalBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"balanceOf", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" }, { "name":"includeReferralBonus", "type":"bool" } ], "name":"dividendsOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" } ], "name":"refBonusOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"refHandlerAddress", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"symbol", "outputs":[ { "name":"", "type":"string" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"gType", "type":"uint8" }, { "name":"end", "type":"uint256" } ], "name":"acquireGauntlet", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"donateDividends", "outputs":[ ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":false, "inputs":[ { "name":"ref", "type":"address" } ], "name":"setReferrer", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"n", "type":"string" }, { "name":"s", "type":"string" } ], "name":"rebrand", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"totalBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"shitCoin", "type":"address" } ], "name":"takeShitcoin", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myRefBonus", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"ethToReinvest", "type":"uint256" }, { "name":"withdrawAfter", "type":"bool" } ], "name":"reinvestPartial", "outputs":[ { "name":"tokensCreated", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"refName", "type":"string" } ], "name":"setReferrer", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"to", "type":"address" }, { "name":"value", "type":"uint256" }, { "name":"data", "type":"bytes" } ], "name":"transfer", "outputs":[ { "name":"", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"from", "type":"address" }, { "name":"value", "type":"uint256" }, { "name":"data", "type":"bytes" } ], "name":"tokenFallback", "outputs":[ ], "payable":false, "stateMutability":"pure", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"", "type":"address" } ], "name":"savedReferral", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"sugardaddy", "type":"address" }, { "name":"spender", "type":"address" } ], "name":"allowance", "outputs":[ { "name":"remaining", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" } ], "name":"sell", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"exit", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"usableBalanceOf", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"refName", "type":"string" } ], "name":"getAddressFromReferralName", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ ], "name":"acceptNewOwner", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"referrerAddress", "type":"address" } ], "name":"buy", "outputs":[ { "name":"", "type":"uint256" } ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"baseHourglass", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myUsableBalance", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"o", "type":"address" } ], "name":"setNewOwner", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"reinvest", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "inputs":[ { "name":"h", "type":"address" }, { "name":"p", "type":"address" } ], "payable":false, "stateMutability":"nonpayable", "type":"constructor" }, { "payable":true, "stateMutability":"payable", "type":"fallback" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"tokenOwner", "type":"address" }, { "indexed":true, "name":"spender", "type":"address" }, { "indexed":false, "name":"tokens", "type":"uint256" } ], "name":"Approval", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"from", "type":"address" }, { "indexed":true, "name":"to", "type":"address" }, { "indexed":false, "name":"value", "type":"uint256" } ], "name":"Transfer", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"from", "type":"address" }, { "indexed":true, "name":"to", "type":"address" }, { "indexed":false, "name":"value", "type":"uint256" }, { "indexed":true, "name":"data", "type":"bytes" } ], "name":"Transfer", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"ethereumSpent", "type":"uint256" }, { "indexed":false, "name":"tokensCreated", "type":"uint256" }, { "indexed":false, "name":"tokensGiven", "type":"uint256" }, { "indexed":true, "name":"referrer", "type":"address" }, { "indexed":true, "name":"bitFlags", "type":"uint8" } ], "name":"onTokenPurchase", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"tokensDestroyed", "type":"uint256" }, { "indexed":false, "name":"ethereumEarned", "type":"uint256" } ], "name":"onTokenSell", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"earningsWithdrawn", "type":"uint256" }, { "indexed":false, "name":"refBonusWithdrawn", "type":"uint256" }, { "indexed":true, "name":"reinvestment", "type":"bool" } ], "name":"onWithdraw", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"donator", "type":"address" }, { "indexed":false, "name":"ethereumDonated", "type":"uint256" } ], "name":"onDonatedDividends", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"strongHands", "type":"address" }, { "indexed":false, "name":"stakeAmount", "type":"uint256" }, { "indexed":true, "name":"gauntletType", "type":"uint8" }, { "indexed":false, "name":"end", "type":"uint256" } ], "name":"onGauntletAcquired", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"strongHands", "type":"address" }, { "indexed":false, "name":"stakeAmount", "type":"uint256" }, { "indexed":true, "name":"extGauntlet", "type":"address" } ], "name":"onExternalGauntletAcquired", "type":"event" } ]);
	p3xInstance = p3xContract.at(p3xAddress);
	
	gameContract = web3.eth.contract([ { "constant": true, "inputs": [], "name": "beingsAlive", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalDividendPoints", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beingsDied", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "value", "type": "uint256" } ], "name": "playWithBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "beings", "outputs": [ { "name": "creator", "type": "address" }, { "name": "honor", "type": "uint256" }, { "name": "alive", "type": "bool" }, { "name": "fighting", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creations", "outputs": [ { "name": "numberOfBeings", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "openBattles", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "COST_PER_BEING", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "resolveCreation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalHonor", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalRefunds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "battles", "outputs": [ { "name": "numberOfFights", "type": "uint256" }, { "name": "creationBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "attackerIds", "type": "uint256[]" }, { "name": "defenderIds", "type": "uint256[]" } ], "name": "createBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "battlesCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "creators", "outputs": [ { "name": "totalHonor", "type": "uint256" }, { "name": "lastDividendPoints", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "beingsCreated", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "battleId", "type": "uint256" } ], "name": "resolveBattle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "refunds", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "startId", "type": "uint256" } ], "name": "getAliveBeings", "outputs": [ { "name": "firstAliveId", "type": "uint256" }, { "name": "ids", "type": "uint256[]" }, { "name": "creator", "type": "address[]" }, { "name": "honor", "type": "uint256[]" }, { "name": "fighting", "type": "bool[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "uiDevAddress", "type": "address" } ], "name": "setUiDev", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "gameHubAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfBeings", "type": "uint256" } ], "name": "StartCreation", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "honor", "type": "uint256" } ], "name": "CreateBeing", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "creatorAddress", "type": "address" }, { "indexed": false, "name": "numberOfFights", "type": "uint256" } ], "name": "CreateBattle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "winningPlayer", "type": "address" }, { "indexed": true, "name": "losingPlayer", "type": "address" }, { "indexed": false, "name": "winnerId", "type": "uint256" }, { "indexed": false, "name": "attackerId", "type": "uint256" } ], "name": "ResolveFight", "type": "event" } ]);
	gameInstance = gameContract.at(gameAddress);
}