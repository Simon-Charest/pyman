import Character from './Character.js';

export default class Ghost extends Character
{
	constructor(name, color, diameter, i, j)
	{
		super(name, color, diameter, i, j);
		
		this.target	= [];
		this.sprite	= true;		// Let ghosts flip between two sprites
		this.mode	= 'chase';	// ['chase', 'scatter', 'frightened']
	}
	
	hasTarget()
	{
		if(this.target == '' || this.isTarget())
		{
			return(true);
		}
		
		return(false);
	}
	
	setTarget(target)
	{
		this.target = target;
	}
	
	isTarget()
	{
		if([this.y, this.x] == this.target)
		{
			return(true);
		}
		
		return(false);
	}
	
	drawTarget()
	{
		var x			= this.target[1] * SIZE + SIZE / 2;
		var y			= this.target[0] * SIZE + SIZE / 2;
		var crossSize	= SIZE / 2;
		var circleSize	= crossSize / 2;
		
		this.context.beginPath();
		this.context.strokeStyle = this.color;
		this.context.moveTo(x, y - crossSize);
		this.context.lineTo(x, y + crossSize);
		this.context.moveTo(x - crossSize, y);
		this.context.lineTo(x + crossSize, y);
		this.context.arc(x, y, circleSize, 0, 2 * Math.PI);
		this.context.stroke();
	}
	
	getDirection()
	{
		if(this.isIntersection())
		{
			var validDirection = [LEFT, UP, RIGHT, DOWN];
			
			switch(this.direction)
			{
				case LEFT:
					validDirection	= [LEFT, UP, DOWN];
				break;
				case UP:
					validDirection	= [LEFT, UP, RIGHT];
				break;
				case RIGHT:
					validDirection	= [UP, RIGHT, DOWN];
				break;
				case DOWN:
					validDirection	= [LEFT, RIGHT, DOWN];
				break;
			}
			
			// Get random direction
			var randomDirection = validDirection[Math.floor(Math.random() * validDirection.length)];
			
			return(randomDirection);
		}
		
		return(this.direction);
	}
	
	getClosestPyman(pymen)
	{
		var c;
		var closest;
		var xDelta;
		var yDelta;
		var distance	= [];
		var min			= -1;
		
		for(c = 0; c < pymen.length; c ++)
		{
			xDelta		= Math.abs(this.x - pymen[c].x);
			yDelta		= Math.abs(this.y - pymen[c].y);
			distance[c]	= xDelta + yDelta;
			
			if(distance[c] < min || min == -1)
			{
				min		= distance[c];
				closest	= c;
			}
		}
		
		return(closest);
	}
	
	setSprite()
	{
		this.sprite = !this.sprite;
	}
	
	draw()
	{
		var sixth			= Math.round(this.diameter / 6);
		var quarter			= Math.round(this.diameter / 4);
		var oneThird		= Math.round(this.diameter * 1 / 3);
		var half			= Math.round(this.diameter / 2);
		var twoThird		= Math.round(this.diameter * 2 / 3);
		var threeQuarter	= Math.round(this.diameter * 3 / 4);
		var fiveSixth		= Math.round(this.diameter * 5 / 6);
		var xBottom			= this.x - half;
		var yBottom			= this.y + half;
		var color;
		
		switch(this.mode)
		{
			case 'chase':
			case 'scatter':
				color = this.color;
			break;
			
			case 'frightened':
				color = 'blue';
			break;
		}
		
		// Draw ghost's body
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.arc(this.x, this.y, half, Math.PI, 2 * Math.PI);
		this.context.rect(this.x - half, this.y, this.diameter, quarter);
		this.context.fill();
		
		// Draw ghost's left eye
		this.drawEye(this.LEFT_EYE);
		
		// Draw ghost's right eye
		this.drawEye(this.RIGHT_EYE);
		
		// Draw ghost's bottom
		this.context.beginPath();
		this.context.fillStyle = color;
		
		if(this.sprite == true)
		{
			this.context.moveTo(xBottom, yBottom - quarter);
			this.context.lineTo(xBottom, yBottom);
			this.context.lineTo(xBottom + sixth, yBottom - quarter);
			this.context.lineTo(xBottom + oneThird, yBottom);
			this.context.lineTo(xBottom + half, yBottom - quarter);
			this.context.lineTo(xBottom + twoThird, yBottom);
			this.context.lineTo(xBottom + fiveSixth, yBottom - quarter);
			this.context.lineTo(xBottom + this.diameter, yBottom);
			this.context.lineTo(xBottom + this.diameter, yBottom - quarter);
		}
		
		else
		{
			this.context.moveTo(xBottom, yBottom - quarter);
			this.context.lineTo(xBottom, yBottom);
			this.context.lineTo(xBottom + quarter, yBottom - quarter);
			this.context.lineTo(xBottom + half, yBottom);
			this.context.lineTo(xBottom + threeQuarter, yBottom - quarter);
			this.context.lineTo(xBottom + this.diameter, yBottom);
			this.context.lineTo(xBottom + this.diameter, yBottom - quarter);
		}
		
		this.context.fill();
	}
	
	// Draw ghost's eye
	drawEye(side)
	{
		var eyeballDiameter	= this.diameter / 8; 
		var pupilDiameter	= this.diameter / 12;
		var eyeDistance		= this.diameter / 5;
		var eyeX			= this.x + side * eyeDistance;
		var eyeY			= this.y - eyeDistance;
		
		// Draw eyeball
		this.context.beginPath();
		this.context.arc(eyeX, eyeY, eyeballDiameter, 0, 2 * Math.PI);
		this.context.fillStyle = this.EYEBALL_COLOR;
		this.context.fill();
		
		// Draw pupil
		this.context.beginPath();
		
		switch(this.direction)
		{
			case LEFT:
				this.context.arc(eyeX - pupilDiameter, eyeY, pupilDiameter, 0, 2 * Math.PI);
			break;
			
			case UP:
				this.context.arc(eyeX, eyeY - pupilDiameter, pupilDiameter, 0, 2 * Math.PI);
			break;
			
			case RIGHT:
				this.context.arc(eyeX + pupilDiameter, eyeY, pupilDiameter, 0, 2 * Math.PI);
			break;
			
			case DOWN:
				this.context.arc(eyeX, eyeY + pupilDiameter, pupilDiameter, 0, 2 * Math.PI);
			break;
			
			default:
				this.context.arc(eyeX, eyeY, pupilDiameter, 0, 2 * Math.PI);
		}
		
		this.context.fillStyle = this.PUPIL_COLOR;
		this.context.fill();
	}
}
