window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
		let provider = new ethers.providers.Web3Provider(web3.currentProvider);
        window.web3 = new Web3(provider);
        try {
            // Request account access if needed
            await ethereum.enable();
			
			let network = await provider.getNetwork();
			console.log(network);
			switch (network.name) {
			case "ropsten":
				break;																																																																							   											
			default:																																																																							   										
				alert('Switch to Ropsten to play Slots!');
			}
			
			gameLoop();
			provider.on('block', (blockNumber) => {
				gameLoop(blockNumber);
			});
			
			} catch (error) {
					console.log(error);
					alert('Reload this page and enable access to use this dapp!');
			}
    }
    // Non-dapp browsers...
    else {
        alert('Please enable MetaMask or visit this page in a Web3 browser to interact with the Game');
    }
});

let el = function(id){ return document.querySelector(id);};

function gameLoop() {
	console.log(blockNumber);
}

function setup(hubAddress, slotsAddress, p3xAddress, data) {
	bytes = data;
	
	address = hubAddress;
	hubContract = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "gameAddress", "type": "address" } ], "name": "addGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "addPlayerBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "amount", "type": "uint256" } ], "name": "addShareholderTokens", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "gameAddress", "type": "address" } ], "name": "removeGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "value", "type": "uint256" } ], "name": "subPlayerBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "player", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "data", "type": "bytes" } ], "name": "tokenFallback", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "howMuch", "type": "uint256" } ], "name": "withdrawBalancePartial", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawDividends", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawFundingBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "howMuch", "type": "uint256" } ], "name": "withdrawFundingBalancePartial", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Withdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "funder", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Fund", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "WithdrawFunding", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "game", "type": "address" } ], "name": "AddGame", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "game", "type": "address" } ], "name": "RemoveGame", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": true, "name": "amount", "type": "uint256" } ], "name": "Mint", "type": "event" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "games", "outputs": [ { "name": "registered", "type": "bool" }, { "name": "amountGiven", "type": "uint256" }, { "name": "amountTaken", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "numberOfGames", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "players", "outputs": [ { "name": "balance", "type": "uint256" }, { "name": "fundingBalance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "shareholders", "outputs": [ { "name": "tokens", "type": "uint256" }, { "name": "outstandingDividends", "type": "uint256" }, { "name": "lastDividendPoints", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalFundingBalances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalOutstandingDividends", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalPlayerBalances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]);
	hubInstance = hubContract.at(address);
	
	p3xContract = web3.eth.contract([ { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" } ], "name":"dividendsOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"withdrawAfter", "type":"bool" } ], "name":"sell", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"name", "outputs":[ { "name":"", "type":"string" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"spender", "type":"address" }, { "name":"value", "type":"uint256" } ], "name":"approve", "outputs":[ { "name":"", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"gauntletTypeOf", "outputs":[ { "name":"stakeAmount", "type":"uint256" }, { "name":"gType", "type":"uint256" }, { "name":"end", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"ethereumToSpend", "type":"uint256" } ], "name":"calculateTokensReceived", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"totalSupply", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"ethToReinvest", "type":"uint256" } ], "name":"reinvestPartial", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"tokensToSell", "type":"uint256" } ], "name":"calculateEthereumReceived", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"from", "type":"address" }, { "name":"to", "type":"address" }, { "name":"value", "type":"uint256" } ], "name":"transferFrom", "outputs":[ { "name":"success", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"to", "type":"address" }, { "name":"ignore", "type":"bool" } ], "name":"ignoreTokenFallback", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"decimals", "outputs":[ { "name":"", "type":"uint8" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myDividends", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"extGauntlet", "type":"address" } ], "name":"acquireExternalGauntlet", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"withdraw", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myGauntletType", "outputs":[ { "name":"stakeAmount", "type":"uint256" }, { "name":"gType", "type":"uint256" }, { "name":"end", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"referrerName", "type":"string" } ], "name":"buy", "outputs":[ { "name":"", "type":"uint256" } ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"allowIgnoreTokenFallback", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"stakingRequirement", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"includeReferralBonus", "type":"bool" } ], "name":"myDividends", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"r", "type":"uint256" } ], "name":"setReferralRequirement", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"lastTotalBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"balanceOf", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" }, { "name":"includeReferralBonus", "type":"bool" } ], "name":"dividendsOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"customerAddress", "type":"address" } ], "name":"refBonusOf", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"refHandlerAddress", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"symbol", "outputs":[ { "name":"", "type":"string" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" }, { "name":"gType", "type":"uint8" }, { "name":"end", "type":"uint256" } ], "name":"acquireGauntlet", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"donateDividends", "outputs":[ ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":false, "inputs":[ { "name":"ref", "type":"address" } ], "name":"setReferrer", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"n", "type":"string" }, { "name":"s", "type":"string" } ], "name":"rebrand", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"totalBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"shitCoin", "type":"address" } ], "name":"takeShitcoin", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myRefBonus", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"ethToReinvest", "type":"uint256" }, { "name":"withdrawAfter", "type":"bool" } ], "name":"reinvestPartial", "outputs":[ { "name":"tokensCreated", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"refName", "type":"string" } ], "name":"setReferrer", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"to", "type":"address" }, { "name":"value", "type":"uint256" }, { "name":"data", "type":"bytes" } ], "name":"transfer", "outputs":[ { "name":"", "type":"bool" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"from", "type":"address" }, { "name":"value", "type":"uint256" }, { "name":"data", "type":"bytes" } ], "name":"tokenFallback", "outputs":[ ], "payable":false, "stateMutability":"pure", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myBalance", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"", "type":"address" } ], "name":"savedReferral", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"sugardaddy", "type":"address" }, { "name":"spender", "type":"address" } ], "name":"allowance", "outputs":[ { "name":"remaining", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"amount", "type":"uint256" } ], "name":"sell", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"exit", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":true, "inputs":[ { "name":"accountHolder", "type":"address" } ], "name":"usableBalanceOf", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ { "name":"refName", "type":"string" } ], "name":"getAddressFromReferralName", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ ], "name":"acceptNewOwner", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ { "name":"referrerAddress", "type":"address" } ], "name":"buy", "outputs":[ { "name":"", "type":"uint256" } ], "payable":true, "stateMutability":"payable", "type":"function" }, { "constant":true, "inputs":[ ], "name":"baseHourglass", "outputs":[ { "name":"", "type":"address" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":true, "inputs":[ ], "name":"myUsableBalance", "outputs":[ { "name":"balance", "type":"uint256" } ], "payable":false, "stateMutability":"view", "type":"function" }, { "constant":false, "inputs":[ { "name":"o", "type":"address" } ], "name":"setNewOwner", "outputs":[ ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "constant":false, "inputs":[ ], "name":"reinvest", "outputs":[ { "name":"", "type":"uint256" } ], "payable":false, "stateMutability":"nonpayable", "type":"function" }, { "inputs":[ { "name":"h", "type":"address" }, { "name":"p", "type":"address" } ], "payable":false, "stateMutability":"nonpayable", "type":"constructor" }, { "payable":true, "stateMutability":"payable", "type":"fallback" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"tokenOwner", "type":"address" }, { "indexed":true, "name":"spender", "type":"address" }, { "indexed":false, "name":"tokens", "type":"uint256" } ], "name":"Approval", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"from", "type":"address" }, { "indexed":true, "name":"to", "type":"address" }, { "indexed":false, "name":"value", "type":"uint256" } ], "name":"Transfer", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"from", "type":"address" }, { "indexed":true, "name":"to", "type":"address" }, { "indexed":false, "name":"value", "type":"uint256" }, { "indexed":true, "name":"data", "type":"bytes" } ], "name":"Transfer", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"ethereumSpent", "type":"uint256" }, { "indexed":false, "name":"tokensCreated", "type":"uint256" }, { "indexed":false, "name":"tokensGiven", "type":"uint256" }, { "indexed":true, "name":"referrer", "type":"address" }, { "indexed":true, "name":"bitFlags", "type":"uint8" } ], "name":"onTokenPurchase", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"tokensDestroyed", "type":"uint256" }, { "indexed":false, "name":"ethereumEarned", "type":"uint256" } ], "name":"onTokenSell", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"accountHolder", "type":"address" }, { "indexed":false, "name":"earningsWithdrawn", "type":"uint256" }, { "indexed":false, "name":"refBonusWithdrawn", "type":"uint256" }, { "indexed":true, "name":"reinvestment", "type":"bool" } ], "name":"onWithdraw", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"donator", "type":"address" }, { "indexed":false, "name":"ethereumDonated", "type":"uint256" } ], "name":"onDonatedDividends", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"strongHands", "type":"address" }, { "indexed":false, "name":"stakeAmount", "type":"uint256" }, { "indexed":true, "name":"gauntletType", "type":"uint8" }, { "indexed":false, "name":"end", "type":"uint256" } ], "name":"onGauntletAcquired", "type":"event" }, { "anonymous":false, "inputs":[ { "indexed":true, "name":"strongHands", "type":"address" }, { "indexed":false, "name":"stakeAmount", "type":"uint256" }, { "indexed":true, "name":"extGauntlet", "type":"address" } ], "name":"onExternalGauntletAcquired", "type":"event" } ]);
	p3xInstance = p3xContract.at(p3xAddress);
	
	slotsContract = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "playerAddress", "type": "address" }, { "name": "totalBetValue", "type": "uint256" }, { "name": "gameData", "type": "bytes" } ], "name": "play", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "totalBetValue", "type": "uint256" }, { "name": "betValue", "type": "uint256" } ], "name": "playWithBalance", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "resolveSpin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newMaxBet", "type": "uint256" } ], "name": "setMaxBet", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "gameHubAddress", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "reel1", "type": "uint256" }, { "indexed": false, "name": "reel2", "type": "uint256" }, { "indexed": false, "name": "reel3", "type": "uint256" } ], "name": "Win", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "player", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Loss", "type": "event" }, { "constant": true, "inputs": [], "name": "hasActiveSpin", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxBet", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "mySpin", "outputs": [ { "name": "numberOfBets", "type": "uint256" }, { "name": "reel1", "type": "uint256[10]" }, { "name": "reel2", "type": "uint256[10]" }, { "name": "reel3", "type": "uint256[10]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "playerSpin", "outputs": [ { "name": "betValue", "type": "uint256" }, { "name": "numberOfBets", "type": "uint256" }, { "name": "startBlock", "type": "uint256" }, { "name": "open", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSpins", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]);
	slotsInstance = slotsContract.at(slotsAddress);
}