var funcNames = [];
var funcMapping = {};
var overviewMapping = {};
var divideMapping = {};
var conquerMapping = {};

var funcName = "";

// ******************
// Skyline Function
// ******************
funcName = "Skyline";
funcNames.push(funcName);

function skyline(buildings) {
	if(buildings.length == 1) return [0,0, buildings];

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
	while(i < half1.length && j < half2.length) {
		if(half1[i] < half2[j]) {
			sub[0] += half2.length - j;
			sorted.push(half1[i]);
			i++;
		}
		else if(half1[i] > half2[j]) {
			sub[1] += half1.length - i;
			sorted.push(half2[j]);
			j++;
		}
		if(i==half1.length) {
			while(j < half2.length) {
				sorted.push(half2[j++]);
			}
		}
		if(j==half2.length) {
			while(i < half1.length) {
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
			sorted.push(secondHalf[second++]);
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
			tracker.currentFrame.animations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, secondHalf[second].value));
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
			if(second == secondHalf.length) tracker.currentFrame.animations.push(textAnimateDoneList(1));
		}
		else {
			tracker.currentFrame.animations.push(textAnimateSelect(firstHalf[first].value,
				secondHalf[second].value, firstHalf[first].value));
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
			if(first == firstHalf.length) tracker.currentFrame.animations.push(textAnimateDoneList(2));
		}
	}

	tracker.logExit(sorted);
	return sorted;
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
	anim.text = "Now we just add the remaining elements from the " + (num==1 ? "first" : "second") + " list.";
	anim.cardColor = "lightcyan";

	return anim;
}

funcMapping[funcName] = mergeSort;
overviewMapping[funcName] = "This function sorts a list of elements by recursively sorting two halves and then merging the " +
"result such that the combination is sorted.";
divideMapping[funcName] = "The input list is divided into two halves by splitting in the middle.";
conquerMapping[funcName] = "The two sorted halves are merged by iteratively selecting elements from the two sorted halves " +
"in overall sorted order.";


// ******************
// Quick Select
// ******************
funcName = "Quick Select";
function quickSelect(k, list) {
	// Base case
	if(list.length == 1) {
		if(k!=0) {
			console.log("shouldn't happen " + k);
			return null;
		}
		else return list[0];
	}

	// Get the list of medians in buckets of size 5
	var medians = [];
	for(var i=0; i<list.length; i+=5) {
		var bucket = list.slice(i, i+5);
		bucket.sort(function(a, b) {
			return a.value - b.value;
		});
		medians.push(bucket[Math.floor(bucket.length / 2)]);
	}


	var pivot = quickSelect(Math.floor(medians.length / 2), medians);
	// Check if the pivot is the kth value. If not, recurse on the greater partition or the lesser partition
	var donePivot = false;
	var partitioned = [pivot];
	var pivotIndex = 0;
	for(var i=0; i<list.length; i++) {
		if(list[i].value==pivot.value && !donePivot) {
			donePivot = true;
			continue;
		}
		else if(list[i].value > pivot.value) {
			partitioned.push(list[i]);
		}
		else {
			partitioned.unshift(list[i]);
			pivotIndex++;
		}
	}

	if(pivotIndex == k) return pivot;
	else {
		if(pivotIndex > k) return quickSelect(k, partitioned.slice(0, pivotIndex));
		else return quickSelect(k - pivotIndex, partitioned.slice(pivotIndex));
	}
}

// Set Starting Function
funcName = "Merge Sort";