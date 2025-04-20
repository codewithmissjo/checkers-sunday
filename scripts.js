// create a variable to keep track of a selected piece, because relying on the html is UNreliable.
var selected;

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
        // check whose turn it is
        let turn = $('#turn').html();
        if ( $(this).hasClass( turn ) ) {
            $('.selected').removeClass("selected");
            selected = $(this);
            // line 31 might not be working for Vibha
            moveChecker();
            // $(this).addClass("selected");
        }
    });

    // change $('.selected') to selected (variable) for reasons!
    // click for red squares that are EMPTY
    // cannot put multiple pieces into a square
    $('.square.red').on("click", function(){
        if ( selected != undefined && selected.length > 0 && $(this).children().length == 0 ) {
            $(this).append( selected );
            $('.selected').removeClass("selected");
            changeTurn();
        }
    });

})

function changeTurn() {
    let turn = $('#turn').html();
    if ( turn == "black" ) {
        $('#turn').html("white");
    } else if ( turn == "white" ) {
        $('#turn').html("black");
    } else {
        $('#turn').html("HUMAN ERROR.");
    }
}

function moveChecker() {
    // does this piece have squares it can move to?
    /*
        if yes, highlight!
        if no, do nothing.
    */
    // ternary conditional statement (just for fun!)
    let t = $('#turn').html()[0] == "b" ? 1 : -1;
    let prow = parseInt(selected.parent().attr("id")[0]);
    let pcol = parseInt(selected.parent().attr("id")[1]);
    
    // 1 row down 1 col left
    if ( $(`#${prow + t}${pcol - 1}`).children().length == 0 ) {
        $(`#${prow + t}${pcol - 1}`).addClass('selected');
    }

    // 1 row down 1 col right
    if ( $(`#${prow + t}${pcol + 1}`).children().length == 0 ) {
        $(`#${prow + t}${pcol + 1}`).addClass('selected');
    }

    if ( $('.selected').length > 0 ) {
        selected.addClass('selected');
    }
    
}

/* IDK

//&& $(this) != $('.selected').parent('.square')
 
*/