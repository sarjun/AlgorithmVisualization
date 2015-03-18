/**
 *
 * Created by Arjun on 10/7/2014.
 */

var TIME_HIGHLIGHT = 1000;
var TIME_TRANSLATE = 1000;
var TIME_UNHIGHLIGHT = 100;
var TIME_BUCKET = 1000;
var TIME_TEXT_PER_WORD = 450;
var TIME_LOOK_CONSOLE = 200;
var TIME_SET_VISIBILITY = 0;
var TIME_SWAP = 1000;
var TIME_PHASE = 1000;
var TIME_TABLE = 0;
var TIME_ADD_ENTRY = 1000;
var TIME_GET_ENTRY = 1000;
var TIME_REMOVE_ENTITY = 1000;
var TIME_ZOOM = 750;

function BoxedList(parent, parentElem, start, nodeList) {
	this.nodeList = nodeList;
	this.nodeMap = {};
	this.parent = parent;
	this.buckets = new Set();
	this.isStart = start;

	var container = $("<table class='node-list'></table>");
	container.wrap("<div class='node-list-holder'></div>");
	parentElem.append(container.parent());//.append("<br>");
	this.elem = $("<tr></tr>");
	container.append(this.elem);
}

BoxedList.prototype.addNode = function (node) {
	this.nodeList.append(node);
};

BoxedList.prototype.generateChildren = function () {
	for (var i = 0; i < this.nodeList.length; i++) {
		this.generateChildElement(this.nodeList[i]);
	}
};

BoxedList.prototype.generateChildElement = function (thisNode) {
	var childElem = $("<td><span class='text-node'></span></td>");
	this.nodeMap[thisNode.id] = childElem.find(".text-node");
	this.nodeMap[thisNode.id].text(thisNode.value);
	this.elem.append(childElem);
};

BoxedList.prototype.animate = function (animationList, skipDelays) {
	var i = 0;
	var maxDelay = 0;
	var childStartLists = [], childEndLists = [];
	for (var j = 0; j < this.parent.children.length; j++) {
		var maps = [];
		for (var k = 0; k < this.parent.children[j].endStack.length; k++) {
			maps.push(this.parent.children[j].endStack[k].nodeMap);
		}
		if (maps.length > 0) childEndLists.push($.extend.apply($, maps));
		maps = [];
		for (var k = 0; k < this.parent.children[j].startStack.length; k++) {
			maps.push(this.parent.children[j].startStack[k].nodeMap);
		}
		if (maps.length > 0) childStartLists.push($.extend.apply($, maps));
	}
	var doAnim = function (boxedList) {
		if (BoxedList.animating == null) return;
		if (i >= animationList.length) {
			if (!skipDelays) BoxedList.animating = null;
			return;
		}
		var delay = 0;
		switch (animationList[i].animationType) {
			case "table":
				tableManager.renderTable(animationList[i].maxShowID);
				maxDelay = Math.max(maxDelay, TIME_TABLE);
				delay = skipDelays ? 0 : TIME_TABLE;
				break;
			case "addEntry":
				var sourceElem = boxedList.getElem(animationList[i].ansSpec);
				var destElem = tableManager.getElemByNodeId(animationList[i].ansSpec.node.id);

				if(sourceElem == null || destElem == null) break;
				ValueNode.translate(sourceElem, destElem, false);

				maxDelay = Math.max(maxDelay, TIME_ADD_ENTRY);
				delay = skipDelays ? 0 : TIME_ADD_ENTRY;
				break;
			case "zoomAbsolute":
				var circle = boxedList.parent.getAdjacentCircleByMethodId(animationList[i].methodId);
				circle.center(true, true, false);

				maxDelay = Math.max(maxDelay, TIME_ZOOM);
				delay = skipDelays ? 0 : TIME_ZOOM;
				break;
			case "getEntry":
				var sourceElem = tableManager.getElemByNodeId(animationList[i].ansSpec.node.id);
				var destElem = boxedList.getElem(animationList[i].ansSpec);

				if(sourceElem == null || destElem == null) break;
				ValueNode.translate(sourceElem, destElem, false);

				maxDelay = Math.max(maxDelay, TIME_GET_ENTRY);
				delay = skipDelays ? 0 : TIME_GET_ENTRY;
				break;
			case "highlight":
				var nodeSpecs = animationList[i].nodeSpecs;
				var color = animationList[i].color;
				for (var j = 0; j < nodeSpecs.length; j++) {
					var elem = boxedList.getElem(nodeSpecs[j]);
					if (elem != null) {
						elem.css("border-color", color);
					}
				}
				maxDelay = Math.max(maxDelay, TIME_HIGHLIGHT);
				delay = skipDelays ? 0 : TIME_HIGHLIGHT;
				break;
			case "unhighlight":
				var nodeSpecs = animationList[i].nodeSpecs;
				for (var j = 0; j < nodeSpecs.length; j++) {
					var elem = boxedList.getElem(nodeSpecs[j]);
					if (elem != null) {
						elem.css("border-color", "black");
					}
				}
				maxDelay = Math.max(maxDelay, TIME_UNHIGHLIGHT);
				delay = skipDelays ? 0 : TIME_UNHIGHLIGHT;
				break;
			case "translate":
				var sourceElem = boxedList.getElem(animationList[i].sourceSpec);
				var destElem = boxedList.getElem(animationList[i].destSpec);

				if(sourceElem == null || destElem == null) break;
				ValueNode.translate(sourceElem, destElem, animationList[i].moveSource);

				maxDelay = Math.max(maxDelay, TIME_TRANSLATE);
				delay = skipDelays ? 0 : TIME_TRANSLATE;
				break;
			case "bucket":
				var thisList = boxedList.getAdjacentBoxedList(animationList[i].visualizationSpec);
				animationList[i].addBuckets.forEach(function (e) {
					thisList.buckets.add(e + "");
				});
				animationList[i].removeBuckets.forEach(function (e) {
					thisList.buckets.delete(e + "");
				});
				thisList.elem.find("td").removeClass("bucket start end");
				thisList.buckets.forEach(function (e){
					var bucket = e.split(",");
					bucket[0] *= 1;
					bucket[1] *= 1;
					thisList.elem.find("td").slice(bucket[0], bucket[1] + 1).addClass("bucket");
					thisList.elem.find("td:nth-child(" + (1 + bucket[0]) + ")").addClass("start");
					if(bucket[0] != 0) thisList.elem.find("td:nth-child(" + (1 + bucket[0] - 1) + ")").addClass("end");
					thisList.elem.find("td:nth-child(" + (1 + bucket[1]) + ")").addClass("end");
				});
				maxDelay = Math.max(maxDelay, TIME_BUCKET);
				delay = skipDelays ? 0 : TIME_BUCKET;
				break;
			case "text":
				var newCard = addConsoleCard(animationList[i].text, animationList[i].cardColor).find("paper-shadow");
				delay = TIME_TEXT_PER_WORD * animationList[i].text.split(" ").length + TIME_LOOK_CONSOLE;
				maxDelay = Math.max(maxDelay, delay);
				delay = skipDelays ? 0 : delay;
				if (delay > 0) {
					var progress = $("<div class='progress'></div>");
					newCard.prepend(progress);
					newCard.prevObject[0].title = "Click to skip";
					progress.animate({
						width: "100%"
					}, delay, "linear", function () {$(this).remove();});
					var progressDone = function (data) {
						data[0].unbind("click").css("cursor", "auto");
						if (BoxedList.animating != null) clearTimeout(BoxedList.animating);
						data[1].finish();
						data[0].prevObject[0].removeAttribute("title");
						doAnim(boxedList);
					};
					var timeout = setTimeout(progressDone, delay, [newCard, progress]);
					newCard.bind("click",[newCard, progress], function (e) {clearTimeout(timeout); progressDone(e.data);}).css("cursor", "pointer");
				}
				break;
			case "visibility":
				var thisList = boxedList.getAdjacentBoxedList(animationList[i].visualizationSpec);
				animationList[i].showRanges.forEach(function (e) {
					thisList.elem.find(".text-node").slice(e[0], e[1] + 1)
						.css("visibility", "");
				});
				animationList[i].hideRanges.forEach(function (e) {
					thisList.elem.find(".text-node").slice(e[0], e[1] + 1)
						.css("visibility", "hidden");
				});
				maxDelay = Math.max(maxDelay, TIME_SET_VISIBILITY);
				delay = skipDelays ? 0 : TIME_SET_VISIBILITY;
				break;
			case "swap":
				var elem1 = boxedList.getElem(animationList[i].node1);
				var elem2 = boxedList.getElem(animationList[i].node2);
				if(elem1 == elem2) break;
				var pos1 = offsetFrom(elem1, mainDiv);
				var pos2 = offsetFrom(elem2, mainDiv);
				var elemLeft = null, elemRight = null;
				var posLeft = null, posRight = null;
				if (pos1.left < pos2.left) {
					elemLeft = elem1;
					posLeft = pos1;
					elemRight = elem2;
					posRight = pos2;
				} else {
					elemLeft = elem2;
					posLeft = pos2;
					elemRight = elem1;
					posRight = pos1;
				}
				var ghostLeft = $(elemLeft[0].outerHTML);
				var ghostRight = $(elemRight[0].outerHTML);
				ghostLeft.addClass("ghost");
				ghostRight.addClass("ghost");
				ghostLeft.css({
					position: "absolute",
					width: elemLeft.width(),
					height: elemLeft.height()
				}).css(posLeft);
				ghostRight.css({
					position: "absolute",
					width: elemRight.width(),
					height: elemRight.height()
				}).css(posRight);
				mainDiv.append(ghostLeft);
				mainDiv.append(ghostRight);
				elemLeft.css("visibility", "hidden");
				elemRight.css("visibility", "hidden");
				var parentLeft = elemLeft.parent();
				var parentRight = elemRight.parent();
				parentLeft.append(elemRight);
				parentRight.append(elemLeft);
				ghostLeft.animate(posRight,{
					duration: TIME_SWAP,
					complete: function () {
						elemLeft.css("visibility", "");
						ghostLeft.remove();
					},
					step: function (now, fx) {
						ghostLeft.css("top", Math.sin(Math.PI * (now - fx.end) / (fx.start - fx.end)) * parentLeft.height() + posLeft.top);
					}
				});
				ghostRight.animate(posLeft,{
					duration: TIME_SWAP,
					complete: function () {
						elemRight.css("visibility", "");
						ghostRight.remove();
					},
					step: function (now, fx) {
						ghostRight.css("top", -Math.sin(Math.PI * (now - fx.end) / (fx.start - fx.end)) * parentRight.height() + posRight.top);
					}
				});
				maxDelay = Math.max(maxDelay, TIME_SWAP);
				delay = skipDelays ? 0 : TIME_SWAP;
				break;
			case "createIntermediateStep":
				var intermediateContainer = boxedList.parent.elem.find("> div.node-stack-container." + (animationList[i].list == "start" ? "start" : "result") +
					" div.node-list-container div.intermediateContainer." + (animationList[i].position));
				var toAppend = $("<div intermediateId='" + animationList[i].intermediateId + "'></div>");
				for (var j in animationList[i].entities) {
					var entity = animationList[i].entities[j];
					switch (typeof entity) {
						case "string":
						case "number":
							toAppend.append("<span>" + entity + "</span>");
							break;
						case "object":
							if (entity instanceof ValueNode) {
								toAppend.append("<span class='text-node' valueNodeId='" + entity.id + "'>" + entity.value + "</span>");
							}
							break;
					}
				}
				intermediateContainer.append(toAppend);
				MathJax.Hub.Queue(["Typeset",MathJax.Hub, toAppend[0]]);
				maxDelay = Math.max(maxDelay, 0);
				delay = skipDelays ? 0 : 0;
				break;
			case "removeIntermediateStep":
				var intermediateContainer = boxedList.parent.elem.find("> div.node-stack-container." + (animationList[i].list == "start" ? "start" : "result") +
					" div.node-list-container div.intermediateContainer." + (animationList[i].position));
				intermediateContainer.find("div[intermediateId=" + animationList[i].intermediateId + "]").remove();
				maxDelay = Math.max(maxDelay, 0);
				delay = skipDelays ? 0 : 0;
				break;
			case "changeValueNode":
				var elem = boxedList.getElem(animationList[i].nodeSpec);
				elem.html(animationList[i].newValue);
				MathJax.Hub.Queue(["Typeset",MathJax.Hub, elem[0]]);
				maxDelay = Math.max(maxDelay, TIME_REMOVE_ENTITY);
				delay = skipDelays ? 0 : TIME_REMOVE_ENTITY;
				break;
			case "intermediateRemoveEntity":
				var intermediate = boxedList.getAdjacentIntermediate(animationList[i].intermSpec);
				var entity = intermediate.children(":nth-child(" + animationList[i].entityIndex + ")");
				animationList[i].effectParams.push(TIME_REMOVE_ENTITY);
				entity.hide.apply(entity, animationList[i].effectParams);
				//entity.remove();
				maxDelay = Math.max(maxDelay, TIME_REMOVE_ENTITY);
				delay = skipDelays ? 0 : TIME_REMOVE_ENTITY;
				break;
			case "phase":
				var thisBoxedList = boxedList.getAdjacentBoxedList(animationList[i].vSpec);
				var thisList = thisBoxedList.elem.parents("table:first");
				var ghost = $(thisList[0].outerHTML);
				ghost.addClass("ghost");
				ghost.css({
					position: "absolute",
					width: thisList.width(),
					height: thisList.height()
				}).css(offsetFrom(thisList, mainDiv));
				mainDiv.append(ghost);
				thisList.css("opacity", "0");
				var tds = thisList.find("td").removeClass("bucket start end");
				thisBoxedList.buckets = new Set();
				for (var j in animationList[i].newState){
					var nodeElem = thisBoxedList.nodeMap[animationList[i].newState[j].id];
					nodeElem.css("border-color", "black");
					$(tds[j]).append(nodeElem);
				}
				ghost.animate({
					opacity: 0
				}, TIME_PHASE, function () {
					ghost.remove();
				});
				thisList.animate({
					opacity: 1
				}, TIME_PHASE);
				break;
			case "bundle":
				//console.log(animationList[i]);
				delay = boxedList.animate(animationList[i].animations, true);
				//console.log(delay);
				maxDelay = Math.max(maxDelay, delay);
				delay = skipDelays ? 0 : delay;
				break;
			default:
				console.log(animationList[i].animationType);
				break;
		}
		i++;
		if (delay > 0) {
			BoxedList.animating = setTimeout(doAnim, delay, boxedList);
		} else {
			doAnim(boxedList);
		}
	};
	BoxedList.animating = 42;
	doAnim(this);
	return maxDelay;
};

BoxedList.prototype.getElem = function(nodeSpec) {
	var circle = this.parent;
	for(var i = 0; i < nodeSpec.parentLevel; i++) {
		circle = circle.parent;
	}

	for( var i=0; i<nodeSpec.childIndexes.length; i++) {
		circle = circle.children[nodeSpec.childIndexes[i]];
	}

	var stack = nodeSpec.list == "start" ? circle.startStack : circle.endStack;
	var boxedListNum = nodeSpec.boxedListNum;
	if(!boxedListNum) {
		// TODO: make circles store flattened nodemaps for the two stacks
		var nodeMap = $.extend.apply($, stack.map(function (blist) {
			return blist.nodeMap;
		}));
		return nodeMap[nodeSpec.node.id];
	}
	else {
		if (boxedListNum < 0 || boxedListNum >= stack.length) {
			var intermediateContainer = circle.elem.find("> div.node-stack-container." + (nodeSpec.list == "start" ? "start" : "result") +
				" div.node-list-container div.intermediateContainer." + (boxedListNum < 0 ? "above" : "below"));
			var intermediate = null;
			if (boxedListNum > 0) {
				boxedListNum -= stack.length - 1;
				intermediate = intermediateContainer.children(":nth-child(" + boxedListNum + ")");
			} else if (boxedListNum < 0) {
				boxedListNum *= -1;
				intermediate = intermediateContainer.find("> div:nth-last-child(" + boxedListNum + ")");
			}
			return intermediate.find("[valuenodeid=" + nodeSpec.node.id + "]");
		} else {
			// TODO: do this later
		}

	}
};

BoxedList.prototype.getAdjacentBoxedList = function(listSpec) {
	var circle = this.getAdjacentCircle(listSpec);

	var stack = listSpec.list == "start" ? circle.startStack : circle.endStack;
	return stack[listSpec.stackIndex];
};

BoxedList.prototype.getAdjacentIntermediate = function(intermSpec) {
	var circle = this.getAdjacentCircle(intermSpec);
	return circle.elem.find("> div.node-stack-container." + (intermSpec.list == "start" ? "start" : "result") +
		" div.node-list-container div.intermediateContainer." + intermSpec.position).children(":nth-child(" + intermSpec.intermIndex + ")");
};

BoxedList.prototype.getAdjacentCircle = function(circleSpec) {
	var circle = this.parent;
	for(var i = 0; i < circleSpec.parentLevel; i++) {
		circle = circle.parent;
	}

	for( var i=0; i<circleSpec.childIndexes.length; i++) {
		circle = circle.children[listSpec.childIndexes[i]];
	}
	return circle;
};
