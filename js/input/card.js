/**
 * Creates a document fragment of the card using the card template.
 * @param card instance
 * @returns {Node}
 */
function generateCardElement(name, value){
	let cardTmpl = document.getElementById('card_tmpl')
		, cardBtn = cardTmpl.content.querySelectorAll('.card')[0]
		, cardBack = cardTmpl.content.querySelectorAll('.back')[0];
	cardBtn.id = name;
	cardBack.textContent = value
	return document.importNode(cardTmpl.content, true);
}

/**
 * One weakness of creating cards this way is that you create the card FRAGMENT here on instantiation, 
 * but you have to wait for the Model (it's kinda more of a ViewModel and Model combined) to add the collection of
 * cards to the DOM before the element can be set. The reason for this decision is because if you were to insert each
 * card into the Dom individually on instantiation,  you'd be making (total number of cards) changes to the DOM. Which
 * is slow. The way I'm doing it only creates 1 dom update because it constructs the card game as a single document
 * fragment and then just inserts that single fragment  into the dom. 
 */
class Card{
	constructor(name, value, pair){
		this.name = name;
		this.value = value;
		this.pair = pair;
		this.selected = false;
		this.hasElement = false;
		this.solved = false;
		this.fragment = generateCardElement(this.name, this.value);
	}

	/**
	 * @desc sets the element property to a dom element
	 * @param {HTMLElement} elem - the card's html element.
	 */
	setElement(elem){
		if((elem instanceof HTMLElement) === false){ throw new TypeError('tried to assign non element to Card')}
		this.element = elem;
		this.hasElement = true;
	}

	/**
	 * @desc toggles the selected class of the card, and also the selected property of the card. 
	 * @throws {ReferenceError} if the card.element hasnt been set yet.
	 */
	flipCard(){
		if(this.hasElement !== true) { throw new ReferenceError('How did you flip a card without there being an element in the dom? what are you? a witch?'); }
		this.selected = !this.selected;
		this.element.classList.toggle('selected');
	}

	/**
	 * @desc reset card state to false and remove selected class.
	 */
	resetCard(){
		if(this.solved !== true){
			this.selected = false;
			this.element.classList.remove('selected');
		}
	}

	/**
	 * @desc set solved to true and add solve class
	 */
	setSolved(){
		this.solved = true;
		this.element.classList.add('solved');
	}
}

export {Card, generateCardElement};