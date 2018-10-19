//
// SET THE CONSTANTS THAT CAN CHANGE AND SCALE WITH THE GAME
//
const ROWS = 6;
const COLUMNS = 6;
const SHIPS = 2;
const SHIPLENGTH = 2;
const TOTALHITS = SHIPLENGTH * SHIPS;

var gameboard = document.getElementById( 'battleship-board' ),
	message = document.getElementById( 'message' ),
	lastMove = document.getElementById( 'last-move' ),
	allTiles = [],
	// set the variable for whether or not two humans are playing
	twoHumans = true,
	// set this variable for tile validation
	hasBeenReset = false,
	gameHasStarted = false,
	acceptableArray = [],
	updatedArray = [];

// CREATE THE PLAYER OBJECT
function Player( ships, guesses, hits, turn ){
    this.ships = {
    	0: [],
    	1: []
    };
    this.guesses = [];
    this.hits = [];
    this.turn = true;
}


// (function(){
// 	for ( var i = 0; i < SHIPS; i++ ){
// 		var rays = [];
// 		i = rays.label;
// 		[] = rays.value;
// 		rays.push( Player.ships[ i ] );
// 	}
// }()); 

var playerOne = new Player();
var playerTwo = new Player();

// 
// CREATE THE BOARD
// 
// based on the number of rows and columns, we will loop through and create our board
// immediately invoke this function and separate namespace
( function(){
	for ( var i = 0; i < ROWS; i++ ) {
		for ( var j = 0; j < COLUMNS; j++ ) {
			var square = document.createElement( 'div' );
			square.classList.add( 'tiles' );
			square.setAttribute( 'id', i.toString() + j.toString() );
			gameboard.appendChild( square );
		}
		// add a break every set # for a new row
		gameboard.innerHTML += '<br/>';
	}
	// add our board event listener to see which tiles have been clicked
	gameboard.addEventListener( 'click', selectTile );
}() );

// check all tiles are there
// console.log(allTiles);


function selectGameType( e ){
	console.log( e );
}



// 
// SET UP AND TILE FUNCTIONS
// 

// now that tiles have been created, create variable that allows all tiles to be accessed and selected
var allTiles = document.getElementsByClassName( 'tiles' );

// SELECT TILES TO REPRESENT BATTLESHIPS
function selectTile( e ){
	// this variable brings back the selected tile
	var selected = e.path[ 0 ];

	// we have access to the id of this element, so push to the array and cap at ship length * total no of ships
	// capping the id length prevents the board id itself from being pushed to the array and causing issues
	if ( selected.id.length === 2 ){
		// if player 1's turn, 
		playerOne.turn ? 
			// check and see if first ship selected
			( playerOne.ships[ 0 ].length < SHIPLENGTH ? 
				checkIfValidTile( selected.id, playerOne.ships[ 0 ] ) : 
				checkIfValidTile( selected.id, playerOne.ships[ 1 ], true ) 
			) : 
			( playerTwo.ships[ 0 ].length < SHIPLENGTH ? 
				checkIfValidTile( selected.id, playerTwo.ships[ 0 ] ) : 
				checkIfValidTile( selected.id, playerTwo.ships[ 1 ], true )
			)
	}

	// check the length and array for the ships
	// console.log( 'playerOneShips 2 length: ', playerOne.ships[ 1 ].length );
	// console.log( 'playerTwoShips: ', playerTwo.ships );

	// check if it is Player 1's turn
	if ( playerOne.turn && ( playerOne.ships[ 0 ].length + playerOne.ships[ 1 ].length ) === ( SHIPLENGTH * SHIPS ) ) {
		clearTiles();
		nextPlayerTurn();
	} 

	// check to see if two humans are playing or human v computer
	if ( playerTwo.turn ) {
		if ( twoHumans ) {
			( playerTwo.ships[ 0 ].length + playerTwo.ships[ 1 ].length ) === ( SHIPLENGTH * SHIPS ) ? beginBattle() : ''
		} else {
			computerSelectTiles();
		}
	}

}

function checkIfShipSunk( hitArray ){
	if ( playerOne.turn ) {
		for( var i = 0; i < SHIPS; i++ ){
			console.log( 'p2 index ', playerTwo.ships[ i ].indexOf( val ) );
			hitArray.length >= playerTwo.ships[ i ].length ? ( hitArray.every( function( val ){ return playerTwo.ships[ i ].indexOf( val ) === -1 }) ? alert( 'ship sunk for player 2' ) : '' ) : '';
		}
	} else {
		for( var i = 0; i < SHIPS; i++ ){
			console.log( 'p1 index ', playerOne.ships[ i ].indexOf( val ) );
			hitArray.length >= playerOne.ships[ i ].length ? ( hitArray.every( function( val ){ return playerOne.ships[ i ].indexOf( val ) === -1 }) ? alert( 'ship sunk for player 1' ) : '' ) : '';
		}
	}
}


// THIS IS WHEN THE "GUESSING" PORTION OF THE GAME BEGINS
function guessTile( e, id ){
	var guessed = e ? e.path[ 0 ] : id.toString(),
		guessedId = e ? guessed.id : id.toString(),
		square = document.getElementById( guessedId );

	// push to guess array
	if ( guessedId.length === 2 ){
		// This is the big conditional to see if the player has hit or missed.
		playerOne.turn ? 
			( playerTwo.ships[ 0 ].includes( guessedId ) || playerTwo.ships[ 1 ].includes( guessedId ) ? 
				( 	lastMove.innerHTML = 'playerOne hit', 
					playerOne.hits.push( guessedId ),
					playerOne.guesses.push( guessedId ),
					square.classList.add( 'hit' ),
					checkIfShipSunk( playerOne.hits )
				) : 
				( 	lastMove.innerHTML = 'playerOne miss', 
					playerOne.guesses.push( guessedId ),
					square.classList.add( 'guessed' )
				) )
			: 
			( playerOne.ships[ 0 ].includes( guessedId ) || playerOne.ships[ 1 ].includes( guessedId ) ? 
				( 	lastMove.innerHTML = 'playerTwo hit', 
					playerTwo.hits.push( guessedId ), 
					playerTwo.guesses.push( guessedId ),
					square.classList.add( 'hit' ),
					checkIfShipSunk( playerTwo.hits )
				) : 
				( 	lastMove.innerHTML = 'playerTwo miss', 
					playerTwo.guesses.push( guessedId ),
					square.classList.add( 'guessed' )
				)
			);

		gameboard.removeEventListener( 'click', guessTile );

		// !PlayerTwo.some(function(val) { return PlayerOne.indexOf(val) === -1 });

		setTimeout( nextPlayerTurn, 3000 );
		setTimeout( clearTiles, 3000 );
		setTimeout( showBoard, 3000 ); 
	}

	// conditional to see if the user has won a game
	playerOne.hits.length === TOTALHITS || playerTwo.hits.length === TOTALHITS ? ( alert( 'Congrats player' + ( playerOne.hits.length === TOTALHITS ? ' one, ' : ' two, ' ) + 'you have won!' ), resetGame() ) : '';
	
}


// 
// THESE FUNCTIONS ARE USED IN CONGRUENCE WITH THE COMPUTER RANDOM SELECTION
// 

// FOR SIMPLICITY, FORCE USER TO ONLY SELECT THE TILES CLOSEST IN UP, DOWN, LEFT, OR RIGHT DIRECTION
function createAcceptableArray( id ){
	acceptableArray = [];

	let idd = id.split( "" ),
		x = Number( idd[ 0 ] ),
		y = Number( idd[ 1 ] );
		
	y - 1 < 0 ? '' : acceptableArray.push( ( x ).toString() + ( y - 1 ).toString() );
	y + 1 >= COLUMNS ? '' : acceptableArray.push( ( x ).toString() + ( y + 1 ).toString() );
	x - 1 < 0 ? '' : acceptableArray.push( ( x - 1 ).toString() + ( y ).toString() );
	x + 1 >= ROWS ? '' : acceptableArray.push( ( x + 1 ).toString() + ( y ).toString() );

	// console.log( 'acceptableArray ', acceptableArray );

	// THIS FUNCTION TO GET ALL THE ACCEPTABLE SQUARES WITHIN RANGE
	// for ( var i = 0; i < SHIPLENGTH; i++ ){
	// 	xMinus = y - i < 0 ? 0 : y - i;
	// 	// call the const columns here
	// 	xPlus = y + i > COLUMNS ? COLUMNS : y + i;
	// 	yMinus = x - i < 0 ? 0 : x - i;
	// 	// call the const rows here
	// 	yPlus = x + i > ROWS ? ROWS : x + i;

	// 	acceptableArray.push( ( x ).toString() + xMinus.toString() );
	// 	acceptableArray.push( ( x ).toString() + xPlus.toString() );
	// 	acceptableArray.push( yMinus.toString() + ( y ).toString() );
	// 	acceptableArray.push( yPlus.toString() + ( y ).toString() );
	// }
}


// THIS FUNCTION IS CREATED AFTER 2 VALUES HAVE BEEN SELECTED FOR A BATTLESHIP
function newAcceptableArray( id ){
	acceptableArray = [];
	updatedArray = [];
	var xArr = [],
		yArr = [];

	for ( var i = 0; i < id.length; i++ ){
		var z = id[ i ].split( "" );
		xArr.push( Number( z[ 0 ] ) );
		yArr.push( Number( z[ 1 ] ) );
	}

	// compare x values and see if it's on the same row
	if ( xArr[ 0 ] === xArr[ 1 ] ){
		var x = xArr[ 0 ].toString();
		yArr.sort( function( a, b ){ return a - b } );
		// if below min or too high, skip. else, add to array
		yArr[ 0 ] - 1 < 0 ? '' : updatedArray.push( x + ( yArr[ 0 ] - 1 ).toString() );
		yArr[ yArr.length - 1 ] + 1 >= ROWS ? '' : updatedArray.push( x + ( yArr[ yArr.length - 1 ] + 1 ).toString() );
		

		// TO GET ALL THE POSSIBLE VALUES OUT OF ORDER
		// for ( var i = 0; i < ( SHIPLENGTH - 1 ); i++ ){
			// var min = ( yArr[ 0 ] - 1 ).toString(),
			// 	max = ( yArr[ 1 ] + 1 ).toString();
			// updatedArray.push( x + min );
			// updatedArray.push( x + max );
		// }
	}

	// compare y values and see if it's on the same column
	if ( yArr[ 0 ] === yArr[ 1 ] ){
		var y = yArr[ 0 ].toString();
		xArr.sort( function( a, b ){ return a - b } );
		// if below min or too high, skip. else, add to array
		xArr[ 0 ] - 1 < 0 ? '' : updatedArray.push( ( xArr[ 0 ] - 1 ).toString() + y );
		xArr[ xArr.length - 1 ] + 1 >= COLUMNS ? '' : updatedArray.push( ( xArr[ xArr.length - 1 ] + 1 ).toString() + y );


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


function checkIfValidTile( tileId, shipArray, newShip = false ){	

	// reset to clear acceptableArray and 
	if ( newShip && !hasBeenReset ) {
		acceptableArray = [];
		hasBeenReset = true;
	} 

	if( shipArray.length >= 2 && SHIPLENGTH > 2 ){
		newAcceptableArray( shipArray );
		if ( updatedArray.includes( tileId ) ) {
			shipArray.push( tileId );
			document.getElementById( tileId ).classList.add( 'selected' );
		}
	}

	if ( shipArray.length === 1 && acceptableArray.includes( tileId ) ) {
		shipArray.push( tileId );
		document.getElementById( tileId ).classList.add( 'selected' );
		newAcceptableArray( shipArray );
	} 

	if ( shipArray.length === 0 ) {
		// push first variable to the array and create the acceptable array based on first selection
		shipArray.push( tileId );
		document.getElementById( tileId ).classList.add( 'selected' );
		createAcceptableArray( tileId );
	}

	// console.log( 'current shipArray ', shipArray );
}

// THIS FUNCTION CAN BE CALLED TO REMOVE ANY STYLING BETWEEN TURNS
function clearTiles(){
	for ( var i = 0; i < allTiles.length; i++ ) {
		allTiles[ i ].classList.remove( 'selected', 'guessed', 'hit' );
	}
}

function getRandomTile(){
	return allTiles[ Math.floor( Math.random() * allTiles.length ) ].id;
}


function computerSelectTiles(){
	var random = getRandomTile();
	var random2 = getRandomTile();

	random !== random2 ? '' : ( random2 = getRandomTile() );

	for ( var i = 0; i < SHIPLENGTH; i++ ){
		checkIfValidTile( random, playerTwo.ships[ i ], true );
		checkIfValidTile( acceptableArray[ Math.floor( Math.random() * acceptableArray.length ) ], playerTwo.ships[ i ] );
		checkIfValidTile( updatedArray[ Math.floor( Math.random() * updatedArray.length ) ], playerTwo.ships[ i ] );
		hasBeenReset = false;
	}

	( playerTwo.ships[ 0 ].length + playerTwo.ships[ 1 ].length ) === ( SHIPLENGTH * SHIPS ) ? beginBattle() : '';
}


function computerGuess(){
	let random_arr = [];

	if ( gameHasStarted === true ){
		var random = getRandomTile();
		if ( !random_arr.includes( random ) ){
			guessTile( null, random );
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
	hasBeenReset = false;
	gameHasStarted ? gameboard.addEventListener( 'click', guessTile ) : '';

	// if player 1's turn - alert them
	// if versus computer, alert that it is computer's turn
	playerOne.turn ? message.innerHTML = 'player 1 turn' : ( twoHumans ? message.innerHTML = 'player 2 turn' : ( ( message.innerHTML = 'computer turn' ), computerGuess() ) )
}

// THIS FUNCTION RESETS THE GAME AND CLEARS ALL OBJECT DATA
function resetGame(){
	for ( var i = 0; i < SHIPS; i++ ){
		playerOne.ships[ i ] = [];
		playerTwo.ships[ i ] = [];
	}
	playerOne.guesses = [];
	playerOne.hits = [];
	playerOne.turn = true;
	playerTwo.guesses = [];
	playerTwo.hits = [];
	playerTwo.turn = false;
	gameHasStarted = false;
	gameboard.addEventListener( 'click', selectTile );
	gameboard.removeEventListener( 'click', guessTile );
	message.innerHTML = "Let's start. Please begin by selecting " + TOTALHITS + " tiles (" + SHIPLENGTH + " tiles per battleship)";
	lastMove.innerHTML = '--';
	clearTiles();
}

// THIS FUNCTION OFFICIALLY STARTS THE GAME
// clear the tiles, set back to player 1 and change the board to blank canvas
function beginBattle(){
	alert( "let's start the game" );
	gameHasStarted = true;
	clearTiles();
	nextPlayerTurn();
	// remove the event listener for selectTile and add guessTile listener
	gameboard.removeEventListener( 'click', selectTile );
	gameboard.addEventListener( 'click', guessTile );
};


// SHOW THE BOARD FROM THE PREVIOUS ROUND
function showBoard(){
	if ( playerOne.turn ){
		// show the guessed spots for playerOne
		for ( var i = 0; i < playerOne.guesses.length; i++ ){
			document.getElementById( playerOne.guesses[i] ).classList.add( 'guessed' );
		}
		// show the hit spots for playerOne
		for ( var i = 0; i < playerOne.hits.length; i++ ){
			document.getElementById( playerOne.hits[i] ).classList.add( 'hit' );
		}
	} else {
		// show the guessed spots for playerTwo
		for ( var i = 0; i < playerTwo.guesses.length; i++ ){
			document.getElementById( playerTwo.guesses[i] ).classList.add( 'guessed' );
		}
		// show the hit spots for playerOne
		for ( var i = 0; i < playerTwo.hits.length; i++ ){
			document.getElementById( playerTwo.hits[i] ).classList.add( 'hit' );
		}
	}

	twoHumans ? '' : ( playerTwo.turn ? gameboard.removeEventListener( 'click', guessTile ) : gameboard.addEventListener( 'click', guessTile ) )
}

// APPLY RANDOM ELEMENT TO ARRAY PROTOTYPE
Array.prototype.randomElement = function() {
    return this[ Math.floor( Math.random() * this.length ) ]
};

// CALL ONCE TO START THE GAME
resetGame();