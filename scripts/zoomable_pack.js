//$(init);

document.addEventListener('polymer-ready', init);
var root;
var rootSize;
var centerOfScreen;
var mainDiv;
function init(){
	if (data == null) return;
	var mainPanel = $("core-header-panel[main]");
	mainPanel[0].shadowRoot.getElementById("mainContainer").style.overflow = "hidden"
	mainDiv = $("<div class='main'></div>");
	$("div.content").append(mainDiv);
	var parentHeight = mainPanel.height() - $("core-header-panel[main] core-toolbar#mainheader").height();
	var parentWidth = mainPanel.width();
	centerOfScreen = [parentWidth / 2, parentHeight / 2];
	mainDiv.width(parentWidth).height(parentHeight);
	makeCircle(data, mainDiv, Math.floor(Math.min(parentHeight, parentWidth) * 0.9));
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
	var offset = offsetFrom(elem, mainDiv);
	return [offset.left + elem.width() / 2, offset.top + elem.height() / 2];
}

function offsetFrom(elem, parent) {
	var offset = elem.offset();
	var parentOffset = parent.offset();
	offset.top -= parentOffset.top;
	offset.left -= parentOffset.left;
	return offset;
}