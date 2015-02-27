/**
 * Created by Arjun on 1/28/2015.
 */
funcName = "Fibonacci";
var intermId = 0;
function fibonacci(n) {
	tracker.logEntry([n]);
	var resetTable = getEmptySetTableAnimation();
	resetTable.maxShowID = tracker.maxId - 1;
	tracker.currentFrame.startAnimations.push(resetTable);

	var ans = tracker.table[n.value];
	if(ans != null) {
		var getEntry = getEmptyGetFromTableAnimation();
		getEntry.ansSpec = getNodeSpecification(ans.value, 0, [], "end");
		tracker.currentFrame.startAnimations.push(getEntry);
		resetTable = getEmptySetTableAnimation();
		tracker.currentFrame.endAnimations.push(resetTable);
		var frame = tracker.logExit([ans.value]);
		resetTable.maxShowID = frame.methodId - 1;
		return ans.value;
	}
	if(n.value < 2){
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = n;
		tEntry.params.n = n;
		resetTable = getEmptySetTableAnimation();
		tracker.currentFrame.endAnimations.push(resetTable);
		var frame = tracker.logExit([n]);
		tEntry.methodId = frame.methodId;
		resetTable.maxShowID = frame.methodId - 1;
		tracker.table[n.value] = tEntry;
		return n;
	}
	var recurrence = getEmptyCreateIntermediateStepAnimation();
	recurrence.intermediateId = intermId++;
	recurrence.list = "start";
	recurrence.position = "below";
	recurrence.entities = ["\\(t(\\)", new ValueNode("\\(n\\)"), "\\() = t(\\)", new ValueNode("\\(n\\)"), "\\(-1\\)", "\\() + t(\\)", new ValueNode("\\(n\\)"), "\\(-2\\)", "\\()\\)"];
	tracker.currentFrame.startAnimations.push(recurrence);
	var nSpreadBundle = getEmptyBundleAnimation();
	var nTransition = getEmptyTranslateAnimation();
	nTransition.sourceSpec = getNodeSpecification(n, 0, [], "start", 0);
	nTransition.destSpec = getNodeSpecification(recurrence.entities[1], 0, [], "start", 1);
	nSpreadBundle.animations.push(nTransition);
	nTransition = getEmptyTranslateAnimation();
	nTransition.sourceSpec = getNodeSpecification(n, 0, [], "start", 0);
	nTransition.destSpec = getNodeSpecification(recurrence.entities[3], 0, [], "start", 1);
	nSpreadBundle.animations.push(nTransition);
	nTransition = getEmptyTranslateAnimation();
	nTransition.sourceSpec = getNodeSpecification(n, 0, [], "start", 0);
	nTransition.destSpec = getNodeSpecification(recurrence.entities[6], 0, [], "start", 1);
	nSpreadBundle.animations.push(nTransition);
	tracker.currentFrame.startAnimations.push(nSpreadBundle);
	ans = fibonacci(new ValueNode(n.value - 1)).value + fibonacci(new ValueNode(n.value - 2)).value;
	var tEntry = getEmptyDPTableEntry();
	var value = new ValueNode(ans);
	var addEntry = getEmptyAddToTableAnimation();
	addEntry.ansSpec = getNodeSpecification(value, 0, [], "end");
	resetTable = getEmptySetTableAnimation();
	tracker.currentFrame.endAnimations.push(resetTable);
	tracker.currentFrame.endAnimations.push(addEntry);
	tEntry.value = value;
	tEntry.params.n = n;
	var frame = tracker.logExit([value]);
	tEntry.methodId = frame.methodId;
	resetTable.maxShowID = frame.methodId - 1;
	resetTable = getEmptySetTableAnimation();
	frame.endAnimations.push(resetTable);
	resetTable.maxShowID = frame.methodId + 1;
	tracker.table[n.value] = tEntry;
	return value;
}

funcMapping[funcName] = fibonacci;
overviewMapping[funcName] = "This is a function that finds the nth number in the Fibonacci sequence.";
divideMapping[funcName] = "The input list is divided into buckets of size 5. We then find the median of each bucket and " +
"recursively find the median of these medians.";
conquerMapping[funcName] = "The input list is partitioned on the median of medians from the previous recursive call. " +
"The algorithm terminates if the median of medians is at" +
" index k. Otherwise, we recurse on the half of the partitioned list that contains the desired index.";
parameterMapping[funcName] = ["n : uint"];
trackerMapping[funcName] = DPTracker;


funcName = "Longest Common Subsequence";
function lcs(x, y) {
	tracker.logEntry([x, y]);
	var resetTable = getEmptySetTableAnimation();
	resetTable.maxShowID = tracker.maxId - 1;
	tracker.currentFrame.startAnimations.push(resetTable);

	var key = x.value.length + "," + y.value.length;
	var ans = tracker.table[key];
	if(ans != null) {
		tracker.logExit([ans.value]);
		return ans.value;
	}
	if(x.value.length == 0 || y.value.length == 0) {
		var ret = new ValueNode(0);
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = ret;
		tEntry.params.x = x;
		tEntry.params.y = y;
		var frame = tracker.logExit([ret]);
		tEntry.methodId = frame.methodId;
		tracker.table[key] = tEntry;
		return ret;
	}
	if(x.value.charAt(0)== y.value.charAt(0)) {
		var ret = new ValueNode(1 + lcs(new ValueNode(x.value.substr(1)), new ValueNode(y.value.substr(1))).value);
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = ret;
		tEntry.params.x = x;
		tEntry.params.y = y;
		var frame = tracker.logExit([ret]);
		tEntry.methodId = frame.methodId;
		tracker.table[key] = tEntry;
		return ret;
	}
	else {
		var ignoreX = lcs(new ValueNode(x.value.substr(1)), y);
		var ignoreY = lcs(x, new ValueNode(y.value.substr(1)));
		var ret = ignoreX.value > ignoreY.value ? ignoreX : ignoreY;
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = ret;
		tEntry.params.x = x;
		tEntry.params.y = y;
		var frame = tracker.logExit([ret]);
		tEntry.methodId = frame.methodId;
		tracker.table[key] = tEntry;
		return ret;
	}
}

funcMapping[funcName] = lcs;
overviewMapping[funcName] = "This function selects the kth smallest (where k is zero-indexed) element from the input list. " +
"This is done by repeatedly partitioning the list and looking in the appropriate half until the selected partition is the desired element.";
divideMapping[funcName] = "The input list is divided into buckets of size 5. We then find the median of each bucket and " +
"recursively find the median of these medians.";
conquerMapping[funcName] = "The input list is partitioned on the median of medians from the previous recursive call. " +
"The algorithm terminates if the median of medians is at" +
" index k. Otherwise, we recurse on the half of the partitioned list that contains the desired index.";
parameterMapping[funcName] = ["s1 : string", "s2 : string"];
trackerMapping[funcName] = DPTracker;
