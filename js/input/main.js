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
			this.resetCards();
			
		}
		
		if(this.selectedCardCount > 1){
			if(solved === false){
				this.resetCards();
			}
			
			this.selectedCardCount = 0;
		}
	}
	
	resetCards(){
		console.log('bro');
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
			
			cardObj.flipCard();
			model.compareCards(cardObj.name);
		});
	}
}


document.addEventListener('DOMContentLoaded', loaded, false);