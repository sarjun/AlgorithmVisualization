/**
 * Created by Arjun on 1/28/2015.
 */
funcName = "Fibonacci";
function fibonacci(n) {
	var intermId = 0;
	tracker.logEntry([n]);
	var zoomAnimation = getEmptyAbsoluteZoomAnimation();
	tracker.currentFrame.startAnimations.push(zoomAnimation);
	tracker.currentFrame.endAnimations.push(zoomAnimation);
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
		zoomAnimation.methodId = frame.methodId;
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
		zoomAnimation.methodId = frame.methodId;
		tEntry.methodId = frame.methodId;
		resetTable.maxShowID = frame.methodId - 1;
		tracker.table[n.value] = tEntry;
		return n;
	}
	var nNodes = [new ValueNode("\\(n\\)"), new ValueNode("\\(n\\)"), new ValueNode("\\(n\\)")];
	var recurrence = getEmptyCreateIntermediateStepAnimation();
	recurrence.intermediateId = intermId++;
	recurrence.list = "start";
	recurrence.position = "below";
	recurrence.entities = ["\\(t(\\)", nNodes[0], "\\() = t(\\)", nNodes[1], "\\(-1\\)", "\\() + t(\\)", nNodes[2], "\\(-2\\)", "\\()\\)"];
	tracker.currentFrame.startAnimations.push(recurrence);
	var nSpreadBundle = getEmptyBundleAnimation();
	var nChangeBundle = getEmptyBundleAnimation();
	for (var i in nNodes) {
		var nTransition = getEmptyTranslateAnimation();
		nTransition.sourceSpec = getNodeSpecification(n, 0, [], "start", 0);
		nTransition.destSpec = getNodeSpecification(nNodes[i], 0, [], "start", 1);
		nSpreadBundle.animations.push(nTransition);
		var nChangeValue = getEmptyChangeValueNodeAnimation();
		nChangeValue.nodeSpec = nTransition.destSpec;
		nChangeValue.newValue = n.value;
		nChangeBundle.animations.push(nChangeValue);
	}
	tracker.currentFrame.startAnimations.push(nSpreadBundle);
	tracker.currentFrame.startAnimations.push(nChangeBundle);
	var mathRemoveBundle = getEmptyBundleAnimation();
	var removeIndices = [8, 5];
	for (var i in removeIndices) {
		var mathRemove = getEmptyIntermediateRemoveEntityAnimation();
		mathRemove.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		mathRemove.entityIndex = removeIndices[i];
		mathRemove.effectParams = ["highlight"];
		mathRemoveBundle.animations.push(mathRemove);
	}
	tracker.currentFrame.startAnimations.push(mathRemoveBundle);
	var child1 = new ValueNode(n.value - 1);
	var child2 = new ValueNode(n.value - 2);
	var doMathBundle = getEmptyBundleAnimation();
	var doMath1 = getEmptyChangeValueNodeAnimation();
	doMath1.nodeSpec = getNodeSpecification(nNodes[1], 0, [], "start", 1);
	doMath1.newValue = child1.value;
	doMathBundle.animations.push(doMath1);
	var doMath2 = getEmptyChangeValueNodeAnimation();
	doMath2.nodeSpec = getNodeSpecification(nNodes[2], 0, [], "start", 1);
	doMath2.newValue = child2.value;
	doMathBundle.animations.push(doMath2);
	tracker.currentFrame.startAnimations.push(doMathBundle);
	var subproblemBundle = getEmptyBundleAnimation();
	var showProb = getEmptyTranslateAnimation();
	showProb.sourceSpec = doMath1.nodeSpec;
	showProb.destSpec = getNodeSpecification(child1, 0, [0], "start", 0);
	subproblemBundle.animations.push(showProb);
	showProb = getEmptyTranslateAnimation();
	showProb.sourceSpec = doMath2.nodeSpec;
	showProb.destSpec = getNodeSpecification(child2, 0, [1], "start", 0);
	subproblemBundle.animations.push(showProb);
	tracker.currentFrame.startAnimations.push(subproblemBundle);
	var removeIntermediate = getEmptyRemoveIntermediateStepAnimation();
	removeIntermediate.intermediateId = recurrence.intermediateId;
	removeIntermediate.list = "start";
	removeIntermediate.position = "below";
	tracker.currentFrame.startAnimations.push(removeIntermediate);
	ans = fibonacci(child1).value + fibonacci(child2).value;

	// End animation
	//nNodes = [new ValueNode("\\(t(n)\\)"), new ValueNode("\\(t(n-1)\\)"), new ValueNode("\\(t(n-2)\\)")];
	nNodes = [new ValueNode("\\(" + n.value + "\\)"), new ValueNode("\\(" + (n.value - 1) + "\\)"), new ValueNode("\\(" + (n.value - 2) + "\\)")];
	recurrence = getEmptyCreateIntermediateStepAnimation();
	recurrence.intermediateId = intermId++;
	recurrence.list = "end";
	recurrence.position = "above";
	//recurrence.entities = [nNodes[0], "\\( = \\)", nNodes[1], "\\( + \\)", nNodes[2]];
	recurrence.entities = ["\\(t(\\)", nNodes[0], "\\()\\)", "\\( = \\)", "\\(t(\\)", nNodes[1], "\\()\\)",
		"\\( + \\)", "\\(t(\\)", nNodes[2], "\\()\\)"];
	tracker.currentFrame.endAnimations.push(recurrence);
	var getFromChildren = getEmptyBundleAnimation();
	for(var z=0; z<tracker.currentFrame.children.length; z++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceSpec = getNodeSpecification(tracker.currentFrame.children[z].result[0], 0, [z], "end", 0);
		translate.destSpec = getNodeSpecification(nNodes[z + 1], 0, [], "end", -1);
		getFromChildren.animations.push(translate);
	}
	removeIndices = [11, 9, 7, 5];
	for(var z in removeIndices) {
		var deleteStrings = getEmptyIntermediateRemoveEntityAnimation();
		deleteStrings.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		deleteStrings.entityIndex = removeIndices[z];
		deleteStrings.effectParams = ["highlight"];
		getFromChildren.animations.push(deleteStrings);
	}
	tracker.currentFrame.endAnimations.push(getFromChildren);
	var updateRecurrence = getEmptyBundleAnimation();
	for(var z=0; z<tracker.currentFrame.children.length; z++) {
		var update = getEmptyChangeValueNodeAnimation();
		update.nodeSpec = getNodeSpecification(nNodes[z+1], 0, [], "end", -1);
		update.newValue = tracker.currentFrame.children[z].result[0].value;
		updateRecurrence.animations.push(update);
	}
	//tracker.currentFrame.endAnimations.push(updateRecurrence);

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
	zoomAnimation.methodId = frame.methodId;
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
