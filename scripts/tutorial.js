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
		console.log(find);
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

var tutorialQueue = [];

function startTutorial(){
	var algoSelect = $("#algoSelect");
	positionSpotlightOnElem(algoSelect);
	$("div.cell").click(tutorialStep2);
	setSpotlightText("This is a dropdown that allows you to select the algorithm that is currently being visualized.");
}

function tutorialStep2() {
	var parameters = $("#params");
	positionSpotlightOnElem(parameters);
	setSpotlightText("These are text inputs for the input parameters to the algorithm.");
	$("div.cell").click(tutorialStep3);
}

function tutorialStep3() {
	var button = $("#btnSetRoot");
	positionSpotlightOnElem(button);
	setSpotlightText("This button generates the visualization based on the selected algorithm and specified input parameters.");
	$("div.cell").click(tutorialStep4);
}

function tutorialStep4() {
	positionSpotlightOnElem(root.elem);
	setSpotlightText("This is the visualization of the selected algorithm on the specified inputs. Each circle is a method call " +
	"where circles inside other circles are recursive calls. The values at the top of the circle are input parameters to that call" +
	" in same order as in the menu. The values at the end of the circle are the return values.");
	$("div.cell").click(tutorialStep5);
}

function tutorialStep5() {
	var rootList = root.elem.find("> .start .node-list-container");
	positionSpotlightOnElem(rootList);
	setSpotlightText("You can click on the values to trigger an animation that explains something about how the algorithm works. " +
	"Try clicking on values that the animation flows into to trigger more animations.");
	var validChildren = root.children.filter(function(a) {
			return !a.elem.hasClass("abbrev");
		});
	if(validChildren.length > 0) {
		$("div.cell").click(function() {
			console.log(validChildren[0]);
			tutorialChildCircle(validChildren[0].elem);
		});
	}
	else {
		$("div.cell").click(tutorialConsole);
	}
}

function tutorialChildCircle(elem) {
	positionSpotlightOnElem(elem);
	setSpotlightText("This is a recursive call. Click on this circle to zoom in to it.");
	$("div.cell").click(tutorialConsole);
}

function tutorialConsole() {
	positionSpotlightOnElem($("div.console.fresh"));
	setSpotlightText("This is the text console used to show explanations of things during the animations.");
	$("div.cell").click(tutorialConsoleButtons);
}

function tutorialConsoleButtons() {
	positionSpotlightOnElem($("#consoleBtns"));
	setSpotlightText("These buttons are used to manipulate the console.");
	$("div.cell").click(doneTutorial);
}

function doneTutorial() {
	clearSpotlightText();
	var spotlight = $("div.cell");
	spotlight.hide();
	$("div.spotlight").hide("fade");
	spotlight.unbind("click");
}