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
	var newCircle = new Circle(parentElem, node, size);
	if (root == null) {
		root = newCircle;
		rootSize = size;
	}
	if (node.children.length > 0) {
		var childSize = 100 / node.children.length + "%";
		for (var i = 0; i < node.children.length; i++) {
			newCircle.children.push(makeCircle(node.children[i], newCircle.elem, childSize));
		}
	}
	return newCircle;
}

function getCenter(elem) {
	var offset = elem.offset();
	return [offset.left + elem.width() / 2, offset.top + elem.height() / 2];
}