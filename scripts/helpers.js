/**
 * Created by Arjun on 10/20/2014.
 */

function addConsoleCard(text, background) {
	var divText = "<div class='inner'><paper-shadow z='2'>" + text + "</paper-shadow></div>";
	var card = $(divText);
	if (background != undefined) card.find("div").css("background", background);
	cardConsole.append(card);
	cardConsole.scrollTop(cardConsole.height());
}

function clearConsole() {
	cardConsole.find("div.inner").remove();
}