/**
 *
 * Created by Arjun on 10/7/2014.
 */
function Circle(parent, node, size) {
	this.children = [];

	this.elem = $("<div class='circle'></div>");
	this.elem.width(size).height(size);
	this.elem.append("<div class='circle-align-helper'></div>");
	if (node.children.length > 0) {
		this.elem.addClass("circle-node");
		this.elem.bind("click", [this], function(e) {
			e.data[0].click();
			e.stopPropagation();
		});
	} else {
		this.elem.addClass("circle-leaf");
	}
	this.startStack = [];
	this.endStack = [];
	var startClicked = function (e) {
		e.data[1].animate(node.startAnimations);
		e.stopPropagation();
	};
	var endClicked = function (e) {
		e.data[1].animate(node.endAnimations);
		e.stopPropagation();
	};
	this.elem.append("<div class='node-stack-container start'><div class='stack-align-helper start'></div><div class='node-list-container'></div></div>")
		.append("<div class='node-stack-container result'><div class='stack-align-helper result'></div><div class='node-list-container'></div></div>");
	var startContainer = this.elem.find("div.start div.node-list-container");
	var endContainer = this.elem.find("div.result div.node-list-container");
	for (var i in node.start) {
		var boxedList = null;
		if (Array.isArray(node.start[i])) {
			boxedList = new BoxedList(this, startContainer, true, node.start[i]);
		} else {
			boxedList = new BoxedList(this, startContainer, true, [node.start[i]]);
		}
		this.startStack.push(boxedList);
		boxedList.generateChildren();
		boxedList.elem.bind("click", [this, boxedList], startClicked);
	}
	for (var i in node.result) {
		var boxedList = null;
		if (Array.isArray(node.result[i])) {
			boxedList = new BoxedList(this, endContainer, false, node.result[i]);
		} else {
			boxedList = new BoxedList(this, endContainer, false, [node.result[i]]);
		}
		this.endStack.push(boxedList);
		boxedList.generateChildren();
		boxedList.elem.bind("click", [this, boxedList], endClicked);
	}

	parent.append(this.elem);
}


Circle.prototype.click = function () {
	var currentSize = root.elem.width();
	var zoomSize = rootSize * root.elem.width() / this.elem.width();
	root.elem.width(zoomSize).height(zoomSize);
	var currentPos = {top: root.elem.css("top"), left: root.elem.css("left")};
	root.elem.css({top: 0, left: 0});
	var circleCenter = getCenter(this.elem);
	root.elem.css(currentPos);
	root.elem.width(currentSize).height(currentSize);
	root.elem.animate({
		width: zoomSize,
		height: zoomSize,
		top: centerOfScreen[1] - circleCenter[1],
		left: centerOfScreen[0] - circleCenter[0]
	}, 750, "easeInOutQuad");
	//root.elem.css({top: centerOfScreen[1] - circleCenter[1], left: centerOfScreen[0] - circleCenter[0]});
};