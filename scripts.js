$(document).ready(function(){
    
    // create the board
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ( (r + c) % 2 == 0) {
                // white tiles
                $("#grid").append("<div class='square white'></div>");
            } else {
                // red tiles
                $("#grid").append(`<div id='${r}${c}' class='square red'></div>`);

                // add the piece
                if ( r < 3 ) {
                    $(`#${r}${c}`).append("<div class='piece black'></div>")
                } else if ( r > 4 ) {
                    $(`#${r}${c}`).append("<div class='piece white'></div>")
                }
            }
        }
    }

    $('.piece').on("click", function(){
        $('.selected').removeClass("selected");
        $(this).addClass("selected");
    });

    $('.square.red').on("click", function(){
        if ( $('.selected').length > 0 ) {
            $(this).append( $('.selected') );
            // $('.selected').removeClass("selected");
            // cannot put multiple pieces into a square
        }
    });


})