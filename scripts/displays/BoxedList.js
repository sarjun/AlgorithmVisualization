/**
 *
 * Created by Arjun on 10/7/2014.
 */

var TIME_HIGHLIGHT = 1000;
var TIME_TRANSLATE = 1000;
var TIME_UNHIGHLIGHT = 100;
var TIME_BUCKET = 1000;
var TIME_TEXT_PER_WORD = 300;
var TIME_SET_VISIBILITY = 0;
var TIME_SWAP = 750;

function BoxedList(parent, start, nodeList) {
	this.nodeList = nodeList;
	this.nodeMap = {};
	this.parent = parent;
	this.buckets = new Set();
	this.isStart = start;

	var container = $("<div class='node-list-container'><table class='node-list'></table></div>");
	container.addClass(start ? "start" : "result");
	parent.elem.append(container);
	this.elem = $("<tr></tr>");
	container.find("table").append(this.elem);
}

BoxedList.prototype.addNode = function (node) {
	this.nodeList.append(node);
};

BoxedList.prototype.generateChildren = function () {
	for (var i = 0; i < this.nodeList.length; i++) {
		this.generateChildElement(this.nodeList[i]);
	}
};

BoxedList.prototype.generateChildElement = function (thisNode) {
	var childElem = $("<td><span class='text-node'></span></td>");
	this.nodeMap[thisNode.id] = childElem.find("span");
	this.nodeMap[thisNode.id].text(thisNode.value);
	this.elem.append(childElem);
};

BoxedList.prototype.animate = function (animationList, skipDelays) {
	var i = 0;
	var maxDelay = -1;
	var childEndLists = [];
	for (var j = 0; j < this.parent.children.length; j++) {
		childEndLists.push(this.parent.children[j].endList.nodeMap);
	}
	var childStartLists = [];
	for (var j = 0; j < this.parent.children.length; j++) {
		childStartLists.push(this.parent.children[j].startList.nodeMap);
	}
	var doAnim = function (boxedList) {
		// TODO: We probably shouldn't calculate this every time an animation occurs!! Maybe once when the animation starts?
		if (i >= animationList.length) {
			boxedList.animating = null;
			return;
		}
		switch (animationList[i].animationType) {
			case "highlight":
				//console.log(animationList[i]);
				var nodes = animationList[i].nodes;
				var color = animationList[i].color;
				for (var j = 0; j < nodes.length; j++) {
					for (var k = 0; k < childEndLists.length; k++) {
						if (childEndLists[k].hasOwnProperty(nodes[j].id)) {
							childEndLists[k][nodes[j].id].css("border-color", color);
						}
					}
				}
				maxDelay = Math.max(maxDelay, TIME_HIGHLIGHT);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : TIME_HIGHLIGHT, boxedList);
				break;
			case "unhighlight":
				var nodes = animationList[i].nodes;
				for (var j = 0; j < nodes.length; j++) {
					for (var k = 0; k < childEndLists.length; k++) {
						if (childEndLists[k].hasOwnProperty(nodes[j].id)) {
							childEndLists[k][nodes[j].id].css("border-color", "black");
						}
					}
				}
				maxDelay = Math.max(maxDelay, TIME_UNHIGHLIGHT);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : TIME_UNHIGHLIGHT, boxedList);
				break;
			case "translate":
				var source = animationList[i].sourceNode;
				var sourceElem = null;
				if(animationList[i].sourceCircle == -1) {
					if((animationList[i].sourceList == "start") == boxedList.isStart) {
						sourceElem = boxedList.nodeMap[source.id];
					}
					else {
						if(boxedList.isStart) {
							sourceElem = boxedList.parent.endList.nodeMap[animationList[i].sourceNode.id];
						}
						else {
							sourceElem = boxedList.parent.startList.nodeMap[source.id];
						}
					}
				}
				else {
					var search = animationList[i].sourceList == "start" ? childStartLists : childEndLists;
					if (search[animationList[i].sourceCircle].hasOwnProperty(source.id)) {
						sourceElem = search[animationList[i].sourceCircle][source.id];
					}
				}

				var dest = animationList[i].destNode;
				var destElem = null;
				if(animationList[i].destCircle == -1) {
					if((animationList[i].destList == "start") == boxedList.isStart) {
						destElem = boxedList.nodeMap[animationList[i].destNode.id];
					}
					else {
						if(boxedList.isStart) {
							destElem = boxedList.parent.endList.nodeMap[dest.id];
						}
						else {
							destElem = boxedList.parent.startList.nodeMap[dest.id];
						}
					}
				}
				else {
					var search = animationList[i].destList == "start" ? childStartLists : childEndLists;
					if (search[animationList[i].destCircle].hasOwnProperty(dest.id)) {
						destElem = search[animationList[i].destCircle][dest.id];
					}
				}

				var sourcePosition = offsetFrom(sourceElem, mainDiv);
				var ghost = $(sourceElem[0].outerHTML);
				ghost.addClass("ghost");
				ghost.css({
					position: "absolute",
					width: sourceElem.width(),
					height: sourceElem.height()
				}).css(sourcePosition);
				mainDiv.append(ghost);
				ghost.animate(offsetFrom(destElem, mainDiv), TIME_TRANSLATE, function () {
					ghost.remove();
				});

				maxDelay = Math.max(maxDelay, TIME_TRANSLATE);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : TIME_TRANSLATE, boxedList);
				break;
			case "bucket":
				animationList[i].addBuckets.forEach(function (e) {
					boxedList.buckets.add(e + "");
				});
				animationList[i].removeBuckets.forEach(function (e) {
					boxedList.buckets.delete(e + "");
				});
				boxedList.elem.find("td").removeClass("bucket start end");
				boxedList.buckets.forEach(function (e){
					var bucket = e.split(",");
					bucket[0] *= 1;
					bucket[1] *= 1;
					boxedList.elem.find("td").slice(bucket[0], bucket[1] + 1).addClass("bucket");
					boxedList.elem.find("td:nth-child(" + (1 + bucket[0]) + ")").addClass("start");
					boxedList.elem.find("td:nth-child(" + (1 + bucket[1]) + ")").addClass("end");
				});
				maxDelay = Math.max(maxDelay, TIME_BUCKET);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : TIME_BUCKET, boxedList);
				break;
			case "text":
				addConsoleCard(animationList[i].text, animationList[i].cardColor);
				var delay = TIME_TEXT_PER_WORD * animationList[i].text.split(" ").length;
				maxDelay = Math.max(maxDelay, delay);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : delay, boxedList);
				break;
			case "visibility":
				animationList[i].showRanges.forEach(function (e) {
					boxedList.elem.find("td").slice(e[0], e[1] + 1)
						.css("visibility", "initial");
				});
				animationList[i].hideRanges.forEach(function (e) {
					boxedList.elem.find("td").slice(e[0], e[1] + 1)
						.css("visibility", "hidden");
				});
				maxDelay = Math.max(maxDelay, TIME_SET_VISIBILITY);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : TIME_SET_VISIBILITY, boxedList);
				break;
			case "swap":
				var node1 = animationList[i].nodePair[0] + 1;
				var node2 = animationList[i].nodePair[1] + 1;
				if (node1 != node2) {
					var elem1 = boxedList.elem.find("td:nth-child(" + node1 + ") span");
					var elem2 = boxedList.elem.find("td:nth-child(" + node2 + ") span");
					var pos1 = offsetFrom(elem1, mainDiv);
					var pos2 = offsetFrom(elem2, mainDiv);
					var elemLeft = null, elemRight = null;
					var posLeft = null, posRight = null;
					if (pos1.left < pos2.left) {
						elemLeft = elem1;
						posLeft = pos1;
						elemRight = elem2;
						posRight = pos2;
					} else {
						elemLeft = elem2;
						posLeft = pos2;
						elemRight = elem1;
						posRight = pos1;
					}
					var ghostLeft = $(elemLeft[0].outerHTML);
					var ghostRight = $(elemRight[0].outerHTML);
					ghostLeft.addClass("ghost");
					ghostRight.addClass("ghost");
					ghostLeft.css({
						position: "absolute",
						width: elemLeft.width(),
						height: elemLeft.height()
					}).css(posLeft);
					ghostRight.css({
						position: "absolute",
						width: elemRight.width(),
						height: elemRight.height()
					}).css(posRight);
					mainDiv.append(ghostLeft);
					mainDiv.append(ghostRight);
					elemLeft.css("visibility", "hidden");
					elemRight.css("visibility", "hidden");
					var parentLeft = elemLeft.parent();
					var parentRight = elemRight.parent();
					parentLeft.append(elemRight);
					parentRight.append(elemLeft);
					ghostLeft.animate(posRight,{
						duration: TIME_SWAP,
						complete: function () {
							elemLeft.css("visibility", "initial");
							ghostLeft.remove();
						},
						step: function (now, fx) {
							ghostLeft.css("top", Math.sin(Math.PI * (now - fx.end) / (fx.start - fx.end)) * parentLeft.height() + posLeft.top);
						}
					});
					ghostRight.animate(posLeft,{
						duration: TIME_SWAP,
						complete: function () {
							elemRight.css("visibility", "initial");
							ghostRight.remove();
						},
						step: function (now, fx) {
							ghostRight.css("top", -Math.sin(Math.PI * (now - fx.end) / (fx.start - fx.end)) * parentRight.height() + posRight.top);
						}
					});
				}
				break;
			case "bundle":
				//console.log(animationList[i]);
				var delay = boxedList.animate(animationList[i].animations, true);
				//console.log(delay);
				boxedList.animating = setTimeout(doAnim, skipDelays ? 0 : delay, boxedList);
				maxDelay = Math.max(maxDelay, delay);
				break;
			default:
				break;
		}

		i++;
	};
	doAnim(this);
	return maxDelay;
};
