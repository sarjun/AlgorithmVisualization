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

funcMapping.funcName = skyline;
overviewMapping.funcName = "This function computes the left and right skyline values of a particular skyline. " +
"The left skyline value of one building is the number of buildings to the left of that building that it is taller than. " +
"The left skyline value of a skyline is the sum of the left skyline value of each building in the skyline. " +
"The right skyline function is defined similarly";
divideMapping.funcName = "Find the right and left skyline values of two halves of the skyline recursively. " +
"This is done by dividing the skyline in half.";
conquerMapping.funcName = "Modification of Mergesort. Whenever an item is added to the result list, update the skyline counters.";