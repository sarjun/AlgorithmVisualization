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
var TIME_SWAP = 1000;

function BoxedList(parent, parentElem, start, nodeList) {
	this.nodeList = nodeList;
	this.nodeMap = {};
	this.parent = parent;
	this.buckets = new Set();
	this.isStart = start;

	var container = $("<table class='node-list'></table>");
	parentElem.append(container).append("<br>");
	this.elem = $("<tr></tr>");
	container.append(this.elem);
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
	var childStartLists = [], childEndLists = [];
	for (var j = 0; j < this.parent.children.length; j++) {
		var maps = [];
		for (var k = 0; k < this.parent.children[j].endStack.length; k++) {
			maps.push(this.parent.children[j].endStack[k].nodeMap);
		}
		if (maps.length > 0) childEndLists.push($.extend.apply($, maps));
		maps = [];
		for (var k = 0; k < this.parent.children[j].startStack.length; k++) {
			maps.push(this.parent.children[j].startStack[k].nodeMap);
		}
		if (maps.length > 0) childStartLists.push($.extend.apply($, maps));
	}
	var doAnim = function (boxedList) {
		if (i >= animationList.length) {
			boxedList.animating = null;
			return;
		}
		var delay = 0;
		switch (animationList[i].animationType) {
			case "highlight":
				var nodeSpecs = animationList[i].nodeSpecs;
				var color = animationList[i].color;
				for (var j = 0; j < nodeSpecs.length; j++) {
					var elem = boxedList.getElem(nodeSpecs[j]);
					if (elem != null) {
						elem.css("border-color", color);
					}
				}
				maxDelay = Math.max(maxDelay, TIME_HIGHLIGHT);
				delay = skipDelays ? 0 : TIME_HIGHLIGHT;
				break;
			case "unhighlight":
				var nodeSpecs = animationList[i].nodeSpecs;
				for (var j = 0; j < nodeSpecs.length; j++) {
					var elem = boxedList.getElem(nodeSpecs[j]);
					if (elem != null) {
						elem.css("border-color", "black");
					}
				}
				maxDelay = Math.max(maxDelay, TIME_UNHIGHLIGHT);
				delay = skipDelays ? 0 : TIME_UNHIGHLIGHT;
				break;
			case "translate":
				var sourceElem = boxedList.getElem(animationList[i].sourceSpec);
				var destElem = boxedList.getElem(animationList[i].destSpec);

				if(sourceElem == null || destElem == null) break;
				var sourcePosition = offsetFrom(sourceElem, mainDiv);
				var ghost = $(sourceElem[0].outerHTML);
				ghost.addClass("ghost");
				ghost.css({
					position: "absolute",
					width: sourceElem.width(),
					height: sourceElem.height()
				}).css(sourcePosition);
				mainDiv.append(ghost);
				var moveSource = animationList[i].moveSource;
				var parentCell = destElem.parent();
				ghost.animate(offsetFrom(destElem, mainDiv), TIME_TRANSLATE, function () {
					ghost.remove();
					if (moveSource) {
						parentCell.append(sourceElem);
					}
				});

				maxDelay = Math.max(maxDelay, TIME_TRANSLATE);
				delay = skipDelays ? 0 : TIME_TRANSLATE;
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
				delay = skipDelays ? 0 : TIME_BUCKET;
				break;
			case "text":
				addConsoleCard(animationList[i].text, animationList[i].cardColor);
				delay = TIME_TEXT_PER_WORD * animationList[i].text.split(" ").length;
				maxDelay = Math.max(maxDelay, delay);
				delay = skipDelays ? 0 : delay;
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
				delay = skipDelays ? 0 : TIME_SET_VISIBILITY;
				break;
			case "swap":
				var node1 = animationList[i].nodePair[0] + 1;
				var node2 = animationList[i].nodePair[1] + 1;
				if (node1 != node2) {
					var elem1 = null;
					var elem2 = null;
					// TODO: The following code is very similar to existing code. Abstract it.
					if(animationList[i].nodePairCircle == -1) {
						elem1 = boxedList.elem.find("td:nth-child(" + node1 + ") span");
						elem2 = boxedList.elem.find("td:nth-child(" + node2 + ") span");
					}
					else if(animationList[i].nodePairCircle < -1) {
						var findCircle = boxedList.parent;
						for(var count = animationList[i].nodePairCircle; count < -1; count++) {
							findCircle = findCircle.parent;
						}
						if(animationList[i].nodePairList == "start") {
							elem1 = findCircle.startStack[animationList[i].nodePairBoxedList].elem.find("td:nth-child(" + node1 + ") span");
							elem2 = findCircle.startStack[animationList[i].nodePairBoxedList].elem.find("td:nth-child(" + node2 + ") span");
						}
						else {
							elem1 = findCircle.endStack[animationList[i].nodePairBoxedList].elem.find("td:nth-child(" + node1 + ") span");
							elem2 = findCircle.endStack[animationList[i].nodePairBoxedList].elem.find("td:nth-child(" + node2 + ") span");
						}
					}
					else {
						// TODO: This isn't done but this whole thing will be refactored anyway.
					}
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
					maxDelay = Math.max(maxDelay, TIME_SWAP);
					delay = skipDelays ? 0 : TIME_SWAP;
				}
				break;
			case "bundle":
				//console.log(animationList[i]);
				delay = boxedList.animate(animationList[i].animations, true);
				//console.log(delay);
				maxDelay = Math.max(maxDelay, delay);
				delay = skipDelays ? 0 : delay;
				break;
			default:
				break;
		}
		i++;
		if (delay > 0) {
			boxedList.animating = setTimeout(doAnim, delay, boxedList);
		} else {
			doAnim(boxedList);
		}
	};
	doAnim(this);
	return maxDelay;
};

BoxedList.prototype.getElem = function(nodeSpec) {
	var circle = this.parent;
	for(var i = 0; i < nodeSpec.parentLevel; i++) {
		circle = circle.parent;
	}

	for( var i=0; i<nodeSpec.childIndexes.length; i++) {
		circle = circle.children[nodeSpec.childIndexes[i]];
	}

	// TODO: make circles store flattened nodemaps for the two stacks
	var stack = nodeSpec.list == "start" ? circle.startStack : circle.endStack;
	var nodeMap = $.extend.apply($, stack.map(function(blist) {
		return blist.nodeMap;
	}));
	return nodeMap[nodeSpec.node.id];

}

//BoxedList.prototype.getElem2 = function(childStartLists, childEndLists, node, circle, list, sibling) {
//	var elem = null;
//	if(sibling != null) {
//		if(list == "start") {
//			var nodeMap = $.extend.apply($, this.parent.parent.children[sibling].startStack.map(function(blist) {
//				return blist.nodeMap;
//			}));
//			elem = nodeMap[node.id];
//		}
//		else {
//			var nodeMap = $.extend.apply($, this.parent.parent.children[sibling].endStack.map(function(blist) {
//				return blist.nodeMap;
//			}));
//			elem = nodeMap[node.id];
//		}
//		return elem;
//	}
//	if(circle == -1) {
//		if((list == "start") == this.isStart) {
//			elem = this.nodeMap[node.id];
//		}
//		else {
//			if(this.isStart) {
//				elem = this.parent.endStack.nodeMap[node.id];
//				// TODO: fix
//			}
//			else {
//				elem = this.parent.startStack.nodeMap[node.id];
//			}
//		}
//	}
//	else if (circle < -1) {
//		var findCircle = this.parent;
//		for(var i = circle; i < -1; i++) {
//			findCircle = findCircle.parent;
//		}
//
//		if(list == "start") {
//			//console.log(findCircle);
//			var nodeMap = $.extend.apply($, findCircle.startStack.map(function(blist) {
//				return blist.nodeMap;
//			}));
//			elem = nodeMap[node.id];
//			//console.log(elem);
//		}
//		else {
//			var nodeMap = $.extend.apply($, findCircle.endStack.map(function(blist) {
//				return blist.nodeMap;
//			}));
//			elem = nodeMap[node.id];
//		}
//	}
//	else {
//		var search = list == "start" ? childStartLists : childEndLists;
//		console.log(circle);
//		if (search[circle].hasOwnProperty(node.id)) {
//			elem = search[circle][node.id];
//		}
//	}
//
//	return elem;
//}