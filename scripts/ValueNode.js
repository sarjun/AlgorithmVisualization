/**
 * Created by Sun on 9/23/2014.
 */
ValueNode.ID = 0;

function ValueNode(val, type){
	if (type != null) {
		switch (type) {
			case "string":
				val += "";
				break;
			default:
				val *= 1;
				break;
		}
	}
    this.value = val;
	this.id = ValueNode.ID++ + "";
	//this.parentElem = parent;
	//this.animationStyle = anim;
	//this.elem = this.animationStyle.generateElement(this);
}

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