/**
 * Created by Sun on 9/23/2014.
 */
function Node(val, parent){
    this.value = val;
	this.parentElem = parent;
	this.elem = this.generateElement();
}
var DisplayType = {"TEXT" : 0, "BAR" : 1, "CUSTOM" : -1};
Node.displayType = DisplayType.TEXT;

Node.prototype.generateElement = function() {
	switch (Node.displayType) {
		case DisplayType.TEXT:
			var parentBox = $("<svg:text class='text-node'></svg:text>");
			parentBox.text(this.value);
			//this.parentElem.append(parentBox);
			break;
	}
}