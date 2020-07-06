var nodes = [];
var nNodes = [];

var width = window.innerWidth,
    height = window.innerHeight;

d3.json("data/lyo.json").then(function(links) {
    links.forEach(function(link) {
        if (nodes[link.source.name]){
            link.source = nodes[link.source.name] ;
        }
        else {
            nodes[link.source.name] = {name: link.source};
            nNodes.push(nodes[link.source.name]);
            link.source = nodes[link.source.name] ;
        }
     
        if (nodes[link.target.name]){
            link.target = nodes[link.target.name] ;
        }
        else {
            nodes[link.target.name] = {name: link.target};
            nNodes.push(nodes[link.target.name]);
            link.target = nodes[link.target.name] ;
        } 
    }); 
     
    var svg = d3.select("forum")
        .append("svg")
        .attr("width", width)
        .attr("height", height), 
        g = svg.append("g")
;
    
    // DEFINING Arrows on the links/arcs    
svg.append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 12)
    .attr("refY", -1.5)
    .attr("markerWidth", 12)
    .attr("markerHeight", 12)
    .attr("orient", "auto")
    .style("fill", "#669999")
    .style("z-index", 9)
  .append("path")
    .attr("d", "M0,-5L10,0L0,5"); 
        // forces
    
    var r = d3.forceRadial(50),
        x = d3.forceX(width),
        y = d3.forceY(height),
        attract = d3.forceManyBody().strength(2),
        center = d3.forceCenter(width/2, height/2),
        collide = d3.forceCollide().radius(50).iterations(6),
        link = d3.forceLink(links).distance(25);
     
    var simulation = d3.forceSimulation(nNodes).alphaTarget(0.5).velocityDecay(0.6)
//        .force("charge", charge)
        .force("r", r)
//        .force("x", x)
//        .force("y", y)
        .force("collide", collide)
        .force("center", center)
        .force("link", link);
    
    var zoom = d3.zoom()
        .on("zoom", zoom_actions);

    // create tear drop shape
    var path = g.selectAll("path")
        .data(links)
        .enter().append("path")
       .style("fill", "none")
        .style("stroke", "#669999")
        .attr("class", "link").attr("marker-end", "url(#end)");

    var node = g.selectAll("circle")
        .data(nNodes)
      .enter().append("circle")
        .attr("r", 5)
        .style("opacity", 1)
        .style("fill", "coral")
        .style("opacity", "0.5")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    var text = g.selectAll("text")
        .data(nNodes)
        .enter().append("text")
        .attr("x", 3)
        .attr("y", ".3em")
        .style("font-size", function(d){return (d.name.size+4) * 5})
        .style("fill", "#333333")
        .style("opacity", 0.6)
        .text(function(d) { return d.name.name; });

    function zoom_actions(){
      g.attr("transform", d3.event.transform);
    }

    function tick() {
        path.attr("d", function(d){
                                 return linkArc(d);
                                });
        node.attr("transform", transform);
        text.attr("transform", transform);
    }

// creation of tear drop shapes
    function linkArc(d) {
//      var dx = parseFloat(d.target.x) - parseFloat(d.source.x);
//      var dy = parseFloat(d.target.y) - parseFloat(d.source.y);
//      var dr = Math.sqrt(dx * dx + dy * dy);
//      var r =  d.source.name.size*0.1; 
//      var xPad,
//          yPad; 
//         
//        if(d.target.x < d.source.x) {
//            xPad = d.source.x - r;
//        } else {
//            xPad = d.source.x + r;
//        }
//        
//        if(d.target.y < d.source.y) {
//            yPad = d.source.y + r;
//        } else {
//            yPad = d.source.y - r;
//        }
//        
//        l = Math.sqrt(dx * dx + r * r);   
//        let tearWidth = 1.03;
//        let path = 
//        `M ${d.target.x} ${d.target.y}, 
//        Q ${xPad*tearWidth} ${yPad*tearWidth}, ${d.source.x} ${d.source.y}, 
//        T ${d.target.x} ${d.target.y},
//        Z`;
//        
//    return path;
     var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
    
    var r = 25,
      l = Math.sqrt(dx * dx + r * r);   
    
    return "M" + d.source.x + "," + d.source.y + "A" + l + "," + l + " 0 0,1 " + d.target.x + "," + d.target.y ;
        
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
    
    simulation.on("tick", tick);
    zoom(svg);
    
})
.catch(function(error){
    console.log("error")
});




// drag functions
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).select("text")
    .attr("x", d.x = d3.event.x)
    .attr("y", d.y = d3.event.y);
//  d3.select(this).select("rect")
//    .attr("x", d.x = d3.event.x)
//    .attr("y", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("active", false);
}