import {Model} from './model';
import {notificationRegistrarInstance} from './notification.js';

/**
 * after dom loads, load create the game.
 */
function loaded(){
	var model = new Model();
	var cards;
	var cardInsertionPoint = document.getElementById('game');
	model.generateGame(cardInsertionPoint);
	cards = document.querySelectorAll('.card');
	
	for(let i = 0; i < cards.length; i++){
		let card = cards[i];
		let cardObj = model.cards[card.id];
		
		cardObj.setElement(card); // see card constructor and model for design decision choice.
		
		card.addEventListener('click', ()=>{
			if(model.isResetting === false ){
				
				if(model.doubleClickCheck(cardObj.name) === true){
					return false;
				}
				
				cardObj.flipCard();
				model.compareCards(cardObj.name);
			} else {
				notificationRegistrarInstance.notify('wait');
			}
		});
	}
	console.log("Hey, no cheating.");
}

document.addEventListener('DOMContentLoaded', loaded, false);

