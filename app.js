const rows = 5;
const columns = 5;
const shipLength = 3;

var board = document.getElementById( 'battleship-board' );
var message = document.getElementById( 'message' );
var lastMove = document.getElementById( 'last-move' );
// var allTiles = [];
// set the variable for whether or not two humans are playing
var twoHumans = true;

// create the player Objects
p1 = {
	ships: {
		one: [],
		two: []
	},
	guesses: [],
	hits: [],
}

p2 = {
	ships: {
		one: [],
		two: []
	},
	guesses: [],
	hits: [],
}

// check to see who's turn it is
p1Turn = true;
p2Turn = false;


// based on the number of rows and columns, we will loop through and create our board
// immediately invoke this function and separate namespace
( function(){
	for ( var i = 0; i < rows; i++ ) {
		for ( var j = 0; j < columns; j++ ) {
			var square = document.createElement( 'div' );
			square.classList.add( 'tiles' );
			square.setAttribute( 'id', i.toString() + j.toString() );
			board.appendChild( square );
			// allTiles.push( square );
		}
		// add a break every set # for a new row
		board.innerHTML += '<br/>';
	}
	// add our board event listener to see which tiles have been clicked
	board.addEventListener( 'click', selectTile );
}() );


// check all tiles are there
// console.log(allTiles);

// now that tiles have been created, create variable that allows all tiles to be access
var allTiles = document.getElementsByClassName( 'tiles' );

// select Tiles to place battleships
function selectTile( e ){
	// this variable brings back the selected tile
	var selected = e.path[ 0 ];
	selected.classList.add( 'selected' );

	// console.log( selected.id );
	// we have access to the id of this element, so push to the array and cap at ship length * 2
	// capping the id length prevents the board id itself from being pushed to the array and causing issues
	if ( selected.id.length === 2 ){
		p1Turn ? 
			( p1.ships.one.length < 3 ? checkIfValidTile( selected.id, p1.ships.one ) : checkIfValidTile( selected.id, p1.ships.two ) ) : 
			( p2.ships.one.length.length < 3 ? p2.ships.one.length.push( selected.id ) : p2.ships.two.push( selected.id ) )
	}

	// check the length and array for the ships
	// console.log( 'p1Ships 1: ', p1.ships.one.length );
	// console.log( 'p1Ships 2: ', p1.ships.two.length );
	// console.log( 'p2Ships: ', p2[ "ships" ] );

	// check if it is Player 1's turn
	if ( p1Turn && ( p1.ships.one.length + p1.ships.two.length ) === ( shipLength * 2 ) ) {
		clearTiles();
		nextPlayerTurn();
	} 

	// check to see if two humans are playing or human v computer
	if ( p2Turn ) {
		if ( twoHumans ) {
			( p2.ships.one.length + p2.ships.two.length ) === (shipLength * 2) ? beginBattle() : ''
		} else {
			computerSelect();
		}
	}

}


// This function is when the game begins
function guessTile( e ){
	var guessed = e.path[ 0 ];
	var guessedId = guessed.id;

	// push to guess array
	if ( guessedId.length === 2 ){
		// This is the big conditional to see if the player has hit or missed.
		p1Turn ? 
			( p2.ships.one.includes( guessedId ) || p2.ships.two.includes( guessedId ) ? 
				( 	lastMove.innerHTML = 'p1 hit', 
					p1.hits.push( guessedId ), 
					p1.guesses.push( guessedId ),
					guessed.classList.add( 'hit' )
				) : 
				( 	lastMove.innerHTML = 'p1 miss', 
					p1.guesses.push( guessedId ),
					guessed.classList.add( 'guessed' )
				) )
			: 
			( p1.ships.one.includes( guessedId ) || p1.ships.two.includes( guessedId ) ? 
				( 	lastMove.innerHTML = 'p2 hit', 
					p2.hits.push( guessedId ), 
					p2.guesses.push( guessedId ),
					guessed.classList.add( 'hit' )
				) : 
				( 	lastMove.innerHTML = 'p2 miss', 
					p2.guesses.push( guessedId ),
					guessed.classList.add( 'guessed' )
				)
			);

		nextPlayerTurn();
		clearTiles();
		showBoard();
	}

	// conditional to see if the user has won a game
	p1.hits.length === 6 || p2.hits.length === 6 ? ( alert( 'Congrats player' + ( p1.hits.length === 6 ? ' one, ' : ' two, ' ) + 'you have won!' ), resetGame() ) : '';
	
}


// this function can be called to remove any styling between turns
function clearTiles(){
	for ( var i = 0; i < allTiles.length; i++ ) {
		allTiles[ i ].classList.remove( 'selected', 'guessed', 'hit' );
	}
}


// this changes the turn from player 1 to player 2
function nextPlayerTurn(){
	p1Turn ^= true;
	p2Turn ^= true;

	// if player 1's turn - alert them
	// if versus computer, alert that it is computer's turn
	p1Turn ? message.innerHTML = 'player 1 turn' : ( twoHumans ? message.innerHTML = 'player 2 turn' : ( message.innerHTML = 'computer turn', computerGuess() ) )
}


function resetGame(){
	p1.ships.one = [];
	p1.ships.two = [];
	p1.guesses = [];
	p1.hits = [];
	p2.ships.one = [];
	p2.ships.two = [];
	p2.guesses = [];
	p2.hits = [];
	board.addEventListener( 'click', selectTile );
	board.removeEventListener( 'click', guessTile );
	message.innerHTML = "Let's play again. Please begin by selecting 6 tiles (3 tiles per battleship)";
	lastMove.innerHTML = '';
	p1Turn = true;
	p2Turn = false;
	clearTiles();
}

// this function officially starts the game - clear the tiles, set back to player 1 and change the board to new
function beginBattle(){
	alert( "let's start the game" );
	clearTiles();
	nextPlayerTurn();

	// remove the event listener for selectTile and add guessTile listener
	board.removeEventListener( 'click', selectTile );
	board.addEventListener( 'click', guessTile );
}


function computerSelect(){
	console.log( "?" );
}

function computerGuess(){
	console.log( "?" );
}

function checkIfValidTile( id, ship_array ){
	// console.log( 'id ' + id );
	// console.log( 'ship_array ' + ship_array );

	var idd = id.split( "" );
	var row = Number( idd[0] );
	var column = Number( idd[1] );
	console.log( "idd row ", row );
	console.log( "idd column ", column );

	row_arr = [];
	column_arr = [];

	
	ship_array.push( id );

	// console.log( 'ship_array ' + ship_array );
	return true;
}

function showBoard(){
	if ( p1Turn ){
		for ( var i = 0; i < p1.guesses.length; i++ ){
			var selected = document.getElementById( p1.guesses[i] );
			selected.classList.add( 'guessed' );
		}
		for ( var i = 0; i < p1.hits.length; i++ ){
			var selected = document.getElementById( p1.hits[i] );
			selected.classList.add( 'hit' );
		}
	} else {
		for ( var i = 0; i < p2.guesses.length; i++ ){
			var selected = document.getElementById( p2.guesses[i] );
			selected.classList.add( 'guessed' );
		}
		for ( var i = 0; i < p2.hits.length; i++ ){
			var selected = document.getElementById( p2.hits[i] );
			selected.classList.add( 'hit' );
		}
	}
}

// random element within the array
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)]
};


