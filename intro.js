var nextButton = $("#next"),
    backButton = $("#goback");

var endBeginning = $("#end-beginning");

var pageNumber = 0;

var demoStepOne = $("form");

var width = 1260,
    height = 600;
var tutorialNodes = [{name: "love"}, {name: "family"}, {name: "holiday in Australia"}];

//var svg = d3.select("body").append("svg")
//    .attr("width", width)
//    .attr("height", height)
//;
//
//var node = svg.append("g").attr("class", "nodes")
//        .selectAll(".node");  
//    
//var text = svg.append("g").attr("class", "text")
//        .selectAll("text");
//
//var link = svg.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll("path");
//    
//var links = [];
//
//svg.append("defs").selectAll("marker")
//    .data(["end"])
//  .enter().append("marker")
//    .attr("id", function(d) { return d; })
//    .attr("viewBox", "0 -5 10 10")
//    .attr("refX", 15)
//    .attr("refY", -1.5)
//    .attr("markerWidth", 6)
//    .attr("markerHeight", 6)
//    .attr("orient", "auto")
//    .style("fill", "steelblue")
//  .append("path")
//    .attr("d", "M0,-5L10,0L0,5");    
//
//var simulation = d3.forceSimulation(tutorialNodes)
//    .force("charge", d3.forceManyBody().strength(-300))
//    .force("link", d3.forceLink(links).distance(50))
//    .force("x", d3.forceX())
//    .force("y", d3.forceY())
//    .alphaTarget(0.5)
//    .force("r", d3.forceRadial(100))
//    .force("center", d3.forceCenter(width / 2, height / 2))
//    .on("tick", tick);   

var texts = [
    "Love reminds me of",
    "Family reminds me of"
]

// central contents
var page1 = $("#page1"),
    page2 = $("#page2"),
    page3 = $("#page3"),
    page4 = $("#page4"),
    page5 = $("#page5"),
    page6 = $("#page6"),
    page7 = $("#page7"),
    page8 = $("#page8"),
    page9 = $("#page9"),
    page10 = $("#page10");

var centralContents = [
    page1,
    page2,
    page3,
    page4,
    page5,
    page6,
    page7,
    page8,
    page9,
    page10
]

console.log("jquery loaded")
$(document).ready(function(){
    console.log("document ready")
    switchCentralContent();
});

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
}

function previousStep(trigger) {
    pageNumber -= 1;
    switchCentralContent();
}

function textUpdate() {
    var text = texts[textNumber - 1]
    ().text(text)
}

function switchCentralContent(){
    console.log("hidden");
//    centralContents.hide();
    page1.hide();
    page2.hide();
    page3.hide();
    page4.hide();
    page5.hide();
    page6.hide();
    page7.hide();
    page8.hide();
    page9.hide();
    page10.hide();
    
    centralContents[pageNumber].show();
    if(pageNumber == 0){
        endBeginning.show();
        backButton.hide();
    }
//    else if(pageNumber == 4) {
//        node = node.data(tutorialNodes).enter()
//      .append("circle")
//      .attr("class", "node")
//      .attr("r", 10)
//      .merge(node)
//    }
    else{
        endBeginning.hide();
        backButton.show();
    }
}

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  link.attr("d", linkArc);    
  text.attr("transform", transform);    
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}   

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}