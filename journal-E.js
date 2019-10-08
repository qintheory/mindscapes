var nodes = [];
var nNodes = [];

var width = window.innerWidth || document.body.clientWidth,
    height = window.innerHeight || document.body.clientHeight;

d3.json("journal-new.json", function(links) {
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
        .attr("height", height)
    ;
    
    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-1800))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("r", d3.forceRadial(300))
        .alphaTarget(0.5)
        .force("collide", d3.forceCollide().radius(20
        ))
        .force("link", d3.forceLink(links).distance(20))
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
       .style("fill", "#f7dd16")
        .style("opacity", "0.4")
        .attr("class", "link").attr("marker-end", "url(#end)");

    var node = svg.append("g").selectAll("circle")
        .data(nNodes)
      .enter().append("circle")
        .attr("r", 20)
        .style("opacity", 0)
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    var text = svg.append("g").selectAll("text")
        .data(nNodes)
      .enter().append("text")
        .attr("x", 3)
        .attr("y", ".3em")
        .style("font-size", function(d){return (d.name.size*0.6+1) * 24})
        .style("font-size", function(d){return (d.name.size*0.6+1) * 24})
//        .style("fill", "#f7dd16")
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
      var dx = parseFloat(d.target.x) - parseFloat(d.source.x);
      var dy = parseFloat(d.target.y) - parseFloat(d.source.y);
      var dr = Math.sqrt(dx * dx + dy * dy);
      var r =  d.source.name.size*10; 
      var xPad,
          yPad; 
         
        if(d.target.x < d.source.x) {
            xPad = d.source.x - r;
        } else {
            xPad = d.source.x + r;
        }
        
        if(d.target.y < d.source.y) {
            yPad = d.source.y + r;
        } else {
            yPad = d.source.y - r;
        }
        
        var r = 35,
      l = Math.sqrt(dx * dx + r * r);   
        
        // return "M" + d.source.x + " " + d.source.y + "A" + l + "," + l + " 0 0,1 " + d.target.x + "," + d.target.y;
        
        // return "M" + d.target.x + " " + d.target.y + "Q" + xPad + " " + yPad+ ", " + d.source.x + " "+ yPad  + ", " + "T" + d.target.x + " " + d.target.y;  //
        
        // NEW CODE COMES HERE //
        
        // set up a tearWidth parameter to make the tear wider or narrower
        let tearWidth = 1.05;
        
        // 
        let path = 
        // "M" + d.target.x + " " + d.target.y + 
        // "Q" + xPad + " " + yPad+ ", " + d.source.x + " "+ yPad  + ", " + 
        // "T" + d.target.x + " " + d.target.y; 
        
        // M - start drawing from the top of the drop (target.x, target.y)
        // Q - draw a quadratic curve Q. This function requires two pairs of coordinates - the first pair is the control point on how spread the line should be, the second pair is the end of the curve. In our case the end of the curve is source.x, source.y.
        // T - looks at the previous control point used and infers a new one, ending up at the top of the drop.
        // Z - closes the drawing of the path
            
        `M ${d.target.x} ${d.target.y}, 
        Q ${xPad*tearWidth} ${yPad*tearWidth}, ${d.source.x} ${d.source.y}, 
        T ${d.target.x} ${d.target.y},
        Z`;
        
    return path;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
    
     
    
});

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


