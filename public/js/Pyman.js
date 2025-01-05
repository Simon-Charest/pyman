import Character from './Character.js';

export default class PacMan extends Character
{
	constructor(name, color, diameter, i, j, left, up, right, down)
	{
		super(name, color, diameter, i, j);
		
		// Set class constants
	
		this.left			= left;
		this.up				= up;
		this.right			= right;
		this.down			= down;
		
		this.speed			= this.diameter / 6;
		this.pacDot			= 0;	// Pac-dots eaten
		this.powerPellet	= 0;	// Power pellets eaten
		this.fruit			= 0;	// Fruits eaten
		this.bump			= 0;	// Bumps in other pac-men
		this.clear			= 0;	// Last pac-dot eaten
		this.roundWon		= 0;	// Rounds won
		this.gameWon		= 0;	// Games won
	}

	isColliding(character)
	{
		var distance = Math.sqrt(Math.pow((this.x - character.x), 2) + Math.pow((this.y - character.y), 2));
		
		if(distance < Math.floor((this.diameter + character.diameter) / 2))
		{
			return(true);
		}
		
		return(false);
	}
	
	doBump()
	{
		switch(this.direction)
		{
			case this.left:
				this.direction = this.right;
			break;
			
			case this.up:
				this.direction = this.down;
			break;
			
			case this.right:
				this.direction = this.left;
			break;
			
			case this.down:
				this.direction = this.up;
			break;
			
			default:
				var directions = [this.left, this.up, this.right, this.down];
				
				this.direction = directions[Math.floor(Math.random()* directions.length)];
		}
		
		this.bump ++;
		this.play(this.SOUND_BUMP);
	}
	
	draw()
	{
		var mouthSize		= 0.1;
		var frame			= (timer * mouthSize);
		var r				= Math.floor(this.radius * this.size);
		var startingAngle;
		var endingAngle;
		
		// Draw Pac-Man's body and mouth
		this.context.beginPath();
		
		switch(this.direction)
		{
			case this.left:
				startingAngle	= 1 * frame + 1 * Math.PI;
				endingAngle		= -1 * frame + 1 * Math.PI;
			break;
			
			case this.up:
				startingAngle	= 1 * frame + 1.5 * Math.PI;
				endingAngle		= -1 * frame  + 1.5 * Math.PI;
			break;
			
			case this.right:
				startingAngle	= 1 * frame + 0 * Math.PI;
				endingAngle		= -1 * frame + 2 * Math.PI;
			break;
			
			case this.down:
				startingAngle	= 1 * frame + 0.5 * Math.PI;
				endingAngle		= -1 * frame + 0.5 * Math.PI;
			break;
			
			default:
				startingAngle	= 0 * Math.PI;
				endingAngle		= 2 * Math.PI;
		}
		
		this.context.arc(this.x, this.y, r, startingAngle, endingAngle);
		this.context.lineTo(this.x, this.y);
		this.context.fillStyle = this.color;
		this.context.fill();
	}
	
	doKill()
	{
		super.doKill();
		this.play(this.SOUND_KILL);
	}
	
	die()
	{
		super.die();
		this.play(this.SOUND_DEATH);
	}
}
