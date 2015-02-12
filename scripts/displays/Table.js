/**
 * Created by Arjun on 2/11/2015.
 */

function Table() {
	this.memoDiv = $("div.memo");
	this.tableElem = null;
}

Table.prototype.createTable = function(table) {
	this.tableElem = $("<table></table>");
	var keys = [new Set()];
	if((Object.keys(table)[0]+"").indexOf(",") != -1) {
		keys.push(new Set());
	}
	for(entryKey in table) {
		var dims = entryKey.split(",");
		for(var z=0; z<dims.length; z++) {
			keys[z].add(dims[z]);
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
		rowElem.append("<td>" + key2 + "</td>");
	}
	this.tableElem.append(rowElem);
	for(key1 in keys[0]) {
		var rowElem = $("<tr></tr>");
		rowElem.append("<td>" + key1 + "</td>");
		if(keys.length == 1) {
			var val = table[key1+""];
			rowElem.append("<td methodID='" + val.methodId + "'>" + val.value.value + "</td>");
		}
		else {
			for (key2 in keys[1]) {
				var val = table[key1 + "," + key2];
				if (val != undefined) rowElem.append("<td methodID='" + val.methodId + "'>" + val.value.value + "</td>");
			}
		}
		this.tableElem.append(rowElem);
	}
	this.memoDiv.append(this.tableElem);
};

Table.prototype.renderTable = function(maxMethodID) {
	this.tableElem.find("td").each(function(i, e) {
		var elem = $(e);
		if(elem.attr("methodID") <= maxMethodID) {
			elem.show();
		}
		else {
			elem.hide();
		}
	});
};