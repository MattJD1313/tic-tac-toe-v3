//Single global module that all other modules are ported to.
const mainScope = (function () {}());

/*
Creates the start page html and sets it to the opening screen
while hiding the board html. When the start button is clicked
the start page vanishes and the board page loads.
*/

(function () {

    const boardHtml = document.getElementById('board');
    const startHtml = document.createElement('DIV');
    startHtml.className = 'screen screen-start';
    startHtml.id = 'start';
    startHtml.innerHTML =
        '<header>'+
        '<h1>Tic Tac Toe</h1>'+
        '<a id = "startButton" class="button">Start game</a>'+
        '</header>';

    (function () {
        boardHtml.setAttribute('hidden','hidden');
        document.body.appendChild(startHtml);
    }());

    const button = document.getElementById('startButton');
    const startGame = (function () {
        document.body.removeChild(startHtml);
        boardHtml.removeAttribute('hidden');
    });
    button.addEventListener('click',startGame);

}(mainScope));

/*
 Initialize game for player one to be first to choose and then tracking
 who the active player is so the state of play is visible. Hovering over
 squares shows the current player's icon and when clicked that icon can be
 entered onto the board and then it is the other player's turn.
 */

(function () {
    //Declaring variables.
    const playerOne = document.getElementById('player1');
    const playerTwo = document.getElementById('player2');
    const boxes = document.getElementsByClassName('boxes')[0];

    //Initializing game.
    (function () {
        playerOne.className = 'players active';
    }());

    //Tracking turns.
    (function () {
        boxes.addEventListener('click', () => {
            if (playerOne.className != 'players active') {
                playerTwo.className = 'players';
                playerOne.className = 'players active';
            } else {
                playerOne.className = 'players';
                playerTwo.className = 'players active';
            }
        });
    }());

    //Select Squares.
    const selectSquare = (function () {
        if(playerOne.className == 'players active'){
            return this.className = 'box box-filled-1';
        }else{
            return this.className = 'box box-filled-2';
        }
    });

    //Hovering behavior.
    const mouseOverSquare = (function () {
        if(this.className != 'box box-filled-1' && this.className != 'box box-filled-2') {
            if (playerOne.className == 'players active') {
                return this.className = 'box box-hover-1';
            }
            if (playerTwo.className == 'players active') {
                return this.className = 'box box-hover-2';
            }
        }
    });

    const mouseLeaveSquare = (function () {
        if(this.className !== 'box box-filled-1' && this.className !== 'box box-filled-2') {
            return this.className = 'box';
        }
    });

    //Adding listeners to handle selecting, hovering, and leaving events..
    (function () {
        for(let i = 0 ; i < boxes.children.length ; i++) {
            boxes.children[i].addEventListener('click', selectSquare);
            boxes.children[i].addEventListener('mouseover', mouseOverSquare);
            boxes.children[i].addEventListener('mouseout', mouseLeaveSquare);
        }
    }());

}(mainScope));


/*
Determining who wins by tracking selections and comparing those selections
to all possible winning combinations. When a win or a tie is determined the
appropriate winner html is displayed.
*/
(function () {
    //Describing winning grid combinations.
    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    //Accessing the box elements.
    const boxes = document.getElementsByClassName('boxes')[0];

    //Creating the winner html.
    const winnerHtml = document.createElement('DIV');
    winnerHtml.className = 'screen screen-win';
    winnerHtml.id = 'finnish';
    winnerHtml.innerHTML =
        '<header>'+
        '<h1>Tic Tac Toe</h1>'+
        '<p class="message"></p>'+
        '<a onclick="window.location.reload()" class="button">New game</a>'+
        '</header>';

    //Displays the winner html with the right message and the player who won.
    const displayWinner = (function (message,player) {
        let boardHtml = document.getElementById('board');
        winnerHtml.className = 'screen screen-win ' + player;
        boardHtml.setAttribute('hidden','hidden');
        winnerHtml.children[0].childNodes[1].innerHTML = message;
        document.body.appendChild(winnerHtml);
    });

    //Tallying the score as it correlates to the winning combos and displays the winner.
    const keepingScore = (function (name,combo,max) {
        if(combo.length >= 3 && combo.length <= max) {
            for (let i = 0; i < winningCombos.length; i++) {
                let score = 0;
                for (let q = 0; q < combo.length; q++) {
                    if (winningCombos[i].indexOf(combo[q]) != -1) {
                        score += 1;
                        if (score === 3) {
                            displayWinner('Winner!!',name);
                        }
                        if (score != 3 && combo.length == max){
                            displayWinner("It's A Tie",'screen-win-tie');
                        }
                    }
                }
            }
        }
    });

    /*
    More or less a UI function that tracks the squares selected and
    calls the keeping score function to see if either player has won
    or if there has been a tie.
    */
    boxes.addEventListener('click',()=>{
        let playerOneResult = [];
        let playerTwoResult = [];
        (function () {
            for (let i = 0; i < boxes.children.length; i++) {
                if(boxes.children[i].className == 'box box-filled-1'){
                    playerOneResult.push(i);
                    keepingScore('screen-win-one', playerOneResult,5);
                }
                if(boxes.children[i].className == 'box box-filled-2'){
                    playerTwoResult.push(i);
                    keepingScore('screen-win-two', playerTwoResult,5);
                }
            }
        }());
    });
}(mainScope));