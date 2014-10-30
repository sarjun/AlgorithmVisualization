var funcNames = [];
var funcMapping = {};
var overviewMapping = {};
var divideMapping = {};
var conquerMapping = {};
var parameterMapping = {};

var funcName = "";

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


// ******************
// Skyline Function
// ******************
funcName = "Merge Sort";
funcNames.push(funcName);

function mergeSort(tracker, list) {
	// Divide and conquer algorithm
	// eventually this would come from the web page
	// for now, we will use mergesort
	tracker.logEntry(list);
	if (list.length == 1) {
		tracker.logExit(list);
		return list;
	}
	var firstHalf = list.slice(0, Math.floor(list.length / 2));
	var secondHalf = list.slice(Math.floor(list.length / 2));
	var bucket = getEmptyBucketAnimation();
	bucket.addBuckets.push([0, Math.floor(list.length / 2) - 1]);
	tracker.currentFrame.startAnimations.push(bucket);
	bucket = getEmptyBucketAnimation();
	bucket.addBuckets.push([Math.floor(list.length / 2), list.length - 1]);
	tracker.currentFrame.startAnimations.push(bucket);
	firstHalf = mergeSort(tracker, firstHalf);
	secondHalf = mergeSort(tracker, secondHalf);
	tracker.currentFrame.startAnimations.push(getDivideInputAnimation(list, 0, Math.floor(list.length / 2) - 1, 0));
	tracker.currentFrame.startAnimations.push(getDivideInputAnimation(list, Math.floor(list.length / 2), list.length - 1, 1));

	var sorted = [];
	var first = 0, second = 0;
	var hideResult = getEmptyVisibilityAnimation();
	hideResult.hideRanges.push([0, list.length]);
	tracker.currentFrame.endAnimations.push(hideResult);
	var highlightStart = getEmptyHighlightAnimation();
	highlightStart.nodes.push(firstHalf[first]);
	highlightStart.nodes.push(secondHalf[second]);
	highlightStart.circles.push(0);
	highlightStart.circles.push(1);
	highlightStart.lists.push("end");
	highlightStart.lists.push("end");
	tracker.currentFrame.endAnimations.push(highlightStart);
	for (var i = 0; i < list.length; i++) {
		if (first == firstHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNode = secondHalf[second];
			translate.destNode = secondHalf[second];
			translate.sourceCircle = 1;
			translate.sourceList = "end";
			translate.destCircle = -1;
			translate.destList = "end";
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.nodes.push(secondHalf[second]);
			unhighlight.circles.push(1);
			unhighlight.lists.push("end");
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(secondHalf[second++]);
			tracker.currentFrame.endAnimations.push(unhighlight);
			if(second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(secondHalf[second]);
				highlight.circles.push(1);
				highlight.lists.push("end");
				tracker.currentFrame.endAnimations.push(highlight);
			}
			continue;
		}
		if (second == secondHalf.length) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceNode = firstHalf[first];
			translate.destNode = firstHalf[first];
			translate.sourceCircle = 0;
			translate.sourceList = "end";
			translate.destCircle = -1;
			translate.destList = "end";
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.circles.push(0);
			unhighlight.lists.push("end");
			unhighlight.nodes.push(firstHalf[first]);
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(firstHalf[first++]);
			if (first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(firstHalf[first]);
				highlight.circles.push(0);
				highlight.lists.push("end");
				tracker.currentFrame.endAnimations.push(highlight);
			}
			continue;
		}
		//console.log(first);
		//console.log(firstHalf);
		//console.log(firstHalf.length);
		if (firstHalf[first].value > secondHalf[second].value) {
			tracker.currentFrame.endAnimations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, secondHalf[second].value));
			var translate = getEmptyTranslateAnimation();
			translate.sourceNode = secondHalf[second];
			translate.destNode = secondHalf[second];
			translate.sourceCircle = 1;
			translate.sourceList = "end";
			translate.destCircle = -1;
			translate.destList = "end";
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.circles.push(1);
			unhighlight.lists.push("end");
			unhighlight.nodes.push(secondHalf[second]);
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(secondHalf[second++]);
			if (second < secondHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(secondHalf[second]);
				highlight.circles.push(1);
				highlight.lists.push("end");
				tracker.currentFrame.endAnimations.push(highlight);
			}
			if (second == secondHalf.length) tracker.currentFrame.endAnimations.push(textAnimateDoneList(1));
		}
		else {
			tracker.currentFrame.endAnimations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, firstHalf[first].value));
			var translate = getEmptyTranslateAnimation();
			translate.sourceNode = firstHalf[first];
			translate.destNode = firstHalf[first];
			translate.sourceCircle = 0;
			translate.sourceList = "end";
			translate.destCircle = -1;
			translate.destList = "end";
			tracker.currentFrame.endAnimations.push(translate);
			tracker.currentFrame.endAnimations.push(getShowDestAnimation(i));
			var unhighlight = getEmptyUnhighlightAnimation();
			unhighlight.circles.push(0);
			unhighlight.lists.push("end");
			unhighlight.nodes.push(firstHalf[first]);
			tracker.currentFrame.endAnimations.push(unhighlight);
			sorted.push(firstHalf[first++]);
			if (first < firstHalf.length) {
				var highlight = getEmptyHighlightAnimation();
				highlight.nodes.push(firstHalf[first]);
				highlight.circles.push(0);
				highlight.lists.push("end");
				tracker.currentFrame.endAnimations.push(highlight);
			}
			if (first == firstHalf.length) tracker.currentFrame.endAnimations.push(textAnimateDoneList(2));
		}
	}

	tracker.logExit(sorted);
	return sorted;
}

function getShowDestAnimation(i) {
	var showResult = getEmptyVisibilityAnimation();
	showResult.showRanges.push([i, i]);
	return showResult;
}

function getDivideInputAnimation(list, start, end, circle) {
	var bundle = getEmptyBundleAnimation();
	for (var i = start; i <= end; i++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceNode = list[i];
		translate.destNode = list[i];
		translate.sourceCircle = -1;
		translate.sourceList = "start";
		translate.destCircle = circle;
		translate.destList = "start";
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
parameterMapping[funcName] = ["Input List"];

// ******************
// Quick Select
// ******************
funcName = "Quick Select";
function quickSelect(tracker, k, list, selMedian) {
	//console.log(k + " from " + list.map(function(elem) {
	//	return elem.value;
	//}));
	tracker.logEntry([k, list.slice(0)]);
	//console.log("entry: " + tracker.currentFrame);
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
			//console.log("exit: " + list[0].value);
			tracker.logExit([list[k.value]]);
			//console.log(tracker.currentFrame);
			return list[k.value];
		}
	}

	// Get the list of medians in buckets of size 5
	var medians = [];
	var bucketAnim = getEmptyBucketAnimation();
	var sortAnim = getEmptyBundleAnimation();
	var medianSelAnim = getEmptyHighlightAnimation();
	var medianListAnim = getEmptyBundleAnimation();
	for(var i=0; i<list.length; i+=5) {
		var bucket = list.slice(i, i+5);
		bucketAnim.addBuckets.push([i, Math.min(i+4, list.length - 1)]);
		var forTranslate = bucket.slice(0);
		bucket.sort(function(a, b) {
			return a.value - b.value;
		});
		for(var j=0; j<bucket.length; j++) {
			var translate = getEmptyTranslateAnimation();
			translate.sourceCircle = translate.destCircle = -1;
			translate.sourceList = translate.destList = "start";
			translate.sourceNode = bucket[j];
			translate.destNode = forTranslate.filter(function(elem) {
				return elem.id == bucket[j].id;
			})[0];
			sortAnim.animations.push(translate);
		}
		medians.push(bucket[Math.floor(bucket.length / 2)]);
		medianSelAnim.nodes.push(bucket[Math.floor(bucket.length / 2)]);
		medianSelAnim.circles.push(-1);
		medianSelAnim.lists.push("start");
	}
	for(var i=0; i<medianSelAnim.nodes.length; i++) {
		var translate = getEmptyTranslateAnimation();
		translate.sourceCircle = -1;
		translate.destCircle = 0;
		translate.sourceList = translate.destList = "start";
		translate.sourceNode = translate.destNode = medianSelAnim.nodes[i];
		medianListAnim.animations.push(translate);
	}
	tracker.currentFrame.startAnimations.push(bucketAnim);
	tracker.currentFrame.startAnimations.push(sortAnim);
	tracker.currentFrame.startAnimations.push(medianSelAnim);
	tracker.currentFrame.startAnimations.push(medianListAnim);

	var pivot = quickSelect(tracker, new ValueNode(Math.floor(medians.length / 2)), medians, true);
	console.log(k + " from " + list.map(function(elem) {
		return elem.value;
	}));
	// Check if the pivot is the kth value. If not, recurse on the greater partition or the lesser partition
	var temp = list[0];
	var switchIndex = list.indexOf(pivot);
	list[0] = pivot;
	list[switchIndex] = temp;
	var start = 1;
	var end = list.length - 1;
	console.log(end);
	console.log(k + " from " + list.map(function(elem) {
		return elem.value;
	}));
	var completedOne = false;
	while(start < end) {
		while(list[start].value <= pivot.value && start < end) {
			start++;
		}
		while(list[end].value > pivot.value && start < end) {
			end--;
		}
			var swap = list[end];
			list[end] = list[start];
			list[start] = swap;
		if(start == end) break;
		console.log("after one swap: " + list.map(function(elem) {
			return elem.value;
		}));
		completedOne = true;
	}
	console.log("done swaps: " + list.map(function(elem) {
		return elem.value;
	}));
	var stop = completedOne ? end - 1 : end;
	for(var i = 0; i < stop; i++) {
		list[i] = list[i+1];
	}
	list[stop] = pivot;
	console.log(end);
	console.log("pivot in: " + list.map(function(elem) {
		return elem.value;
	}));
	//var donePivot = false;
	//var partitioned = [pivot];
	//var pivotIndex = 0;
	//for (var i = 0; i < list.length; i++) {
	//	if (list[i].value == pivot.value && !donePivot) {
	//		donePivot = true;
	//	}
	//	else if (list[i].value > pivot.value) {
	//		partitioned.push(list[i]);
	//	}
	//	else {
	//		partitioned.unshift(list[i]);
	//		pivotIndex++;
	//	}
	//}

	if(stop == k.value) {
		quickSelect(tracker, new ValueNode(0), [pivot], false);
		tracker.logExit([pivot]);
		return pivot;
	}
	else {
		if(stop > k.value) {
			var answer = quickSelect(tracker, k, list.slice(0, stop), false);
			tracker.logExit([answer]);
			//console.log("exit: " + answer.value);
			//console.log(tracker.currentFrame);
			return answer;
		}
		else {
			var answer = quickSelect(tracker, new ValueNode(k.value - stop), list.slice(stop + 1), false);
			tracker.logExit([answer]);
			//console.log("exit: " + answer.value);
			//console.log(tracker.currentFrame);
			return answer;
		}
	}
}

funcMapping[funcName] = quickSelect;
overviewMapping[funcName] = "This function selects the kth smallest element from the input list.";
divideMapping[funcName] = "The input list is divided into the medians of buckets of size 5. " +
"The median of these medians is then used as a pivot to partition the input list.";
conquerMapping[funcName] = "The return value is simply the value returned by the second recursive call.";
parameterMapping[funcName] = ["K", "Input List"];

// Set Starting Function
funcName = "Quick Select";