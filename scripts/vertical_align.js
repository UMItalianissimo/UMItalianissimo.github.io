$(document).ready(function(){
    resize();

    $(window).resize(function(){
        resize();
    });
});


function resize() {
    // sets top margin of each ".info" block to vertically align it in parent
    $(".info").each(function() {
        var margin = ($(".info_block").height() - $(this).height()) / 2;
        $(this).css('margin-top', margin + 'px');
    })
};
