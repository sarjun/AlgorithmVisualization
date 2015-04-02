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
		//var getEntry = getEmptyGetFromTableAnimation();
		//getEntry.ansSpec = getNodeSpecification(ans.value, 0, [], "end");
		//addStartAnimation(getEntry);
		var newAns = new ValueNode(ans.value.value + pos.value);
		tracker.logExit([newAns]);
		return newAns;
	}
	var offsetFromMax = new ValueNode(maxRightSeen.value - pos.value);
	if (steps.value <= 0) {
		ans = maxRightSeen;
		var tEntry = getEmptyDPTableEntry();
		tEntry.params = {
			"steps": steps,
			"offsetFromMacs": offsetFromMax
		};
		tEntry.value = offsetFromMax;
		tracker.table[key] = tEntry;
		var frame = tracker.logExit([ans]);
		tEntry.methodId = frame.methodId;
		return ans;
	} else {

		var newStep = new ValueNode(steps.value - 1);
		var pStay = new ValueNode(1 - pLeft.value - pRight.value);

		// Start animation
		var nNodes = [new ValueNode("\\(P_{left}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P_{stay}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P_{right}\\)"), new ValueNode("\\(S\\)"), new ValueNode("\\(P\\)"), new ValueNode("\\(M\\)"),
			new ValueNode("\\(P\\)")];
		var recurrence = getEmptyCreateIntermediateStepAnimation();
		recurrence.intermediateId = intermId++;
		recurrence.list = "start";
		recurrence.position = "below";
		recurrence.entities = ["\\(t(S,P,M) =\\; \\)"];
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
			"\\( + 1\\)", "\\(,\\)", "\\(max(\\)", nNodes[11], "\\(,\\)", nNodes[12], "\\( + 1)\\)", "\\()\\)"];
		recurrence.inline = true;
		addStartAnimation(recurrence);

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
		var fillBundle = getEmptyBundleAnimation();
		var ss = [3, 4, 4];
		var ps = [[6], [7], [7, 13]];
		var ms = [9, 9, 11];
		for(var i = 2; i >=0; i--) {
			if(probs[i] <= check[i]) {
				var removeInterm = getEmptyRemoveIntermediateStepAnimation();
				removeInterm.intermediateId = ids[i];
				removeInterm.position = "below";
				removeInterm.list = "start";
				removeZeroBundle.animations.push(removeInterm);
				if(i == 0) {
					var removePlus = getEmptyIntermediateRemoveEntityAnimation();
					if(pStay.value > EPSILON) removePlus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 3);
					else removePlus.intermSpec = getIntermediateSpecification(0, [], "start", "below", 4);
					removePlus.effectParams = ["fade"];
					removePlus.entityIndex = 1;
					removeZeroBundle.animations.push(removePlus);
				}
			} else {
				// TODO: this wont work in this loop.
				var moveS = getEmptyTranslateAnimation();
				moveS.sourceSpec = getNodeSpecification(steps, 0, [], "start");
				moveS.destSpec = getNodeSpecification(nNodes[1+4*i], 0, [], "start", 4+(i*1));
				fillBundle.animations.push(moveS);
				var moveP = getEmptyTranslateAnimation();
				moveP.sourceSpec = getNodeSpecification(pos, 0, [], "start");
				moveP.destSpec = getNodeSpecification(nNodes[2+4*i], 0, [], "start", 4+(i*1));
				fillBundle.animations.push(moveP);
				if(i==2) {
					moveP = getEmptyTranslateAnimation();
					moveP.sourceSpec = getNodeSpecification(pos, 0, [], "start");
					moveP.destSpec = getNodeSpecification(nNodes[12], 0, [], "start", 4+(i*1));
					fillBundle.animations.push(moveP);
				}
				var moveM = getEmptyTranslateAnimation();
				moveM.sourceSpec = getNodeSpecification(oldMax, 0, [], "start");
				moveM.destSpec = getNodeSpecification(nNodes[3+4*i], 0, [], "start", 4+(i*1));
				fillBundle.animations.push(moveM);
			}
		}
		addStartAnimation(removeZeroBundle);
		addStartAnimation(fillBundle);

		var ans = 0;
		if (pLeft.value > 0) {
			var moveLeft = maximumRandomWalk(new ValueNode(pos.value - 1), newStep, pLeft, pRight, maxRightSeen);
			ans += pLeft.value * moveLeft.value;
		}
		if (pStay.value > EPSILON) {
			var stay = maximumRandomWalk(pos, newStep, pLeft, pRight, maxRightSeen);
			ans += pStay.value * stay.value;
		}
		if (pRight.value > 0) {
			var moveRight = maximumRandomWalk(new ValueNode(pos.value + 1), newStep, pLeft, pRight, new ValueNode(Math.max(pos.value + 1, maxRightSeen.value)));
			ans += pRight.value * moveRight.value;
		}
		endReset.maxShowID = tracker.maxId - 1;
		ans = new ValueNode(ans);
		var tEntry = getEmptyDPTableEntry();
		tEntry.params = {
			"steps": steps,
			"offsetFromMacs": offsetFromMax
		};
		tEntry.value = new ValueNode(ans.value - pos.value);
		tracker.table[key] = tEntry;
		var frame = tracker.logExit([ans]);
		tEntry.methodId = frame.methodId;
		return ans;
	}
}

funcMapping[funcName] = maximumRandomWalk;
overviewMapping[funcName] = "This function selects the kth smallest (where k is zero-indexed) element from the input list. " +
"This is done by repeatedly partitioning the list and looking in the appropriate half until the selected partition is the desired element.";
divideMapping[funcName] = "The input list is divided into buckets of size 5. We then find the median of each bucket and " +
"recursively find the median of these medians.";
conquerMapping[funcName] = "The input list is partitioned on the median of medians from the previous recursive call. " +
"The algorithm terminates if the median of medians is at" +
" index k. Otherwise, we recurse on the half of the partitioned list that contains the desired index.";
parameterMapping[funcName] = ["position : int", "steps : int", "probability step left : float", "probability step right : float", "rightmost seen position : int"];
trackerMapping[funcName] = DPTracker;