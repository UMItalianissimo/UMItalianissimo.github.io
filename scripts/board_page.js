$(document).ready(function(){
    $.getJSON("https://api.myjson.com/bins/cf40g", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
            items.push( "<p id='" + key + "'>" + val + "</p>" );
        });

        for (var i = 0; i < items.length; ++i) {
            $(".board_description").append(items[i]);
        }
    });

    $.getJSON("json/board_members.json", function(data) {

        // add all the board members to a list
        var members = [];
        $.each(data, function(key, val) {
            members.push(val);
        });

        // create a div for each item in the list and add it to board_members div
        for (var i = 0; i < members.length; ++i) {
            var member = members[i];
            var element = $("<div id='" + member.firstName + "'>" +
                "<p>" + member.firstName + " " + member.lastName + " " + member.year +
                "</p><p>" + member.study + "</p></div>");

            console.log(member.firstName + " " + member.hasPhoto);
            if (member.hasPhoto == "true") {
                element.prepend("<img src='assets/img/board/" +
                    (member.firstName + member.lastName).toLowerCase() + ".jpg'>");
            }
            else {
                element.prepend("<img src='assets/img/board/incognito.jpg' >");
            }
            $(".board_members").append(element);
        }

    })
});
