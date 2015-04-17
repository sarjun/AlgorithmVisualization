/**
 *
 * Created by Arjun on 10/7/2014.
 */
function Circle(parentCircle, parentElem, node, height, width) {
	this.children = [];

	this.elem = $("<div class='circle'></div>");
	this.parent = parentCircle;
	this.elem.width(width).height(height);
	//this.elem.append("<div class='circle-align-helper'></div>");
	this.methodId = node.methodId;
	Circle.methodIdMap[node.methodId] = this;
	if (node.children.length > 0) {
		this.elem.addClass("circle-node");
	} else {
		this.elem.addClass("circle-leaf");
	}
	this.elem.bind("click", [this], function(e) {
		if (BoxedList.animating != null) return;
		e.data[0].center(true, false, true);
		e.stopPropagation();
	});
	this.startStack = [];
	this.endStack = [];
	var startClicked = function (e) {
		if (BoxedList.animating == null) {
			boxedList.parent.elem.find("> div.node-stack-container.start paper-shadow > *").unwrap();
			$("div.console.fresh").removeClass("fresh");
			e.data[1].animate(node.startAnimations);
		}
		e.stopPropagation();
	};
	var endClicked = function (e) {
		if (BoxedList.animating == null) {
			boxedList.parent.elem.find("> div.node-stack-container.result paper-shadow > *").unwrap();
			$("div.console.fresh").removeClass("fresh");
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
		boxedList = new BoxedList(this, startContainer, true, node.start[i]);
		this.startStack.push(boxedList);
		boxedList.generateChildren();
		boxedList.elem.bind("click", [this, boxedList], startClicked)
			.mouseenter(i,
			function (e) {
				if (Circle.centered == boxedList.parent) {
					$($("section#params paper-input")[e.data * 1]).addClass("selected");
				}
				if (BoxedList.animating != null) return;
				if ($.ischrome)
					boxedList.parent.elem.find("> div.node-stack-container.start .node-list-holder .text-node").wrap("<paper-shadow z='1'></paper-shadow>");
			}).mouseleave(i, function (e) {
				$($("section#params paper-input")[e.data * 1]).removeClass("selected");
				if ($.ischrome)
					boxedList.parent.elem.find("> div.node-stack-container.start .node-list-holder paper-shadow > *").unwrap();
			}
		);
	}
	for (var i in node.result) {
		var boxedList = null;
		boxedList = new BoxedList(this, endContainer, false, node.result[i]);
		this.endStack.push(boxedList);
		boxedList.generateChildren();
		boxedList.elem.bind("click", [this, boxedList], endClicked)
			.hover(
			function () {
				if (BoxedList.animating != null) return;
				if ($.ischrome)
					boxedList.parent.elem.find("> div.node-stack-container.result .node-list-holder .text-node").wrap("<paper-shadow z='1'></paper-shadow>");
			}, function () {
				if ($.ischrome)
					boxedList.parent.elem.find("> div.node-stack-container.result .node-list-holder paper-shadow > .text-node").unwrap();
			}
		);
	}

	startContainer.add(endContainer).append("<div class='intermediateContainer above'></div><div class='intermediateContainer below'></div>");

	parentElem.append(this.elem);
}

Circle.methodIdMap = {};

Circle.prototype.getAdjacentCircleByMethodId = function(id) {
	return Circle.methodIdMap[id];
}

Circle.prototype.center = function (animated, shouldLock, renderTable) {
	if(shouldLock) BoxedList.animating = 42;//anything not null works
	if (Circle.centered == this) {
		return;
	}
	//console.log("depth: " + this.depth);
	//if (this.elem.hasClass("circle-leaf")) return;

	var engorged = $("div.circle.engorge");
	var lastRoot = $("div.circle.hideRoot div.circle.currentRoot");
	$("div.circle").removeClass("hideRoot currentRoot animated engorge");
	var node = this.parent;
	var visibleParents = [], animatedParents = [];
	while (node != null) {
		if (node.depth >= this.depth - 5) visibleParents.push(node.elem[0]);
		else if (node != root) animatedParents.push(node.elem[0]);
		node = node.parent;
	}
	visibleParents = $(visibleParents);
	animatedParents = $(animatedParents);
	root.elem.addClass("collapse");
	if (this.depth > 4) {
		root.elem.addClass("hideRoot");
	}
	visibleParents.last().addClass("currentRoot");
	if (visibleParents.length == 0) {
		root.elem.addClass("currentRoot");
	}

	animatedParents.addClass("engorge");
	var zeros = [], ones = [];
	root.elem.find("div.circle").each(function (i,e) {
		if ($(e).css("flex-grow") < 1) {
			zeros.push(e);
		} else {
			if ($(e).height() > $(e).parent().height() * 0.9) {
				ones.push([e, 100 / (e.style.height.replace("%", ""))]);
			} else {
				ones.push([e, 1]);
			}
			//console.log(e.style.height + " " + ($(e).height() / $(e).parent().height()));
		}
	});

	Circle.centered = this;
	mainDiv.find("div.circle").removeClass("centered");
	this.elem.addClass("centered");
	var currentHeight = root.elem.height();
	var currentWidth = root.elem.width();
	//console.log("child: " + this.elem.width() + " x " + this.elem.height());
	var zoomHeight = rootHeight * root.elem.height() / this.elem.height();
	var zoomWidth = rootWidth * root.elem.width() / this.elem.width();
	//console.log("zoom: " + zoomWidth + " x " + zoomHeight);
	root.elem.width(zoomWidth).height(zoomHeight);
	zoomHeight = rootHeight * root.elem.height() / this.elem.height();
	zoomWidth = rootWidth * root.elem.width() / this.elem.width();
	root.elem.width(zoomWidth).height(zoomHeight);
	var currentPos = {top: root.elem.css("top"), left: root.elem.css("left")};
	root.elem.css({top: 0, left: 0});
	var circleCenter = getCenter(this.elem);
	var thisPointer = this;
	if (animated) {
			root.elem.removeClass("collapse");
			visibleParents.last().removeClass("currentRoot");
			animatedParents.removeClass("engorge");
			engorged.addClass("engorge");
			lastRoot.addClass("currentRoot");
		root.elem.css(currentPos);
		root.elem.width(currentWidth).height(currentHeight);
		root.elem.animate({
			opacity: 1//decoy
		}, TIME_ZOOM, "linear", function () {
			//root.elem.addClass("collapse");
			refreshCircleOverflow();
			if (tracker instanceof DPTracker && renderTable) tableManager.renderTable(thisPointer.methodId);
		});

		root.elem.css({
			width: zoomWidth,
			height: zoomHeight,
			top: centerOfScreen[1] - circleCenter[1],
			left: centerOfScreen[0] - circleCenter[0]
		});
		root.elem.addClass("animated");
		//root.elem.css({top: centerOfScreen[1] - circleCenter[1], left: centerOfScreen[0] - circleCenter[0]});
		//refreshCircleOverflow();
		$(zeros).css({
			flexGrow: 0.00001
		});
		for (var i in ones) {
			//console.log(ones[i][1]);
			$((ones[i][0])).css({
				flexGrow: ones[i][1]
			});
		}

			engorged.removeClass("engorge");
			lastRoot.removeClass("currentRoot");
			visibleParents.last().addClass("currentRoot");
			//root.elem.addClass("collapse");

			animatedParents.addClass("engorge");
			//engorged.addClass("animated");

	} else {
		//root.elem.addClass("collapse");
		root.elem.css({top: centerOfScreen[1] - circleCenter[1], left: centerOfScreen[0] - circleCenter[0]});
		refreshCircleOverflow();
		if (thisPointer.methodId && renderTable) tableManager.renderTable(thisPointer.methodId);
	}

};

Circle.prototype.checkOverflow = function () {
	var myOffset = offsetFrom(this.elem, mainDiv);
	var centerX = myOffset.left + this.elem.width() / 2;
	var centerY = myOffset.top + this.elem.height() / 2;
	var radX = this.elem.width() * this.elem.width() / 4;
	var radY = this.elem.height() * this.elem.height() / 4;
	radX *= 1.09;
	radY *= 1.09;
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
			if ((centerX - corners[c][0]) * (centerX - corners[c][0]) / radX + (centerY - corners[c][1]) * (centerY - corners[c][1]) / radY > 1) {
				this.elem.addClass("abbrev");
				return true;
			}
		}
		for (var c in this.children) {
			var childOffset = offsetFrom(this.children[c].elem, mainDiv);
			if (tableOffset.top + table.height() >= childOffset.top && tableOffset.top <= childOffset.top + this.children[c].elem.height()) {
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
