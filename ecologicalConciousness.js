var nodes = [];
var nNodes = [];

var width = window.innerWidth || document.body.clientWidth,
    height = window.innerHeight || document.body.clientHeight;

d3.json("data/eco.json", function(links) {
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
//        link.source = nodes[link.source.name] || (nodes[link.source.name] = {name: link.source});
//        link.target = nodes[link.target.name] || (nodes[link.target.name] = {name: link.target});
    }); 
    
    
    
    var svg = d3.select("forum").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("collide", d3.forceCollide().radius(
            function(d){
                return d.name.size * 10;
            }
        ))
        .force("link", d3.forceLink(links).id(function(d) {return d.id; }).distance(50).strength(1))
        .on("tick", tick);
    
    
    simulation.nodes(nNodes);
    simulation.force("link").links(links);
        // Per-type markers, as they don't inherit styles.
//    svg.append("defs").selectAll("marker")
//        .data(["end"])
//      .enter().append("marker")
//        .attr("id", function(d) { return d; })
//        .attr("viewBox", "0 -5 10 10")
//        .attr("refX", 15)
//        .attr("refY", -1.5)
//        .attr("markerWidth", 6)
//        .attr("markerHeight", 6)
//        .attr("orient", "auto")
//        .style("fill", "#669999")
//      .append("path")
//        .attr("d", "M0,-5L10,0L0,5");  
    
    var path = svg.append("g").selectAll("path")
        .data(links)
      .enter().append("path")
        .attr("class", "link").attr("marker-end", "url(#end)");

    var node = svg.append("g").selectAll("circle")
        .data(nNodes)
      .enter().append("circle")
        .attr("r", function(d){return d.name.size * 10})
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    var text = svg.append("g").selectAll("text")
        .data(nNodes)
      .enter().append("text")
        .attr("x", 5)
        .attr("y", ".31em")
        .style("font-size", function(d){return d.name.size * 14})
        .text(function(d) { return d.name.name; });

//        
    function tick() {
      path.attr("d", function(d){
//          console.log(d); 
                                 return linkArc(d);
                                });
      node.attr("transform", transform);
      text.attr("transform", transform);
    }

    function linkArc(d) {
//        console.log(d.target);
//        console.log(d.source);
      var dx = parseFloat(d.target.x) - parseFloat(d.source.x);
      var dy = parseFloat(d.target.y) - parseFloat(d.source.y);
      var dr = Math.sqrt(dx * dx + dy * dy);
      var r =  d.source.name.size*10; 
      var xPad,
          yPad; 
        
      console.log(d.source)  
        if(d.target.x < d.source.x) {
            xPad = d.source.x - r;
        } else {
            xPad = d.source.x +r;
        }
        
        if(d.target.y < d.source.y) {
            yPad = d.source.y + r;
        } else {
            yPad = d.source.y -r;
        }
//        console.log(d.target);
//        console.log(dr);
        
//        if (isNaN(dr)) {
//            console.log(d.target);
//            console.log(d.target.name.x - d.source.name.x);
//            console.log(dy);
//        }
        
         
//      return "M" + d.source.x + " " + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        
        return "M" + xPad + " " + yPad + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y + ", " + "T" + d.target.x + " " + d.target.y;
        
//        return "M" + d.target.x + " " + d.target.y + "Q" + xPad + " " + yPad+ ", " + d.source.x + " "+ yPad  + ", " + "T" + d.target.x + " " + d.target.y;
//        
        
//         return "M " + d.source.x + " " + d.source.y + " C " + d.source.x + 10 + " " + d.source.y - 10 + ", " + d.target.x - dx/2 - 10 + " " + d.target.y -dy/2 + 10 + ", " + d.target.x - dx/2 + " " + d.target.y - dy/2 +
//             " S " + d.target.x + " " + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
    
     
    
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3);
  d.fx = null;
  d.fy = null;
}


//var label = {
//    'nodes': [],
//    'links': []
//}
//
//water.nodes.forEach(function(d, i) {
//    label.nodes.push({node: d});
//    label.nodes.push({node: d});
//    label.links.push({
//        source: i * 2,
//        target: i * 2 + 1
//    });
//});
//
//var labelLayout = d3.forceSimulation(label.nodes)
//    .force("charge", d3.forceManyBody().strength(-50))
//    .force("link", d3.forceLink(label.links).distance(0).strength(2));
//
//var simulation = d3.forceSimulation()
//    .force("link", d3.forceLink().id(function(d) { return d.id; }))
//    .force()