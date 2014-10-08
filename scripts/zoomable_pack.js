$(init);
var root;
var rootSize;
var centerOfScreen;
function init(){
	if (data == null) return;
	var parent = $("<div class='main'></div>");
	$("body").append(parent);
	centerOfScreen = [$(document).width() / 2, $(document).height() / 2];
	makeCircle(data, parent, Math.floor(Math.min($(document).height(), $(document).width()) * 0.9));
	root.click();
}
function makeCircle(node, parentElem, size) {
	var myCircle = $("<div class='circle'></div>");
	if (root == null) {
		root = myCircle;
		rootSize = size;
	}
	myCircle.width(size).height(size);
	parentElem.append(myCircle);
	myCircle.append("<div class='align-helper'></div>");
	if (node.children.length > 0) {
		myCircle.addClass("circle-node");
		var childSize = 100 / node.children.length + "%";
		for (var i = 0; i < node.children.length; i++) {
			makeCircle(node.children[i], myCircle, childSize);
		}
		myCircle.bind("click", function (e) {
			var currentSize = root.width();
			var zoomSize = rootSize * root.width() / myCircle.width();
			root.width(zoomSize).height(zoomSize);
			var currentPos = {top: root.css("top"), left: root.css("left")};
			root.css({top: 0, left: 0});
			var circleCenter = getCenter(myCircle);
			root.css(currentPos);
			root.width(currentSize).height(currentSize);
			root.animate({
				width: zoomSize,
				height: zoomSize,
				top: centerOfScreen[1] - circleCenter[1],
				left: centerOfScreen[0] - circleCenter[0]
			}, 750, "easeInOutQuad");
			//root.css({top: centerOfScreen[1] - circleCenter[1], left: centerOfScreen[0] - circleCenter[0]});
			e.stopPropagation();
		});
	} else {
		myCircle.addClass("circle-leaf");
	}

	var startList = new BoxedList(myCircle, true, node.start);
	var endList = new BoxedList(myCircle, false, node.result);
	startList.generateChildren();
	endList.generateChildren();
	//switch (node.animType) {
	//	case "text":
	//		startList = new BoxedList();
	//		endList = new BoxedList();
	//		break;
	//	default:
	//		break;
	//}
}

function getCenter(elem) {
	var offset = elem.offset();
	return [offset.left + elem.width() / 2, offset.top + elem.height() / 2];
}