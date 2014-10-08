/**
 *
 * Created by Arjun on 10/7/2014.
 */
function BoxedList(parent, start, nodeList) {
	this.nodeList = nodeList;
	this.parent = parent;
	this.elem = $("<div class='node-list'></div>");
	this.elem.addClass(start ? "start" : "result");
	parent.append(this.elem);
}

BoxedList.prototype.addNode = function(node) {
	this.nodeList.append(node);
}

BoxedList.prototype.generateChildren = function() {
	for(var i=0; i<this.nodeList.length; i++) {
		this.generateElement(this.nodeList[i]);
	}
}

BoxedList.prototype.generateElement = function(thisNode) {
	var parentBox = $("<span class='text-node'></span>");
	parentBox.text(thisNode.value);
	this.elem.append(parentBox);
}

BoxedList.prototype.animate = function(animationList) {
	for(var i=0; i<animationList.length; i++) {
		switch (animationList[i].animationType) {
			case "highlight":
				var nodes = animationList[i].nodes;
				var color = animationList[i].color;
				for(var j=0; j<nodes.length; j++) {

				}
				break;
			case "unhighlight":
				break;
			case "translate":
				break;
			default:
				break;
		}
	}
}