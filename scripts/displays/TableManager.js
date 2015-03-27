/**
 * Created by Arjun on 2/11/2015.
 */

function TableManager() {
	this.memoDiv = $("div.memo");
	this.tableElem = null;
}

TableManager.prototype.createTable = function(table) {
	this.tableElem = $("<table></table>");
	var keys = [];
	var sampleEntry = table[Object.keys(table)[0]];
	for(var i = 0; i<Object.keys(sampleEntry.params).length; i++) {
		keys.push(new Set());
	}
	for(entryKey in table) {
		var index = 0;
		for(param in table[entryKey].params) {
			keys[index++].add(table[entryKey].params[param].getDisplayString());
		}
	}

	// Order keys
	for(var z=0; z<keys.length; z++) {
		var sorted = [];
		for (key1 of keys[z]) {
			sorted.push(key1);
		}
		sorted.sort();
		keys[z] = sorted;
	}

	var rowElem = $("<tr><td></td></tr>");
	for(key2 in keys[1]) {
		rowElem.append("<td class='memo-label'>" + key2 + "</td>");
	}
	this.tableElem.append(rowElem);
	for(key1 in keys[0]) {
		var rowElem = $("<tr></tr>");
		rowElem.append("<td memo-label>" + key1 + "</td>");
		var val = undefined;
		if(keys.length == 1) {
			var val = table[key1+""];
			rowElem.append(this.createCell(val));
		}
		else {
			for (key2 in keys[1]) {
				var val = table[key1 + "," + key2];
				rowElem.append(this.createCell(val));
			}
		}
		this.tableElem.append(rowElem);
	}
	this.memoDiv.append(this.tableElem);
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