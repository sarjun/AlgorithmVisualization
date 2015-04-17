//var util = require('util'); //required to print to console

function print(msg) {
	console.log(msg);
}

// Begin real code
var funcNames = [];
var funcMapping = {};
var overviewMapping = {};
var divideMapping = {};
var conquerMapping = {};
var parameterMapping = {};
var trackerMapping = {};
var initParams = {};

var funcName = "";


function getEmptyExecutionFrame() {
	return {
		parentFrame: null,
		start: null,
		children: [],
		result: null,
		originalToResult: null,
		startAnimations: [],
		endAnimations: []
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
		params:{},
		value:null
	};
}

function getNodeSpecification(node, parentLevel, childIndexes, list, boxedListNum) {
	return {
		node: node,
		parentLevel: parentLevel,   // 0 = this circle, 1 = this circle's parent, etc.
		childIndexes: childIndexes, // the indexes are used after finding the circle using parentLevel
		list: list,
		boxedListNum: boxedListNum // -1 = above intermediate; boxedListCount = intermediate below
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

function getCircleSpecification(parentLevel, childIndexes) {
	return {
		parentLevel: parentLevel,   // 0 = this circle, 1 = this circle's parent, etc.
		childIndexes: childIndexes  // the indexes are used after finding the circle using parentLevel
	}
}

function getIntermediateSpecification(parentLevel, childIndexes, list, position, intermIndex) {
	return {
		parentLevel: parentLevel,   // 0 = this circle, 1 = this circle's parent, etc.
		childIndexes: childIndexes, // the indexes are used after finding the circle using parentLevel
		list: list,
		position: position,
		intermIndex: intermIndex    // 1 indexed.
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
	return getTextAnim();
}

function getTextAnim(text, cardColor) {
	return {
		animationType: "text",
		text: text,
		cardColor: cardColor
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

function getEmptySetTableAnimation() {
	return {
		animationType: "setTable",
		maxShowID: null
	}
}

function getEmptyAddToTableAnimation() {
	return {
		animationType: "addToTable",
		ansSpec: null
	}
}

function getEmptyGetFromTableAnimation() {
	return {
		animationType: "getFromTable",
		ansSpec: null
	}
}

function getEmptyCreateIntermediateStepAnimation() {
	return {
		animationType: "createIntermediateStep",
		intermediateId: "",
		entities: [],
		position: null,
		list: null,
		inline: false
	}
}

function getEmptyChangeValueNodeAnimation() {
	return {
		animationType: "changeValueNode",
		nodeSpec: null,
		newValue: null
	}
}

function getEmptyIntermediateAddEntityAnimation() {
	return {
		animationType: "intermediateAddEntity",
		intermSpec: null,
		entityIndex: 0,//insert after this index
		newEntity: null,
		effectParams: null
	}
}

function getEmptyIntermediateRemoveEntityAnimation() {
	return {
		animationType: "intermediateRemoveEntity",
		intermSpec: null,
		entityIndex: 0,
		effectParams: null
	}
}

function getEmptyClearIntermediateAnimation() {
	return {
		animationType: "clearIntermediates"
	}
}

function getEmptyRemoveIntermediateStepAnimation() {
	return {
		animationType: "removeIntermediateStep",
		intermediateId: "",
		position: null,
		list: null
	}
}

function getEmptyRelativeZoomAnimation() {
	return {
		animationType: "zoomRelative",
		circleSpec: null
	}
}

function getEmptyAbsoluteZoomAnimation() {
	return {
		animationType: "zoomAbsolute",
		methodId: 0
	}
}

function addStartAnimation(anim) {
	tracker.currentFrame.startAnimations.push(anim);
}

function addEndAnimation(anim) {
	tracker.currentFrame.endAnimations.push(anim);
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
	this.maxId = 0;
}

DPTracker.prototype = new Tracker();
function DPTracker() {
	Tracker.call(this);
	this.table = {};
}
DPTracker.prototype.constructor = DPTracker;

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
	this.currentFrame.methodId = this.maxId++;
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

var tracker = new Tracker();

