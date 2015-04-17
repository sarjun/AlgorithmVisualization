//$(init);

document.addEventListener('polymer-ready', init);
var root;
var rootHeight, rootWidth;
var centerOfScreen, parentHeight, parentWidth;
var mainDiv, mainPanel, contentDiv, memoDiv, contentHolderDiv;
var btnSetRoot;
var tableManager;
var MAX_RATIO = Math.sqrt(2);

function setContentSize() {
	parentHeight = mainPanel.height() - $("core-header-panel[main] core-toolbar#mainheader").height();
	parentWidth = contentDiv.width();
	centerOfScreen = [parentWidth / 2, parentHeight / 2];
	rootHeight = parentHeight * 0.9;
	rootWidth = parentWidth * 0.9;
	if (rootWidth > rootHeight) {
		if (rootWidth > rootHeight * MAX_RATIO) rootWidth = rootHeight * MAX_RATIO;
	} else {
		if (rootHeight > rootWidth * MAX_RATIO) rootHeight = rootWidth * MAX_RATIO;
	}
	//rootHeight = Math.floor(Math.min(parentHeight, parentWidth) * 0.9);
	//rootWidth = Math.floor(Math.min(parentHeight, parentWidth) * 0.9);
	if (root != null) {
		root.elem.width(rootWidth).height(rootHeight);
		var currentCenter = Circle.centered;
		Circle.centered = null;
		currentCenter.center(false);
	}
}

function init() {
	tableManager = new TableManager();
	funcName = "Maximum Random Walk";
	tracker = new trackerMapping[funcName]();
	var localInitParams = initParams[funcName].slice(0, initParams[funcName].length);
	for(var i=0; i<localInitParams.length; i++) {
		if(Array.isArray(localInitParams[i])) {
			var newList = [];
			for(var j=0; j<localInitParams[i].length; j++) {
				newList[j] = new ValueNode(localInitParams[i][j].value);
			}
			localInitParams[i] = newList;
		} else {
			localInitParams[i] = new ValueNode(localInitParams[i].value);
		}
	}
	funcMapping[funcName].apply(null, localInitParams);
	var data = tracker.execution.children[0];
	if(tracker.table != null) {
		tableManager.createTable(tracker.table);
	}

	initAlgorithm(funcName);
	initAlgoSelect();
	mainPanel = $("core-header-panel[main]");
	btnSetRoot = document.querySelector("#btnSetRoot");
	mainPanel[0].shadowRoot.getElementById("mainContainer").style.overflow = "hidden";
	mainDiv = $("<div class='main'></div>");
	memoDiv = $("div.memo");
	contentHolderDiv = $("div.content-holder");
	contentDiv = $("div.content");
	contentDiv.append(mainDiv);
	setContentSize();
	$(window).resize(setContentSize);
	//mainDiv.width(parentWidth).height(parentHeight);
	makeCircle(null, data, mainDiv, rootHeight, rootWidth, 0);
	root.center(false);
	document.querySelector("#navicon").addEventListener('click', function() {
		document.querySelector("core-drawer-panel").togglePanel();
	});
	$(btnSetRoot).click(function () {
		if (BoxedList.animating != null) {
			clearTimeout(BoxedList.animating);
			BoxedList.animating = null;
			clearConsole();
		}
		var params = [];
		$("section#params").children().each(function (i, e) {
			e.value = e.value.trim();
			var type = parameterMapping[funcName][i].split(":")[1].trim();
			if (type.charAt(0) == '[' && type.charAt(type.length - 1) == ']') {
				var list = e.value.substring(1, e.value.length - 1).split(",");
				var listType = type.substring(1, type.length - 1);
				for (var i in list) {
					if (list[i].trim().length > 0) {
						list[i] = new ValueNode(list[i], listType);
					} else {
						list.splice(i, 1);
					}
				}
				params.push(list);
			} else {
				params.push(new ValueNode(e.value, type));
			}
		});
		var dAndC = funcMapping[funcName];
		tracker = new trackerMapping[funcName]();
		dAndC.apply(this, params);
		data = tracker.execution.children[0];
		mainDiv.empty();
		root = null;
		memoDiv.empty();
		makeCircle(null, data, mainDiv, 0, 0, 0);
		if(tracker.table != null) {
			tableManager.createTable(tracker.table);
		}
		root.center(false);
		reinitConsole();
		setContentSize();
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		formatVerticalText();
		document.querySelector("core-drawer-panel").closeDrawer();
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
			updateDrawerWidth();
		}
		catch(err) {
			setTimeout(initDropdown, 100);
		}
	};
	setTimeout(initDropdown, 100);

	var initParamValues = function() {
		try {
			var inputs = document.querySelector("#params").children;
			for(var i=0; i<initParams[funcName].length; i++) {
				if(Array.isArray(initParams[funcName][i])) {
					var show = "[";
					for(var index = 0; index < initParams[funcName][i].length; index++) {
						show += initParams[funcName][i][index].value + ",";
					}
					show = show.substr(0, show.length - 1) + "]";
					inputs[i].value = show;
				} else {
					inputs[i].value = initParams[funcName][i].value + "";
				}
			}
			updateDrawerWidth();
		}
		catch(err) {
			setTimeout(initParamValues, 100);
		}
	};
	setTimeout(initParamValues, 100);
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
	updateDrawerWidth();
}

function updateDrawerWidth(){
	$("core-menu.select").parent().show();
	var maxWidth = $("core-menu.select").width();
	if (maxWidth < 100) maxWidth = 100;
	$("core-menu.select").parent().hide();
	document.querySelector("core-drawer-panel").drawerWidth = (maxWidth + 24) + "px";
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
	reinitConsole();
}

function reinitConsole() {
	clearConsole();
	var summaryTab = $("div.console.summary");
	summaryTab.empty();
	addConsoleCard(overviewMapping[funcName]);
	addConsoleCard(divideMapping[funcName]);
	addConsoleCard(conquerMapping[funcName]);
	summaryTab.scrollTop(0);
}

function makeCircle(parentCircle, node, parentElem, height, width, depth) {
	var newCircle = new Circle(parentCircle, parentElem, node, height, width);
	if (root == null) {
		root = newCircle;
		rootHeight = height;
		rootWidth = width;
	}
	if (node.children.length > 0) {
		var childSize = 100 / Math.max(2, node.children.length) + "%";
		for (var i = 0; i < node.children.length; i++) {
			newCircle.children.push(makeCircle(newCircle, node.children[i], newCircle.elem, childSize, "", depth + 1));
		}
	}
	newCircle.depth = depth;
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