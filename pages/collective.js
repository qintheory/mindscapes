var nodes = [];


var width = window.innerWidth || document.body.clientWidth,
    height = window.innerHeight || document.body.clientHeight;

//$(document).ready(function(){
//    $("#mindscapes").hide();
//
////    switchCentralContent();  
//});
//
//$("#button-mymindscapes").click(function(){
//    $("#mindscapes").show();
//})



 d3.json("eco.json", function(links) {  
    
    links.forEach(function(link) {
      link.source = nodes[link.source.name] || (nodes[link.source.name] = {name: link.source});
      link.target = nodes[link.target.name] || (nodes[link.target.name] = {name: link.target});
    });
    
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(20)
        .charge(-200)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Per-type markers, as they don't inherit styles.
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

    var path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .attr("class", "link").attr("marker-end", "url(#end)");

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", function(d){return d.name.size * 10})
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
      .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .style("font-size", function(d){return d.name.size * 14})
        .text(function(d) { return d.name.name; });

    // Use elliptical arc path segments to doubly-encode directionality.
    function linkDistance(d){
        return 50 * d.time;
    }

//    var linkLength = 
//        
    function tick() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      text.attr("transform", transform);
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
    
    console.log(nodes.length)
    console.log(links.length)
    
}) 

