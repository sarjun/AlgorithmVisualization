/**
 * Created by Arjun on 1/28/2015.
 */
var temp = funcName;

fiboId = 0;
funcName = "Fibonacci";
function fibonacci(n) {
	tracker.logEntry([n]);
	var ans = tracker.table[n.value];
	if(ans != null) {
		tracker.logExit(ans.value);
		return ans.value;
	}
	if(n.value < 2){
		var tEntry = getEmptyDPTableEntry();
		tEntry.value = n;
		tEntry.n = n;
		var frame = tracker.logExit([n]);
		tEntry.methodId = frame.methodId;
		tracker.table[n.value] = tEntry;
		return n;
	}
	ans = fibonacci(new ValueNode(n.value - 1)).value + fibonacci(new ValueNode(n.value - 2)).value;
	var tEntry = getEmptyDPTableEntry();
	var value = new ValueNode(ans);
	tEntry.value = value;
	tEntry.n = n;
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
parameterMapping[funcName] = ["K : uint", "Input List : [int list]"];
