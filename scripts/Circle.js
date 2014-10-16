/**
 *
 * Created by Arjun on 10/7/2014.
 */
function Circle(parent, node, size) {
	this.children = [];

	this.elem = $("<div class='circle'></div>");
	this.elem.width(size).height(size);
	this.elem.append("<div class='align-helper'></div>");
	if (node.children.length > 0) {
		this.elem.addClass("circle-node");
		this.elem.bind("click", [this], function(e) {
			e.data[0].click();
			e.stopPropagation();
		});
	} else {
		this.elem.addClass("circle-leaf");
	}

	this.startList = new BoxedList(this, true, node.start);
	this.endList = new BoxedList(this, false, node.result);
	this.startList.generateChildren();
	this.endList.generateChildren();
	this.endList.elem.bind("click", [this], function(e){
		//console.log(node);
		e.data[0].endList.animate(node.animations);
		e.stopPropagation();
	});
	//switch (node.animType) {
	//	case "text":
	//		startList = new BoxedList();
	//		endList = new BoxedList();
	//		break;
	//	default:
	//		break;
	//}
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