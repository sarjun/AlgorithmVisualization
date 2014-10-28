//$(init);

document.addEventListener('polymer-ready', init);
var root;
var rootSize;
var centerOfScreen;
var mainDiv;
var initList, btnSetRoot;
var cardConsole;

function init() {
	if (data == null) return;
	initAlgorithm(funcName);
	var mainPanel = $("core-header-panel[main]");
	initList = document.querySelector("#param0");
	btnSetRoot = document.querySelector("#btnSetRoot");
	mainPanel[0].shadowRoot.getElementById("mainContainer").style.overflow = "hidden"
	mainDiv = $("<div class='main'></div>");
	var contentDiv = $("div.content");
	contentDiv.append(mainDiv);
	var parentHeight = mainPanel.height() - $("core-header-panel[main] core-toolbar#mainheader").height();
	var parentWidth = contentDiv.width();
	centerOfScreen = [parentWidth / 2, parentHeight / 2];
	//mainDiv.width(parentWidth).height(parentHeight);
	makeCircle(data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
	root.click();
	$(btnSetRoot).click(function () {
		toSort = [];
		track = new Tracker();
		var newList = initList.value.split(",");
		for (var i in newList) {
			var newNode = new ValueNode(newList[i] * 1);
			toSort.push(newNode);
		}
		dAndC(track, toSort);
		data = track.execution.children[0];
		mainDiv.empty();
		root = null;
		makeCircle(data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
		root.click();
	});

	initConsole();
}

function initAlgorithm(funcName) {
	var params = parameterMapping[funcName];
	for (var i in params) {
		$("section#params").append('<paper-input floatingLabel id="param' + i + '" label="' + params[i] + '"></paper-input>');
	}
}

function initConsole() {
	cardConsole = $("div.console");
	$("a#btnClearConsole").click(clearConsole);
	addConsoleCard(overviewMapping[funcName]);
	addConsoleCard(divideMapping[funcName]);
	addConsoleCard(conquerMapping[funcName]);
}

function makeCircle(node, parentElem, size) {
	var newCircle = new Circle(parentElem, node, size);
	if (root == null) {
		root = newCircle;
		rootSize = size;
	}
	if (node.children.length > 0) {
		var childSize = 100 / node.children.length + "%";
		for (var i = 0; i < node.children.length; i++) {
			newCircle.children.push(makeCircle(node.children[i], newCircle.elem, childSize));
		}
	}
	return newCircle;
}

function getCenter(elem) {
	var offset = offsetFrom(elem, mainDiv);
	return [offset.left + elem.width() / 2, offset.top + elem.height() / 2];
}

function offsetFrom(elem, parent) {
	var offset = elem.offset();
	var parentOffset = parent.offset();
	offset.top -= parentOffset.top;
	offset.left -= parentOffset.left;
	return offset;
}