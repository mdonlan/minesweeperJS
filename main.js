function createGrid() {
    var numRows = 0;
    var x = 0;
    var y = 0;
    allTiles = [];
    gameOver = false;
    numClicks = 0;
    for(var i = 0; i < 100; i++) {
        
        // create new row
        if(i == 0 || x == 10) {
            var row = document.createElement("DIV");
            row.id = 'row' + numRows;
            row.className = 'row';
            $(".grid").append(row);
            currentRow = row.id;

            numRows++;

            if(x == 10) {
                y++;
                x = 0;
            }
        }

        var tile = document.createElement("DIV");
        tile.id = 'tile' + i;
        tile.className = 'tile';

        $("#" + currentRow).append(tile);

        allTiles.push(tile);

        //$("#tile" + i).html(i);
        $("#tile" + i).data('x', x);
        $("#tile" + i).data('y', y);
        $("#tile" + i).data('isMine', false);
        $("#tile" + i).data('hasBeenUsed', false);
        $("#tile" + i).data("hasBeenRevealed", false);
        $("#tile" + i).css('background', "#4f5256");

        x++;
    }
};

// capture click events

// right click
$(document).on("contextmenu", ".tile", function(event){
    target = event.target;
    //console.log($(target));
    if($(target).hasClass("marked")) {
        $(target).removeClass("marked");
    } else {
        $(target).addClass("marked");
    }
    return false;
 });

// left click
function onClick() {
    $('body').click(function(event) {
        target = event.target;

        // if click is on a valid tile
        // check if is mine
        if(gameOver == false) {
            if($(target).data("isMine") == true) {
                if(numClicks == 0) {
                    // if first click is on a bomb move the move 
                    // to a random tile instead of ending the game
                    $(target).data("isMine", false);
                    randomMine(target);
                } else {
                    //game over
                    $(".messages").css("display", "block");
                    $(".messages").html("You hit a mine! Game Over!");
                    gameOver = true;
                    var bombImg = document.createElement("img");
                    var randBombNum = Math.floor((Math.random() * 7) + 1);
                    bombImg.setAttribute('src', 'assets/bomb0' + randBombNum + ".png");
                    bombImg.setAttribute('alt', 'bombImg');
                    bombImg.setAttribute('height', '40px');
                    bombImg.setAttribute('width', '40px');
                    $(target).append(bombImg);
                    revealBoard();
                }
            }
            else if($(target).hasClass("tile")) {
                numClicks++;
                $(target).css("background", "#dddddd");
                $(target).data("hasBeenRevealed", true);
                $(target).data("hasBeenUsed", true);
                findNeighbors(target);
            }
        }
    });
};

function randomMine(target) {
    var randX = Math.floor((Math.random() * 9));
    var randY = Math.floor((Math.random() * 9));

    for(var i = 0; i < allTiles.length; i++) {
        if($(allTiles[i]).data("x") == randX && $(allTiles[i]).data("y") == randY) {
            if($(allTiles[i]).data("isMine") == true) {
                // if new spot is already a mine then redo
                console.log('redoing random mine')
                randomMine(target);
            } else {
                $(allTiles[i]).data("isMine", true);
                console.log('new random mine placed')
            }
        }
    }
};

function findNeighbors(targetTile) {
    //console.log('running findNeighbors function...')
    // loop through all tiles to find neighbors
    var neighbors = [];
    for(var i = 0; i < allTiles.length; i++) {

        if($(allTiles[i]).data("hasBeenUsed") == false && $(allTiles[i]).is(":empty")) {
            // left tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") && $(allTiles[i]).data("x") == $(targetTile).data("x") - 1) {
                var leftTile = allTiles[i];
                //$(leftTile).css("background", "orange");
                neighbors.push(leftTile);
            }
            // right tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") && $(allTiles[i]).data("x") == $(targetTile).data("x") + 1) {
                var rightTile = allTiles[i];
                //$(rightTile).css("background", "orange");
                neighbors.push(rightTile);
            }
            // top tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") - 1 && $(allTiles[i]).data("x") == $(targetTile).data("x")) {
                var topTile = allTiles[i];
                //$(topTile).css("background", "orange");
                neighbors.push(topTile);
            }
            // bot tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") + 1 && $(allTiles[i]).data("x") == $(targetTile).data("x")) {
                var botTile = allTiles[i];
                //$(botTile).css("background", "orange");
                neighbors.push(botTile);
            }
            // topLeft tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") - 1 && $(allTiles[i]).data("x") == $(targetTile).data("x") - 1) {
                var topLeftTile = allTiles[i];
                //$(topLeftTile).css("background", "orange");
                neighbors.push(topLeftTile);
            }
            // topRight tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") - 1 && $(allTiles[i]).data("x") == $(targetTile).data("x") + 1) {
                var topRightTile = allTiles[i];
                //$(topRightTile).css("background", "orange");
                neighbors.push(topRightTile);
            }
            // botLeft tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") + 1 && $(allTiles[i]).data("x") == $(targetTile).data("x") - 1) {
                var botLeftTile = allTiles[i];
                //$(botLeftTile).css("background", "orange");
                neighbors.push(botLeftTile);
            }
            // botRight tile
            if($(allTiles[i]).data("y") == $(targetTile).data("y") + 1 && $(allTiles[i]).data("x") == $(targetTile).data("x") + 1) {
                var botRightTile = allTiles[i];
                //$(botRightTile).css("background", "orange");
                neighbors.push(botRightTile);
            }
        }
    }
    for(var j = 0; j < neighbors.length; j++) {
        //$(neighbors[j]).data("hasBeenUsed", true);
        if( $(neighbors[j]).data("isMine") == false) {
            //$(neighbors[j]).css("background", "#dddddd");
        }
        
    }
    $(targetTile).data("hasBeenUsed", true);
    checkForMines(neighbors, targetTile);
};

function checkForMines(neighbors, targetTile) {
    var numMines = 0;
    for(var i = 0; i < neighbors.length; i++) {
        if($(neighbors[i]).data("isMine") == true) {
            numMines++;
            // reset mine used status so it 
            // can be used to calculate numMines in future
            // findNeighbors loops
            $(neighbors[i]).data("hasBeenUsed", false);
        }
    }
    //console.log('numMines:' + numMines);

    // if no neighbors are mines
    // show next level of neighbors
    // else show numMines in neighbors
    if(numMines == 0) {
        for(var j = 0; j < neighbors.length; j++) {
            $(neighbors[j]).css("background", "#dddddd");
            $(neighbors[j]).data("hasBeenRevealed", true);
            findNeighbors(neighbors[j]);
        }
    } else {
        for(var k = 0; k < neighbors.length; k++) {
            $(targetTile).html(numMines);
        }
    }
    checkWin();
};

function placeMines() {
    for(var i = 0; i < 10; i++) {
        var randX = Math.floor((Math.random() * 9));
        var randY = Math.floor((Math.random() * 9));
        for(var j = 0; j < allTiles.length; j++) {
            if(randX == $(allTiles[j]).data("x") && randY == $(allTiles[j]).data("y")) {
                if($(allTiles[j]).data("isMine") == true) {
                    i = i - 1;
                }
                $(allTiles[j]).data("isMine", true);
                //$(allTiles[j]).css("background", "blue");
            }
        }
    }
};

function checkWin() {
    // loop through all tiles and check if the only ones that
    // haven't been used are the mines
    var numNotUsed = 0;
    for(var i = 0; i < allTiles.length; i++) {
        if($(allTiles[i]).data("hasBeenUsed") == false) {
            numNotUsed++;
        }
    }

    if(numNotUsed == 10) {
        console.log('user wins')
        $(".messages").html("You found all the mines! You Win!!!");
        $(".messages").css("display", "block");
        gameOver = true;
    }

    if(gameOver == true) {
        revealBoard();
    }
};

function revealBoard() {
    for(var i = 0; i < allTiles.length; i++) {
        $(allTiles[i]).css("background", "#dddddd");
        if($(allTiles[i]).data("isMine") == true) {
            var bombImg = document.createElement("img");
            var randBombNum = Math.floor((Math.random() * 7) + 1);
            bombImg.setAttribute('src', 'assets/bomb0' + randBombNum + ".png");
            bombImg.setAttribute('alt', 'bombImg');
            bombImg.setAttribute('height', '40px');
            bombImg.setAttribute('width', '40px');
            $(allTiles[i]).append(bombImg);
        }
    }
}

createGrid();
placeMines();
onClick();