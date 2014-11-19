function positionSpotlight(top, left, width, height) {
	console.log([top, left]);
	var spotlight = $("div.spotlight");
	spotlight.show();
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
	return $("div.spotlight span").html("").css("flex-shrink", 0);
}

function startTutorial(){
	var algoSelect = $("#algoSelect");
	positionSpotlightOnElem(algoSelect);
	algoSelect.click(function () {
		algoSelect.unbind("click");
		tutorialStep2();
	});
	setSpotlightText("Click to select a divide and conquer algorithm");
}

function tutorialStep2() {
	var algoSelect = $("#algoSelect");
	positionSpotlightOnElem(algoSelect.find("paper-dropdown"), algoSelect);
	//positionSpotlightOnElem($("div.console"));
	setSpotlightText("Choose an algorithm from the click");
	algoSelect.click(function() {
		algoSelect.unbind("click");
		tutorialStep3();
	});
}

function tutorialStep3() {
	var parameters = $("#params");
	positionSpotlightOnElem(parameters);
	setSpotlightText("These are text inputs for parameters to the algorithm. Click to automatically enter sample values.");
	parameters.click(function() {
		document.querySelector("#param0").value = "4";
		document.querySelector("#param1").value = "4,2,5,7,8,1,3,8,0";
		parameters.unbind("click");
		tutorialStep4();
	});
}

function tutorialStep4() {
	var button = $("#btnSetRoot");
	positionSpotlightOnElem(button);
	setSpotlightText("Click the button to set the algorithm to visualize and the input parameters set above.");
	button.click(function() {
		button.unbind("click");
		tutorialStep5();
	});
}

function tutorialStep5() {
	var rootList = root.elem.find("> .start .node-list-container");
	//clearSpotlightText();
	positionSpotlightOnElem(rootList);
}