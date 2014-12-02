function positionSpotlight(top, left, width, height) {
	var spotlight = $("div.spotlight");
	spotlight.show();
	$("div.cell").show();
	if (top < 0) {
		spotlight.find("div.top").css({
			'flex-basis': 0,
			'margin-top': top
		});
	} else {
		spotlight.find("div.top").css({
			'flex-basis': top,
			'margin-top': 0
		});
	}
	if (top + height > $(window).height()) {
		var find = spotlight.find("> div.padding");
		find.css({
			'margin-bottom': $(window).height() - top - height
		});
	} else {
		spotlight.find("> div.padding").css({
			'margin-bottom': 0
		});
	}
	if (left < 0) {
		spotlight.find("div.row").css("flex-basis", height).find("div.left").css({
			'flex-basis': 0,
			'margin-left': left
		});
	} else {
		spotlight.find("div.row").css("flex-basis", height).find("div.left").css({
			'flex-basis': left,
			'margin-left': 0
		});
	}
	if (left + width > $(window).width()) {
		spotlight.find("div.row div.padding").css({
			'margin-right': $(window).width() - left - width
		});
	} else {
		spotlight.find("div.row div.padding").css({
			'margin-right': 0
		});
	}
	spotlight.find("div.cell").css("flex-basis", width);
}

function positionSpotlightOnElem(elem, parent) {
	if (parent == null) {
		var offset = elem.offset();
	} else {
		var offset = elem.offset();
		var parentOffset = parent.offset();
		offset.top += parentOffset.top;
		offset.left += parentOffset.left;
	}
	var width = elem.outerWidth(false);
	var height = elem.outerHeight(false);
	positionSpotlight(offset.top - height * 0.1, offset.left - width * 0.1, width * 1.2, height * 1.2);
}

function setSpotlightText(msg) {
	var spans = clearSpotlightText();
	if (spans.first().width() > spans.last().width()) {
		spans.first().html(msg);
		spans.first().parent().css("flex-shrink", 1);
	} else {
		spans.last().html(msg);
		spans.last().parent().css("flex-shrink", 1);
	}
}

function clearSpotlightText() {
	var spans = $("div.spotlight span").html("");
	spans.parent().css("flex-shrink", 0);
	return spans;
}

var tutorialQueue = null;

function startTutorial(){
	if(tutorialQueue == null) {
		$("div.cell").click(function() {
			if(tutorialQueue.length > 0) {
				tutorialQueue.shift().call();
			}
			else {
				doneTutorial();
			}
		});
	}
	tutorialQueue = [tutorialStep2, tutorialStep3, tutorialStep4, tutorialStep5, tutorialConsole,
		tutorialConsoleButtons];
	tutorialStep1();
}

function tutorialStep1() {
	var algoSelect = $("#algoSelect");
	positionSpotlightOnElem(algoSelect);
	setSpotlightText("This is a dropdown that allows you to select the algorithm that is currently being visualized.");
}

function tutorialStep2() {
	var parameters = $("#params");
	positionSpotlightOnElem(parameters);
	setSpotlightText("These are text inputs for the input parameters to the algorithm.");
}

function tutorialStep3() {
	var button = $("#btnSetRoot");
	positionSpotlightOnElem(button);
	setSpotlightText("This button generates the visualization based on the selected algorithm and specified input parameters.");
}

function tutorialStep4() {
	positionSpotlightOnElem(root.elem);
	setSpotlightText("This is the visualization of the selected algorithm on the specified inputs. Each circle is a method call " +
	"where circles inside other circles are recursive calls. The values at the top of the circle are input parameters to that call" +
	" in same order as in the menu. The values at the end of the circle are the return values.");
}

function tutorialStep5() {
	var startList = Circle.centered.elem.find("> .start .node-list-container");
	positionSpotlightOnElem(startList);
	setSpotlightText("You can click on the values to trigger an animation that explains something about how the algorithm works. " +
	"Try clicking on values that the animation flows into to trigger more animations.");
	var validChildren = Circle.centered.children.filter(function(a) {
			return !a.elem.hasClass("abbrev");
		});
	if(validChildren.length > 0) {
		tutorialQueue.unshift(function() {
			tutorialChildCircle(validChildren[0].elem);
		});
	}
}

function tutorialChildCircle(elem) {
	positionSpotlightOnElem(elem);
	setSpotlightText("This is a recursive call. Click on this circle to zoom in to it.");
}

function tutorialConsole() {
	positionSpotlightOnElem($("div.console.fresh"));
	setSpotlightText("This is the text console used to show explanations during the animations. A new panel will slide " +
	"in for each animation with an explanation. Explanations during animations will have progress bars that indicate " +
	"the time allotted for reading. You may click on the explanation to terminate the reading time and continue with " +
	"the animation.");
}

function tutorialConsoleButtons() {
	positionSpotlightOnElem($("#consoleBtns"));
	setSpotlightText("These buttons are used to manipulate the console. The \"<\" button shifts the console panel in focus to " +
	"the panel for the previously executed animation. Similarly, the \">\" button shifts to the panel for the animation " +
	"after the current one. The \"Clear\" button clear all panels related to specific animations.");
}

function doneTutorial() {
	clearSpotlightText();
	var spotlight = $("div.cell");
	spotlight.hide();
	$("div.spotlight").hide("fade");
}