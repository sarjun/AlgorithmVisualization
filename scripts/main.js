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

function getEmptyHighlightAnimation() {
	return {
		animationType: "highlight",
		nodes: [],
		circles: [],
		lists: [],
		color: "orange"
	}
}

function getEmptyTranslateAnimation() {
	return {
		animationType: "translate",
		sourceNode: null,
		destNode: null,
		sourceCircle: null,
		sourceList: null,
		destCircle: null,
		destList: null,
		moveSource: false
	}
}

function getEmptyUnhighlightAnimation() {
	return {
		animationType: "unhighlight",
		nodes: [],
		circles: [],
		lists: []
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
		removeBuckets: []
	}
}

function getEmptyVisibilityAnimation() {
	return {
		animationType: "visibility",
		showRanges: [],
		hideRanges: []
	}
}

function getEmptySwapAnimation() {
	return {
		animationType: "swap",
		nodePair: []
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

Tracker.prototype.traceExecution = function () {
	printFrame(this.execution, 0);
}

Tracker.prototype.logEntry = function (list) {
	var newFrame = getEmptyExecutionFrame();
	newFrame["parentFrame"] = this.currentFrame;
	this.currentFrame["children"].push(newFrame);
	this.currentFrame = newFrame;
	this.currentFrame["start"] = list;
}

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

	this.currentFrame = this.currentFrame["parentFrame"];
}


var track = new Tracker();
var toSort = [];
for (var i = 9; i > 0; i--) {
	var newNode = new ValueNode(i);
	toSort.push(newNode);
}
console.log(quickSelect(track, 2, toSort, false, 0));
console.log("done");

dAndC = funcMapping[funcName];
var track = new Tracker();
var toSort = [];
for (var i = 15; i > 0; i--) {
	var newNode = new ValueNode(i);
	toSort.push(newNode);
}
dAndC(track, new ValueNode(2), toSort);
//test.tracker.traceExecution();
var data = track.execution.children[0];
