/**
 * Created by Arjun on 2/11/2015.
 */

function TableManager() {
	this.memoDiv = $("div.memo");
	this.tableElem = null;
}

TableManager.prototype.createTable = function(table) {
	this.tableContainer = $("<div class='table-container'></div>");
	this.tableElem = $("<table></table>");
	var sampleEntry = table[Object.keys(table)[0]];
	var vAxisName = "\\(\\leftarrow \\;\\)" + Object.keys(sampleEntry.params)[0];
	var hAxisName = Object.keys(sampleEntry.params)[1] + "\\( \\; \\rightarrow\\)";
	var keys = [];
	for(var i = 0; i<Object.keys(sampleEntry.params).length; i++) {
		keys.push(new Set());
	}
	for(entryKey in table) {
		var index = 0;
		for(param in table[entryKey].params) {
			// Order keys
			keys[index++].add(table[entryKey].params[param].getDisplayString());
		}
	}

	for(var z=0; z<keys.length; z++) {
		var sorted = [];
		for (key1 of keys[z]) {
			sorted.push(key1);
		}
		sorted.sort();
		keys[z] = sorted;
	}


	var oneKey = keys.length == 1;

	var rowElem = $("<tr><td></td></tr>");
	for(key2 in keys[1]) {
		rowElem.append("<td class='memo-label'>" + key2 + "</td>");
	}

	if (!oneKey) {
		this.tableElem.append("<tr><td></td><td colspan='" + (keys[1].length + 0) + "'>" + hAxisName + "</td></tr>");
		//rowElem.append("<td class='expand'></td>");
		this.tableElem.append(rowElem);
		this.tableContainer.addClass("two-dimen");
	}

	for(key1 in keys[0]) {
		var rowElem = $("<tr></tr>");
		rowElem.append("<td class='memo-label'>" + key1 + "</td>");
		var val = undefined;
		if(oneKey) {
			var val = table[key1+""];
			rowElem.append(this.createCell(val));
		}
		else {
			for (key2 in keys[1]) {
				var val = table[key1 + "," + key2];
				rowElem.append(this.createCell(val));
			}
			//rowElem.append("<td class='expand'></td>");
		}
		this.tableElem.append(rowElem);
	}
	this.tableContainer.append("<span class='vertical-text'><span>" + vAxisName + "</span></span>");
	this.tableContainer.append(this.tableElem);
	//this.memoDiv.append("<div>horizontal axis</div>");
	this.memoDiv.append(this.tableContainer);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.tableContainer[0]]);
};

TableManager.prototype.createCell = function(tableEntry) {
	if(tableEntry == undefined) return $("<td class='text-node'></td>");
	var elem = $("<td class='text-node'><span nodeId='" + tableEntry.value.id + "' methodID='" + tableEntry.methodId +
		"'>" + tableEntry.value.getDisplayString() + "</span></td>");
	elem.bind("click", [tableEntry.methodId, this], function(e) {
		Circle.methodIdMap[e.data[0]].elem.click();
	});
	return elem;
};

TableManager.prototype.renderTable = function(maxMethodID) {
	this.tableElem.find("td span").each(function(i, e) {
		var elem = $(e);
		if(elem.attr("methodID") <= maxMethodID) {
			elem.css("visibility", "visible");
		}
		else if(elem.attr("methodID") > maxMethodID) {
			elem.css("visibility", "hidden");
		}
	});
};

TableManager.prototype.getElemByNodeId = function(nodeId) {
	return this.tableElem.find("td span[nodeId=" + nodeId + "]").parent();
};