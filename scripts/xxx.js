let provider;
let contractAddress;
let abi;
let contract;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
		provider = new ethers.providers.Web3Provider(web3.currentProvider);
        window.web3 = new Web3(provider);
        try {
            // Request account access if needed
            await ethereum.enable();
			
			let network = await provider.getNetwork();
			switch (network.name) {
			case "ropsten":
				start();
				break;																																																																							   											
			default:																																																																							   										
				alert('Switch to Ropsten to play!');
			}
			
		} catch (error) {
			console.log(error);
			alert('Reload this page and enable access to play!');
		}
    }
    // Non-dapp browsers...
    else {
        alert('Please enable MetaMask or visit this page in a Web3 browser to play');
    }
});

let el = function(id){ return document.querySelector(id);};

function start() {
	contractAddress = '0x0F6fA64BED94596B27a6CfeFf65AA09Ec0eF0207';
	abi = '[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fightId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "defenderId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "damageDealt", "type": "uint256" } ], "name": "Attack", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fightId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "defenderId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "damageDealt", "type": "uint256" } ], "name": "CriticalHit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "Death", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "blueprintId", "type": "uint256" } ], "name": "DiscoverItem", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fightId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "defenderId", "type": "uint256" } ], "name": "DodgeAttack", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fighterId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "itemId", "type": "uint256" } ], "name": "EquipItem", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fightId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "LoseLive", "type": "event" }, { "constant": true, "inputs": [], "name": "FIGHTER_COST", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "enum PvP.ItemType", "name": "itemType", "type": "uint8" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "name": "addBlueprint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "blueprints", "outputs": [ { "internalType": "enum PvP.ItemType", "name": "itemType", "type": "uint8" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "blueprintsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "discoverItem", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" }, { "internalType": "uint256", "name": "itemId", "type": "uint256" } ], "name": "equipItem", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fighters", "outputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "playerAddress", "type": "address" }, { "internalType": "bool", "name": "fighting", "type": "bool" }, { "internalType": "bool", "name": "alive", "type": "bool" }, { "internalType": "uint256", "name": "numberOfEquippedItems", "type": "uint256" }, { "internalType": "uint256", "name": "lives", "type": "uint256" }, { "internalType": "uint256", "name": "health", "type": "uint256" }, { "internalType": "uint256", "name": "maxHealth", "type": "uint256" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightersCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightersDied", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fights", "outputs": [ { "internalType": "bool", "name": "open", "type": "bool" }, { "internalType": "uint256", "name": "creationBlock", "type": "uint256" }, { "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "internalType": "uint256", "name": "defenderId", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "startId", "type": "uint256" } ], "name": "getAliveFighterIds", "outputs": [ { "internalType": "uint256[]", "name": "aliveFighterIds", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "getEquippedItemIds", "outputs": [ { "internalType": "uint256[]", "name": "equippedItemIds", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "items", "outputs": [ { "internalType": "address", "name": "playerAddress", "type": "address" }, { "internalType": "bool", "name": "exists", "type": "bool" }, { "internalType": "bool", "name": "equipped", "type": "bool" }, { "internalType": "enum PvP.ItemType", "name": "itemType", "type": "uint8" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "itemsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "recruitFighter", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "fightId", "type": "uint256" } ], "name": "resolveFight", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "internalType": "uint256", "name": "defenderId", "type": "uint256" } ], "name": "startFight", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]';
	contract = new ethers.Contract(contractAddress, abi, provider);
	
	let filter = {
		address: contractAddress,
	}
	
	provider.on(filter, (result) => {
		console.log(result);
	});
	provider.on('block', (blockNumber) => {
		gameLoop(blockNumber);
	});
	
	loadContractData();
}

async function loadContractData() {
	let aliveFighterIds = await contract.getAliveFighterIds(0);
	
	let fightersWindow = createWindow('window', 'Fighters', '', 'default');
		
	for(let i = 0; i < aliveFighterIds.length; i++) {
		let fighterId = aliveFighterIds[i];
		let fighter = await contract.fighters(fighterId);
		let fighterContent = 
		`
		<h2> Owner: ${fighter.playerAddress} </h2>
		<p> Lives: ${fighter.lives} </p>
		<p> Health:	${fighter.health} </p>
		<p> Armour: ${fighter.armour}</p>	
		<p> Damage: ${fighter.minDamage} - ${fighter.maxDamage}</p>
		<p> Combat Skills:</p>
		<p> ${fighter.dodgeChance}% to dodge an Attack</p>
		<p> ${fighter.criticalHitChance}% to hit for ${fighter.criticalHitDamage} extra Damage</p>
		`
		let fighterWindow = createWindow(fightersWindow.content, 'Fighter: ' + fighterId, fighterContent, 'parentpanel').minimize();
  
		let equippedItemIds = await contract.getEquippedItemIds(fighterId);
		for(let j = 0; j < equippedItemIds.length; j++) {
			let itemId = equippedItemIds[j];
			let item = await contract.items(itemId);
			
			createItemWindow(fightersWindow.content, item, itemId, fighterWindow);
		}
	}
	
}

function createWindow(container, header, content, minimizeTo) {
	return jsPanel.create({
		container:	container,
		minimizeTo:	minimizeTo,
		headerControls: {
			close: 'remove'
		},
		headerTitle:	header,
		content:	content,
		contentSize: '500 300'
	})
}

function createItemWindow(container, item, itemId, fighterWindow) {
	let content = 
		`
		${item.armour != 0 ? `<p> + ${item.armour} Armour</p>`: '' }
		${item.minDamage != 0 || item.maxDamage != 0 ? `<p> + ${item.minDamage} - ${item.maxDamage} Damage</p>`: '' }
		${item.dodgeChance != 0 ? `<p> + ${item.dodgeChance}% to dodge an Attack</p>`: '' }
		${item.criticalHitChance != 0 ? `<p> + ${item.criticalHitChance}% to hit for ${item.criticalHitDamage} extra Damage</p>`: '' }
		`
  
	let position;
	switch(item.itemType) {
		case 0:
			position  = {my:'right-top', at:'left-top', offsetX:-5};
			break;
		case 1:
			position  = {my:'right-center', at:'left-center', offsetX:-5};
			break;
		case 2:
			position  = {my:'right-bottom', at:'left-bottom', offsetX:-5};
			break;
		case 3:
			position  = {my:'left-top', at:'right-top', offsetX:+5};
			break;
		case 4:
			position  = {my:'left-center', at:'right-center', offsetX:+5};
			break;
		case 5:
			position  = {my:'left-bottom', at:'right-bottom', offsetX:+5};
			break;
	}
	
	jsPanel.create({
		container:	container,
		headerTitle:	'Item: ' + itemId,
		headerControls: {
			close: 'remove'
		},
		content:	content,
	}).dock({
		master: fighterWindow,
		position: position,
		linkSlaveHeight: false,
		linkSlaveWidth: false
	});
}

function dock(master, slave) {
	slave.dock({
		master: master
	});
}

 function gameLoop(blockNumber) {
	console.log(blockNumber);
}