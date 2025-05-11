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
                    $(`#${r}${c}`).append("<div class='piece black king'></div>")
                } else if ( r > 4 ) {
                    $(`#${r}${c}`).append("<div class='piece white king'></div>")
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
            
            moveChecker();
            // $(this).addClass("selected");
        }
    });

    // change $('.selected') to selected (variable) for reasons!
    // click for red squares that are EMPTY
    // cannot put multiple pieces into a square
    $('.square.red').on("click", function(){
        if ( selected != undefined && selected.length > 0 && $(this).children().length == 0 && $(this).hasClass('selected') ) {
            $(this).append( selected );
            $('.selected').removeClass("selected");

            // How can we know if the move that was JUST made was a jump
            if ( $(this).hasClass('jump') ) {
                // WHICH PIECE to remove
                let t = $('#turn').html()[0] == "b" ? -1 : 1;
                let jrow = parseInt($(this).attr('id')[0]) + t;
                let jcol = 0;
                if ( $(this).hasClass('jump-left') ) {
                    jcol = parseInt($(this).attr('id')[1]) + 1;
                } else if ( $(this).hasClass('jump-right') ) {
                    jcol = parseInt($(this).attr('id')[1]) - 1;
                }
                let PIECE = $(`#${jrow}${jcol}`).children();

                // How to move a piece, where to move it to;
                $('#score').append(PIECE);

                // RESET
                $('.jump-right').removeClass('jump-right');
                $('.jump-left').removeClass('jump-left');
                $('.jump').removeClass('jump');
            }

            //if the piece is black and the row is 7, add the king class to the piece.
            //if the piece is white and the row is 0, add the king class to the piece.
            if ( ($('#turn').html() == "black" && parseInt($(this).attr('id')[0]) == 7) || ($('#turn').html() == "white" && parseInt($(this).attr('id')[0]) == 0) ) {
                selected.addClass('king');
            }

            selected = undefined;
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
    if ( selected.hasClass("king") ) {
        let prow = parseInt(selected.parent().attr("id")[0]);
        let pcol = parseInt(selected.parent().attr("id")[1]);

        /*
        +-
        ++
        -+
        --
        */
       let directions = [
        [ 1, -1 ],
        [ 1, 1 ]
       ]

        // 1 row down(+) 1 col left(-)
        if ( $(`#${prow + 1}${pcol - 1}`).children().length == 0 ) {
            $(`#${prow + 1}${pcol - 1}`).addClass('selected');
        }

        tryMove(1, -1);

        // 1 row down(+) 1 col right(+)
        if ( $(`#${prow + 1}${pcol + 1}`).children().length == 0 ) {
            $(`#${prow + 1}${pcol + 1}`).addClass('selected');
        }

        // 1 row up(-) 1 col left(-)
        if ( $(`#${prow - 1}${pcol - 1}`).children().length == 0 ) {
            $(`#${prow - 1}${pcol - 1}`).addClass('selected');
        }

        // 1 row up(-) 1 col right(+)
        if ( $(`#${prow - 1}${pcol + 1}`).children().length == 0 ) {
            $(`#${prow - 1}${pcol + 1}`).addClass('selected');
        }

    } else {
        // does this piece have squares it can move to?
        /*
            if yes, highlight!
            if no, do nothing.
        */
        // ternary conditional statement (just for fun!)
        let t = $('#turn').html()[0] == "b" ? 1 : -1;

        let prow = parseInt(selected.parent().attr("id")[0]);
        let pcol = parseInt(selected.parent().attr("id")[1]);
        
        // 1 row down(+)/up(-) 1 col left(-)
        if ( $(`#${prow + t}${pcol - 1}`).children().length == 0 ) {
            $(`#${prow + t}${pcol - 1}`).addClass('selected');
        } else if ( ! $(`#${prow + t}${pcol - 1}`).children().hasClass($('#turn').html()) ) {
            if ( $(`#${prow + (t * 2)}${pcol - 2}`).children().length == 0 ) {
                $(`#${prow + (t * 2)}${pcol - 2}`).addClass('selected');
                $(`#${prow + (t * 2)}${pcol - 2}`).addClass('jump');
                $(`#${prow + (t * 2)}${pcol - 2}`).addClass('jump-left');
            }
        }

        // 1 row down(+)/up(-) 1 col right(+)
        if ( $(`#${prow + t}${pcol + 1}`).children().length == 0 ) {
            $(`#${prow + t}${pcol + 1}`).addClass('selected');
        } else if ( ! $(`#${prow + t}${pcol + 1}`).children().hasClass($('#turn').html()) ) {
            if ( $(`#${prow + (t * 2)}${pcol + 2}`).children().length == 0 ) {
                $(`#${prow + (t * 2)}${pcol + 2}`).addClass('selected');
                $(`#${prow + (t * 2)}${pcol + 2}`).addClass('jump');
                $(`#${prow + (t * 2)}${pcol + 2}`).addClass('jump-right');
            }
        }
    }
    
    // if there ARE highlighted squares to move to, then highlight the piece that can be moved.
    if ( $('.selected').length > 0 ) {
        selected.addClass('selected');
    } else {
        selected = undefined;
    }
    
}

function tryMove(row, col) {
    let prow = parseInt(selected.parent().attr("id")[0]);
    let pcol = parseInt(selected.parent().attr("id")[1]);
    const corner = $(`#${prow + row}${pcol + col}`);

    if (corner.children().length == 0) {
        corner.addClass('selected');
    }
}