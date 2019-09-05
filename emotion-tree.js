var width = window.innerWidth || document.body.clientWidth,
    height = window.innerHeight || document.body.clientHeight,
    root;

var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", tick);

var svg = d3.select("emotions").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.append("g").selectAll(".link"),
    node = svg.append("g").attr("class", "nodes").selectAll(".node"),
    text = svg.append("g").attr("class", "texts")
        .selectAll("text");

d3.json("emotion-tree.json", function(error, json) {
  if (error) throw error;

  root = d3.hierarchy(json);
  update();
});
    
    
function update() {
  var nodes = flatten(root),
      links = root.links();

  // Restart the force layout.
  simulation
    .nodes(nodes)

  simulation.force("link")
    .links(links);

  // Update the links…
  link = link.data(links, function(d) { return d.target.id; });

  // Exit any old links.
  link.exit().remove();

  // Enter any new links.
  link = link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .merge(link);

  // Update the nodes…
  node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

  // Exit any old nodes.
  node.exit().remove();

  // Enter any new nodes.
  node = node.enter().append("circle")
      .attr("class", "node")
      .attr("text", function(d) { return d.name; } )
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return Math.sqrt(d.data.size) / 10 || 4.5; })
      .style("fill", color)
      .merge(node)
      .on("click", click)
//      .call(d3.drag()
//        .on("start", dragstarted)
//        .on("drag", dragged)
//        .on("end", dragended))
      ;

  text = text.data(nodes, function(d) { return d.id; });
  text.exit().remove();
  text = text.enter()
            .append("text")
                .attr("class", "text")
                .attr("x", 8)
                .attr("y", ".31em")
            .merge(text)
            .attr("id", function(d){ return d.id; })
            .text(function(d) { return d.data.name });
  
  console.log(nodes)    
  
}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    
  text.attr("transform", transform);    
    
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
} 
    
// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? "#69BBBB" : d.children ? "#A3E4D7" : "#CB1818";
}

function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).select("text")
    .attr("x", d.x = d3.event.x)
    .attr("y", d.y = d3.event.y);
  d3.select(this).select("rect")
    .attr("x", d.x = d3.event.x)
    .attr("y", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("active", false);
}    
    
// Toggle children on click.
function click(d) {
  if (!d3.event.defaultPrevented) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
      simulation.restart();
    } else {
      d.children = d._children;
      d._children = null;
      simulation.restart();
    }
    update();
  }
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}