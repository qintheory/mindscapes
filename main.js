var input;    

var width = 1260,
    height = 800;

// numerate the nodes    
var id = 0;    
var svgNodeCount = 0;    
    
var firstClickedNode = null;
var nodeClicked = false;
    
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
;

// DEFINE NODES AND TEXTS    
var nodes = [ ],
    node = svg.append("g").attr("class", "nodes")
        .selectAll(".node");  

var practice = [{name: 1}, {name: 2}, {name: 3}, {name: 4}];
    
var text = svg.append("g").attr("class", "text")
        .selectAll("text");

// DEFINE LINKS    
var link = svg.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll("path");
    
var links = [];
var line;
    
// DEFINING Arrows on the links/arcs    
svg.append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .style("fill", "steelblue")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");    
        

// DEFINE FORCES    
var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-300))
    .force("link", d3.forceLink(links).distance(50))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(0.5)
    .force("r", d3.forceRadial(100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", tick);   

// enabling mouse up at all times   
svg.on("mouseup", mouseUp);

// MAKE NODES FROM USER INPUT    
function enter(){
    input = document.getElementById("myInput").value; 
    drawNodes(input);
    return false;
}
  
function drawNodes(name){
   var item = {name, id}
   id ++;
   d3.select
   nodes.push(item);
   
    
    node = node.data(nodes);
    
    node = node.enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("id", function(d){ return (svgNodeCount++); })
      .merge(node)
//      .call(d3.drag()
//        .on("start", dragstarted)
//        .on("drag", dragged)
//        .on("end", dragended))
    ;
    
    text = text.data(nodes);
    
    text = text.enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.name })
        .merge(text)
    ;

    console.log("restarted"); 
    console.log(node);
    
    simulation.nodes(nodes);
    simulation.restart();
    
    $("#nodeCounter").text("Node Count: " + id)
    document.getElementById("myInput").value = " ";

}

// ENABLING LINK MAKING FROM NODES     
function interactionBegins() {
 
    node = node.on("mousedown", makeLinks);
    
    d3.selectAll("input")
        .style("display", "none");
    
    console.log("interaction");
    

}

function makeLinks() {
    thisNode = this;
//    console.log("Node ID clicked is "+this.id);
    
    //Check if the node is 
    nodeClicked = true;
        links.forEach(function(d){
            if (d.source.id == thisNode.id){
                console.log("loop"); 
                nodeClicked = false; 
            }
    })  

    // CASE 1: if it's a new node
    if (firstClickedNode == null) {
        d3.select(thisNode).transition()
            .style("fill", "black");
        firstClickedNode = thisNode;
        console.log("firstClickedNode is "+firstClickedNode.id);
        
//        var d = d3.mouse(this);
//        line = svg.append("line")
//            .attr("x1", d[0])
//            .attr("y1", d[1])
//            .attr("x2", d[0])
//            .attr("y2", d[1])
//        ; 
//        
//        svg.on("mousemove", mouseMove); 
    } 

    // CASE 2: if clicked on itself  
    else if (firstClickedNode == thisNode){
        console.log("cannot connect to oneself");  
    }
    // CASE 3 & 4, forming links
    else {
        mouseDown(nodes[firstClickedNode.id], nodes[this.id]);
        d3.select(thisNode).transition()
            .style("fill", "black")
                .attr("r", 34)
            .transition()
              .attr("r", 10);  
        console.log("new link from"+ firstClickedNode.id + "to" + this.id );
        firstClickedNode = thisNode;     
        // if the selected link is in the array links already as source// loop formed, can stop drawing  
//        svg.on("mousemove", null);
        links.forEach(function(d){
            if (d.source.id == thisNode.id){
                console.log("loop"); 
                nodeClicked = false; 
            }
        })
        
        
    }
}
   
// MOUSE DOWN to create a link
function mouseDown(node1, node2) {
  // Updating data
  links.push({source: node1, target: node2});
    
  // drawing lines:
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("path").attr("class", "link").attr("marker-end", "url(#end)").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart(); 
    
}

// MOUSE UP to reset first node
function mouseUp() {
  console.log("mouseUp");
  if (nodeClicked == false) {
    console.log("1st node nulled, restart");
    firstClickedNode = null;
  }
//  nodeClicked = false;
} 

//function mouseMove() {
//
//}
//
//function eraseLine(d) {
//    line = svg.remove("line");
//}

// FORCE TRANSFORMATION    
function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  link.attr("d", linkArc);    
  text.attr("transform", transform);    
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}    

// MAKING ARC as links    
function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
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