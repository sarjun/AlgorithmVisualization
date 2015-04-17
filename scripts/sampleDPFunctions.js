/**
 * Created by Arjun on 1/28/2015.
 */
funcName = "Fibonacci";
function fibonacci(n) {
	var intermId = 0;
	tracker.logEntry([n]);
	var zoomAnimation = getEmptyAbsoluteZoomAnimation();
	addStartAnimation(zoomAnimation);
	addEndAnimation(zoomAnimation);
	var resetTable = getEmptySetTableAnimation();
	resetTable.maxShowID = tracker.maxId - 1;
	addStartAnimation(resetTable);
	addEndAnimation(resetTable);


	var ans = tracker.table[n.value];
	if(ans != null) {
		addStartAnimation(getTextAnim("We have already computed the Fibonacci of " + n.value + ". We can get the answer from the memoization table."));
		addEndAnimation(getTextAnim("This answer was taken from the memoization table."));
		var getEntry = getEmptyGetFromTableAnimation();
		getEntry.ansSpec = getNodeSpecification(ans.value, 0, [], "end");
		addStartAnimation(getEntry);
		var frame = tracker.logExit([ans.value]);
		zoomAnimation.methodId = frame.methodId;
		resetTable.maxShowID = frame.methodId - 1;
		return ans.value;
	}
	if(n.value < 2){
		addStartAnimation(getTextAnim("\\(" + n.value + " \\leq 1 \\), so this is a base case. The Fibonacci of " + n.value + " is " + n.value + "."));
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = n;
		tEntry.params.n = n;
		addEndAnimation(getTextAnim("The Fibonnaci of " + n.value + " does not exist in the memoization table, so now we add it."));
		var addToTableAnim = getEmptyAddToTableAnimation();
		addToTableAnim.ansSpec = getNodeSpecification(n, 0, [], "end");
		addEndAnimation(addToTableAnim);
		resetTable = getEmptySetTableAnimation();
		addEndAnimation(resetTable);
		var frame = tracker.logExit([n]);
		resetTable.maxShowID = frame.methodId;
		zoomAnimation.methodId = frame.methodId;
		tEntry.methodId = frame.methodId;
		tracker.table[n.value] = tEntry;
		return n;
	}
	var nNodes = [new ValueNode("\\(n\\)"), new ValueNode("\\(n\\)"), new ValueNode("\\(n\\)")];
	var recurrence = getEmptyCreateIntermediateStepAnimation();
	recurrence.intermediateId = intermId++;
	recurrence.list = "start";
	recurrence.position = "below";
	recurrence.entities = ["\\(t(\\)", nNodes[0], "\\() = t(\\)", nNodes[1], "\\(-1\\)", "\\() + t(\\)", nNodes[2], "\\(-2\\)", "\\()\\)"];
	addStartAnimation(recurrence);
	var nSpreadBundle = getEmptyBundleAnimation();
	var nChangeBundle = getEmptyBundleAnimation();
	for (var i in nNodes) {
		var nTransition = getEmptyTranslateAnimation();
		nTransition.sourceSpec = getNodeSpecification(n, 0, [], "start");
		nTransition.destSpec = getNodeSpecification(nNodes[i], 0, [], "start", 1);
		nSpreadBundle.animations.push(nTransition);
		var nChangeValue = getEmptyChangeValueNodeAnimation();
		nChangeValue.nodeSpec = nTransition.destSpec;
		nChangeValue.newValue = n.value;
		nChangeBundle.animations.push(nChangeValue);
	}
	addStartAnimation(nSpreadBundle);
	addStartAnimation(nChangeBundle);
	var mathRemoveBundle = getEmptyBundleAnimation();
	var removeIndices = [8, 5];
	for (var i in removeIndices) {
		var mathRemove = getEmptyIntermediateRemoveEntityAnimation();
		mathRemove.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		mathRemove.entityIndex = removeIndices[i];
		mathRemove.effectParams = ["highlight"];
		mathRemoveBundle.animations.push(mathRemove);
	}
	addStartAnimation(mathRemoveBundle);
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
	addStartAnimation(doMathBundle);
	var subproblemBundle = getEmptyBundleAnimation();
	var showProb = getEmptyTranslateAnimation();
	showProb.sourceSpec = doMath1.nodeSpec;
	showProb.destSpec = getNodeSpecification(child1, 0, [0], "start");
	subproblemBundle.animations.push(showProb);
	showProb = getEmptyTranslateAnimation();
	showProb.sourceSpec = doMath2.nodeSpec;
	showProb.destSpec = getNodeSpecification(child2, 0, [1], "start");
	subproblemBundle.animations.push(showProb);
	addStartAnimation(subproblemBundle);
	var removeIntermediate = getEmptyRemoveIntermediateStepAnimation();
	removeIntermediate.intermediateId = recurrence.intermediateId;
	removeIntermediate.list = "start";
	removeIntermediate.position = "below";
	addStartAnimation(removeIntermediate);
	addStartAnimation(getEmptyClearIntermediateAnimation());
	ans = fibonacci(child1).value + fibonacci(child2).value;
	var value = new ValueNode(ans);

	// End animation
	resetTable = getEmptySetTableAnimation();
	addEndAnimation(resetTable);
	//nNodes = [new ValueNode("\\(t(n)\\)"), new ValueNode("\\(t(n-1)\\)"), new ValueNode("\\(t(n-2)\\)")];
	nNodes = [new ValueNode("\\(" + n.value + "\\)"), new ValueNode("\\(" + (n.value - 1) + "\\)"), new ValueNode("\\(" + (n.value - 2) + "\\)")];
	recurrence = getEmptyCreateIntermediateStepAnimation();
	recurrence.intermediateId = intermId++;
	recurrence.list = "end";
	recurrence.position = "above";
	//recurrence.entities = [nNodes[0], "\\( = \\)", nNodes[1], "\\( + \\)", nNodes[2]];
	recurrence.entities = ["\\(t(\\)", nNodes[0], "\\()\\)", "\\( = \\)", "\\(t(\\)", nNodes[1], "\\()\\)",
		"\\( + \\)", "\\(t(\\)", nNodes[2], "\\()\\)"];
	addEndAnimation(recurrence);
	var getFromChildren = getEmptyBundleAnimation();
	for(var z=0; z<tracker.currentFrame.children.length; z++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceSpec = getNodeSpecification(tracker.currentFrame.children[z].result[0], 0, [z], "end");
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
	addEndAnimation(getFromChildren);
	var updateRecurrence = getEmptyBundleAnimation();
	for(var z=0; z<tracker.currentFrame.children.length; z++) {
		var update = getEmptyChangeValueNodeAnimation();
		update.nodeSpec = getNodeSpecification(nNodes[z+1], 0, [], "end", -1);
		update.newValue = tracker.currentFrame.children[z].result[0].value;
		updateRecurrence.animations.push(update);
	}
	addEndAnimation(updateRecurrence);
	var getAnswer = getEmptyBundleAnimation();
	var calcAnswer = getEmptyChangeValueNodeAnimation();
	calcAnswer.nodeSpec = getNodeSpecification(nNodes[1], 0, [], "end", -1);
	calcAnswer.newValue = tracker.currentFrame.children[0].result[0].value + tracker.currentFrame.children[1].result[0].value;
	getAnswer.animations.push(calcAnswer);
	removeIndices = [10, 8];
	for(var z in removeIndices) {
		var deleteStrings = getEmptyIntermediateRemoveEntityAnimation();
		deleteStrings.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		deleteStrings.entityIndex = removeIndices[z];
		deleteStrings.effectParams = ["highlight"];
		getAnswer.animations.push(deleteStrings);
	}
	addEndAnimation(getAnswer);
	var showAnswer = getEmptyTranslateAnimation();
	showAnswer.sourceSpec = getNodeSpecification(nNodes[1], 0, [], "end", -1);
	showAnswer.destSpec = getNodeSpecification(value, 0, [], "end");
	addEndAnimation(showAnswer);
	removeIntermediate = getEmptyRemoveIntermediateStepAnimation();
	removeIntermediate.intermediateId = recurrence.intermediateId;
	removeIntermediate.list = "end";
	removeIntermediate.position = "above";
	addEndAnimation(removeIntermediate);
	addEndAnimation(getEmptyClearIntermediateAnimation());

	var tEntry = getEmptyDPTableEntry();
	var addEntry = getEmptyAddToTableAnimation();
	addEntry.ansSpec = getNodeSpecification(value, 0, [], "end");
	addEndAnimation(addEntry);
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
divideMapping[funcName] = "The nth number in the Fibonacci sequence is defined by the recurrence \\(t(n)=t(n-1)+t(n-2)\\). " +
"We will calculate it recursively.";
conquerMapping[funcName] = "We will store the calculated values of the sequence in the memoization table so no values are recalculated.";
parameterMapping[funcName] = ["n : uint"];
trackerMapping[funcName] = DPTracker;


funcName = "Longest Common Subsequence";
function lcs(x, y) {
	var intermId = 0;
	tracker.logEntry([x, y]);
	var zoomAnim = getEmptyRelativeZoomAnimation();
	zoomAnim.circleSpec = getCircleSpecification(0, []);
	addStartAnimation(zoomAnim);
	addEndAnimation(zoomAnim);
	var resetTable = getEmptySetTableAnimation();
	resetTable.maxShowID = tracker.maxId - 1;
	addStartAnimation(resetTable);
	var endReset = getEmptySetTableAnimation();
	endReset.maxShowID = tracker.maxId - 1;
	addEndAnimation(endReset);
	
	var key = x.value.length + "," + y.value.length;
	var ans = tracker.table[key];
	if(ans != null) {
		var getEntry = getEmptyGetFromTableAnimation();
		getEntry.ansSpec = getNodeSpecification(ans.value, 0, [], "end");
		addStartAnimation(getEntry);
		tracker.logExit([ans.value]);
		return ans.value;
	}
	if(x.value.length == 0 || y.value.length == 0) {
		var highlightAnim = getEmptyHighlightAnimation();
		var unhighlightAnim = getEmptyUnhighlightAnimation();
		highlightAnim.nodeSpecs = [];
		if (x.value.length == 0) {
			highlightAnim.nodeSpecs.push(getNodeSpecification(x, 0, [], "start"));
		}
		if (y.value.length == 0) {
			highlightAnim.nodeSpecs.push(getNodeSpecification(y, 0, [], "start"));
		}
		unhighlightAnim.nodeSpecs = highlightAnim.nodeSpecs;
		addStartAnimation(highlightAnim);
		addStartAnimation(unhighlightAnim);
		addEndAnimation(highlightAnim);
		addEndAnimation(unhighlightAnim);
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
	var newX = new ValueNode(x.value.substr(1));
	var newY = new ValueNode(y.value.substr(1));
	if(x.value.charAt(0) == y.value.charAt(0)) {
		var bundleAnim = getEmptyBundleAnimation();
		var substringAnim = getEmptyChangeValueNodeAnimation();
		substringAnim.nodeSpec = getNodeSpecification(x, 0, [], "start");
		substringAnim.newValue = newX.value;
		bundleAnim.animations.push(substringAnim);
		substringAnim = getEmptyChangeValueNodeAnimation();
		substringAnim.nodeSpec = getNodeSpecification(y, 0, [], "start");
		substringAnim.newValue = newY.value;
		bundleAnim.animations.push(substringAnim);
		addStartAnimation(bundleAnim);
		bundleAnim = getEmptyBundleAnimation();
		var translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(x, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(newX, 0, [0], "start");
		bundleAnim.animations.push(translateChildAnim);
		translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(y, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(newY, 0, [0], "start");
		bundleAnim.animations.push(translateChildAnim);
		addStartAnimation(bundleAnim);
		bundleAnim = getEmptyBundleAnimation();
		var resetAnim = getEmptyPhaseAnimation();
		resetAnim.vSpec = getVisualizationSpecification(0, [], "start", 0);
		resetAnim.newState = [x];
		bundleAnim.animations.push(resetAnim);
		resetAnim = getEmptyPhaseAnimation();
		resetAnim.vSpec = getVisualizationSpecification(0, [], "start", 1);
		resetAnim.newState = [y];
		bundleAnim.animations.push(resetAnim);
		addStartAnimation(bundleAnim);

		// End animation
		var recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		recurrence.list = "end";
		recurrence.position = "above";
		recurrence.entities = ["\\(t(x,y)=\\)", "\\(1+\\)", new ValueNode("\\(t(x-1,y-1)\\)")];
		addEndAnimation(recurrence);

		var childRet = lcs(newX, newY);
		endReset.maxShowID = tracker.maxId - 1;
		var ret = new ValueNode(1 + childRet.value);

		var bundleAnim = getEmptyBundleAnimation();
		var translateAnim = getEmptyTranslateAnimation();
		translateAnim.sourceSpec = getNodeSpecification(childRet, 0, [0], "end");
		translateAnim.destSpec = getNodeSpecification(recurrence.entities[2], 0, [], "end", -1);
		bundleAnim.animations.push(translateAnim);
		var removeEntityAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		removeEntityAnim.entityIndex = 3;
		removeEntityAnim.effectParams = ["fade"];
		bundleAnim.animations.push(removeEntityAnim);
		addEndAnimation(bundleAnim);
		var addEntityAnim = getEmptyIntermediateAddEntityAnimation();
		addEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		addEntityAnim.entityIndex = 2;
		addEntityAnim.effectParams = [""];
		addEntityAnim.newEntity = childRet;
		addEndAnimation(addEntityAnim);

		bundleAnim = getEmptyBundleAnimation();
		removeEntityAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		removeEntityAnim.entityIndex = 2;
		removeEntityAnim.effectParams = ["highlight"];
		bundleAnim.animations.push(removeEntityAnim);
		var changeValueAnim = getEmptyChangeValueNodeAnimation();
		changeValueAnim.nodeSpec = getNodeSpecification(childRet, 0, [], "end", -1);
		changeValueAnim.newValue = ret.value;
		bundleAnim.animations.push(changeValueAnim);
		addEndAnimation(bundleAnim);

		translateAnim = getEmptyTranslateAnimation();
		translateAnim.sourceSpec = getNodeSpecification(childRet, 0, [], "end", -1);
		translateAnim.destSpec = getNodeSpecification(ret, 0, [], "end");
		addEndAnimation(translateAnim);

		var removeIntermediate = getEmptyRemoveIntermediateStepAnimation();
		removeIntermediate.intermediateId = recurrence.intermediateId;
		removeIntermediate.list = "end";
		removeIntermediate.position = "above";
		addEndAnimation(removeIntermediate);

		var addToTableAnim = getEmptyAddToTableAnimation();
		addToTableAnim.ansSpec = translateAnim.destSpec;
		addEndAnimation(addToTableAnim);

		var updateTable = getEmptySetTableAnimation();
		updateTable.maxShowID = tracker.maxId;
		addEndAnimation(updateTable);

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
		var substringAnim = getEmptyChangeValueNodeAnimation();
		substringAnim.nodeSpec = getNodeSpecification(x, 0, [], "start");
		substringAnim.newValue = newX.value;
		addStartAnimation(substringAnim);
		var moveToChildBundle = getEmptyBundleAnimation();
		var translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(x, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(newX, 0, [0], "start");
		moveToChildBundle.animations.push(translateChildAnim);
		translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(y, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(y, 0, [0], "start");
		moveToChildBundle.animations.push(translateChildAnim);
		addStartAnimation(moveToChildBundle);
		var resetAnim = getEmptyPhaseAnimation();
		resetAnim.vSpec = getVisualizationSpecification(0, [], "start", 0);
		resetAnim.newState = [x];
		addStartAnimation(resetAnim);

		substringAnim = getEmptyChangeValueNodeAnimation();
		substringAnim.nodeSpec = getNodeSpecification(y, 0, [], "start");
		substringAnim.newValue = newY.value;
		addStartAnimation(substringAnim);
		moveToChildBundle = getEmptyBundleAnimation();
		translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(y, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(newY, 0, [1], "start");
		moveToChildBundle.animations.push(translateChildAnim);
		translateChildAnim = getEmptyTranslateAnimation();
		translateChildAnim.sourceSpec = getNodeSpecification(x, 0, [], "start");
		translateChildAnim.destSpec = getNodeSpecification(x, 0, [1], "start");
		moveToChildBundle.animations.push(translateChildAnim);
		addStartAnimation(moveToChildBundle);
		resetAnim = getEmptyPhaseAnimation();
		resetAnim.vSpec = getVisualizationSpecification(0, [], "start", 1);
		resetAnim.newState = [y];
		addStartAnimation(resetAnim);

		var ignoreX = lcs(newX, y);
		var ignoreY = lcs(x, newY);
		endReset.maxShowID = tracker.maxId - 1;
		var ret = new ValueNode(ignoreX.value > ignoreY.value ? ignoreX.value : ignoreY.value);

		// End animation
		var recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		recurrence.list = "end";
		recurrence.position = "above";
		recurrence.entities = ["\\(t(x,y)=\\;\\)", "\\(max(\\;\\)", new ValueNode("\\(t(x-1,y)\\)"), "\\(\\;,\\;\\)", new ValueNode("\\(t(x,y-1)\\)"), "\\(\\;)\\)"];
		addEndAnimation(recurrence);

		var bundleAnim = getEmptyBundleAnimation();
		var translateAnim = getEmptyTranslateAnimation();
		translateAnim.sourceSpec = getNodeSpecification(ignoreX, 0, [0], "end");
		translateAnim.destSpec = getNodeSpecification(recurrence.entities[2], 0, [], "end", -1);
		bundleAnim.animations.push(translateAnim);
		var removeEntityAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		removeEntityAnim.entityIndex = 3;
		removeEntityAnim.effectParams = ["fade"];
		bundleAnim.animations.push(removeEntityAnim);
		addEndAnimation(bundleAnim);
		var addEntityAnim = getEmptyIntermediateAddEntityAnimation();
		addEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		addEntityAnim.entityIndex = 2;
		addEntityAnim.effectParams = [""];
		addEntityAnim.newEntity = ignoreX;
		addEndAnimation(addEntityAnim);

		bundleAnim = getEmptyBundleAnimation();
		translateAnim = getEmptyTranslateAnimation();
		translateAnim.sourceSpec = getNodeSpecification(ignoreY, 0, [0], "end");
		translateAnim.destSpec = getNodeSpecification(recurrence.entities[4], 0, [], "end", -1);
		bundleAnim.animations.push(translateAnim);
		removeEntityAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		removeEntityAnim.entityIndex = 6;
		removeEntityAnim.effectParams = ["fade"];
		bundleAnim.animations.push(removeEntityAnim);
		addEndAnimation(bundleAnim);
		addEntityAnim = getEmptyIntermediateAddEntityAnimation();
		addEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		addEntityAnim.entityIndex = 5;
		addEntityAnim.effectParams = [""];
		addEntityAnim.newEntity = ignoreY;
		addEndAnimation(addEntityAnim);

		bundleAnim = getEmptyBundleAnimation();

		for (var i = 2; i < 9; i++) {
			removeEntityAnim = getEmptyIntermediateRemoveEntityAnimation();
			removeEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
			removeEntityAnim.entityIndex = i;
			removeEntityAnim.effectParams = ["fade"];
			bundleAnim.animations.push(removeEntityAnim);
		}
		addEndAnimation(bundleAnim);


		addEntityAnim = getEmptyIntermediateAddEntityAnimation();
		addEntityAnim.intermSpec = getIntermediateSpecification(0, [], "end", "above", 1);
		addEntityAnim.entityIndex = 1;
		addEntityAnim.effectParams = ["fade"];
		addEntityAnim.newEntity = ret;
		addEndAnimation(addEntityAnim);

		translateAnim = getEmptyTranslateAnimation();
		translateAnim.sourceSpec = getNodeSpecification(ret, 0, [], "end", -1);
		translateAnim.destSpec = getNodeSpecification(ret, 0, [], "end");
		addEndAnimation(translateAnim);

		var removeIntermediate = getEmptyRemoveIntermediateStepAnimation();
		removeIntermediate.intermediateId = recurrence.intermediateId;
		removeIntermediate.list = "end";
		removeIntermediate.position = "above";
		addEndAnimation(removeIntermediate);
		addEndAnimation(getEmptyClearIntermediateAnimation());

		var addToTableAnim = getEmptyAddToTableAnimation();
		addToTableAnim.ansSpec = translateAnim.destSpec;
		addEndAnimation(addToTableAnim);

		var updateTable = getEmptySetTableAnimation();
		updateTable.maxShowID = tracker.maxId;
		addEndAnimation(updateTable);

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

funcName = "Maximum Random Walk";
function maximumRandomWalk(pos, steps, pLeft, pRight, maxRightSeen) {
	var intermId = 0;
	tracker.logEntry([steps, pos, maxRightSeen]);
	var zoomAnim = getEmptyRelativeZoomAnimation();
	zoomAnim.circleSpec = getCircleSpecification(0, []);
	addStartAnimation(zoomAnim);
	addEndAnimation(zoomAnim);
	var resetTable = getEmptySetTableAnimation();
	resetTable.maxShowID = tracker.maxId - 1;
	addStartAnimation(resetTable);
	var endReset = getEmptySetTableAnimation();
	endReset.maxShowID = tracker.maxId - 1;
	addEndAnimation(endReset);

	var oldMax = maxRightSeen;
	maxRightSeen = new ValueNode(maxRightSeen.value);
	var key = steps.value + "," + (maxRightSeen.value - pos.value);
	var ans = tracker.table[key];
	if(ans != null) {
		addStartAnimation(getTextAnim("Another similar problem where there was \\(S\\) steps left and where the current position " +
		"was \\(M-P\\) away from the rightmost spot seen has already been solved. Therefore, the average rightward displacement going forward " +
		"(taking \\(M-P\\) into account ) is stored in the memoization table."));
		var newAns = new ValueNode(ans.value.value + pos.value);
		nNodes = [new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(M\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(P\\)")];
		var addInterm = getEmptyCreateIntermediateStepAnimation();
		addInterm.intermediateId = intermId++;
		addInterm.entities = ["\\(t(\\)", nNodes[0], "\\(,\\)", nNodes[1], "\\(,\\)", nNodes[2], "\\( )=\\; \\)", "\\(Table \\; \\mathbf{[} \\;\\)", nNodes[3], "\\(,\\)", nNodes[4], "\\(+\\)", nNodes[5], "\\(\\; \\mathbf{]} \\;\\)", "\\(-\\)", nNodes[6]];
		addInterm.list = "start";
		addInterm.position = "below";
		addStartAnimation(addInterm);
		addStartAnimation(getTextAnim("We will get the average rightward displacement by indexing the table at \\([S,M-P]\\)." +
		"We will add \\(P\\) to the value in the table to get the average rightmost position reached from this particular " +
		"position."));
		var transBundle = getEmptyBundleAnimation();
		var setBundle = getEmptyBundleAnimation();
		var sources = [steps, pos, oldMax];
		var dests = ["\\(S\\)", "\\(P\\)", "\\(M\\)"];
		for (var n in nNodes) {
			var transAnim = getEmptyTranslateAnimation();
			var source = sources[dests.indexOf(nNodes[n].value)];
			transAnim.sourceSpec = getNodeSpecification(source, 0, [], "start");
			transAnim.destSpec = getNodeSpecification(nNodes[n], 0, [], "start", 3);
			transBundle.animations.push(transAnim);
			var setAnim = getEmptyChangeValueNodeAnimation();
			setAnim.nodeSpec = transAnim.destSpec;
			setAnim.newValue = source.value;
			setBundle.animations.push(setAnim);
		}
		addStartAnimation(transBundle);
		addStartAnimation(setBundle);
		var changeBundle = getEmptyBundleAnimation();
		var changeAnim = getEmptyChangeValueNodeAnimation();
		changeAnim.nodeSpec = getNodeSpecification(nNodes[4], 0, [], "start", 3);
		changeAnim.newValue = (maxRightSeen.value - pos.value);
		changeBundle.animations.push(changeAnim);
		var removeAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		removeAnim.entityIndex = 12;
		removeAnim.effectParams = {width: 0};
		changeBundle.animations.push(removeAnim);
		removeAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		removeAnim.entityIndex = 13;
		removeAnim.effectParams = {width: 0};
		changeBundle.animations.push(removeAnim);
		addStartAnimation(changeBundle);
		changeBundle = getEmptyBundleAnimation();
		for (var i = 8; i <= 14; i++) {
			removeAnim = getEmptyIntermediateRemoveEntityAnimation();
			removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
			removeAnim.entityIndex = i;
			removeAnim.effectParams = {width: 0};
			changeBundle.animations.push(removeAnim);
		}
		addStartAnimation(changeBundle);
		transBundle = getEmptyBundleAnimation();
		var addAnim = getEmptyIntermediateAddEntityAnimation();
		addAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		addAnim.newEntity = ans.value;
		addAnim.entityIndex = 8;
		addAnim.effectParams = {width: 1, opacity: 0};
		var getEntry = getEmptyGetFromTableAnimation();
		getEntry.ansSpec = getNodeSpecification(ans.value, 0, [], "start", 3);
		transBundle.animations.push(addAnim);
		transBundle.animations.push(getEntry);
		addStartAnimation(transBundle);
		changeBundle = getEmptyBundleAnimation();
		removeAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		removeAnim.entityIndex = 9;
		removeAnim.effectParams = [""];
		changeBundle.animations.push(removeAnim);
		addAnim = getEmptyIntermediateAddEntityAnimation();
		addAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		addAnim.newEntity = new ValueNode(ans.value.value);
		addAnim.entityIndex = 8;
		addAnim.effectParams = [""];
		changeBundle.animations.push(addAnim);
		changeAnim = getEmptyChangeValueNodeAnimation();
		changeAnim.nodeSpec = getNodeSpecification(nNodes[5], 0, [], "start", 3);
		changeAnim.newValue = "";
		changeBundle.animations.push(changeAnim);
		addStartAnimation(changeBundle);
		changeBundle = getEmptyBundleAnimation();
		changeAnim = getEmptyChangeValueNodeAnimation();
		changeAnim.nodeSpec = getNodeSpecification(addAnim.newEntity, 0, [], "start", 3);
		changeAnim.newValue = newAns.getDisplayString();
		changeBundle.animations.push(changeAnim);
		var removeAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		removeAnim.entityIndex = 17;
		removeAnim.effectParams = {width: 0};
		changeBundle.animations.push(removeAnim);
		removeAnim = getEmptyIntermediateRemoveEntityAnimation();
		removeAnim.intermSpec = getIntermediateSpecification(0, [], "start", "below", 1);
		removeAnim.entityIndex = 18;
		removeAnim.effectParams = {width: 0};
		changeBundle.animations.push(removeAnim);
		addStartAnimation(changeBundle);
		transAnim = getEmptyTranslateAnimation();
		transAnim.sourceSpec = getNodeSpecification(addAnim.newEntity, 0, [], "start", 3);
		transAnim.destSpec = getNodeSpecification(newAns, 0, [], "end");
		addStartAnimation(transAnim);
		removeAnim = getEmptyRemoveIntermediateStepAnimation();
		removeAnim.list = "start";
		removeAnim.position = "below";
		removeAnim.intermediateId = intermId - 1;
		removeAnim.effectParams = {};
		addStartAnimation(removeAnim);
		addStartAnimation(getEmptyClearIntermediateAnimation());
		addEndAnimation(getTextAnim("This answer was calculated using stored values in the memoization table. Click on the input " +
		"values to this problem instance to see how."));
		tracker.logExit([newAns]);
		return newAns;
	}
	var offsetFromMax = new ValueNode(maxRightSeen.value - pos.value);
	if (steps.value <= 0) {
		ans = maxRightSeen;
		var tEntry = getEmptyDPTableEntry();
		tEntry.params = {
			"Steps": steps,
			"Offset from Max": offsetFromMax
		};
		tEntry.value = offsetFromMax;
		tracker.table[key] = tEntry;

		// Start animation
		addStartAnimation(getTextAnim("The number of steps remaining, \\(S\\), is zero, so this is a base case. The " +
		"rightmost position is simply equal to \\(M\\), or the rightmost position seen on the path to here."));
		var getAnswer = getEmptyTranslateAnimation();
		getAnswer.sourceSpec = getNodeSpecification(oldMax, 0, [], "start");
		getAnswer.destSpec = getNodeSpecification(ans, 0, [], "end");
		addStartAnimation(getAnswer);

		// End animation
		var updateTable = answerToKey(steps, pos, maxRightSeen, intermId, ans, tEntry);

		var frame = tracker.logExit([ans]);
		updateTable.maxShowID = frame.methodId;
		tEntry.methodId = frame.methodId;
		return ans;
	} else {

		var newStep = new ValueNode(steps.value - 1);
		var newMax = new ValueNode(Math.max(pos.value + 1, maxRightSeen.value));
		var pStay = new ValueNode(1 - pLeft.value - pRight.value);
		var walkLeft = new ValueNode(pos.value - 1);
		var walkRight = new ValueNode(pos.value + 1);

		// Start animation
		var nNodes = [new ValueNode("\\(P_{left}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P_{stay}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P_{right}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P\\)"), new ValueNode("S"), new ValueNode("P"), new ValueNode("M")];
		var recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		recurrence.list = "start";
		recurrence.position = "below";
		recurrence.entities = ["\\(t(\\)", nNodes[13], "\\(,\\)", nNodes[14], "\\(,\\)", nNodes[15], "\\() =\\; \\)"];
		recurrence.inline = true;
		addStartAnimation(recurrence);
		recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		var leftId = recurrence.intermediateId;
		recurrence.list = "start";
		recurrence.position = "below";
		recurrence.entities = [nNodes[0], "\\(\\times t(\\)", nNodes[1], "\\( - 1\\)", "\\(,\\)", nNodes[2], "\\( - 1\\)", "\\(,\\)", nNodes[3], "\\()\\)"];
		recurrence.inline = true;
		addStartAnimation(recurrence);
		recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		var stayId = recurrence.intermediateId;
		recurrence.list = "start";
		recurrence.position = "below";
		recurrence.entities = ["\\( + \\)", nNodes[4], "\\(\\times t(\\)", nNodes[5], "\\( - 1\\)", "\\(,\\)", nNodes[6], "\\(,\\)", nNodes[7], "\\()\\)"];
		recurrence.inline = true;
		addStartAnimation(recurrence);
		recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		var rightId = recurrence.intermediateId;
		recurrence.list = "start";
		recurrence.position = "below";
		recurrence.entities = ["\\( + \\)", nNodes[8], "\\(\\times t(\\)", nNodes[9], "\\( - 1\\)", "\\(,\\)", nNodes[10],
			"\\( + 1\\)", "\\(,\\)", "\\(max(\\)", nNodes[11], "\\(,\\)", nNodes[12], "\\( + 1\\)", "\\()\\)", "\\()\\)"];
		recurrence.inline = true;
		addStartAnimation(recurrence);
		addStartAnimation(getTextAnim("The recurrence shown is derived as follows: <br><br> The average " +
		"rightmost position reached starting from position \\(P\\) with \\(S\\) steps left and having already been as far right as " +
		"\\(M\\) is equal to a weighted average of the solution after moving to the left (\\(P-1\\)), " +
		"staying in the same position(\\(P\\)), and moving to the right (\\(P+1\\))."));

		var initRecurrence = getEmptyBundleAnimation();
		var setRecurrence = getEmptyBundleAnimation();
		var initS = getEmptyTranslateAnimation();
		initS.sourceSpec = getNodeSpecification(steps, 0, [], "start");
		initS.destSpec = getNodeSpecification(nNodes[13], 0, [], "start", 3);
		initRecurrence.animations.push(initS);
		var setS = getEmptyChangeValueNodeAnimation();
		setS.nodeSpec = initS.destSpec;
		setS.newValue = steps.getDisplayString();
		setRecurrence.animations.push(setS);
		var initP = getEmptyTranslateAnimation();
		initP.sourceSpec = getNodeSpecification(pos, 0, [], "start");
		initP.destSpec = getNodeSpecification(nNodes[14], 0, [], "start", 3);
		initRecurrence.animations.push(initP);
		var setP = getEmptyChangeValueNodeAnimation();
		setP.nodeSpec = initP.destSpec;
		setP.newValue = pos.getDisplayString();
		setRecurrence.animations.push(setP);
		var initM = getEmptyTranslateAnimation();
		initM.sourceSpec = getNodeSpecification(oldMax, 0, [], "start");
		initM.destSpec = getNodeSpecification(nNodes[15], 0, [], "start", 3);
		initRecurrence.animations.push(initM);
		var setM = getEmptyChangeValueNodeAnimation();
		setM.nodeSpec = initM.destSpec;
		setM.newValue = oldMax.getDisplayString();
		setRecurrence.animations.push(setM);
		addStartAnimation(initRecurrence);
		addStartAnimation(setRecurrence);

		var changeBundle = getEmptyBundleAnimation();
		var probNodes = [nNodes[0], nNodes[4], nNodes[8]];
		var probVals = [pLeft.getDisplayString(), pStay.getDisplayString(), pRight.getDisplayString()];
		for (var i in probNodes) {
			var changeProbAnim = getEmptyChangeValueNodeAnimation();
			changeProbAnim.nodeSpec = getNodeSpecification(probNodes[i], 0, [], "start", 4 + i*1);
			changeProbAnim.newValue = probVals[i];
			changeBundle.animations.push(changeProbAnim);
		}
		addStartAnimation(changeBundle);

		var probs = [pLeft.value, pStay.value, pRight.value];
		var check = [0, EPSILON, 0];
		var ids = [leftId, stayId, rightId];
		var removeZeroBundle = getEmptyBundleAnimation();
		var childP = [walkLeft, pos, walkRight];
		var deleted = [];
		for(var i = 2; i >=0; i--) {
			deleted.unshift(probs[i] <= check[i]);
			if(deleted[0]) {
				var removeInterm = getEmptyRemoveIntermediateStepAnimation();
				removeInterm.intermediateId = ids[i];
				removeInterm.position = "below";
				removeInterm.list = "start";
				removeInterm.effectParams = {width:0};
				removeZeroBundle.animations.push(removeInterm);
				if(i == 0) {
					var removePlus = getEmptyIntermediateRemoveEntityAnimation();
					if(pStay.value > EPSILON) removePlus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 3);
					else removePlus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 4);
					removePlus.effectParams = {width:0};
					removePlus.entityIndex = 1;
					removeZeroBundle.animations.push(removePlus);
				}
			}
		}
		var fillBundle = getEmptyBundleAnimation();
		var updateBundle = getEmptyBundleAnimation();
		var doMathBundle = getEmptyBundleAnimation();
		var callChildren = getEmptyBundleAnimation();
		for(var i=0; i<3; i++) {
			if(deleted[i]) continue;

			var moveS = getEmptyTranslateAnimation();
			moveS.sourceSpec = getNodeSpecification(steps, 0, [], "start");
			moveS.destSpec = getNodeSpecification(nNodes[1+4*i], 0, [], "start", 4+(i*1));
			fillBundle.animations.push(moveS);
			var updateS = getEmptyChangeValueNodeAnimation();
			updateS.nodeSpec = moveS.destSpec;
			updateS.newValue = steps.value;
			updateBundle.animations.push(updateS);
			var deleteMinus = getEmptyIntermediateRemoveEntityAnimation();
			deleteMinus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 2+i);
			deleteMinus.entityIndex = i > 0 ? 5 : 4;
			deleteMinus.effectParams = {width:0};
			updateS = getEmptyChangeValueNodeAnimation();
			updateS.nodeSpec = moveS.destSpec;
			updateS.newValue = newStep.value;
			doMathBundle.animations.push(deleteMinus);
			doMathBundle.animations.push(updateS);
			var toChild = getEmptyTranslateAnimation();
			toChild.sourceSpec = moveS.destSpec;
			toChild.destSpec = getNodeSpecification(newStep, 0, [i - deleted.slice(0,i).filter(function(a){return a;}).length], "start");
			callChildren.animations.push(toChild);

			var moveP = getEmptyTranslateAnimation();
			moveP.sourceSpec = getNodeSpecification(pos, 0, [], "start");
			moveP.destSpec = getNodeSpecification(nNodes[2+4*i], 0, [], "start", 4+(i*1));
			fillBundle.animations.push(moveP);
			var updateP = getEmptyChangeValueNodeAnimation();
			updateP.nodeSpec = moveP.destSpec;
			updateP.newValue = pos.value;
			updateBundle.animations.push(updateP);
			toChild = getEmptyTranslateAnimation();
			toChild.sourceSpec = moveP.destSpec;
			toChild.destSpec = getNodeSpecification(childP[i], 0, [i - deleted.slice(0,i).filter(function(a){return a;}).length], "start");
			callChildren.animations.push(toChild);
			if(i%2==0) {
				var deleteArith = getEmptyIntermediateRemoveEntityAnimation();
				deleteArith.intermSpec = getIntermediateSpecification(0, [], "start", "below", 2 + i);
				deleteArith.entityIndex = i == 0 ? 7 : 8;
				deleteArith.effectParams = {width: 0};
				doMathBundle.animations.push(deleteArith);
				updateP = getEmptyChangeValueNodeAnimation();
				updateP.nodeSpec = moveP.destSpec;
				updateP.newValue = i == 0 ? (pos.value - 1) : (pos.value + 1);
				doMathBundle.animations.push(updateP);
			}

			if(i==2) {
				moveP = getEmptyTranslateAnimation();
				moveP.sourceSpec = getNodeSpecification(pos, 0, [], "start");
				moveP.destSpec = getNodeSpecification(nNodes[12], 0, [], "start", 4+(i*1));
				fillBundle.animations.push(moveP);
				updateP = getEmptyChangeValueNodeAnimation();
				updateP.nodeSpec = moveP.destSpec;
				updateP.newValue = pos.value;
				updateBundle.animations.push(updateP);

				var deletePlus = getEmptyIntermediateRemoveEntityAnimation();
				deletePlus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 4);
				deletePlus.entityIndex = 14;
				deletePlus.effectParams = {width:0};
				var updateVal = getEmptyChangeValueNodeAnimation();
				updateVal.nodeSpec = moveP.destSpec;
				updateVal.newValue = pos.value + 1;
				doMathBundle.animations.push(deletePlus);
				doMathBundle.animations.push(updateVal);
			}

			var moveM = getEmptyTranslateAnimation();
			moveM.sourceSpec = getNodeSpecification(oldMax, 0, [], "start");
			moveM.destSpec = getNodeSpecification(nNodes[3+4*i], 0, [], "start", 4+(i*1));
			fillBundle.animations.push(moveM);
			var updateM = getEmptyChangeValueNodeAnimation();
			updateM.nodeSpec = moveM.destSpec;
			updateM.newValue = oldMax.value;
			updateBundle.animations.push(updateM);
			if(i != 2) {
				toChild = getEmptyTranslateAnimation();
				toChild.sourceSpec = moveM.destSpec;
				toChild.destSpec = getNodeSpecification(maxRightSeen, 0, [i - deleted.slice(0,i).filter(function(a){return a;}).length], "start");
				callChildren.animations.push(toChild);
			}
		}
		addStartAnimation(removeZeroBundle);
		addStartAnimation(fillBundle);
		addStartAnimation(updateBundle);
		addStartAnimation(getTextAnim("Note that \\(M\\) may be different for the method call " +
		"representing movement to the right because \\(P+1\\) may be the new rightmost position seen along this path."));
		addStartAnimation(doMathBundle);
		var resolveMaxBundle = getEmptyBundleAnimation();
		if(!deleted[2]) {
			var intermSpec = getIntermediateSpecification(0, [], "start", "below", 4);
			var effectParams = {width:0};
			var remove = getEmptyIntermediateRemoveEntityAnimation();
			remove.intermSpec = intermSpec;
			remove.entityIndex = 15;
			remove.effectParams = effectParams;
			resolveMaxBundle.animations.push(remove);
			remove = getEmptyIntermediateRemoveEntityAnimation();
			remove.intermSpec = intermSpec;
			remove.entityIndex = 12;
			remove.effectParams = effectParams;
			resolveMaxBundle.animations.push(remove);
			remove = getEmptyIntermediateRemoveEntityAnimation();
			remove.intermSpec = intermSpec;
			remove.entityIndex = pos.value + 1 > oldMax.value ? 11 : 13;
			remove.effectParams = effectParams;
			resolveMaxBundle.animations.push(remove);
			remove = getEmptyIntermediateRemoveEntityAnimation();
			remove.intermSpec = intermSpec;
			remove.entityIndex = 10;
			remove.effectParams = effectParams;
			resolveMaxBundle.animations.push(remove);

			var maxToChild = getEmptyTranslateAnimation();
			maxToChild.sourceSpec = getNodeSpecification(pos.value + 1 > oldMax.value ? nNodes[12] : nNodes[11], 0, [], "start", 6);
			maxToChild.destSpec = getNodeSpecification(newMax, 0, [2 - deleted.slice(0,2).filter(function(a){return a;}).length], "start");
			callChildren.animations.push(maxToChild);
		}
		addStartAnimation(resolveMaxBundle);
		addStartAnimation(callChildren);
		var clearInterms = getEmptyBundleAnimation();
		removeInterm = getEmptyRemoveIntermediateStepAnimation();
		removeInterm.intermediateId = leftId - 1;
		removeInterm.position = "below";
		removeInterm.list = "start";
		removeInterm.effectParams = {width:0};
		clearInterms.animations.push(removeInterm);
		for(var i in deleted) {
			if(deleted[i]) continue;
			removeInterm = getEmptyRemoveIntermediateStepAnimation();
			removeInterm.intermediateId = ids[i];
			removeInterm.position = "below";
			removeInterm.list = "start";
			removeInterm.effectParams = {width:0};
			clearInterms.animations.push(removeInterm);
		}
		addStartAnimation(clearInterms);
		addStartAnimation(getEmptyClearIntermediateAnimation());

		var ans = 0;
		if (pLeft.value > 0) {
			var moveLeft = maximumRandomWalk(walkLeft, newStep, pLeft, pRight, maxRightSeen);
			ans += pLeft.value * moveLeft.value;
		}
		if (pStay.value > EPSILON) {
			var stay = maximumRandomWalk(pos, newStep, pLeft, pRight, maxRightSeen);
			ans += pStay.value * stay.value;
		}
		if (pRight.value > 0) {
			var moveRight = maximumRandomWalk(walkRight, newStep, pLeft, pRight, newMax);
			ans += pRight.value * moveRight.value;
		}
		endReset.maxShowID = tracker.maxId - 1;
		ans = new ValueNode(ans);
		var tEntry = getEmptyDPTableEntry();
		tEntry.params = {
			"Steps": steps,
			"Offset from Max": offsetFromMax
		};
		tEntry.value = new ValueNode(ans.value - pos.value);
		tracker.table[key] = tEntry;

		// End animations
		nNodes = [new ValueNode("\\(t(\\)" + (steps.value - 1) + "\\(,\\)" + (pos.value - 1) + "\\(,\\)" + oldMax.value + "\\()\\)"),
			new ValueNode("\\(t(\\)" + (steps.value - 1) + "\\(,\\)" + pos.value + "\\(,\\)" + oldMax.value + "\\()\\)"),
			new ValueNode("\\(t(\\)" + (steps.value - 1) + "\\(,\\)" + (pos.value + 1) + "\\(,\\)" + newMax.value + "\\()\\)")];
		recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		recurrence.list = "end";
		recurrence.position = "above";
		recurrence.entities = [new ValueNode("\\(t(" + steps.value + "," + pos.value + "," + oldMax.value + ")\\)"), "\\( = \\;\\)"];
		recurrence.inline = true;
		addEndAnimation(recurrence);
		if(!deleted[0]) {
			recurrence = getEmptyCreateIntermediateStepAnimation();
			leftId = recurrence.intermediateId = intermId++;
			recurrence.list = "end";
			recurrence.position = "above";
			recurrence.entities = ["\\(" + pLeft.getDisplayString() + "\\times\\)", nNodes[0]];
			recurrence.inline = true;
			addEndAnimation(recurrence);
		}
		if(!deleted[1]) {
			recurrence = getEmptyCreateIntermediateStepAnimation();
			stayId = recurrence.intermediateId = intermId++;
			recurrence.list = "end";
			recurrence.position = "above";
			recurrence.entities = [deleted[0] ? "" : "\\(+\\)", "\\(" + pStay.getDisplayString() + "\\times\\)", nNodes[1]];
			recurrence.inline = true;
			addEndAnimation(recurrence);
		}
		if(!deleted[2]) {
			recurrence = getEmptyCreateIntermediateStepAnimation();
			rightId = recurrence.intermediateId = intermId++;
			recurrence.list = "end";
			recurrence.position = "above";
			recurrence.entities = [(deleted[0] && deleted[1]) ? "" : "\\(+\\)", "\\(" + pRight.getDisplayString() + "\\times\\)", nNodes[2]];
			recurrence.inline = true;
			addEndAnimation(recurrence);
		}
		var getFromChildren = getEmptyBundleAnimation();
		var updateVals = getEmptyBundleAnimation();
		var multiply = getEmptyBundleAnimation();
		var add = getEmptyBundleAnimation();
		var skipCount = 0;
		var intermIds = [leftId, stayId, rightId];
		for(var i = 0; i < 3; i++) {
			if(deleted[i]) {
				skipCount++;
				continue;
			}
			var getAnim = getEmptyTranslateAnimation();
			getAnim.sourceSpec = getNodeSpecification(tracker.currentFrame.children[i - skipCount].result[0], 0, [i - skipCount], "end");
			getAnim.destSpec = getNodeSpecification(nNodes[i], 0, [], "end",
				i-3 + deleted.slice(i+1,3).filter(function(a){return a;}).length);
			getFromChildren.animations.push(getAnim);
			var update = getEmptyChangeValueNodeAnimation();
			update.nodeSpec = getAnim.destSpec;
			update.newValue = tracker.currentFrame.children[i - skipCount].result[0].getDisplayString();
			updateVals.animations.push(update);
			update = getEmptyChangeValueNodeAnimation();
			update.nodeSpec = getAnim.destSpec;
			update.newValue = new ValueNode(probVals[i] * tracker.currentFrame.children[i - skipCount].result[0].value).getDisplayString();
			multiply.animations.push(update);
			var removeMult = getEmptyIntermediateRemoveEntityAnimation();
			removeMult.intermSpec = getIntermediateSpecification(0, [], "end", "above", i + 2 - skipCount);
			removeMult.entityIndex = i == 0 ? 1 : 2;
			removeMult.effectParams = {width: 0};
			multiply.animations.push(removeMult);
			if(deleted.slice(0,i).filter(function(a){return !a;}).length > 0) {
				var deleteAnim = getEmptyRemoveIntermediateStepAnimation();
				deleteAnim.intermediateId = intermIds[i];
				deleteAnim.effectParams = {width: 0};
				deleteAnim.list = "end";
				deleteAnim.position = "above";
				add.animations.push(deleteAnim);
			}
		}
		addEndAnimation(getFromChildren);
		addEndAnimation(updateVals);
		addEndAnimation(multiply);
		var addAnim = getEmptyChangeValueNodeAnimation();
		addAnim.nodeSpec = getNodeSpecification(nNodes[deleted.indexOf(false)], 0, [], "end",
			-3 + deleted.filter(function(a){return a}).length);
		addAnim.newValue = ans.getDisplayString();
		add.animations.push(addAnim);
		addEndAnimation(add);
		var getAnswer = getEmptyTranslateAnimation();
		getAnswer.sourceSpec = addAnim.nodeSpec;
		getAnswer.destSpec = getNodeSpecification(ans, 0, [], "end");
		addEndAnimation(getAnswer);
		var removeRec = getEmptyBundleAnimation();
		var removeOne = getEmptyRemoveIntermediateStepAnimation();
		removeOne.intermediateId = leftId - 1;
		removeOne.effectParams = {width: 0};
		removeOne.list = "end";
		removeOne.position = "above";
		removeRec.animations.push(removeOne);
		removeOne = getEmptyRemoveIntermediateStepAnimation();
		removeOne.intermediateId = intermIds[deleted.indexOf(false)];
		removeOne.effectParams = {width: 0};
		removeOne.list = "end";
		removeOne.position = "above";
		removeRec.animations.push(removeOne);
		addEndAnimation(removeRec);
		var updateTable = answerToKey(steps, pos, maxRightSeen, intermId, ans, tEntry);

		var frame = tracker.logExit([ans]);
		tEntry.methodId = frame.methodId;
		updateTable.maxShowID = frame.methodId;
		return ans;
	}
}

function answerToKey(steps, pos, maxRightSeen, intermId, ans, tEntry) {
	addEndAnimation(getTextAnim("Now we want to store this answer in the memoization table for lookup when solving " +
	"similar problems."));
	intermId += 1000;
	var nNodes = [new ValueNode("\\(S\\)"), new ValueNode("\\(M\\)"), new ValueNode("\\(P\\)"),
		new ValueNode("\\(t(S,P,M)\\)"), new ValueNode("P")];
	var newValues = [steps.value, maxRightSeen.value, pos.value, "\\(t(" + steps.value + "," + pos.value + "," +
	maxRightSeen.value + ")\\)", pos.value];
	var getMemo = getEmptyCreateIntermediateStepAnimation();
	getMemo.entities = ["\\(Table\\;\\mathbf{[}\\;\\)", nNodes[0], "\\(, \\)", nNodes[1], "\\(-\\)", nNodes[2], "\\(\\;\\mathbf{]}\\; = \\;\\)",
		nNodes[3], "\\(-\\)", nNodes[4]];
	getMemo.intermediateId = intermId++;
	getMemo.list = "end";
	getMemo.position = "below";
	addEndAnimation(getMemo);
	addEndAnimation(getTextAnim("The table entry is formed by subtracting the current position from \\(t(S,P,M)\\). " +
	"Recall that even though there are three variables in the recurrence, the answer to problems with the same value " +
	"for \\(S\\) and \\((M-P)\\) is the same.<br><br>This is because the average rightmost position from any \\(P\\) " +
	"can be found by figuring out the average rightmost displacement looking forward using \\(S\\) steps left and knowing " +
	"that we have been \\(M-P\\) further to the right in the past than we are now. We can " +
	"then add the current position to that value to get the overall average rightmost position from any specifc value of \\(P\\)."));
	addEndAnimation(getTextAnim("Therefore, the table will be indexed by \\(S\\) and \\(M-P\\) and the table entry " +
	"will have this specific value of \\(P\\) subtracted out so that it can be used for any problem with \\(S\\) steps left " +
	"and where we have been \\(M-P\\) further to the right in the past than we are now."));
	var updateVals = getEmptyBundleAnimation();
	for(var i=0; i<nNodes.length; i++) {
		var update = getEmptyChangeValueNodeAnimation();
		update.nodeSpec = getNodeSpecification(nNodes[i], 0, [], "end", 1);
		update.newValue = newValues[i];
		updateVals.animations.push(update);
	}
	addEndAnimation(updateVals);
	var getAnswer = getEmptyTranslateAnimation();
	getAnswer.sourceSpec = getNodeSpecification(ans, 0, [], "end");
	getAnswer.destSpec = getNodeSpecification(nNodes[3], 0, [], "end", 1);
	addEndAnimation(getAnswer);
	var updateVal = getEmptyChangeValueNodeAnimation();
	updateVal.nodeSpec = getAnswer.destSpec;
	updateVal.newValue = ans.getDisplayString();
	addEndAnimation(updateVal);
	updateVals = getEmptyBundleAnimation();
	for(var i=4; i<7; i++) {
		var removeStuff = getEmptyIntermediateRemoveEntityAnimation();
		removeStuff.intermSpec = getIntermediateSpecification(0, [], "end", "below", 1);
		removeStuff.effectParams = {width: 0};
		removeStuff.entityIndex = i;
		updateVals.animations.push(removeStuff);
	}
	var addAnswer = getEmptyIntermediateAddEntityAnimation();
	addAnswer.entityIndex = 3;
	addAnswer.intermSpec = getIntermediateSpecification(0, [], "end", "below", 1);
	addAnswer.newEntity = new ValueNode(maxRightSeen.value - pos.value);
	addAnswer.effectParams = {width:1, opacity:1};
	updateVals.animations.push(addAnswer);
	addEndAnimation(updateVals);
	updateVals = getEmptyBundleAnimation();
	for(var i=9; i<12; i++) {
		var removeStuff = getEmptyIntermediateRemoveEntityAnimation();
		removeStuff.intermSpec = getIntermediateSpecification(0, [], "end", "below", 1);
		removeStuff.effectParams = {width: 0};
		removeStuff.entityIndex = i;
		updateVals.animations.push(removeStuff);
	}
	addAnswer = getEmptyIntermediateAddEntityAnimation();
	addAnswer.entityIndex = getMemo.entities.length - 1;
	addAnswer.intermSpec = getIntermediateSpecification(0, [], "end", "below", 1);
	addAnswer.newEntity = tEntry.value;
	addAnswer.effectParams = {width:1, opacity:1};
	updateVals.animations.push(addAnswer);
	addEndAnimation(updateVals);
	var addToTable = getEmptyAddToTableAnimation();
	addToTable.ansSpec = getNodeSpecification(tEntry.value, 0, [], "end", 1);
	addEndAnimation(addToTable);
	var updateTable = getEmptySetTableAnimation();
	addEndAnimation(updateTable);
	var removeInterm = getEmptyRemoveIntermediateStepAnimation();
	removeInterm.intermediateId = intermId - 1;
	removeInterm.list = "end";
	removeInterm.position = "below";
	removeInterm.effectParams = {};
	addEndAnimation(removeInterm);
	addEndAnimation(getEmptyClearIntermediateAnimation());
	return updateTable;
}

funcMapping[funcName] = maximumRandomWalk;
overviewMapping[funcName] = "This function computes the expected right-most position reached after taking \\(S\\) random " +
"steps from starting position \\(P\\). The probabilities of moving to the left, staying in the current spot, and moving to " +
"the right are given by \\(P_{left}, 1-P_{left}-P_{right}, \\) and \\(P_{right},\\) respectively. Note that staying in " +
"the same spot counts as an action that consumes a step.";
divideMapping[funcName] = "This is done by repeatedly computing the weighted average of the expected results of moving " +
"left, staying still, and moving right. This can be represented by the following recurrence: \\(t(S,P,M)=P_{left}\\times " +
"t(S-1, P-1, M) + P_{stay}\\times t(S-1,P,M) + P_{right}\\times t(S-1, P+1, max(M, P+1))\\). S always decreases by " +
"one in the sub-problems because the number of steps remaining decreases by 1. P changes according to whether the " +
"sub-problem represents movement to the right, left, or staying in place. M only has the potential to change when moving " +
"to the right, because otherwise the maximum location seen so far cannot increase (and it will never decrease).";
conquerMapping[funcName] = "This algorithm takes 3 parameters \\((S, P, M)\\), so it can be memoized with a 3-dimensional table. " +
	"However, if we knew the average rightmost position reached by taking \\(S\\) steps from position 0, we could add that to any position \\(P\\) " +
"to get the average rightmost position reached by taking \\(S\\) steps from \\(P\\). However, the rightmost position seen so far could change some " +
"of our answers if it is higher than the current position. Therefore, we also need to know the rightmost position we have seen relative " +
"to the current position in addition to the number of steps left. Given those two, we know the average rightmost position relative " +
"to our distance from the rightmost position already seen. If we add that to the current position, that gives us the overall rightmost position " +
"seen to any problem instance."+
//"However, it is sufficient to memoize the expected maximum position relative to the current position \\((t(S,P,M)-P)\\). " +
//"This expected relative maximum position only depends upon the number of steps left to take \\((S)\\) and the maximum position seen relative to the current position \\((M-P)\\). " +
"Therefore, we can use a 2-dimensional table where the dimensions are \\(S\\) and \\(M-P\\) and add the memoized value to the current position for the final answer. This reduces the running time of the algorithm from " +
"\\(\\Theta(n^3)\\) with a 3-dimensional table to \\(\\Theta(n^2)\\).";
parameterMapping[funcName] = ["position : int", "steps : int", "probability step left : float", "probability step right : float", "rightmost seen position : int"];
trackerMapping[funcName] = DPTracker;
initParams[funcName] = [new ValueNode(0), new ValueNode(Math.ceil(Math.random() * 4) + 3), new ValueNode(Math.ceil(Math.random() * 4) / 10),
	new ValueNode(Math.ceil(Math.random() * 4) / 10), new ValueNode(0)];