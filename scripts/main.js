//var util = require('util'); //required to print to console

function print(msg) {
	console.log(msg);
}

// Begin real code

function getEmptyExecutionFrame() {
	return {
		parentFrame: null,
		start: null,
		children: [],
		result: null,
		originalToResult: null,
		startAnimations: [],
		endAnimations: [],
		animType: "text"
	};
}

function getEmptyDPExecutionFrame() {
	var ret = getEmptyExecutionFrame();
	ret["methodId"] = null;
	return ret;
}

function getEmptyDPTableEntry() {
	return {
		methodId:null,
		value:null
	};
}

function getNodeSpecification(node, parentLevel, childIndexes, list) {
	return {
		node: node,
		parentLevel: parentLevel,   // 0 = this circle, 1 = this circle's parent, etc.
		childIndexes: childIndexes, // the indexes are used after finding the circle using parentLevel
		list: list
	}
}

function getVisualizationSpecification(parentLevel, childIndexes, list, stackIndex) {
	return {
		parentLevel: parentLevel,   // 0 = this circle, 1 = this circle's parent, etc.
		childIndexes: childIndexes, // the indexes are used after finding the circle using parentLevel
		list: list,
		stackIndex: stackIndex
	}
}

function getEmptyHighlightAnimation() {
	return {
		animationType: "highlight",
		nodeSpecs: [],
		color: "orange"
	}
}

function getEmptyTranslateAnimation() {
	return {
		animationType: "translate",
		sourceSpec: null,
		destSpec: null,
		moveSource: false
	}
}

function getEmptyUnhighlightAnimation() {
	return {
		animationType: "unhighlight",
		nodeSpecs: []
	}
}

function getEmptyTextAnimation() {
	return {
		animationType: "text",
		text: null,
		cardColor: null
	}
}

function getEmptyBucketAnimation() {
	return {
		animationType: "bucket",
		addBuckets: [],
		removeBuckets: [],
		visualizationSpec: null
	}
}

function getEmptyVisibilityAnimation() {
	return {
		animationType: "visibility",
		showRanges: [],
		hideRanges: [],
		visualizationSpec: null
	}
}

function getEmptySwapAnimation() {
	return {
		animationType: "swap",
		node1: null,
		node2: null
	}
}

function getEmptyPhaseAnimation() {
	return {
		animationType: "phase",
		newState: [],
		vSpec: null
	}
}

function getEmptyBundleAnimation() {
	return {
		animationType: "bundle",
		animations: []
	}
}

function printFrame(frame, indents) {
	printTabs(indents);
	print("{\n");
	printTabs(indents);
	print(frame["start"]);
	print("\n");
	for (var i = 0; i < frame["children"].length; i++) {
		printFrame(frame["children"][i], indents + 1);
	}
	printTabs(indents);
	print(frame["result"]);
	print("\n");
	printTabs(indents);
	print(frame["originalToResult"]);
	print("\n");
	printTabs(indents);
	print("}\n");
}

function printTabs(count) {
	for (var i = 0; i < count; i++) print("\t");
}


function Tracker() {
	this.execution = getEmptyExecutionFrame();
	this.currentFrame = this.execution;
	this.type = "rearrange";
}

function DPTracker() {
	this.table = {};
	this.maxId = 0;
}

DPTracker.prototype = new Tracker();
DPTracker.prototype.logExit = function(list) {
	this.currentFrame.methodId = this.maxId++;
	return Tracker.prototype.logExit.call(this, list);
};

Tracker.prototype.traceExecution = function () {
	printFrame(this.execution, 0);
};

Tracker.prototype.logEntry = function (list) {
	var newFrame = getEmptyExecutionFrame();
	newFrame["parentFrame"] = this.currentFrame;
	this.currentFrame["children"].push(newFrame);
	this.currentFrame = newFrame;
	this.currentFrame["start"] = list;
};

Tracker.prototype.logExit = function (list) {
	this.currentFrame["result"] = list;

	if (this.type == "rearrange") {
		var original = this.currentFrame["start"];
		var origToResult = [];

		for (var i = 0; i < list.length; i++) {
			for (var j = 0; j < list.length; j++) {
				if (original[i] == list[j]) {
					origToResult.push(j);
					break;
				}
			}
		}

		this.currentFrame["originalToResult"] = origToResult;
	}

	var oldCurrent = this.currentFrame;
	this.currentFrame = this.currentFrame["parentFrame"];
	return oldCurrent;
};

funcName = "Median of Medians";
dAndC = funcMapping[funcName];
var tracker = new Tracker();
var toSort = [];
var kValue = new ValueNode(2);
for (var i = 15; i > 0; i--) {
	var newNode = new ValueNode(i);
	toSort.push(newNode);
}
shuffle(toSort);
dAndC(kValue, toSort.slice(0));
//test.tracker.traceExecution();
var data = tracker.execution.children[0];
