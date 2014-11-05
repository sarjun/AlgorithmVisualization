/**
 * Created by Arjun on 10/20/2014.
 */

function addConsoleCard(text, background) {
	var divText = "<div class='inner'><paper-shadow z='2'>" + text + "</paper-shadow></div>";
	var card = $(divText);
	if (background != undefined) card.find("div").css("background", background);
	cardConsole.append(card);
	cardConsole.scrollTop(cardConsole[0].scrollHeight);
}

function clearConsole() {
	cardConsole.find("div.inner").remove();
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