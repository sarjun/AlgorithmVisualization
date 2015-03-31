/**
 * Created by Arjun on 10/20/2014.
 */

$.ischrome = (typeof window.chrome === "object");

var EPSILON = 0.000001;

function addConsoleCard(text, background) {
	var divText = "<div class='inner'><paper-shadow z='2'>" + text + "</paper-shadow></div>";
	var card = $(divText);
	if (background != undefined) card.find("div").css("background", background);
	var cardConsole = $("div.console.fresh");
	var consoleHolder = $("div.console-holder");
	if (cardConsole.length == 0) {
		$("div.console").filter(function () {return $(this).css('display') != 'none';}).hide("slide", {direction: "left"});
		cardConsole = $("<div class='console fresh' style='display: none'></div>");
		consoleHolder.append(cardConsole);
		cardConsole.show("slide", {direction: "right"});
	}
	cardConsole.append(card);
	cardConsole.scrollTop(cardConsole[0].scrollHeight);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub, card[0]]);
	return card;
}

function clearConsole() {
	if (BoxedList.animating != null) return;
	$("div.console:not(.summary)").remove();
	$("div.console").addClass("fresh").show();
}

function refreshCircleOverflow () {
	mainDiv.find("div.circle").removeClass("abbrev");
	if (Circle.centered == root) {
		for (var i in root.children) {
			root.children[i].checkOverflow();
		}
	} else {
		for (var i in Circle.centered.parent.children) {
			for (var j in Circle.centered.parent.children[i].children) {
				Circle.centered.parent.children[i].children[j].checkOverflow();
			}
		}
	}
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}