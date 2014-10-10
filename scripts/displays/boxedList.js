/**
 *
 * Created by Arjun on 10/7/2014.
 */

var TIME_HIGHLIGHT = 1000;
var TIME_TRANSLATE = 1000;
var TIME_UNHIGHLIGHT = 1000;

function BoxedList(parent, start, nodeList) {
	this.nodeList = nodeList;
	this.nodeMap = {};
	this.parent = parent;
	this.elem = $("<div class='node-list'></div>");
	this.elem.addClass(start ? "start" : "result");
	parent.elem.append(this.elem);
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
	var childElem = $("<span class='text-node'></span>");
	childElem.text(thisNode.value);
	this.elem.append(childElem);
	this.nodeMap[thisNode.id] = childElem;
};

BoxedList.prototype.animate = function (animationList) {
	var i = 0;
	var doAnim = function (boxedList) {
		console.log(i);
		if (i >= animationList.length) {
			boxedList.animating = null;
			return;
		}
		switch (animationList[i].animationType) {
			case "highlight":
				//console.log(animationList[i]);
				var nodes = animationList[i].nodes;
				var color = animationList[i].color;
				var childLists = [];
				for (var j = 0; j < boxedList.parent.children.length; j++) {
					childLists.push(boxedList.parent.children[j].endList.nodeMap);
				}
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
				boxedList.animating = setTimeout(doAnim, TIME_UNHIGHLIGHT, boxedList);
				break;
			case "translate":
				boxedList.animating = setTimeout(doAnim, TIME_TRANSLATE, boxedList);
				break;
			default:
				break;
		}

		i++;
	};
	doAnim(this);
};
