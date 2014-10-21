/**
 * Created by Arjun on 10/20/2014.
 */

function addPolymerCard(text) {
	var divText = "<div class='inner'>"
		+ "<div>" +
		"<paper-shadow z='2'></paper-shadow>"
		+ text
		+ "</div></div>";
	var card = $(divText);
	console.append(card);
}