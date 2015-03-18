// ******************
// Skyline Function
// ******************
funcName = "Skyline";
funcNames.push(funcName);

function skyline(buildings) {
	if (buildings.length == 1) return [0, 0, buildings];

	var half1 = buildings.slice(0, Math.floor(buildings.length / 2));
	var half2 = buildings.slice(Math.floor(buildings.length / 2), buildings.length);

	var sub = skyline(half1);
	var temp = skyline(half2);
	sub[0] += temp[0];
	sub[1] += temp[1];
	half1 = sub[2];
	half2 = temp[2];

	var i = 0;
	var j = 0;
	var sorted = [];
	while (i < half1.length && j < half2.length) {
		if (half1[i] < half2[j]) {
			sub[0] += half2.length - j;
			sorted.push(half1[i]);
			i++;
		}
		else if (half1[i] > half2[j]) {
			sub[1] += half1.length - i;
			sorted.push(half2[j]);
			j++;
		}
		if (i == half1.length) {
			while (j < half2.length) {
				sorted.push(half2[j++]);
			}
		}
		if (j == half2.length) {
			while (i < half1.length) {
				sorted.push(half1[i++]);
			}
		}
	}
	sub[2] = sorted;

	return sub;
}

funcMapping[funcName] = skyline;
overviewMapping[funcName] = "This function computes the left and right skyline values of a particular skyline. " +
"The left skyline value of one building is the number of buildings to the left of that building that it is taller than. " +
"The left skyline value of a skyline is the sum of the left skyline value of each building in the skyline. " +
"The right skyline function is defined similarly";
divideMapping[funcName] = "Find the right and left skyline values of two halves of the skyline recursively. " +
"This is done by dividing the skyline in half.";
conquerMapping[funcName] = "Modification of Mergesort. Whenever an item is added to the result list, update the skyline counters.";
trackerMapping[funcName] = Tracker;


// ******************
// Skyline Function
// ******************
funcName = "Merge Sort";
funcNames.push(funcName);

function mergeSort(list) {
	// Divide and conquer algorithm
	// eventually this would come from the web page
	// for now, we will use mergesort
	tracker.logEntry([list]);
	var zoomAnimation = getEmptyAbsoluteZoomAnimation();
	tracker.currentFrame.startAnimations.push(zoomAnimation);
	tracker.currentFrame.endAnimations.push(zoomAnimation);
	if (list.length == 1) {
		var frame = tracker.logExit(list);
		zoomAnimation.methodId = frame.methodId;
		return list;
	}
	var firstHalf = list.slice(0, Math.floor(list.length / 2));
	var secondHalf = list.slice(Math.floor(list.length / 2));
	var bucket = getEmptyBucketAnimation();
	bucket.addBuckets.push([0, Math.floor(list.length / 2) - 1]);
	tracker.currentFrame.startAnimations.push(bucket);
	bucket.visualizationSpec = getVisualizationSpecification(0, [], "start", 0);
	bucket = getEmptyBucketAnimation();
	bucket.addBuckets.push([Math.floor(list.length / 2), list.length - 1]);
	bucket.visualizationSpec = getVisualizationSpecification(0, [], "start", 0);
	tracker.currentFrame.startAnimations.push(bucket);
	firstHalf = mergeSort(firstHalf);
	secondHalf = mergeSort(secondHalf);
	tracker.currentFrame.startAnimations.push(getDivideInputAnimation(list, 0, Math.floor(list.length / 2) - 1, 0));
	tracker.currentFrame.startAnimations.push(getDivideInputAnimation(list, Math.floor(list.length / 2), list.length - 1, 1));

	var sorted = [];
	var first = 0, second = 0;
	var hideResult = getEmptyVisibilityAnimation();
	hideResult.hideRanges.push([0, list.length]);
	hideResult.visualizationSpec = getVisualizationSpecification(0, [], "end", 0);
	tracker.currentFrame.endAnimations.push(hideResult);
	var highlightStart = getEmptyHighlightAnimation();
	highlightStart.nodeSpecs.push(getNodeSpecification(firstHalf[first], 0, [0], "end"));
	highlightStart.nodeSpecs.push(getNodeSpecification(secondHalf[second], 0, [1], "end"));
	tracker.currentFrame.endAnimations.push(highlightStart);
	for (var i = 0; i < list.length; i++) {
		if (first == firstHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceSpec = getNodeSpecification(secondHalf[second], 0, [1], "end");
			translate.destSpec = getNodeSpecification(secondHalf[second], 0, [], "end");
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodeSpecs.push(getNodeSpecification(secondHalf[second], 0, [1], "end"));
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(secondHalf[second++]);
			tracker.currentFrame.endAnimations.push(unhighlight);
			if(second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodeSpecs.push(getNodeSpecification(secondHalf[second], 0, [1], "end"));
				tracker.currentFrame.endAnimations.push(highlight);
			}
			continue;
		}
		if (second == secondHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceSpec = getNodeSpecification(firstHalf[first], 0, [0], "end");
			translate.destSpec = getNodeSpecification(firstHalf[first], 0, [], "end");
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodeSpecs.push(getNodeSpecification(firstHalf[first], 0, [0], "end"));
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(firstHalf[first++]);
			if (first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodeSpecs.push(getNodeSpecification(firstHalf[first], 0, [0], "end"));
				tracker.currentFrame.endAnimations.push(highlight);
			}
			continue;
		}
		if (firstHalf[first].value > secondHalf[second].value) {
			tracker.currentFrame.endAnimations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, secondHalf[second].value));
			var translate = getEmptyTranslateAnimation();
			translate.sourceSpec = getNodeSpecification(secondHalf[second], 0, [1], "end");
			translate.destSpec = getNodeSpecification(secondHalf[second], 0, [], "end");
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodeSpecs.push(getNodeSpecification(secondHalf[second], 0, [1], "end"));
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(secondHalf[second++]);
			if (second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodeSpecs.push(getNodeSpecification(secondHalf[second], 0, [1], "end"));
				tracker.currentFrame.endAnimations.push(highlight);
			}
			if (second == secondHalf.length) tracker.currentFrame.endAnimations.push(textAnimateDoneList(1));
		}
		else {
			tracker.currentFrame.endAnimations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, firstHalf[first].value));
			var translate = getEmptyTranslateAnimation();
			translate.sourceSpec = getNodeSpecification(firstHalf[first], 0, [0], "end");
			translate.destSpec = getNodeSpecification(firstHalf[first], 0, [], "end");
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodeSpecs.push(getNodeSpecification(firstHalf[first], 0, [0], "end"));
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(firstHalf[first++]);
			if (first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodeSpecs.push(getNodeSpecification(firstHalf[first], 0, [0], "end"));
				tracker.currentFrame.endAnimations.push(highlight);
			}
			if (first == firstHalf.length) tracker.currentFrame.endAnimations.push(textAnimateDoneList(2));
		}
	}

	var frame = tracker.logExit([sorted]);
	zoomAnimation.methodId = frame.methodId;
	return sorted;
}

function getShowDestAnimation(i) {
	var showResult = getEmptyVisibilityAnimation();
	showResult.showRanges.push([i, i]);
	showResult.visualizationSpec = getVisualizationSpecification(0, [], "end", 0);
	return showResult;
}

function getDivideInputAnimation(list, start, end, circle) {
	var bundle = getEmptyBundleAnimation();
	for (var i = start; i <= end; i++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceSpec = getNodeSpecification(list[i], 0, [], "start");
		translate.destSpec = getNodeSpecification(list[i], 0, [circle], "start");
		bundle.animations.push(translate);
	}
	return bundle;
}

function textAnimateSelect(val1, val2, sel) {
	var anim = getEmptyTextAnimation();
	anim.text = "We select the minimum of " + val1 + " and " + val2 + ".";
	anim.text += val1 == val2 ? "Since they are the same, it doesn't matter which one is added to the result list first." : "";
	anim.cardColor = "lightcyan";

	return anim;
}

function textAnimateDoneList(num) {
	var anim = getEmptyTextAnimation();
	anim.text = "Now we just add the remaining elements from the " + (num == 1 ? "first" : "second") + " list.";
	anim.cardColor = "lightcyan";

	return anim;
}

funcMapping[funcName] = mergeSort;
overviewMapping[funcName] = "This function sorts a list of elements by recursively sorting two halves and then merging the " +
"result such that the combination is sorted.";
divideMapping[funcName] = "The input list is divided into two halves by splitting in the middle.";
conquerMapping[funcName] = "The two sorted halves are merged by iteratively selecting elements from the two sorted halves " +
"in overall sorted order.";
parameterMapping[funcName] = ["Input List : [int list]"];
trackerMapping[funcName] = Tracker;

// ******************
// Quick Select
// ******************
funcName = "Median of Medians";
function quickSelect(k, list, selMedian, interm) {
	var entryList = list.slice(0);
	tracker.logEntry([k, entryList]);
	var zoomStart = getEmptyRelativeZoomAnimation();
	zoomStart.circleSpec = getCircleSpecification(0, []);
	tracker.currentFrame.startAnimations.push(zoomStart);
	if(interm) {
		var zoomEnd = getEmptyRelativeZoomAnimation();
		zoomEnd.circleSpec = getCircleSpecification(1, []);
		tracker.currentFrame.endAnimations.push(zoomEnd);
	}
	// Check error conditions
	if(k.value > list.length - 1) {
		var errorMsg = new ValueNode("The value of k is too high to be found in the list.");
		tracker.logExit([errorMsg]);
		return;
	}
	if(k.value < 0) {
		var errorMsg = new ValueNode("The value of k cannot be negative.");
		tracker.logExit([errorMsg]);
		return;
	}
	if(k.value % 1 != 0) {
		var errorMsg = new ValueNode("The value of k must be a positive integer.");
		tracker.logExit([errorMsg]);
		return;
	}

	// Base case
	if(list.length <= 5) {
		if(k.value > 4) {
			console.log("shouldn't happen!");
			return null;
		}
		else {
			list.sort(function(a, b) {
				return a.value - b.value;
			});
			textAnimateBaseCase();
			var foundKth = getEmptyTranslateAnimation();
			foundKth.sourceSpec = getNodeSpecification(list[k.value], 0, [], "start");
			foundKth.destSpec = getNodeSpecification(list[k.value], 0, [], "end");
			tracker.currentFrame.startAnimations.push(foundKth);
			if(selMedian) {
				animatePivotSelection(list[k.value]);
			}
			tracker.logExit([list[k.value]]);
			return list[k.value];
		}
	}

	// Get the list of medians in buckets of size 5
	var medians = [];
	var bucketAnim = getEmptyBucketAnimation();
	bucketAnim.visualizationSpec = getVisualizationSpecification(0, [], "start", 1);
	var sortAnim = getEmptyBundleAnimation();
	var showAnim = getEmptyVisibilityAnimation();
	var medianSelAnim = getEmptyHighlightAnimation();
	var medianListAnim = getEmptyBundleAnimation();
	var resetAnim = getEmptyPhaseAnimation();

	resetAnim.newState = entryList;
	resetAnim.vSpec = getVisualizationSpecification(0, [], "start", 1);

	showAnim.showRanges.push([0, list.length - 1]);
	showAnim.visualizationSpec = getVisualizationSpecification(0, [], "start", 1);

	for(var i=0; i<list.length; i+=5) {
		var bucket = list.slice(i, i+5);
		bucketAnim.addBuckets.push([i, Math.min(i+4, list.length - 1)]);
		var forTranslate = bucket.slice(0);
		bucket.sort(function(a, b) {
			return a.value - b.value;
		});
		for(var j=0; j<bucket.length; j++) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceSpec = getNodeSpecification(bucket[j], 0, [], "start");
			translate.destSpec = getNodeSpecification(forTranslate[j], 0, [], "start");
			translate.moveSource = true;
			sortAnim.animations.push(translate);
		}
		medians.push(bucket[Math.floor(bucket.length / 2)]);

		medianSelAnim.nodeSpecs.push(getNodeSpecification(bucket[Math.floor(bucket.length / 2)], 0, [], "start"));
	}
	var hide = getEmptyVisibilityAnimation();
	hide.visualizationSpec = getVisualizationSpecification(0, [], "start", 1);
	hide.hideRanges.push([0, list.length - 1]);
	sortAnim.animations.push(hide);
	for(var i=0; i<medianSelAnim.nodeSpecs.length; i++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceSpec = getNodeSpecification(medianSelAnim.nodeSpecs[i].node, 0, [], "start");
		translate.destSpec = getNodeSpecification(medianSelAnim.nodeSpecs[i].node, 0, [0], "start");
		medianListAnim.animations.push(translate);
	}
	tracker.currentFrame.startAnimations.push(bucketAnim);
	tracker.currentFrame.startAnimations.push(sortAnim);
	tracker.currentFrame.startAnimations.push(showAnim);
	tracker.currentFrame.startAnimations.push(medianSelAnim);
	textAnimateMedians(medians);
	tracker.currentFrame.startAnimations.push(medianListAnim);
	tracker.currentFrame.startAnimations.push(resetAnim);

	var pivot = quickSelect(new ValueNode(Math.floor(medians.length / 2)), medians, true, true);
	// Check if the pivot is the kth value. If not, recurse on the greater partition or the lesser partition
	var temp = list[0];
	var switchIndex = list.indexOf(pivot);
	list[0] = pivot;
	list[switchIndex] = temp;
	var highlightPivot = getEmptyHighlightAnimation();
	highlightPivot.nodeSpecs.push(getNodeSpecification(pivot, 1, [], "start"));
	tracker.currentFrame.children[0].endAnimations.push(highlightPivot);
	textAnimatePartitionSetup(pivot);
	animateSwapParentCircle(list[0], list[switchIndex]);
	var bucketRemaining = getEmptyBucketAnimation();
	bucketRemaining.visualizationSpec = getVisualizationSpecification(1, [], "start", 1);
	bucketRemaining.addBuckets.push([1, list.length - 1]);
	tracker.currentFrame.children[0].endAnimations.push(bucketRemaining);
	var start = 1;
	var end = list.length - 1;
	var completedOne = false;
	var first = true;
	while(start < end) {
		if(first) {
			textAnimatePartitionLeft();
			highlightInParentStart(list[start]);
		}
		while(list[start].value <= pivot.value && start < end) {
			unhighlightInParentStart(list[start]);
			start++;
			highlightInParentStart(list[start]);
		}
		if(first) {
			textAnimatePartitionRight();
			highlightInParentStart(list[end]);
		}
		while(list[end].value > pivot.value && start < end) {
			unhighlightInParentStart(list[end]);
			end--;
			highlightInParentStart(list[end]);
		}
		if(first) {
			textAnimatePartitionSwap();
			first = false;
		}
		var swap = list[end];
		list[end] = list[start];
		list[start] = swap;
		animateSwapParentCircle(list[start], list[end]);
		if(start == end) break;
	}
	var stop = list[end].value < pivot.value ? end : end - 1;
	for(var i = 0; i < stop; i++) {
		list[i] = list[i+1];
	}
	list[stop] = pivot;
	textAnimatePartitionDone(stop, list[stop].value, k.value);

	resetAnim = getEmptyPhaseAnimation();
	resetAnim.newState = entryList;
	resetAnim.vSpec = getVisualizationSpecification(1, [], "start", 1);
	if(stop == k.value) {
		quickSelect(new ValueNode(0), [pivot], false, true);
		if(selMedian) {
			animatePivotSelection(pivot);
		}
		textAnimateRecurseKth();
		animateRecurseSubList([pivot], resetAnim);
		tracker.logExit([pivot]);
		return pivot;
	}
	else {
		if(stop > k.value) {
			var answer = quickSelect(k, list.slice(0, stop), false, true);
			if(selMedian) {
				animatePivotSelection(answer);
			}
			animateRecurseSubList(list.slice(0, stop), resetAnim);
			tracker.logExit([answer]);
			return answer;
		}
		else {
			var answer = quickSelect(new ValueNode(k.value - stop - 1), list.slice(stop + 1), false, true);
			if(selMedian) {
				animatePivotSelection(answer);
			}
			animateRecurseSubList(list.slice(stop + 1), resetAnim);
			tracker.logExit([answer]);
			return answer;
		}
	}
}

function textAnimateMedians(medians) {
	var explainMedOfMed = getEmptyTextAnimation();
	explainMedOfMed.text = "The medians of the buckets in the input list are: " + medians[0].value;
	for(var i=1; i<medians.length - 1; i++) {
		explainMedOfMed.text += ", " + medians[i].value;
	}
	explainMedOfMed.text += ", and " + medians[medians.length - 1].value;
	var index =  Math.floor(medians.length / 2) + "";
	var suffix = getSuffix(index * 1);
	explainMedOfMed.text += ". The " + index + suffix + " lowest value (zero-indexed) in these medians (the median of medians) will be " +
	"found recursively to partition the input list.";

	tracker.currentFrame.startAnimations.push(explainMedOfMed);
}

function getSuffix(num) {
	switch (num % 100) {
		case 11:
		case 12:
		case 13:
			return 'th';
		default :
			break;
	}
	switch (num % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default :
			return 'th';
	}
}

function textAnimateBaseCase() {
	var explainBase = getEmptyTextAnimation();
	explainBase.text = "Since the input list is smaller than the size of one bucket (5), this is a base case. Return the desired element.";
	tracker.currentFrame.startAnimations.push(explainBase);
}

function textAnimatePartitionSetup(elem) {
	var explainPartition = getEmptyTextAnimation();
	explainPartition.text = "The partitioning around " + elem.value + " will be done in place. First we move it to " +
	"the beginning of the list.";
	tracker.currentFrame.children[0].endAnimations.push(explainPartition);
}

function textAnimatePartitionRight() {
	var explainPartition = getEmptyTextAnimation();
	explainPartition.text = "Find the first element from the right of the list whose value is less than the pivot element...";
	tracker.currentFrame.children[0].endAnimations.push(explainPartition);
}

function textAnimatePartitionLeft() {
	var explainPartition = getEmptyTextAnimation();
	explainPartition.text = "Find the first element from the left of the list whose value is greater than the pivot element...";
	tracker.currentFrame.children[0].endAnimations.push(explainPartition);
}

function textAnimatePartitionSwap() {
	var explainPartition = getEmptyTextAnimation();
	explainPartition.text = "Now swap them. Repeat this until the two pointers reach the same index in the list.";
	tracker.currentFrame.children[0].endAnimations.push(explainPartition);
}

function textAnimateRecurseKth() {
	var explainDone = getEmptyTextAnimation();
	explainDone.text = "The partition is the kth element, so we are done! We will recurse on just the kth element only for " +
	"symmetry in the visualization.";
	tracker.currentFrame.children[0].endAnimations.push(explainDone);
}

function textAnimatePartitionDone(pivotIndex, pivot, search) {
	var explainDone = getEmptyTextAnimation();
	var compare = pivot > search;
	explainDone.text = "Now we know that the pivot is the " + pivotIndex + getSuffix(pivotIndex) + " value in the list (zero-indexed).";
	if(pivot != search) {
		explainDone.text += " Since the index we are looking for, " + search + ", is " + (compare ? "smaller" : "greater") +
		" than the pivot index, we will recurse on the " + (compare ? "left" : "right") + " half of the list.";
	}
	else {
		explainDone.text += " Since the index we are looking for, " + search + ", is equal to the pivot index, " +
		"we are done!";
	}
	tracker.currentFrame.children[0].endAnimations.push(explainDone);
}

function animatePivotSelection(pivot) {
	var showAnswer = getEmptyTranslateAnimation();
	showAnswer.sourceSpec = getNodeSpecification(pivot, 0, [], "end");
	showAnswer.destSpec = getNodeSpecification(pivot, 1, [], "start");
	tracker.currentFrame.endAnimations.push(showAnswer);
}

function highlightInParentStart(node) {
	var elemToConsider = getEmptyHighlightAnimation();
	elemToConsider.nodeSpecs.push(getNodeSpecification(node, 1, [], "start"));
	tracker.currentFrame.children[0].endAnimations.push(elemToConsider);
}

function unhighlightInParentStart(node) {
	var elemDoneConsider = getEmptyUnhighlightAnimation();
	elemDoneConsider.nodeSpecs.push(getNodeSpecification(node, 1, [], "start"));
	tracker.currentFrame.children[0].endAnimations.push(elemDoneConsider);
}

function animateSwapParentCircle(node1, node2) {
	var swapAnim = getEmptySwapAnimation();
	swapAnim.node1 = getNodeSpecification(node1, 1, [], "start");
	swapAnim.node2 = getNodeSpecification(node2, 1, [], "start");
	tracker.currentFrame.children[0].endAnimations.push(swapAnim);
}

function animateRecurseSubList(subList, resetAnim) {
	var bundle = getEmptyBundleAnimation();
	for(var i=0; i<subList.length; i++) {
		var translate = getEmptyTranslateAnimation();

		var sourceSpec = getNodeSpecification(subList[i], 1, [], "start");
		var destSpec = getNodeSpecification(subList[i], 1, [1], "start");
		translate.sourceSpec = sourceSpec;
		translate.destSpec = destSpec;
		bundle.animations.push(translate);
	}
	tracker.currentFrame.children[0].endAnimations.push(bundle);
	tracker.currentFrame.children[0].endAnimations.push(resetAnim);
}

funcMapping[funcName] = quickSelect;
overviewMapping[funcName] = "This function selects the kth smallest (where k is zero-indexed) element from the input list. " +
"This is done by repeatedly partitioning the list and looking in the appropriate half until the selected partition is the desired element.";
divideMapping[funcName] = "The input list is divided into buckets of size 5. We then find the median of each bucket and " +
"recursively find the median of these medians.";
conquerMapping[funcName] = "The input list is partitioned on the median of medians from the previous recursive call. " +
"The algorithm terminates if the median of medians is at" +
" index k. Otherwise, we recurse on the half of the partitioned list that contains the desired index.";
parameterMapping[funcName] = ["K : uint", "Input List : [int list]"];
trackerMapping[funcName] = Tracker;

// Set Starting Function
funcName = "Median of Medians";