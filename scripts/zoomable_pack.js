//$(init);

document.addEventListener('polymer-ready', init);
var root;
var rootSize;
var centerOfScreen;
var mainDiv;
var btnSetRoot;
var cardConsole;

function init() {
	if (data == null) return;
	initAlgorithm(funcName);
	initAlgoSelect();
	var mainPanel = $("core-header-panel[main]");
	btnSetRoot = document.querySelector("#btnSetRoot");
	mainPanel[0].shadowRoot.getElementById("mainContainer").style.overflow = "hidden";
	mainDiv = $("<div class='main'></div>");
	var contentDiv = $("div.content");
	contentDiv.append(mainDiv);
	var parentHeight = mainPanel.height() - $("core-header-panel[main] core-toolbar#mainheader").height();
	var parentWidth = contentDiv.width();
	centerOfScreen = [parentWidth / 2, parentHeight / 2];
	//mainDiv.width(parentWidth).height(parentHeight);
	makeCircle(null, data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
	root.center(false);
	$(btnSetRoot).click(function () {
		var params = [];
		$("section#params").children().each(function (i, e) {
			var list = e.value.split(",");
			if (list.length > 1) {
				for (var i in list) {
					if (list[i].trim().length > 0) {
						list[i] = new ValueNode(list[i] * 1);
					} else {
						list.splice(i, 1);
					}
				}
				params.push(list);
			} else {
				params.push(new ValueNode(list[0] * 1));
			}
		});
		dAndC = funcMapping[funcName];
		tracker = new Tracker();
		dAndC.apply(this, params);
		data = tracker.execution.children[0];
		mainDiv.empty();
		root = null;
		makeCircle(null, data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
		root.center(false);
	});

	initConsole();
}
function initAlgoSelect() {
	var algoTemplate = document.querySelector('template#algoTemplate');
	algoTemplate.algorithms = [
		{name: 'Merge Sort', value: 'Merge Sort'},
		{name: 'Quick Select', value: 'Quick Select'}
	];
	algoTemplate.algoSelect = function (e, details) {
		if (details.isSelected) {
			funcName = details.item.templateInstance.model.value;
			initAlgorithm(funcName);
		}
	};
}
function initAlgorithm(funcName) {
	var params = parameterMapping[funcName];
	$("section#params").empty();
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

function makeCircle(parentCircle, node, parentElem, size) {
	var newCircle = new Circle(parentCircle, parentElem, node, size);
	if (root == null) {
		root = newCircle;
		rootSize = size;
	}
	if (node.children.length > 0) {
		var childSize = 100 / node.children.length + "%";
		for (var i = 0; i < node.children.length; i++) {
			newCircle.children.push(makeCircle(newCircle, node.children[i], newCircle.elem, childSize));
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