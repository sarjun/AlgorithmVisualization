/**
 * Created by Arjun on 10/20/2014.
 */

function addConsoleCard(text, background) {
	var divText = "<div class='inner'>"
		+ "<div>" +
		"<paper-shadow z='2'></paper-shadow>"
		+ text
		+ "</div></div>";
	var card = $(divText);
	if(background != undefined) card.find("div").css("background", background);
	cardConsole.append(card);
	cardConsole.scrollTop(cardConsole.height());
}