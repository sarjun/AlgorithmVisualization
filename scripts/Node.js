/**
 * Created by Sun on 9/23/2014.
 */
Node.ID = 0;

function Node(val){
    this.value = val;
	this.id = Node.ID++ + "";
	//this.parentElem = parent;
	//this.animationStyle = anim;
	//this.elem = this.animationStyle.generateElement(this);
}
var DisplayType = {"TEXT" : 0, "BAR" : 1, "CUSTOM" : -1};
