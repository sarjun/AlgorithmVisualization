/**
 *
 * Created by Arjun on 10/7/2014.
 */

var TIME_HIGHLIGHT = 1000;
var TIME_TRANSLATE = 1000;
var TIME_UNHIGHLIGHT = 300;
var TIME_BUCKET = 1000;
var TIME_TEXT_PER_WORD = 300;
var TIME_SET_VISIBILITY = 0;

function BoxedList(parent, start, nodeList) {
	this.nodeList = nodeList;
	this.nodeMap = {};
	this.parent = parent;
	this.buckets = new Set();

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

BoxedList.prototype.animate = function (animationList) {
	var i = 0;
	var doAnim = function (boxedList) {
		if (i >= animationList.length) {
			boxedList.animating = null;
			return;
		}
		var childLists = [];
		for (var j = 0; j < boxedList.parent.children.length; j++) {
			childLists.push(boxedList.parent.children[j].endList.nodeMap);
		}
		switch (animationList[i].animationType) {
			case "highlight":
				//console.log(animationList[i]);
				var nodes = animationList[i].nodes;
				var color = animationList[i].color;
				for (var j = 0; j < nodes.length; j++) {
					for (var k = 0; k < childLists.length; k++) {
						if (childLists[k].hasOwnProperty(nodes[j].id)) {
							childLists[k][nodes[j].id].css("border-color", color);
						}
					}
				}
				boxedList.animating = setTimeout(doAnim, TIME_HIGHLIGHT, boxedList);
				break;
			case "unhighlight":
				var nodes = animationList[i].nodes;
				for (var j = 0; j < nodes.length; j++) {
					for (var k = 0; k < childLists.length; k++) {
						if (childLists[k].hasOwnProperty(nodes[j].id)) {
							childLists[k][nodes[j].id].css("border-color", "black");
						}
					}
				}
				boxedList.animating = setTimeout(doAnim, TIME_UNHIGHLIGHT, boxedList);
				break;
			case "translate":
				var nodes = animationList[i].sourceNodes;
				var dest = boxedList.nodeMap[animationList[i].destNode.id];
				for (var j = 0; j < nodes.length; j++) {
					for (var k = 0; k < childLists.length; k++) {
						if (childLists[k].hasOwnProperty(nodes[j].id)) {
							var childElem = childLists[k][nodes[j].id];
							var childPosition = offsetFrom(childElem, mainDiv);
							var ghost = $(childElem[0].outerHTML);
							ghost.addClass("ghost");
							ghost.css({
								position: "absolute",
								width: childElem.width(),
								height: childElem.height()
							}).css(childPosition);
							$("div.main").append(ghost);
							ghost.animate(offsetFrom(dest, mainDiv), TIME_TRANSLATE, function () {
								$("div.main .ghost").remove();
							});
						}
					}
				}
				boxedList.animating = setTimeout(doAnim, TIME_TRANSLATE, boxedList);
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
				boxedList.animating = setTimeout(doAnim, TIME_BUCKET, boxedList);
				break;
			case "text":
				addConsoleCard(animationList[i].text, animationList[i].cardColor);
				boxedList.animating = setTimeout(doAnim, TIME_TEXT_PER_WORD * animationList[i].text.split(" ").length, boxedList);
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
				boxedList.animating = setTimeout(doAnim, TIME_SET_VISIBILITY, boxedList);
				break;
			default:
				break;
		}

		i++;
	};
	doAnim(this);
};
