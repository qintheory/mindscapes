var input;    
var time, date1, date2;

// numerate the nodes    
var id = 0;   
var size = 1;
var svgNodeCount = 0;    
var nodeNum;
    
var previousClick = null;
var nodeClicked = false;
var loopFormed = false;
var nodeRepeated = false;
var connector = [];
var train = [];
var streams = [];
var nowClick;

var width = 800;
var height = 500;
var svg = d3.select("playground").insert("svg")
            .attr("width", width)
            .attr("height", height)
            ;

// DEFINE NODES AND TEXTS    
var nodes = [ ],
    node = svg.append("g").attr("class", "nodes")
        .selectAll(".node");  

var practice = [{name: 1}, {name: 2}, {name: 3}, {name: 4}];
    
var text = svg.append("g").attr("class", "texts")
        .selectAll("text");

// DEFINE LINKS    
var link = svg.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll("path");
    
var links = [];


//TUTORIAL SECTION jQuery
var nextButton = $("#next"),
    backButton = $("#goback");

var endBeginning = $("#end-beginning");

var pageNumber = 0;

var helpAnswers = [
    "I am here to answer some potential questions.",
    "",
    "(our thought processes about how the world works"
]

//var line;
    
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
    .force("charge", d3.forceManyBody().strength(-400))
//    .force("link", d3.forceLink(links).distance(50))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .alphaTarget(0.5)
    .force("r", d3.forceRadial(300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", tick);   

var page1 = $("#tut1"),
    page2 = $("#tut2"),
    page3 = $("#tut3"),
    page4 = $("#tut4"),
    page5 = $("#tut5");

var centralContents = [
    page1,
    page2,
    page3,
    page4,
    page5
    ]

$(document).ready(function(){
    console.log("document ready");
    $("about").hide();
    $("tutorial").hide();
    $("demo").hide();
    $("#questionaire").hide();
//    switchCentralContent();  
});

$("demo").ready(function(){
    $("#analysis-button").hide();
    $("analysis").hide();
//    switchCentralContent();  
});


$("#button-about").click(function(){
    $("about").toggle(function(){
        $("#button-about").toggleClass("active");
    });
    $("#button-tutorial").removeClass("active");
    $("#button-demo").removeClass("active");
    $("tutorial").hide();
    $("demo").hide();
})

$("#button-tutorial").click(function(){
    $("tutorial").toggle(function(){
    document.getElementById('vid1').play();    
    $("#button-tutorial").toggleClass("active");
    $("#button-tutorial").text("Tutorial");
    });
    $("#button-about").removeClass("active");
    $("#button-demo").removeClass("active");
    $("about").hide();
    $("demo").hide();
    
    switchCentralContent();
})

$("#button-tutorial").hover(
    function() {
        var $this = $(this); // caching $(this)
        $this.data('first time?', $this.text());
        $this.text("Tutorial");
    },
    function() {
        var $this = $(this); // caching $(this)
        $this.text($this.data('first time?'));
    }
)


$("#button-demo").click(function(){
    $("quote").toggle();
    $("demo").toggle(function(){
        $("#button-demo").toggleClass("active");
    });
    $("#button-tutorial").removeClass("active");
    $("#button-about").removeClass("active");    
    $("about").hide();
    $("tutorial").hide();
})

$("#button-demo").hover(
    function() {
        var $this = $(this); // caching $(this)
        $this.data('Old Friends', $this.text());
        $this.text("Start Mindscaping");
    },
    function() {
        var $this = $(this); // caching $(this)
        $this.text($this.data('Old Friends'));
    }
)

$("#button-start-demo").click(function(){
//    $("quote").toggle();
    $("demo").show();
    $("#button-tutorial").removeClass("active");
    $("#button-about").removeClass("active");    
    $("about").hide();
    $("tutorial").hide();
})


//tutorial page control

backButton.click(function () {
    previousStep("backButton");
})

nextButton.click(function () {
    nextStep("nextButton");
    // console.log(thoughtsForms)
})

function nextStep(trigger) {
    pageNumber += 1;
    switchCentralContent()  
    if(pageNumber == 2) {
        document.getElementById('vid2').play();
    }
    if(pageNumber == 4) {
        nextButton.hide();
    }
}

function previousStep(trigger) {
    pageNumber -= 1;
    switchCentralContent();
}

function switchCentralContent(){
    page1.hide();
    page2.hide();
    page3.hide();
    page4.hide();
    page5.hide();
    
    centralContents[pageNumber].show();
    
    if(pageNumber == 0){
        endBeginning.show();
        backButton.hide();
        $("#pagecounter").text(" ");
    }
    else{
        endBeginning.hide();
        backButton.show();
        nextButton.show();
        $("#pagecounter").text(pageNumber);
    }    
}



// enabling mouse up at all times   
svg.on("mouseup", mouseUp);
//restart();








// MAKE NODES FROM USER INPUT    
function enter(){
    input = document.getElementById("myInput").value; 
    drawNode(input);
    return false;
}
  
function drawNode(name){
   var item = {name, id, size};
//   id ++;
   d3.select
   nodes.push(item);
   
   updateNodes();  
    $("#theGuides").html("<u>Drag</u> to move the node <br/> <u>Doubleclick</u> to Delete Node");
    document.getElementById("myInput").value = "";
    
    $("#finish-button").text("finish"); 
}

function deleteNode(d, i) {
    nodes.splice(i, 1);
    console.log("node deleted!")
    
    d3.event.stopPropagation();
    updateNodes();
}

function updateNodes(d, i) {
    console.log("update nodes")
    
    // update id # of the node
    nodes.forEach(function(d, i){
       d.id = i;
    })
    
    // update data for the nodes
    node = node.data(nodes);
    text = text.data(nodes);
    
    node.exit()
        .remove();
    
    node = node.enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("id", function(d){ return d.id; })
      .style("stroke-opacity", 1)
      .merge(node)
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on('dblclick', deleteNode)
    ;
    

    text.exit()
        .remove();
    
    text = text
        .enter()
        .append("text")
            .attr("class", "text")
            .attr("x", 8)
            .attr("y", ".31em")
            .merge(text)
            .attr("id", function(d){ return d.id; })
            .text(function(d) { return d.name })
    ;
    
    simulation.nodes(nodes);
    simulation.restart();
    $("#nodeCounter").text("Node Count: " +  nodes.length);
}

// ENABLING LINK MAKING FROM NODES     
function linkingBegins() {
    node = node
        .on('mousedown.drag', null)
        .on("mousedown", makeLinks)
//        .on("dblclick", deleteLink)
        ;
    
    d3.selectAll("input")
        .style("display", "none");
    $("#theGuides").html("<u>Click</u> on the node to make connections <br/> <s>Drag</s> and <s>Doubleclick</s> are disabled <br/> <u> You can only start a new string when a loop is formed</u>");
    $("#nodeCounter").html("Start a new stream of consciousness");
    console.log("interaction");
    $("#finish-button").hide();
    $("#analysis-button").show();

}


function makeLinks() {
// console.log("Node ID clicked is "+this.id);
    nowClick = this;
    nodeClicked = true;

    // check if the clicked node is repeated
    links.forEach(function(d){
        if (d.source.id == nowClick.id & loopFormed == true){
            console.log("nodes aready connected, change node"); 
            nodeClicked = false;
            nodeRepeated = true;
            $("#nodeCounter").text("Repeated Node Detected")
        }
        else {
            nodeRepeated = false;
        }
    })
    
    // CASE 1: if it's a new node
    if (previousClick == null & nodeRepeated == false) {
        previousClick = nowClick;
        train.push(nowClick.id);
        selectedNode(nowClick);
        // register time
        date1 = new Date().getTime();
    } 

    // CASE 2: if clicked on itself  
    else if (previousClick == nowClick){
        console.log("cannot connect to oneself"); 
//        deselectNode(nowClick);
//        nodeClicked = false;
        $("#nodeCounter").text("cannot connect to oneself")
    }
    
    // CASE 3 & 4, forming links
    else {
        // register time
        date2 = new Date().getTime();
        time = (date2 - date1) / 1000;
        date1 = date2;
        
        mouseDown(nodes[previousClick.id], nodes[nowClick.id], time);
        
        console.log("new link from"+ previousClick.id + "to" + nowClick.id );
        
        deselectNode(previousClick);
        selectedNode(nowClick);
        train.push(nowClick.id);
        console.log(train);
        //check if loops
        links.forEach(function(d, i){
            if (d.source.id == nowClick.id){
                loopFormed = true;
                train.push(streams);
                console.log("loop formed or entered, initiate nodes"); 
                $("#nodeCounter").text("Loop formed. Now start a new stream.")
                d3.select(nowClick).style("fill", "aliceblue");
                nodeClicked = false;
                deselectNode(nowClick);
//                train.length = 0;
            }
            else {
                previousClick = nowClick;
            }
        })
        

    }
}

function selectedNode(d) {
    
    // selected node - colour highlighted
    d3.select(d).transition()
            .style("fill", "coral")
                .attr("r", 34)
            .transition()
              .attr("r", 10)
    ;  
    node = node.style("fill", "aliceblue").merge(node);
   
    // 
     $("#nodeCounter").text(nodes[d.id].name + " reminds me of")
}

function deselectNode(d) {
    
    // unhighlight the previous node
    d3.select(d)
        .attr("r", 10)
        .style("fill", "aliceblue")
        .merge(node)
    ; 
    
//    console.log("innitiate node" + d.id)
//    $("#nodeCounter").text("Nothing is selected")
    
}
 

//node.style("fill", "#powderblue").merge(node);    
// MOUSE DOWN to create a link
function mouseDown(node1, node2, time) {
  // Updating data
  links.push({source: node1, target: node2, time: time});
  // drawing lines:
  updateLink();    
}

// MOUSE UP to reset first node
function mouseUp() {
    
  console.log("mouseUp");
  if (nodeClicked == false) {
      console.log("previous node nulled, restart");
      previousClick = null;
      if (links.length == nodes.length) {
        console.log("linking finished");
//        node.style("fill", "#ccc"); 
        //disable makeLinks
        node.on("mousedown", null)
//            .on("dblclick", null);
        untangle();  
        $("#nodeCounter").text("Your nodes are all connected! Press the 'analysis' button" ) 
        $("#analysis-button").text("analysis");   
      } 
  }
  
} 

//function deleteLink() {
//    console.log("doubleclicked")
//    links.pop();
////    var lastCLickedid = links[links.length -1].target.id;
////    d3.select(".node: #lastCLickedid").style("fill", "coral");
////        return l.source.id != d.id && l.target.id != d.id; 
////    var lastId = links[links.length-1].target.id;
//    d = this;
//    d3.select(d)
//        .style("fill", "aliceblue")
//        .merge(node)
//        ; 
//    
//    d3.event.stopPropagation();
//    updateLink();
////    nodeClicked = false;
////    previousClick = null; 
//    
//}

function updateLink() {
    link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("path").attr("class", "link").attr("marker-end", "url(#end)").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  // simulation.force("link").links(links);
  simulation.alpha(1).restart(); 
    
}

$("#analysis-button").click(function(){
    $("analysis").show();
    $("guide").hide();
    $("#questionaire").show();
//    var graphAnalysis = links;
    analysis(links);
    $("#analysis-button").hide();
//    $("")
});

function untangle(){
    simulation.force("link", d3.forceLink(links).distance(50));
    console.log("untangled!")
    //innitiate dragging
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    
//    data-netlify="true"
      var graphAnalysis = JSON.stringify(links);
     $("#graph-analysis").text(graphAnalysis);
//    console.log(graphAnalysis);

}

$("#my-form").submit(function(e) {
  e.preventDefault();

var $form = $(this);
  $.post($form.attr("action"), $form.serialize()).then(function() {
    alert("Thank you!");
  });
});

function linkDistance(d){
    return 50 * d.time;
}

function nodeSize(d) {
    return 5 * d;
}

function analysis(links){
    var ids = [];
    var counts = [];
    var n = 1
    
    links.forEach(function(d, i){
        var item = d.target.id;
        //if it's repeated
        if (ids.includes(item)){
            console.log("repeated")
            var j = ids.indexOf(item);
            counts[j] += 1;
        }
        else{
            ids.push(item);
            counts.push(n);
        }
        console.log(ids);
        console.log(counts);
    });
    
    ids.forEach(function(d, i){
        nodes[d].size *= (counts[i]+0.5); 
    })
    
    node.attr("r", function(d){return d.size * 5});

//    loop.filter()
}


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

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}