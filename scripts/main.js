//var util = require('util'); //required to print to console

function print(msg) {
    console.log(msg);
}

// Begin real code

function getEmptyExecutionFrame() {
	return {
		parentFrame:null,
		start:null,
		children:[],
		result:null,
		originalToResult:null,
		animations:[],
		animType:"text"
	};
}

function getEmptyHighlightAnimation() {
	return {
		animationType:"highlight",
		nodes:[],
		color:"orange"
	}
}

function getEmptyTranslateAnimation() {
	return {
		animationType:"translate",
		sourceNodes:[],
		destNode:null
	}
}

function getEmptyUnhighlightAnimation() {
	return {
		animationType:"unhighlight",
		nodes:[]
	}
}
function printFrame(frame, indents) {
	printTabs(indents);
	print("{\n");
	printTabs(indents);
	print(frame["start"]);
	print("\n");
	for(var i = 0; i<frame["children"].length; i++) {
		printFrame(frame["children"][i], indents+1);
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
	for(var i = 0; i < count; i++) print("\t");
}


function Tracker() {
	this.execution = getEmptyExecutionFrame();
	this.currentFrame = this.execution;
	this.type = "rearrange";
}

Tracker.prototype.traceExecution = function() {
	printFrame(this.execution, 0);
}

Tracker.prototype.logEntry = function(list) {
	var newFrame = getEmptyExecutionFrame();
	newFrame["parentFrame"] = this.currentFrame;
	this.currentFrame["children"].push(newFrame);
	this.currentFrame = newFrame;
	this.currentFrame["start"] = list;
}

Tracker.prototype.logExit = function(list) {
	this.currentFrame["result"] = list;

	if(this.type == "rearrange") {
		var original = this.currentFrame["start"];
		var origToResult = [];
		
		for(var i = 0; i < list.length; i++) {
			for(var j = 0; j < list.length; j++) {
				if(original[i] == list[j]) {
					origToResult.push(j);
					break;
				}
			}
		}

		this.currentFrame["originalToResult"] = origToResult;
	}

	this.currentFrame = this.currentFrame["parentFrame"];
}

function Container() {
	this.tracker = new Tracker();
}

Container.prototype.dAndC = function(tracker, list) {
	// Divide and conquer algorithm
	// eventually this would come from the web page
	// for now, we will use mergesort
	tracker.logEntry(list);
	if(list.length == 1) {
		tracker.logExit(list);
		return list;
	}
	var firstHalf = list.slice(0, list.length/2);
	var secondHalf = list.slice(list.length/2);
	firstHalf = this.dAndC(tracker, firstHalf);
	secondHalf = this.dAndC(tracker, secondHalf);

	var sorted = [];
	var first = 0, second = 0;
	var highlightStart = getEmptyHighlightAnimation();
	highlightStart.nodes.push(firstHalf[first]);
	highlightStart.nodes.push(secondHalf[second]);
	tracker.currentFrame.animations.push(highlightStart);
	for(var i=0; i<list.length; i++) {
		if(first == firstHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNodes.push(secondHalf[second]);
			translate.destNode = secondHalf[second];
			tracker.currentFrame.animations.push(translate);
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodes.push(secondHalf[second]);
			tracker.currentFrame.animations.push(unhighlight);
			if(second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(secondHalf[second]);
				tracker.currentFrame.animations.push(highlight);
			}
			continue;
		}
		if(second == secondHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNodes.push(firstHalf[first]);
			translate.destNode = firstHalf[first];
			tracker.currentFrame.animations.push(translate);
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodes.push(firstHalf[first]);
			tracker.currentFrame.animations.push(unhighlight);
			sorted.push(firstHalf[first++]);
			if(first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(firstHalf[first]);
				tracker.currentFrame.animations.push(highlight);
			}
			continue;
		}
		//console.log(first);
		//console.log(firstHalf);
		//console.log(firstHalf.length);
		if(firstHalf[first].value > secondHalf[second].value) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNodes.push(secondHalf[second]);
			translate.destNode = secondHalf[second];
			tracker.currentFrame.animations.push(translate);
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodes.push(secondHalf[second]);
			tracker.currentFrame.animations.push(unhighlight);
			sorted.push(secondHalf[second++]);
			if(second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(secondHalf[second]);
				tracker.currentFrame.animations.push(highlight);
			}
		}
		else {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNodes.push(firstHalf[first]);
			translate.destNode = firstHalf[first];
			tracker.currentFrame.animations.push(translate);
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodes.push(firstHalf[first]);
			tracker.currentFrame.animations.push(unhighlight);
			if(first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(firstHalf[first]);
				tracker.currentFrame.animations.push(highlight);
			}
			sorted.push(firstHalf[first++]);
		}
	}

	tracker.logExit(sorted);
	return sorted;
}

var test = new Container();
var track = new Tracker();
var toSort = [];
for(var i=8; i>=1; i--) {
	var newNode = new Node(i);
	toSort.push(newNode);
}
test.dAndC(track, toSort);
//test.tracker.traceExecution();
var data = track.execution.children[0];
