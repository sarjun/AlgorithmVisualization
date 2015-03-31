/**
 * Created by Sun on 9/23/2014.
 */
ValueNode.ID = 0;

function ValueNode(val, type){
	if (type != null) {
		this.type = type;
		switch (type) {
			case "string":
				val += "";
				break;
			case "int":
				val *= 1;
				break;
			default:
				val *= 1;
				if (typeof(val) == "number") {
					if (val % 1 != 0) {
						this.type = "float";
					}
				}
				break;
		}
	} else {
		if (typeof(val) == "number") {
			if (val % 1 != 0) {
				this.type = "float";
			}
		}
	}
    this.value = val;
	this.id = ValueNode.ID++ + "";
	//this.parentElem = parent;
	//this.animationStyle = anim;
	//this.elem = this.animationStyle.generateElement(this);
}

ValueNode.prototype.getDisplayString = function() {
	if (this.type != null) {
		switch (this.type) {
			case "float":
				return Math.round(this.value * 1000) /  1000;
				break;
			default:
				break;
		}
	}
	return this.value;
};

ValueNode.prototype.getType = function() {
	if (this.type != null) {
		return this.type;
	}
	//TODO: if problems, check here first
	return typeof(this.value);
};

ValueNode.translate = function(sourceElem, destElem, moveSource) {
	var sourcePosition = offsetFrom(sourceElem, mainDiv);
	var ghost = $(sourceElem[0].outerHTML);
	ghost.addClass("ghost");
	ghost.css({
		position: "absolute",
		width: sourceElem.width(),
		height: sourceElem.height()
	}).css(sourcePosition);
	contentHolderDiv.append(ghost);
	var parentCell = destElem.parent();
	ghost.animate(offsetFrom(destElem, contentHolderDiv), TIME_TRANSLATE, function () {
		ghost.remove();
		if (moveSource) {
			parentCell.append(sourceElem);
		}
	});
}