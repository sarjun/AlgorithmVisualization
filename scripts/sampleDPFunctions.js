/**
 * Created by Arjun on 1/28/2015.
 */
funcName = "Fibonacci";
function fibonacci(n) {
	tracker.logEntry([n]);
	var ans = tracker.table[n.value];
	if(ans != null) {
		tracker.logExit([ans.value]);
		return ans.value;
	}
	if(n.value < 2){
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = n;
		tEntry.params.n = n;
		var frame = tracker.logExit([n]);
		tEntry.methodId = frame.methodId;
		tracker.table[n.value] = tEntry;
		return n;
	}
	ans = fibonacci(new ValueNode(n.value - 1)).value + fibonacci(new ValueNode(n.value - 2)).value;
	var tEntry = getEmptyDPTableEntry();
	var value = new ValueNode(ans);
	tEntry.value = value;
	tEntry.params.n = n;
	var frame = tracker.logExit([value]);
	tEntry.methodId = frame.methodId;
	tracker.table[n.value] = tEntry;
	return value;
}

funcMapping[funcName] = fibonacci;
overviewMapping[funcName] = "This function selects the kth smallest (where k is zero-indexed) element from the input list. " +
"This is done by repeatedly partitioning the list and looking in the appropriate half until the selected partition is the desired element.";
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