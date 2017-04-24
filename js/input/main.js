const cardCount = 24, pairCount = 12;


function generateCardElement(card){
	let cardTmpl = document.getElementById('card_tmpl')
	, cardBtn = cardTmpl.content.querySelectorAll('.card')[0]
	, cardBack = cardTmpl.content.querySelectorAll('.back')[0];
	cardBtn.id = card.name;
	cardBack.textContent = card.value;
	return document.importNode(cardTmpl.content, true);
}

class Card{
	constructor(name, value, pair){
		this.name = name;
		this.value = value;
		this.pair = pair;
		this.selected = false;
		this.hasElement = false;
		this.solved = false;
		this.fragment = generateCardElement(this);
	}
	setElement(elem){
		this.element = elem;
		this.hasElement = true;
	}
	flipCard(){
		if(this.hasElement !== true) { throw new ReferenceError('How did you flip a card without there being an element in the dom? what are you? a witch?'); }
		this.selected = !this.selected;
		this.element.classList.toggle('selected')
	}
	resetCard(){
		if(this.solved !== true){
			this.selected = false;
			this.element.classList.remove('selected');
		}
	}
	setSolved(){
		this.solved = true;
		this.element.classList.add('solved');
	}
}

class Model{
	constructor(){
		this.cards = {};
		this.positions = {};
		this.selectedCardCount = 0;
		this.isResetting = true;
		this.waysToSayWait = waysToSayWait;
		this.waysToSayTryAgain = waysToSayTryAgain;
		this.waysToSayGoodJob = waysToSayGoodJob;
	}
	
	generateGame(){
		let fragment = document.createDocumentFragment()
		, cardInsertionPoint = document.getElementById('game');
		
		for(let i = 1; i <= cardCount; i+=2){
			let cardAName = `card` + i;
			let cardBName = `card` + (i+1);
			let cardNumber = (i+1) / 2;
			this.cards[cardAName] = new Card(cardAName, cardNumber, cardBName);
			this.cards[cardBName] = new Card(cardBName, cardNumber, cardAName);
		}
		
		
		for(let card in this.cards){
			if(this.cards.hasOwnProperty(card)){
				fragment.appendChild(this.cards[card].fragment);
			}
		}
		cardInsertionPoint.appendChild(fragment);
		this.isResetting = false;
	};
	
	compareCards(cardName){
		this.selectedCardCount++;
		let currentCard = this.cards[cardName];
		let cardPair = this.cards[currentCard.pair];
		var solved = false;
		
		if(cardPair.selected === true){
			currentCard.setSolved();
			cardPair.setSolved();
			solved = true;	
			this.notify('solution');
			this.resetCards();
		}
		
		if(this.selectedCardCount > 1){
			if(solved === false){
				this.resetCards();
				this.notify('failure');
			}
			
			this.selectedCardCount = 0;
		}
	}
	
	resetCards(){
			this.isResetting = true;
			setTimeout(() =>{
				for(var card in this.cards){
					if(this.cards.hasOwnProperty(card)){
						this.cards[card].resetCard();
					}
				}
				this.isResetting = false;
			}, 2000);
		
	}
	
	notify(typeOfNotification){
		switch(typeOfNotification){
			case 'solution':
				changeNotification(generateNotification(this.waysToSayGoodJob));
				break;
			case 'failure':
				changeNotification(generateNotification(this.waysToSayTryAgain));
				break;
			case 'wait':
				changeNotification(generateNotification(this.waysToSayWait));
				break;
			default:
				changeNotification('');
				break;
		}
	}
}

function generateNotification(collection){
	let min = 0
	, max = collection.length
	, randomIndex = Math.floor(Math.random() * (max - min));
	return collection[randomIndex];
}

function loaded(){
	var model = new Model();
	var cards;
	model.generateGame();
	cards = document.querySelectorAll('.card');
	
	for(let i = 0; i < cards.length; i++){
		let card = cards[i];
		let cardObj = model.cards[card.id];
		
		cardObj.setElement(card);
		
		card.addEventListener('click', ()=>{
			if(model.isResetting === false ){
				cardObj.flipCard();
				model.compareCards(cardObj.name);
			} else {
				model.notify('wait');
			}
		});
	}
}

function changeNotification(val){
	var p = document.getElementById('game_notification');
	p.textContent = val;
}

document.addEventListener('DOMContentLoaded', loaded, false);



var waysToSayWait = [
	"Jeez. Wait until the cards reset before continuing, psycho."
	, "Slow Down Speed Racer!"
	, "Take a breather for a second."
	, "You're really going for gold aren't you?"
	, "Figuratively take a chill pill."
	, "Literally take a chill pill."
	, "Does someone telling you to relax EVER help you relax? Either way, relax."
	, "Your new name is Clicky McTooFast."
	, "Crazy Idea: Wait a second."
	, "Are you hot or something because you need to chill."
	, "BRAH. COOL OUT A SECOND."
	, "Fine. Keep clicking too fast. Whatever."
	, "Seriously, I'm holding your event listener hostage."
];
var waysToSayTryAgain = [
		"No dice."
	, "Statistically speaking, you're more likely to get it this next time."
	, "Hey, at least you don't have a Masters Degree in failure. Yet."
	, "In a parallel universe those two are matches. Not this one though."
	, "Well then get your stuff together, get it all together and put it in a back pack, all your stuff, so it's together. And if you gotta take it some where, take it somewhere, you know? Take it to the stuff store and sell it, or put it in the stuff museum. I don't care what you do, you just gotta get it together. Get your stuff together."
	, "Losersayswhat"
	, "Maybe try interpretive dance instead?"
	, "You know what would solve this problem? A nice, cool, glass of Pepsi."
];
var waysToSayGoodJob = [
	"What do you want? A cookie? Nice match."
	, "If I had a cookie, I'd eat it in front of you. Good job matching cards tho."
	, "Ok how'd you do that? Are you a witch? Good job."
	, "Someone call Einstein because you're relatively good at this."
	, "You could probably solve world hunger if you tried."
	, "You're great."
	, "FABULOUSSSSS"
	, "YOU'RE ON FIRE. SOMEONE CALL 911."
	, "I, for one, am proud of you."
];