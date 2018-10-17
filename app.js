const rows = 5;
const columns = 5;
const shipLength = 3;

var board = document.getElementById( 'battleship-board' );
var allTiles = [];

PlayerOne = {
	ships: [ '00'],
	guesses: [ '01' ],
	hits: [ '02' ],
}

PlayerTwo = {
	ships: [],
	guesses: [],
	hits: [],
}

// array for where the ships are selected
p1Ships = [];
p2Ships = [];

// array for selected ones
p1Guessed = [];
p2Guessed = [];

// array for correctly guessed ones
p1Hits = [];
p2Hits = [];

// check to see who's turn it is
p1Turn = true;
p2Turn = false;

// set the variable for whether or not two humans are playing
var twoHumans = true;

// based on the number of rows and columns, we will loop through and create our board
// immediately invoke this function and separate namespace just in case
( function(){
	for ( var i = 0; i < rows; i++ ) {
		for ( var j = 0; j < columns; j++ ) {
			var square = document.createElement( 'div' );
			square.classList.add( 'tiles' );
			square.setAttribute( 'id', i.toString() + j.toString() );
			board.appendChild( square );
			allTiles.push( square );
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

	// we have access to the id of this element, so push to the array and cap at 6
	// capping the id length prevents the board id itself from being pushed to the array
	if ( selected.id.length === 2 ){
		p1Turn ? playerOne.ships.push( selected.id ) : playerTwo.ships.push( selected.id )
	}

	// check the length and array for the ships
	// console.log( 'p1Ships: ', p1Ships );
	// console.log( 'p2Ships: ', p2Ships );

	// check if it is Player 1's turn
	if ( p1Turn && p1Ships.length === ( shipLength * 2 ) ) {
		clearTiles();
		nextPlayerTurn();
	} 

	// check to see if two humans are playing or human v computer
	if ( p2Turn ) {
		if ( twoHumans ) {
			p2Ships.length === (shipLength * 2) ? beginBattle() : ''
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
			( p2Ships.includes( guessedId ) ? 
				( alert( 'p1 hit' ), p1Hits.push( guessedId ), p1Guessed.push( guessedId ) ) : 
				( alert( 'p1 miss' ), p1Guessed.push( guessedId ) ) )
			: 
			( p1Ships.includes( guessedId ) ? 
				( alert( 'p2 hit' ), p2Hits.push( guessedId ), p2Guessed.push( guessedId ) ) : 
				( alert( 'p2 miss' ), p2Guessed.push( guessedId ) )
			);
		// p1Turn ? ( p1Guessed.push( guessed.id ), findMatch( p2Ships, p1Guessed, p1Hits ) ) : ( p2Guessed.push( guessed.id ), findMatch( p1Ships, p2Guessed, p2Hits ) )
	}

	guessed.classList.add( 'guessed' );

	console.log( p1Guessed );
	console.log( p1Hits );


	nextPlayerTurn();
	clearTiles();
	showBoard();
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

	p1Turn ? alert( 'player 1 turn' ) : ( twoHumans ? alert( 'player 2 turn' ) : ( alert( 'computer turn' ), computerSelect() ) );
}


// this function officially starts the game - clear the tiles, set back to player 1 and change the board to new
function beginBattle(){
	alert( "let's start the game" );
	clearTiles();
	nextPlayerTurn();

	// remove the event listener for selectTile and add 
	board.removeEventListener( 'click', selectTile );
	board.addEventListener( 'click', guessTile );
}


function computerSelect(){
	console.log( "?" );
}

function showBoard(){
	console.log( 'p1Guessed ', p1Guessed );
	if ( p1Turn ){
		for ( var i = 0; i < p1Guessed.length; i++ ){
			var selected = document.getElementById( p1Guessed[i] );
			selected.classList.add( 'guessed' );
		}
		for ( var i = 0; i < p1Hits.length; i++ ){
			var selected = document.getElementById( p1Hits[i] );
			selected.classList.add( 'hit' );
		}
	} else {
		for ( var i = 0; i < p2Guessed.length; i++ ){
			var selected = document.getElementById( p2Guessed[i] );
			selected.classList.add( 'guessed' );
		}
		for ( var i = 0; i < p2Hits.length; i++ ){
			var selected = document.getElementById( p2Hits[i] );
			selected.classList.add( 'hit' );
		}
	}
}


var findMatch = function( haystack, arr, newarr ) {
    return arr.some( function( v ) {
        haystack.indexOf( v ) >= 0 ? newarr.push(v) : false;
    });
};

// random element within the array
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)]
};


// check the diff
Array.prototype.diff = function(arr) {
    var ret = [];
    this.sort();
    arr.sort();

    for( var i = 0; i < this.length; i += 1 ) {
        if( arr.indexOf( this[ i ] ) > -1 ){
            ret.push( this[ i ] );
        }
    }
    return ret;
};




