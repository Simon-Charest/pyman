export default class Character
{
	constructor(name, color, diameter, i, j)
	{
		// Set class constants
		this.SOUND_BUMP			= 'snd/pyman_bump.wav';
		this.SOUND_DEATH		= 'snd/pyman_death.wav';
		this.SOUND_KILL			= 'snd/pyman_kill.wav';
		this.STAGE_COLOR_RGB	= new Uint8ClampedArray([0, 0, 255, 255]);
		this.EYEBALL_COLOR		= 'white';
		this.PUPIL_COLOR		= 'black';
		this.LEFT_EYE			= -1;
		this.RIGHT_EYE			= 1;
		
		// Set class proprieties by parameters
		this.name				= name;
		this.color				= color;
		this.diameter			= diameter;
		this.i					= i;
		this.j					= j;
		
		// Set class proprieties
		this.x					= this.i * this.diameter + this.diameter / 2;
		this.y					= this.j * this.diameter + this.diameter / 2;
		this.radius				= this.diameter / 2;
		this.speed				= this.diameter / 8;
		this.size				= 1;
		
		// Direction
		this.direction			= 0;
		this.left				= LEFT;
		this.up					= UP;
		this.right				= RIGHT;
		this.down				= DOWN
		
		// Level
		this.canvas				= document.getElementById(CANVAS);
		this.context			= this.canvas.getContext('2d');
		
		// Character's game statistics
		this.death				= 0;	// Death count
		this.kill				= 0;	// Kill count
		this.tunnel				= 0;	// Tunnel usage
	}

	setPosition(tile)
	{
		this.x	= tile[1] * this.diameter + this.radius;
		this.y	= tile[0] * this.diameter + this.radius;
	}
	
	setDirection(direction)
	{
		switch(direction)
		{
			// If direction is correct...
			case this.left:
			case this.up:
			case this.right:
			case this.down:
			
				// Set direction
				this.direction = direction;
				
			break;
		}
	}
	
	getLegalMove()
	{
		var validDirection = [];
		var d;
		
		switch(this.direction)
		{
			case this.left:
				validDirection	= [LEFT, UP, DOWN];
			break;
			
			case this.up:
				validDirection	= [LEFT, UP, RIGHT];
			break;
			
			case this.right:
				validDirection	= [UP, RIGHT, DOWN];
			break;
			
			case this.down:
				validDirection	= [LEFT, RIGHT, DOWN];
			break;
			
			default:
				validDirection	= [LEFT, UP, RIGHT, DOWN];
		}
		
		for(d = 0; d < validDirection.length; d ++)
		{
			if(this.isBlocked(validDirection[d]))
			{
				validDirection.splice(validDirection.indexOf(d), 1);
			}
		}
		
		var randomDirection = validDirection[Math.floor(Math.random() * validDirection.length)];
		
		return(randomDirection);
	}
	
	isIntersection()
	{
		switch(this.direction)
		{
			// If the character is moving horizontally...
			case this.left:
			case this.right:
			
				// Check if the character can move either up or down...
				if(!this.isBlocked(this.up) || !this.isBlocked(this.down))
				{
					return(true);
				}
				
			break;
			
			// If the character is moving vertically...
			case this.up:
			case this.down:
			
				// Check if the character can move either left or right...
				if(!this.isBlocked(this.left) || !this.isBlocked(this.right))
				{
					return(true);
				}
				
			break;
			
			default:
				return(true);
		}
		
		return(false);
	}
	
	isBlocked(direction)
	{
		var x	= this.x;
		var y	= this.y;
		
		// If direction is not defined...
		if(typeof(direction) == 'undefined')
		{
			// Set default direction
			direction = this.direction;
		}
		
		// Get the tile that is half a character away, in the given direction
		switch(direction)
		{
			case this.left:
				x -= this.radius;
			break;
			
			case this.up:
				y -= this.radius;
			break;
			
			case this.right:
				x += this.radius;
			break;
			
			case this.down:
				y += this.radius;
			break;
		}
		
		// Get tile's information
		var data = this.context.getImageData(x, y, 1, 1).data;
		
		// Evaluate whether or not the tile is blocked 
		var value =
		(
			data[0] == this.STAGE_COLOR_RGB[0]
			&& data[1] == this.STAGE_COLOR_RGB[1]
			&& data[2] == this.STAGE_COLOR_RGB[2]
			&& data[3] == this.STAGE_COLOR_RGB[3]
		);
		
		// Return whether or not the tile is blocked
		return(value);
	}
	
	move()
	{
		if(!this.isBlocked(this.direction))
		{
			switch(this.direction)
			{
				case this.left:
					this.x -= this.speed;
				break;
				
				case this.up:
					this.j --;
					this.y -= this.speed;
				break;
				
				case this.right:
					this.i ++;
					this.x += this.speed;
				break;
				
				case this.down:
					this.j ++;
					this.y += this.speed;
				break;
			}
			
			this.i	= Math.round((this.x - this.radius) / this.diameter);
			this.j	= Math.round((this.y - this.radius) / this.diameter);
			
			this.manageTunnel();
		}
		
		// Redraw character
		this.draw();
	}
	
	manageTunnel()
	{
		if(this.x < 0)
		{
			this.tunnel ++;
			this.x = this.canvas.width;
		}
		
		else if(this.x > this.canvas.width)
		{
			this.tunnel ++;
			this.x = 0;
		}
		
		if(this.y < 0)
		{
			this.tunnel ++;
			this.y = this.canvas.height;
		}
		
		else if(this.y > this.canvas.height)
		{
			this.tunnel ++;
			this.y = 0;
		}
	}
	
	// PreloadJS Module (http://createjs.com/docs/preloadjs/modules/PreloadJS.html)
	// SoundJS Module (http://createjs.com/docs/soundjs/modules/SoundJS.html)
	play(sound)
	{
		var queue = new createjs.LoadQueue();
		queue.installPlugin(createjs.Sound);
		queue.on('complete', handleComplete, this);
		queue.loadFile({id:'sound', src:sound});
		
		function handleComplete()
		{
			createjs.Sound.play('sound');
		}
	}
	
	doKill()
	{
		this.kill ++;
	}
	
	die()
	{
		this.death ++;
	}
}
