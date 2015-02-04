//$(init);

document.addEventListener('polymer-ready', init);
var root;
var rootSize;
var centerOfScreen, parentHeight, parentWidth;
var mainDiv, mainPanel, contentDiv, memoDiv;
var btnSetRoot;

function setContentSize() {
	parentHeight = mainPanel.height() - $("core-header-panel[main] core-toolbar#mainheader").height();
	parentWidth = contentDiv.width();
	centerOfScreen = [parentWidth / 2, parentHeight / 2];
	rootSize = Math.floor(Math.min(parentHeight, parentWidth) * 0.9);
	if (root != null) {
		root.elem.width(rootSize).height(rootSize);
		var currentCenter = Circle.centered;
		Circle.centered = null;
		currentCenter.center(false);
	}
}

function init() {
	funcName = "Median of Medians";
	var dAndC = funcMapping[funcName];
	var toSort = [];
	var kValue = new ValueNode(2);
	for (var i = 15; i > 0; i--) {
		var newNode = new ValueNode(i);
		toSort.push(newNode);
	}
	shuffle(toSort);
	dAndC(kValue, toSort.slice(0));
	var data = tracker.execution.children[0];

	initAlgorithm(funcName);
	initAlgoSelect();
	mainPanel = $("core-header-panel[main]");
	btnSetRoot = document.querySelector("#btnSetRoot");
	mainPanel[0].shadowRoot.getElementById("mainContainer").style.overflow = "hidden";
	mainDiv = $("<div class='main'></div>");
	memoDiv = $("div.memo");
	contentDiv = $("div.content");
	contentDiv.append(mainDiv);
	setContentSize();
	$(window).resize(setContentSize);
	//mainDiv.width(parentWidth).height(parentHeight);
	makeCircle(null, data, mainDiv, rootSize);
	root.center(false);
	$(btnSetRoot).click(function () {
		if (BoxedList.animating != null) {
			clearTimeout(BoxedList.animating);
			BoxedList.animating = null;
			clearConsole();
		}
		var params = [];
		$("section#params").children().each(function (i, e) {
			e.value = e.value.trim();
			if (e.value.charAt(0) == '[' && e.value.charAt(e.value.length - 1) == ']') {
				var list = e.value.substring(1, e.value.length - 1).split(",");
				for (var i in list) {
					if (list[i].trim().length > 0) {
						list[i] = new ValueNode(list[i] * 1);
					} else {
						list.splice(i, 1);
					}
				}
				params.push(list);
			} else {
				params.push(new ValueNode(e.value * 1));
			}
		});
		var dAndC = funcMapping[funcName];
		tracker = new trackerMapping[funcName]();
		dAndC.apply(this, params);
		data = tracker.execution.children[0];
		mainDiv.empty();
		root = null;
		memoDiv.empty();
		makeCircle(null, data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
		if(tracker.table != null) {
			var tableElem = $("<table></table>");
			var first = true;
			for(entryKey in tracker.table) {
				var rowElem = $("<tr></tr>");
				var entry = tracker.table[entryKey];
				if(first) {
					var headerElem = $("<tr></tr>");
					for(key in entry.params) headerElem.append("<td>" + key + "</td>");
					headerElem.append("<td>Value</td>");
					first = false;
					tableElem.append(headerElem);
				}
				for(key in entry.params) {
					rowElem.append("<td>" + entry.params[key].value + "</td>");
				}
				rowElem.append("<td>" + entry.value.value + "</td>");
				tableElem.append(rowElem);
			}
			memoDiv.append(tableElem);
		}
		root.center(false);
		setContentSize();
	});
	$("#btnStartTutorial").click(function() {
		root.center(true);
		startTutorial();
	});

	initConsole();
	initMenuValues();
	$("div.spotlight").hide();
	setContentSize();
	//startTutorial();
}

function initMenuValues() {
	var initDropdown = function() {
		try {
			var algoSel = document.querySelector("#algoSelect");
			algoSel.selectedItemLabel = funcName;
		}
		catch(err) {
			setTimeout(initDropdown, 100);
		}
	};
	setTimeout(initDropdown, 100);

	var initParams = function() {
		try {
			var inputs = document.querySelector("#params").children;
			inputs[0].value = kValue.value + "";
			var show = "[";
			for(var index = 0; index < toSort.length; index++) {
				show += toSort[index].value + ",";
			}
			show = show.substr(0, show.length - 1) + "]";
			inputs[1].value = show;
		}
		catch(err) {
			setTimeout(initParams, 100);
		}
	};
	setTimeout(initParams, 100);
	//for(var i in inputs) {
	//
	//}
}

function initAlgoSelect() {
	var algoTemplate = document.querySelector('template#algoTemplate');
	algoTemplate.algorithms = Object.keys(overviewMapping).map(
		function(key) {
			return {
				name: key,
				value: key
			};
		}
	);
	algoTemplate.algorithms.shift(); // TODO: remove this hack...
	algoTemplate.algoSelect = function (e, details) {
		if (details.isSelected) {
			funcName = details.item.templateInstance.model.value;
			initAlgorithm(funcName);
		}
	};
}
function initAlgorithm(funcName) {
	$("span#algoTitle").text(funcName);
	var params = parameterMapping[funcName];
	var paramBox = $("section#params");
	paramBox.empty();
	for (var i in params) {
		var input = $('<paper-input floatingLabel id="param' + i + '" label="' + params[i] + '"></paper-input>');
		paramBox.append(input);
		input.keyup(function(event){
			if(event.keyCode == 13){
				$("#btnSetRoot").click();
			}
		});
	}
}

function initConsole() {
	$("a#btnClearConsole").click(clearConsole).hover(function () {
		$("div.console").css("opacity", "0.5");
	}, function() {
		$("div.console").css("opacity", "1.0");
	});
	$("a#btnPrevConsole").click(function () {
		if (BoxedList.animating != null) return;
		var currentConsole = $("div.console.fresh");
		var previousConsole = currentConsole.prev();
		if (previousConsole.hasClass("console")) {
			currentConsole.hide("slide", {direction: "right"});
			previousConsole.show("slide", {direction: "left"});
			currentConsole.removeClass("fresh");
			previousConsole.addClass("fresh");
		}
	});
	$("a#btnNextConsole").click(function () {
		if (BoxedList.animating != null) return;
		var currentConsole = $("div.console.fresh");
		var nextConsole = currentConsole.next();
		if (nextConsole.hasClass("console")) {
			currentConsole.hide("slide", {direction: "left"});
			nextConsole.show("slide", {direction: "right"});
			currentConsole.removeClass("fresh");
			nextConsole.addClass("fresh");
		}
	});
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