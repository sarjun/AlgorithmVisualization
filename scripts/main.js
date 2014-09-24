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
		originalToResult:null
	};
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

Container.prototype.runDivideAndConquer = function() {
	//print("currentList: " + arguments[0] + "\n");
	//this.tracker.traceExecution();
	//print("\n");
	this.tracker.logEntry(arguments[0]);
	var result = this["dAndC"].apply(this, arguments);
	//print("logging exit: " + result + "\n");
	this.tracker.logExit(result);
	//print("done logging\n");

	return result;
}

Container.prototype.dAndC = function(list) {
	// Divide and conquer algorithm
	// eventually this would come from the web page
	// for now, we will use mergesort
	if(list.length == 1) return list;
	var firstHalf = list.slice(0, list.length/2);
	var secondHalf = list.slice(list.length/2);
	firstHalf = this.runDivideAndConquer(firstHalf);
	secondHalf = this.runDivideAndConquer(secondHalf);

	var sorted = [];
	var first = 0, second = 0;
	for(var i=0; i<list.length; i++) {
		if(first > firstHalf.length) sorted.push(secondHalf[second++]);
		if(second > secondHalf.length) sorted.push(firstHalf[first++]);
		if(firstHalf[first] > secondHalf[second]) sorted.push(secondHalf[second++]);
		else sorted.push(firstHalf[first++]);
	}

	return sorted;
}

function addSize(frame) {
	if (frame["children"].length == 0) {
		frame.size = 10;
	}
	else {
		for(var i=0; i < frame["children"].length; i++) {
			addSize(frame["children"][i]);
		}
	}
}

var test = new Container();
test.runDivideAndConquer([8, 7, 6, 5, 4, 3, 2, 1]);
test.tracker.traceExecution();
addSize(test.tracker.execution);
var data = test.tracker.execution;
