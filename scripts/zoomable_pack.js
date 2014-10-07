$(init);
function init(){
	if (data == null) return;
	var parent = $("<div class='main'></div>");
	$("body").append(parent);
	makeCircle(data, parent, Math.min($(document).height(), $(document).width()) * 0.9);
}
function makeCircle(node, parentElem, size) {
	var myCircle = $("<div class='circle'></div>");
	myCircle.width(size).height(size);
	parentElem.append(myCircle);
	myCircle.append("<div class='align-helper'></div>");
	if (node.children.length > 0) {
		myCircle.addClass("circle-node");
		var childSize = size / node.children.length - 2;
		for (var i = 0; i < node.children.length; i++) {
			makeCircle(node.children[i], myCircle, childSize);
		}
		//console.log(node);
	} else {
		myCircle.addClass("circle-leaf");
	}
	var startNodeList = $("<div class='start node-list'></div>");
	for (var i = 0; i < node.start.length; i++) {
		new Node(node.start[i], startNodeList);
	}
	myCircle.append(startNodeList);
	var resultNodeList = $("<div class='result node-list'></div>");
	for (var i = 0; i < node.result.length; i++) {
		new Node(node.result[i], resultNodeList);
	}
	myCircle.append(resultNodeList);
}
/*
var w = 1280,
    h = 800,
    r = 720,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })

var vis = d3.select("body").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

//data = {
//	"name": "root",
//	"name2": "root2",
//	"children": [
//		{
//			"name": "level1_1",
//			"name2": "level1_1a",
//			"size": 10
//		},
//		{
//			"name": "level1_2",
//			"name2": "level1_2a",
//			"size": 10
//		}
//	]
//};

node = root = data;
var nodes = pack.nodes(root);

vis.selectAll("circle")
  .data(nodes)
.enter().append("svg:circle")
  .attr("class", function(d) { return d.children.length > 0 ? "parent" : "child"; })
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", function(d) { return d.r; })
  .on("click", function(d) { return zoom(node == d ? root : d); });

var append = vis.selectAll("text")
		.data(nodes)
		.enter();
append.append("svg:text")
  .attr("class", function(d) { return d.children.length > 0 ? "parent" : "child"; })
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y - (d.r / 2); })
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
	.attr("is-start", "true")
  .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
  .text(function(d) { return d.start + ""; });
append.append("svg:text")
  .attr("class", function(d) { return d.children.length > 0 ? "parent" : "child"; })
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y + (d.r / 2); })
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
	.attr("is-start", "false")
  .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
  .text(function(d) { return d.result + ""; });

d3.select(window).on("click", function() { zoom(root); });

function zoom(d, i) {
  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

	t.selectAll("text[is-start=true]")
		.attr("y", function(d) { return y(d.y) - d.r*k / 2; });

	t.selectAll("text[is-start=false]")
		.attr("y", function(d) { return y(d.y) + d.r*k / 2; });

  node = d;
  d3.event.stopPropagation();
}
*/