// Global constants initialization

// Stage
const CANVAS	= 'stage';

// Draw / gameplay
const SPEED		= 30;	// Refresh rate of the draw function, in milliseconds
const SIZE		= 24;	// Tile size

// Yellow Pac-Man
const LEFT		= 37;
const UP		= 38;
const RIGHT		= 39;
const DOWN		= 40;

// Pink Pac-Man
const A			= 65;	// left
const W			= 87;	// up
const D			= 68;	// right
const S			= 83;	// down

// Blue Pac-Man
const J			= 74;	// left
const I			= 73;	// up
const L			= 76;	// right
const K			= 75;	// down

// Red Pac-Man
const F			= 70;	// left
const T			= 84;	// up
const H			= 72;	// right
const G			= 71;	// down

// *****************************************************************************

// Global variables initialization

// Stage / gameplay
var timer	= 1;												// Set game loop timer
var debug	= document.location.href.indexOf('debug=1') > -1;	// 1=true, 0=false

// Characters
var ghosts		= [];
var pymen		= [];
var deadPymen	= [];

var url = getURL();

// *****************************************************************************

function getURL()
{
	var get = {};
					
	location.search.substr(1).split('&').forEach
	(
		function(url)
		{
			var value = url.split('=');
			
			get[value[0]] = value[1];
		}
	);
	
	return(get);
}

// Global function which works pretty much like an enum
function getKey(value)
{
	switch(value)
	{
		case 37:
			return('LEFT');
		break;
		
		case 38:
			return('UP');
		break;
		
		case 39:
			return('RIGHT');
		break;
		
		case 40:
			return('DOWN');
		break;
	}
}

// Capture keystroke
function onKeyDown(e)
{
	for(var p = 0; p < pymen.length; p ++)
	{
		pymen[p].setDirection(e.keyCode);
	}
}

// Capture touch event
function touch(keyCode)
{
	switch(keyCode)
	{
		case LEFT:
		case UP:
		case RIGHT:
		case DOWN:
			pymen[0].setDirection(keyCode);
		break;
	}
}

function displayScore()
{
	var score = "<table class='center'>";
	
	for(var p = 0; p < deadPymen.length; p ++)
	{
		score += '<tr>';
		score += '<th colspan="2">' + deadPymen[p].name + '</th>';
		score += '</tr>';
		
		score += '<tr>';
		score += '<td>pacDot</td>';
		score += '<td>' + deadPymen[p].pacDot + '</td>';
		score += '</tr>';
		
		score += '<tr>';
		score += '<td>powerPellet</td>';
		score += '<td>' + deadPymen[p].powerPellet + '</td>';
		score += '</tr>';
	}
	
	score += '</table>';
	
	$("#score").html(score);
}

function showLevelProperties()
{
	var temp;
	
	for(var s = 0; s < stages.length; s ++)
	{
		temp = new Stage(stages[s], CANVAS);
		
		console.log
		(
			'stage[' + s + ']='
			+ '{'
			+ 'c:' + temp.columns
			+ ',r:' + temp.rows
			+ ',w:' + temp.walls.length
			+ ',f:' + temp.floors.length
			+ ',c*w:' + temp.columns * temp.rows
			+ ',w%:' + (temp.walls.length / (temp.walls.length + temp.floors.length) * 100).toFixed(1) + '%'
			+ '}'
		);
	}
}
