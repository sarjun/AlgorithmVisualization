/**
 *
 * Created by Arjun on 10/7/2014.
 */
function Circle(parentCircle, parentElem, node, size) {
	this.children = [];

	this.elem = $("<div class='circle'></div>");
	this.parent = parentCircle;
	this.elem.width(size).height(size);
	this.elem.append("<div class='circle-align-helper'></div>");
	if (node.children.length > 0) {
		this.elem.addClass("circle-node");
		this.elem.bind("click", [this], function(e) {
			e.data[0].center(true);
			e.stopPropagation();
		});
	} else {
		this.elem.addClass("circle-leaf");
	}
	this.startStack = [];
	this.endStack = [];
	var startClicked = function (e) {
		if (BoxedList.animating == null) {
			e.data[0].center(true);
			boxedList.parent.elem.find("> div.node-stack-container.start paper-shadow > *").unwrap();
			e.data[1].animate(node.startAnimations);
		}
		e.stopPropagation();
	};
	var endClicked = function (e) {
		if (BoxedList.animating == null) {
			if (e.data[0].parent != null) e.data[0].parent.center(true);
			boxedList.parent.elem.find("> div.node-stack-container.result paper-shadow > *").unwrap();
			e.data[1].animate(node.endAnimations);
		}
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
		boxedList.elem.bind("click", [this, boxedList], startClicked)
			.mouseenter(i,
			function (e) {
				if (Circle.centered == boxedList.parent) {
					$($("section#params paper-input")[e.data * 1]).addClass("selected");
				}
				if (BoxedList.animating != null) return;
				boxedList.parent.elem.find("> div.node-stack-container.start .text-node").wrap("<paper-shadow z='1'></paper-shadow>");
			}).mouseleave(i, function (e) {
				$($("section#params paper-input")[e.data * 1]).removeClass("selected");
				boxedList.parent.elem.find("> div.node-stack-container.start paper-shadow > *").unwrap();
			}
		);
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
		boxedList.elem.bind("click", [this, boxedList], endClicked)
			.hover(
			function () {
				if (BoxedList.animating != null) return;
				boxedList.parent.elem.find("> div.node-stack-container.result .text-node").wrap("<paper-shadow z='1'></paper-shadow>");
			}, function () {
				boxedList.parent.elem.find("> div.node-stack-container.result paper-shadow > *").unwrap();
			}
		);
	}

	parentElem.append(this.elem);
}


Circle.prototype.center = function (animated) {
	Circle.centered = this;
	mainDiv.find("div.circle").removeClass("centered");
	this.elem.addClass("centered");
	var currentSize = root.elem.width();
	var zoomSize = rootSize * root.elem.width() / this.elem.width();
	root.elem.width(zoomSize).height(zoomSize);
	zoomSize = rootSize * root.elem.width() / this.elem.width();
	root.elem.width(zoomSize).height(zoomSize);
	var currentPos = {top: root.elem.css("top"), left: root.elem.css("left")};
	root.elem.css({top: 0, left: 0});
	var circleCenter = getCenter(this.elem);
	if (animated) {
		root.elem.css(currentPos);
		root.elem.width(currentSize).height(currentSize);
		root.elem.animate({
			width: zoomSize,
			height: zoomSize,
			top: centerOfScreen[1] - circleCenter[1],
			left: centerOfScreen[0] - circleCenter[0]
		}, 750, "easeInOutQuad", refreshCircleOverflow);
	} else {
		root.elem.css({top: centerOfScreen[1] - circleCenter[1], left: centerOfScreen[0] - circleCenter[0]});
		refreshCircleOverflow();
	}
};

Circle.prototype.checkOverflow = function () {
	var myOffset = offsetFrom(this.elem, mainDiv);
	var centerX = myOffset.left + this.elem.width() / 2;
	var centerY = myOffset.top + this.elem.height() / 2;
	var rad = this.elem.width() * this.elem.width() / 4;
	var tables = this.elem.find("> div.node-stack-container table.node-list");
	for (var i = 0; i < tables.length; i++) {
		var table = $(tables[i]);
		var tableOffset = offsetFrom(table, mainDiv);
		var corners = [
			[tableOffset.left, tableOffset.top],
			[tableOffset.left + table.width(), tableOffset.top],
			[tableOffset.left, tableOffset.top + table.height()],
			[tableOffset.left + table.width(), tableOffset.top + table.height()]
		];
		for (var c in corners) {
			if ((centerX - corners[c][0]) * (centerX - corners[c][0]) + (centerY - corners[c][1]) * (centerY - corners[c][1]) >= rad) {
				this.elem.addClass("abbrev");
				return true;
			}
		}

	}
	for (var i in this.children) {
		this.children[i].checkOverflow();
	}
	return false;
};