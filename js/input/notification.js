const placeToPrintTo = 'game_notification';

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
		"No dice. Try Again."
	, "Statistically speaking, you're more likely to get it this next time. Try again."
	, "Hey, at least you don't have a Masters Degree in failure. Yet. Try again."
	, "In a parallel universe those two are matches. Not this one though. Try again."
	, "Well then get your stuff together, get it all together and put it in a back pack, all your stuff, so it's together. And if you gotta take it some where, take it somewhere, you know? Take it to the stuff store and sell it, or put it in the stuff museum. I don't care what you do, you just gotta get it together. Get your stuff together. Now Try again."
	, "Losersayswhat."
	, "Maybe try interpretive dance instead? Or just try again."
	, "You know what would solve this problem? A nice, cool, glass of Pepsi. Jk that'd solve nothing. Try Again."
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
	, "Ok, you're TOO good at this."
];

/**
 * @desc given an array of stuff, return a random item from the array.
 * @param collection
 * @returns {*}
 */
function generateRandomNotification(collection){
	let min = 0
		, max = collection.length
		, randomIndex = Math.floor(Math.random() * (max - min));
	return collection[randomIndex];
}

/**
 * @param {HTMLElement} element - element to change text of.
 * @param {string} val - text to change to.
 * @returns {string}
 */
function changeNotification(element, val){
	element.textContent = val;
	return element.textContent;
}

class Notification{
	constructor(place, message){
		var element = document.getElementById(place);
		this.place = place;
		this.message = message;
		this.element = element;
		changeNotification(this.element, this.message);
	}
}

// This is a bit overkill for this project, but I made it so that you can see how I would architect the app because
// in the future someone might want to have different notifications in different places, in which case you'd probably
// only have one place to keep track of.
class NotificationRegistrar{
	constructor(){
		var currentNotifications = {};
		currentNotifications[placeToPrintTo] = new Notification(placeToPrintTo, '');
		this.currentNotifications = currentNotifications;
	}

	/**
	 * @desc create new notification based on type of notification.
	 * @param {string} typeOfNotification - Type can be "solution", "failure", "wait", "duplicateClick". Others will create empty notification.
	 */
	notify(typeOfNotification){
		var message;
		switch(typeOfNotification){
			case 'solution':
				 message = generateRandomNotification(waysToSayGoodJob);
				break;
			case 'failure':
				message = generateRandomNotification(waysToSayTryAgain);
				break;
			case 'wait':
				message = generateRandomNotification(waysToSayWait);
				break;
			case 'duplicateClick':
					message = "Ok in a philisophical sense, by clicking the same card twice you're right, it's a match, but this isn't philosophy class.";
				break;
			default:
				message = '';
				break;
		}
		
		this.currentNotifications[placeToPrintTo] = new Notification(placeToPrintTo, message);
	}
}

var notificationRegistrarInstance = new NotificationRegistrar();
export {notificationRegistrarInstance, Notification, NotificationRegistrar};