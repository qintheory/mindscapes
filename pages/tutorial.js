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

//$("#button-tutorial").click(function(){
//    $("tutorial").toggle(function(){
//    document.getElementById('vid1').play();    
//    $("#button-tutorial").toggleClass("active");
//    $("#button-tutorial").text("Tutorial");
//    });
//    $("#button-about").removeClass("active");
//    $("#button-demo").removeClass("active");
//    $("about").hide();
//    $("demo").hide();
//    
//    switchCentralContent();
//})

//$("#button-tutorial").hover(
//    function() {
//        var $this = $(this); // caching $(this)
//        $this.data('first time?', $this.text());
//        $this.text("Tutorial");
//    },
//    function() {
//        var $this = $(this); // caching $(this)
//        $this.text($this.data('first time?'));
//    }
//)


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
