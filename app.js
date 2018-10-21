//
// SET THE CONSTANTS THAT CAN CHANGE AND SCALE WITH THE GAME
//
const ROWS = 6;
const COLUMNS = 6;
const SHIPS = 2;
const SHIPLENGTH = 3;
const TOTALHITS = SHIPLENGTH * SHIPS;

var gameboard = document.getElementById( "battleship-board" ),
	message = document.getElementById( "message" ),
	lastMove = document.getElementById( "last-move" ),
	gameOptions = document.getElementById( "game-options-wrapper" ),
	allTiles = [],
	// set the variable for whether or not two humans are playing
	twoHumans = true,
	gameHasStarted = false,
	// change seconds delay if you want to slow down pace of play
	secondsDelay = 1000,
	acceptableArray = [],
	updatedArray = [],
	computerGuessArray = [];

// CREATE THE PLAYER OBJECT
function Player( ships, guesses, hits, turn ){
    this.ships = {};
    this.guesses = [];
    this.hits = [];
    this.turn = true;
    this.shipNumber = 0;
    this.counter = 0;
}

var playerOne = new Player(),
	playerTwo = new Player();

// 
// CREATE THE BOARD
// 
// based on the number of rows and columns, we will loop through and create our board
// immediately invoke this function and separate namespace
( function(){
	for ( var i = 0; i < ROWS; i++ ) {
		for ( var j = 0; j < COLUMNS; j++ ) {
			var square = document.createElement( "div" );
			square.classList.add( "tiles" );
			square.setAttribute( "id", i.toString() + j.toString() );
			gameboard.appendChild( square );
		}
		// add a break every set # for a new row
		gameboard.innerHTML += "<br/>";
	}
	// add our board event listener to see which tiles have been clicked
	gameboard.addEventListener( "click", selectTile );

}() );

// check all tiles are there
// console.log(allTiles);


// THIS FUNCTION CHANGES GAMEPLAY FROM HUMAN V HUMAN TO HUMAN V COMPUTER
function selectGameType( e ){
	e.id === "computer" ? 
		( twoHumans = false, message.innerHTML = "Please select first. Then, the computer will." ) : 
		( twoHumans = true, message.innerHTML = "Let's start. Please begin by selecting " + SHIPLENGTH + " tiles per battleship (" + TOTALHITS + " total)" );
}


// 
// SET UP AND TILE FUNCTIONS
// 
// now that tiles have been created, create variable that allows all tiles to be accessed and selected
var allTiles = document.getElementsByClassName( "tiles" );

// 
// HELPER FUNCTIONS
// 
// GET TOTAL TILES PLACED FOR SHIPS BY PLAYER
function totalShips( currentPlayer ){
	var amount = 0;

	for( var i = 0; i < SHIPS; i++ ){
		amount += currentPlayer.ships[ i ].length;
	}
	return amount;
}

// GET CURRENT PLAYER
function getCurrentPlayer(){
	return playerOne.turn ? playerOne : playerTwo;
}
// GET PASSIVE PLAYER
function getPassivePlayer(){
	return !playerOne.turn ? playerOne : playerTwo;
}


// SELECT TILES TO REPRESENT BATTLESHIPS
function selectTile( e ){
	// this variable brings back the selected tile
	var selected = e.path[ 0 ],
		player = getCurrentPlayer();

	// console.log( "current player ", player );
	
	// we have access to the id of this element, so push to the array and cap at ship length * total no of ships
	// prevent the board itself from being pushed to the array and causing issues
	if ( selected.id !== "battleship-board" ){
		if ( player.ships[ player.shipNumber ].length < SHIPLENGTH ){
			checkIfValidTile( selected.id, player.ships[ player.shipNumber ] );
			if ( player.ships[ player.shipNumber ].length === SHIPLENGTH ){
				player.shipNumber++;
			}
		}
	}

	// check the length and array for the ships
	// console.log( 'playerOneShips 1 length: ', playerOne.ships[ 0 ].length );

	if ( playerOne.turn && ( totalShips( playerOne ) === TOTALHITS ) ) {
		clearTiles();
		nextPlayerTurn();
	} 

	// check to see if two humans are playing or human v computer
	if ( playerTwo.turn ) {
		if ( twoHumans ) {
			totalShips( playerTwo ) === TOTALHITS ? beginBattle() : ""
		} else {
			computerSelectTiles();
		}
	}

}

// FUNCTION TO SEE IF A SHIP HAS BEEN SUNK
function checkIfShipSunk( hitArray ){
	var count = 0,
		alertCount = 0,
		currentPlayer = getCurrentPlayer(),
		otherPlayer = getPassivePlayer();

	// function to see if the ship is sunk
	if ( hitArray.length >= SHIPLENGTH ) { 

		for( var i = 0; i < SHIPS; i++ ){
			for ( var j = 0; j < hitArray.length; j++ ){
				if ( otherPlayer.ships[ i ].includes( hitArray[ j ] ) ){
					count++;
				}
			}
			if ( count === SHIPLENGTH ){
				alertCount++;
			}
			// reset per ship loop
			count = 0;

			if ( alertCount - currentPlayer.counter > 0 ){
				// console.log( "alertCount ", alertCount );
				alert( "A ship has been sunk!" );
				lastMove.innerHTML = "Player " + ( currentPlayer === playerOne ? "1" : "2" ) + " has sunk a ship"; 
				currentPlayer.counter++;
				
			}
		}
	}
}


// THIS IS WHEN THE "GUESSING" PORTION OF THE GAME BEGINS
// passing either clicked tile or computer
function guessTile( e, id ){
	var guessed = e ? e.path[ 0 ] : id.toString(),
		guessedId = e ? guessed.id : id.toString(),
		square = document.getElementById( guessedId ),
		isInEnemyArray = false,
		currentPlayer = getCurrentPlayer(),
		otherPlayer = getPassivePlayer();

	// push to guess array
	if ( guessedId !== "battleship-board" ){

		for ( var i = 0; i < SHIPS; i++ ){
			if ( otherPlayer.ships[ i ].includes( guessedId ) ){
				isInEnemyArray = true;
			}
		}

		if ( isInEnemyArray ){
			lastMove.innerHTML = "Player " + ( currentPlayer === playerOne ? "1" : "2" ) + " has hit a ship"; 
			currentPlayer.hits.push( guessedId );
			currentPlayer.guesses.push( guessedId );
			square.classList.add( "hit" );
			checkIfShipSunk( currentPlayer.hits );
		} else { 	
			lastMove.innerHTML = "Player " + ( currentPlayer === playerOne ? "1" : "2" ) + " has missed";
			currentPlayer.guesses.push( guessedId );
			square.classList.add( "guessed" );
		}

		gameboard.removeEventListener( "click", guessTile );

		setTimeout(function() { 
			nextPlayerTurn()
			clearTiles()
			showPlayerBoard()
		}, secondsDelay ); 
	}

	// conditional to see if the user has won a game
	playerOne.hits.length === TOTALHITS || playerTwo.hits.length === TOTALHITS ? ( alert( "Congrats Player" + ( playerOne.hits.length === TOTALHITS ? " 1, " : " 2, " ) + "you have won!" ), setTimeout( resetGame, secondsDelay ) ) : "";
	
}


// 
// THESE FUNCTIONS ARE USED IN CONGRUENCE WITH THE COMPUTER RANDOM SELECTION
// 

// FOR SIMPLICITY, FORCE USER TO ONLY SELECT THE TILES CLOSEST IN UP, DOWN, LEFT, OR RIGHT DIRECTION
// if x or y is below 0 or above the column/row width, do not add to the array
function createAcceptableArray( id ){
	acceptableArray = [];

	let num = id.split( "" ),
		x = Number( num[ 0 ] ),
		y = Number( num[ 1 ] );
		
	y - 1 < 0 ? "" : acceptableArray.push( ( x ).toString() + ( y - 1 ).toString() );
	y + 1 >= COLUMNS ? "" : acceptableArray.push( ( x ).toString() + ( y + 1 ).toString() );
	x - 1 < 0 ? "" : acceptableArray.push( ( x - 1 ).toString() + ( y ).toString() );
	x + 1 >= ROWS ? "" : acceptableArray.push( ( x + 1 ).toString() + ( y ).toString() );
}


// THIS FUNCTION IS CREATED AFTER 2 VALUES HAVE BEEN SELECTED FOR A BATTLESHIP
// after 2 consecutive tiles are selected, this allows user to pick one that is next in line in either direction
function newAcceptableArray( id ){
	// reset the arrays
	acceptableArray = [];
	updatedArray = [];

	let xArr = [],
		yArr = [];

	for ( var i = 0; i < id.length; i++ ){
		let num = id[ i ].split( "" );
		xArr.push( Number( num[ 0 ] ) );
		yArr.push( Number( num[ 1 ] ) );
	}

	// compare x values and see if it's on the same row
	if ( xArr[ 0 ] === xArr[ 1 ] ){
		var x = xArr[ 0 ].toString();
		yArr.sort( function( a, b ){ return a - b } );
		// if below min or too high, skip. else, add to array
		yArr[ 0 ] - 1 < 0 ? "" : updatedArray.push( x + ( yArr[ 0 ] - 1 ).toString() );
		yArr[ yArr.length - 1 ] + 1 >= ROWS ? "" : updatedArray.push( x + ( yArr[ yArr.length - 1 ] + 1 ).toString() );
	}

	// compare y values and see if it's on the same column
	if ( yArr[ 0 ] === yArr[ 1 ] ){
		var y = yArr[ 0 ].toString();
		xArr.sort( function( a, b ){ return a - b } );
		// if below min or too high, skip. else, add to array
		xArr[ 0 ] - 1 < 0 ? "" : updatedArray.push( ( xArr[ 0 ] - 1 ).toString() + y );
		xArr[ xArr.length - 1 ] + 1 >= COLUMNS ? "" : updatedArray.push( ( xArr[ xArr.length - 1 ] + 1 ).toString() + y );


		// TO GET ALL THE POSSIBLE VALUES OUT OF ORDER
		// for ( var i = 0; i < ( SHIPLENGTH - 1 ); i++ ){
		// 	var min = ( xArr[ 0 ] - i ).toString(),
		// 		max = ( xArr[ 1 ] + i ).toString();
			// updatedArray.push( ( min + y );
			// updatedArray.push( ( max + y );
		// }
	}

	// console.log( 'updatedArray ', updatedArray );
}


function checkIfValidTile( tileId, shipArray ){

	if( shipArray.length >= 2 && SHIPLENGTH > 2 ){
		newAcceptableArray( shipArray );
		if ( updatedArray.includes( tileId )  ) {
			shipArray.push( tileId );
			document.getElementById( tileId ).classList.add( "selected" );
		}
	}

	if ( shipArray.length === 1 && acceptableArray.includes( tileId ) ) {
		shipArray.push( tileId );
		document.getElementById( tileId ).classList.add( "selected" );
		newAcceptableArray( shipArray );
	} 

	if ( shipArray.length === 0 ) {
		// push first variable to the array and create the acceptable array based on first selection
		shipArray.push( tileId );
		document.getElementById( tileId ).classList.add( "selected" );
		createAcceptableArray( tileId );
	}

	// console.log( "current shipArray ", shipArray );
}

// THIS FUNCTION CAN BE CALLED TO REMOVE ANY STYLING BETWEEN TURNS
function clearTiles(){
	for ( var i = 0; i < allTiles.length; i++ ) {
		allTiles[ i ].classList.remove( "selected", "guessed", "hit" );
	}
}

// FUNCTION TO GET A RANDOM TILE ID
function getRandomTile(){
	return allTiles[ Math.floor( Math.random() * allTiles.length ) ].id;
}


// COMPUTER TILE SELECTION
function computerSelectTiles(){
	let random = getRandomTile();

	for ( var i = 0; i < SHIPS; i++ ){
		if( i > 0 ) {
			// reassign random to new number. if in first ship array, get another random number
			random = getRandomTile();
			if ( playerTwo.ships[ 0 ].includes( random ) ){
				random = getRandomTile();
			}
		}
		checkIfValidTile( random, playerTwo.ships[ i ] );
		checkIfValidTile( acceptableArray[ Math.floor( Math.random() * acceptableArray.length ) ], playerTwo.ships[ i ] );
		checkIfValidTile( updatedArray[ Math.floor( Math.random() * updatedArray.length ) ], playerTwo.ships[ i ] );
	}

	// if ships selected, start game
	totalShips( playerTwo ) === ( TOTALHITS ) ? beginBattle() : "";
}


// COMPUTER GUESS FUNCTION. GET A RANDOM TILE AND IF NOT IN THE COMPUTER GUESS ARRAY, GUESS IT.
function computerGuess(){
	if ( gameHasStarted === true ){
		let random = getRandomTile();
		if ( !computerGuessArray.includes( random ) ){
			computerGuessArray.push( random );
			guessTile( null, random );
		} else {
			// guess again if already guessed
			computerGuess();
		}
	}
}


// 
// GAMEPLAY FUNCTIONS
// 

// THIS FUNCTION TOGGLES BETWEEN PLAYER 1 AND PLAYER 2
function nextPlayerTurn(){
	playerOne.turn ^= true;
	playerTwo.turn ^= true;

	// reset for tile selection
	gameHasStarted ? gameboard.addEventListener( "click", guessTile ) : "";

	// if player 1's turn - alert them
	// if versus computer, alert that it is computer's turn
	playerOne.turn ? message.innerHTML = "Player 1 turn" : ( twoHumans ? message.innerHTML = "Player 2 turn" : ( ( message.innerHTML = "Computer's turn" ), computerGuess() ) )
}

// THIS FUNCTION RESETS THE GAME AND CLEARS ALL OBJECT DATA
function resetGame(){
	for ( var i = 0; i < SHIPS; i++ ){
		playerOne.ships[ i ] = [];
		playerTwo.ships[ i ] = [];
	}

	playerOne.guesses = [];
	playerOne.hits = [];
	playerOne.shipNumber = 0;
	playerOne.counter = 0;
	playerOne.turn = true;

	playerTwo.guesses = [];
	playerTwo.hits = [];
	playerTwo.shipNumber = 0;
	playerTwo.counter = 0;
	playerTwo.turn = false;

	message.innerHTML = "Let's start. Please begin by selecting " + SHIPLENGTH + " tiles each for your " + SHIPS + " battleships";
	lastMove.innerHTML = "--";
	gameHasStarted = false;
	gameboard.addEventListener( "click", selectTile );
	gameboard.removeEventListener( "click", guessTile );
	clearTiles();
	// console.log( 'reset game being called' );
}

// THIS FUNCTION OFFICIALLY STARTS THE GAME
// clear the tiles, set back to player 1 and change the board to blank canvas
function beginBattle(){
	alert( "Let's start the game" );
	gameHasStarted = true;
	clearTiles();
	nextPlayerTurn();
	// remove the event listener for selectTile and add guessTile listener
	gameboard.removeEventListener( "click", selectTile );
	gameboard.addEventListener( "click", guessTile );
};


// SHOW THE BOARD FROM THE PREVIOUS ROUND
function showPlayerBoard(){
	if ( playerOne.turn ){
		// show the guessed spots for playerOne
		for ( var i = 0; i < playerOne.guesses.length; i++ ){
			document.getElementById( playerOne.guesses[i] ).classList.add( "guessed" );
		}
		// show the hit spots for playerOne
		for ( var i = 0; i < playerOne.hits.length; i++ ){
			document.getElementById( playerOne.hits[i] ).classList.add( "hit" );
		}
	} else {
		// show the guessed spots for playerTwo
		for ( var i = 0; i < playerTwo.guesses.length; i++ ){
			document.getElementById( playerTwo.guesses[i] ).classList.add( "guessed" );
		}
		// show the hit spots for playerOne
		for ( var i = 0; i < playerTwo.hits.length; i++ ){
			document.getElementById( playerTwo.hits[i] ).classList.add( "hit" );
		}
	}

	// if computer's turn to select, remove the guessTile ability
	!twoHumans && playerTwo.turn ? gameboard.removeEventListener( "click", guessTile ) : gameboard.addEventListener( "click", guessTile ) 
}


// CALL ONCE TO START THE GAME
resetGame();