let provider;
let signer;
let contractAddress;
let abi;
let contract;
let playerAddress;

let attackerId;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
		provider = new ethers.providers.Web3Provider(web3.currentProvider);
		signer = provider.getSigner();
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
	contractAddress = '0x9C787a6F449d6735414e02d34a1c54e167e35F59';
	abi = '[ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fighterId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "level", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "itemId", "type": "uint256" } ], "name": "DiscoverItem", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "LevelUp", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "fightId", "type": "uint256" }, { "indexed": false, "internalType": "enum PvP.FightEvent", "name": "fightEvent", "type": "uint8" }, { "indexed": false, "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "defenderId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "ProgressFight", "type": "event" }, { "constant": true, "inputs": [], "name": "FIGHTER_COST", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ITEM_TYPES_COUNT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "discoverItem", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "fightersCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightersDied", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "fights", "outputs": [ { "internalType": "bool", "name": "open", "type": "bool" }, { "internalType": "uint256", "name": "creationBlock", "type": "uint256" }, { "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "internalType": "uint256", "name": "defenderId", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsClosed", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "fightsCreated", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "startId", "type": "uint256" } ], "name": "getAliveFighterIds", "outputs": [ { "internalType": "uint256[]", "name": "aliveFighterIds", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "getEquippedItems", "outputs": [ { "internalType": "uint8[]", "name": "itemType", "type": "uint8[]" }, { "internalType": "uint256[]", "name": "armour", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "minDamage", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "maxDamage", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "dodgeChance", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "criticalHitChance", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "criticalHitDamage", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "getFighterInfo1", "outputs": [ { "internalType": "uint256", "name": "lives", "type": "uint256" }, { "internalType": "uint256", "name": "health", "type": "uint256" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "fighterId", "type": "uint256" } ], "name": "getFighterInfo2", "outputs": [ { "internalType": "address", "name": "playerAddress", "type": "address" }, { "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "xp", "type": "uint256" }, { "internalType": "uint256", "name": "maxXp", "type": "uint256" }, { "internalType": "bool", "name": "fighting", "type": "bool" }, { "internalType": "uint256", "name": "numberOfEquippedItems", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "startId", "type": "uint256" } ], "name": "getOpenFights", "outputs": [ { "internalType": "uint256[]", "name": "fightIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "attackerIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "defenderIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "creationBlocks", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "items", "outputs": [ { "internalType": "bool", "name": "exists", "type": "bool" }, { "internalType": "enum PvP.ItemType", "name": "itemType", "type": "uint8" }, { "internalType": "uint256", "name": "level", "type": "uint256" }, { "internalType": "uint256", "name": "armour", "type": "uint256" }, { "internalType": "uint256", "name": "minDamage", "type": "uint256" }, { "internalType": "uint256", "name": "maxDamage", "type": "uint256" }, { "internalType": "uint256", "name": "dodgeChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitChance", "type": "uint256" }, { "internalType": "uint256", "name": "criticalHitDamage", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "itemsOfLevel", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxLevel", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "maxXpOfLevel", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "recruitFighter", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "fightId", "type": "uint256" } ], "name": "resolveFight", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "attackerId", "type": "uint256" }, { "internalType": "uint256", "name": "defenderId", "type": "uint256" } ], "name": "startFight", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]';
	contract = new ethers.Contract(contractAddress, abi, signer);
	
	getPlayerInfo();
	loadContractData();
}

async function getPlayerInfo() {
	accounts = await provider.listAccounts();
	playerAddress = accounts[0];
}

function loadContractData() {
	loadRules()
	loadFighterData();
	loadFightsData();
}

function loadRules() {
	let rulesWindow = createWindow('Rules').normalize();
	rulesWindow.content.innerHTML =
	`<h3>Gameplay:</h3>
	<h6>Recruit Fighters</h6>
	<p>Recruit Fighters to start playing the game</br>
	Every Fighter starts with the same stats that can be improved while playing</p>
	<h6>Discover Items</h6>
	<p>Fighters can discover items that increase the fighters base stats</br>
	There are 6 different item categories (Weapon, Shield, Amulet, Helmet, Chestplate, Leggins) to discover</p>
	<h6>Attack Enemies</h6>
	<p>Attack enemy fighters to defeat and/or kill them</br>
	Only enemies with a higher or same level can be attacked</br>
	During a fight the fighters are attacking each other in a turn-based manner, the attacker starts the fight</br>
	The losing player loses a life and dies if he has no more lifes left</p>
	<h6>Level up</h6>
	<p>A Fighter gains xp by attacking or discovering items</br>
	After a level up the fighter can discover better items</p>
	`
}

async function loadFighterData() {
	let aliveFighterIds = await contract.getAliveFighterIds(0);
	let myFightersWindow = createWindow('My Fighters');
	attach('window', myFightersWindow, {my:'center-top', at:'center-bottom', offsetY:5}, `<button type="button" class="btn btn-primary" onclick="recruitFighter()">Recruit Fighter</button>`);
	
	let fightersWindow = createWindow('Enemies');
		
	for(let i = 0; i < aliveFighterIds.length; i++) {
		let fighterId = aliveFighterIds[i];
		let fighterInfo1 = await contract.getFighterInfo1(fighterId);
		let fighterInfo2 = await contract.getFighterInfo2(fighterId);
		
		let formatedPlayerAddress = fighterInfo2.playerAddress.substring(0,10) + '...' + fighterInfo2.playerAddress.substring(fighterInfo2.playerAddress.length - 8, fighterInfo2.playerAddress.length)
		
		let fighterContent = 
		`
		<p>Owner: ${formatedPlayerAddress}</p>
		<p>XP: ${fighterInfo2.xp}/${fighterInfo2.maxXp}</p>
		<p>Lives: ${fighterInfo1.lives}</p>
		<p>Health:	${fighterInfo1.health}</p>
		<p>Armour: ${fighterInfo1.armour}</p>	
		<p>Damage: ${fighterInfo1.minDamage} - ${fighterInfo1.maxDamage}</p>
		<p>${fighterInfo1.dodgeChance}% Chance to dodge an Attack</p>
		<p>${fighterInfo1.criticalHitChance}% Chance to hit for ${fighterInfo1.criticalHitDamage} extra Damage</p>
		`
		
		let fighterWindow;
		let parentContainer;
		let header = `Fighter: ${fighterId} (Level ${fighterInfo2.level})`;
		if(playerAddress == fighterInfo2.playerAddress) {
			parentContainer = myFightersWindow.content;
			fighterWindow = createFighterWindow(parentContainer, header, fighterContent, 'parentpanel');
			attach(parentContainer, fighterWindow, {my:'left-top', at:'left-bottom', offsetY:5}, `<button type="button" class="btn btn-primary" onclick="discoverItem(${fighterId})">Discover Items</button>`);
			attach(parentContainer, fighterWindow, {my:'right-top', at:'right-bottom', offsetY:5}, `<button type="button" class="btn btn-warning" onclick="setAttacker(${fighterId})">Select as Attacker</button>`);
		} else {
			parentContainer = fightersWindow.content;
			fighterWindow = createFighterWindow(parentContainer, header , fighterContent, 'parentpanel');
			attach(parentContainer, fighterWindow, {my:'center-top', at:'center-bottom', offsetY:5}, `<button type="button" class="btn btn-danger" onclick="attack(${fighterId})">Attack</button>`);
		}
  
		let items = await contract.getEquippedItems(fighterId);
		for(let j = 0; j < items[0].length; j++) {
			let content = 
			`
			${items.armour[j] != 0 ? `<p> + ${items.armour[j]} Armour</p>`: '' }
			${items.minDamage[j] != 0 || items.maxDamage[j] != 0 ? `<p> + ${items.minDamage[j]} - ${items.maxDamage[j]} Damage</p>`: '' }
			${items.dodgeChance[j] != 0 ? `<p> + ${items.dodgeChance[j]}% Dodge Chance</p>`: '' }
			${items.criticalHitChance[j] != 0 ? `<p> + ${items.criticalHitChance[j]}% Criticial Hit Chance</p>`: '' }
			${items.criticalHitDamage[j] != 0 ? `<p> + ${items.criticalHitDamage[j]} Criticial Hit Damage</p>`: '' }
			`
  
			let position;
			switch(items.itemType[j]) {
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
			attach(parentContainer, fighterWindow, position, content);
		}
	}
}

function attach(container, master, position, content) {
	jsPanel.create({
			container:	container,
			header: false,
			content: content,
			contentSize: 'auto auto',
		}).dock({
			master: master,
			position: position,
			linkSlaveHeight: false,
			linkSlaveWidth: false
	});
}

async function loadFightsData() {
	let fights = await contract.getOpenFights(0);
	
	let myFightsWindow = createWindow('My Open Fights');
	
	for(let i = 0; i < fights[0].length; i++) {
		if(playerAddress == fights.attackerIds[i] || fights.defenderIds[i]) {
			let fightWindow = createFighterWindow(myFightsWindow.content, 'Fight: ' + fights.fightIds[i], `<p>Fighter ${fights.attackerIds[i]} vs. Fighter ${fights.defenderIds[i]}</p>`, 'parentpanel');
			attach(myFightsWindow.content, fightWindow, {my:'center-top', at:'center-bottom', offsetY:5}, `<button type="button" class="btn btn-success" onclick="resolveFight(${fights.fightIds[i]})">Resolve</button>`);
		}
	}
	
	let fightsHistory = createWindow('Fight History');
	
	let eventAbi = [ 'event ProgressFight(uint256 indexed fightId, uint8 fightEvent, uint256 attackerId, uint256 defenderId, uint256 value)' ];
	let iface = new ethers.utils.Interface(eventAbi);
	let filter = contract.filters.ProgressFight();
	filter.fromBlock = 0;
	
	provider.getLogs(filter).then(function(logs) {
		let events = logs.map((log) => iface.parseLog(log))
		let fightId;
		let fightWindow;
		let contentString;
		for(let i = 0; i < events.length; i++) {
			let event = events[i];
			let newFightId = event.values.fightId.toNumber();
			if(fightId != newFightId) {
				if(fightWindow != undefined) {
					fightWindow.content.innerHTML = contentString;
					fightWindow.resize('auto auto');
					fightWindow.minimize();
				}
				fightId = newFightId;
				fightWindow = createFightHistoryWindow(fightsHistory.content, 'Fight: ' + fightId, 'parentpanel');
				contentString = '';
			}
			switch (event.values.fightEvent) {
				case 0:
					contentString += `<p>Fighter ${event.values.attackerId} hit Fighter ${event.values.defenderId} for ${event.values.value} damage</p>`;
					break;
				case 1:
					contentString += `<p>Fighter ${event.values.defenderId} dodged an attack from Fighter ${event.values.attackerId}</p>`;
					break;
				case 2:
					contentString += `<p>Fighter ${event.values.attackerId} landed a critical hit on Fighter ${event.values.defenderId} for ${event.values.value} damage</p>`;
					break;
				case 3:
					contentString += `<p>Fighter ${event.values.attackerId} defeated Fighter ${event.values.defenderId} with ${event.values.value} health left</p>`;
					break;
				case 4:
					contentString += `<p>Fighter ${event.values.attackerId} killed Fighter ${event.values.defenderId} with ${event.values.value} health left</p>`;
					break;
			}
		}
		if(fightWindow != undefined) {
			fightWindow.content.innerHTML = contentString;
			fightWindow.resize('auto auto');
			fightWindow.minimize();
			fightWindow.resizeit('disable');
		}
	}).catch(function(err){
		console.log(err);
	});
}

function recruitFighter() {
	contract.recruitFighter();
}

function resolveFight(fightId) {
	contract.resolveFight(fightId);
}

function discoverItem(fighterId) {
	contract.discoverItem(fighterId);
}

function setAttacker(fighterId) {
	attackerId = fighterId;
}

function attack(defenderId) {
	contract.startFight(attackerId, defenderId);
}

function createWindow(header) {
	return jsPanel.create({
		headerControls: {
			close: 'remove',
			maximize: 'remove',
		},
		headerTitle: header,
		panelSize: '1000 600',
		setStatus: 'minimized',
		resizeit: {
			containment: 0
		},
		dragit: {
			containment: 0
		}
	})
}

function createFighterWindow(container, header, content, minimizeTo) {
	return jsPanel.create({
		container:	container,
		minimizeTo:	minimizeTo,
		headerControls: {
			close: 'remove',
			maximize: 'remove',
			smallify: 'remove'
		},
		headerTitle:	header,
		content:	content,
		contentSize: '300 auto',
		setStatus: 'minimized',
		dragit: {
			containment: 0
		},
		resizeit: false,
	})
}

function createFightHistoryWindow(container, header, minimizeTo) {
	return jsPanel.create({
		container:	container,
		minimizeTo:	minimizeTo,
		headerControls: {
			close: 'remove',
			maximize: 'remove',
			smallify: 'remove'
		},
		headerTitle:	header,
		dragit: {
			containment: 0
		},
		resizeit: false,
	})
}