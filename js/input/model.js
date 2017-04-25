import {Card} from './card';
import {notificationRegistrarInstance} from './notification';

const cardCount = 24;

/**
 * @desc Given an Array of items, will return a shuffled array of those items 
 * @param stackOfCards - Array of non-shuffled cards.
 * @param [shuffledStack] - Array of shuffled cards. This is a recursive function so you dont need to pass this param.
 * @returns {Array}
 */
function shuffleCards(stackOfCards, shuffledStack){
	shuffledStack = shuffledStack || [];
	
	let min = 0
		, max = stackOfCards.length
		, randomIndex = Math.floor(Math.random() * (max - min));

	shuffledStack.push(stackOfCards[randomIndex]);
	stackOfCards.splice(randomIndex, 1);
	if(stackOfCards.length !== 0){
		shuffleCards(stackOfCards, shuffledStack);
	}
	return shuffledStack;
}

/**
 * @desc Tests if number is even. Uses bitwise rather than modulo because it's faster. 
 * @param {Number} num
 * @returns {boolean}
 */
function isEven(num){
	return !(num & 1);
}

/**
 * Generates Card pairs. 
 * Do not call directly, use call or apply. 
 */
function generateCardInstances(){
	if(!isEven(cardCount)){ throw new Error("card count is not even. Can't create game"); }
	for(let i = 1; i <= cardCount; i+=2){
		let cardAName = `card` + i;
		let cardBName = `card` + (i+1);
		let cardNumber = (i+1) / 2;
		this.cards[cardAName] = new Card(cardAName, cardNumber, cardBName);
		this.cards[cardBName] = new Card(cardBName, cardNumber, cardAName);
	}
}

/**
 * Creates a single document fragment containing all card's template fragments. See Card class for design choice
 * explanation.
 * @param shuffledCardsArr
 * @returns {DocumentFragment}
 */
function generateCardDOM(shuffledCardsArr){
	let fragment = document.createDocumentFragment();
	shuffledCardsArr.forEach((card)=>{
		if(card instanceof Card === false){ throw new TypeError('theres a card in the shuffled cards array that is not a Card instance.'); }
		fragment.appendChild(card.fragment);
	});
	return fragment;
}

/**
 * @desc I think technically this is a combination of a Model and a VM. I'm trying not to go overboard on the OOP but
 *   if you really want to get technical about it the generateGame stuff should be in it's own class.
 */
class Model{
	constructor(){
		this.cards = {};
		this.selectedCardCount = 0;
		this.isResetting = true;
	}

	/**
	 * @desc creates card pairs, shuffles cards, creates a single dom fragment of all cards and adds it all at once.  
	 * @param {HTMLElement} cardInsertionPoint
	 */
	generateGame(cardInsertionPoint){
		
		generateCardInstances.call(this);
		
		let stackOfCards = shuffleCards(Object.values(this.cards));
		
		let fragment = generateCardDOM(stackOfCards);
		
		cardInsertionPoint.appendChild(fragment);
		
		this.currentCard = '';
		this.isResetting = false;
	}

	/**
	 * @desc checks to see if arg is the same card as the currentCard. If so, notify's the Notification Registrar that there was a duplicate click.
	 * @param {String} currentCard
	 * @returns {boolean}
	 */
	doubleClickCheck(currentCard){
		if(this.currentCard === currentCard){
			notificationRegistrarInstance.notify('duplicateClick');
			return true;
		}
	}

	/**
	 * @desc checks model to see if arg's card pair is selected. if so, sets both cards to solved and notifys 
	 * Notification Registrar of solution. If not, and more than 1 cards are selected, resets the cards and notifys a failure.
	 * @param cardName
	 */
	compareCards(cardName){
		var currentCard = this.cards[cardName]
		, cardPair = this.cards[currentCard.pair]
		, solved = false;
		
		this.currentCard = cardName;
		this.selectedCardCount++;

		if(cardPair.selected === true){
			currentCard.setSolved();
			cardPair.setSolved();
			solved = true;
			notificationRegistrarInstance.notify('solution');
			this.resetCards();
		}

		if(this.selectedCardCount > 1){
			if(solved === false){
				this.resetCards();
				notificationRegistrarInstance.notify('failure');
			}

			this.selectedCardCount = 0;
		}
	}

	/**
	 * @desc calls Card.resetCard and sets currentCard back to '' after 1 second. 
 	 */
	resetCards(){
		this.isResetting = true;
		setTimeout(() =>{
			for(var card in this.cards){
				if(this.cards.hasOwnProperty(card)){
					this.cards[card].resetCard();
				}
			}
			this.currentCard = '';
			this.isResetting = false;
		}, 1000);
	}
}

export {Model, shuffleCards};
