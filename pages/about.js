$("#button-about").click(function(){
    $("about").toggle(function(){
        $("#button-about").toggleClass("active");
    });
    $("#button-tutorial").removeClass("active");
    $("#button-demo").removeClass("active");
    $("tutorial").hide();
    $("demo").hide();
})

