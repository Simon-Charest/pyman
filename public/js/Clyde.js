import Ghost from './Ghost.js';

// AI: Running away from the closest Pac-Man
export default class Clyde extends Ghost
{
	constructor(name, color, diameter, x, y)
	{
		super(name, color, diameter, x, y);
		
		this.sprite = false;
	}
	
	getDirection(pymen)
	{
		// If current ghost is crossing an intersection or is not yet moving... 
		if(this.isIntersection() || this.direction == 0)
		{
			var deltaX		= Math.abs(this.i - this.target.x);	// Calculate horizontal distance from selected Pac-Man
			var deltaY		= Math.abs(this.j - this.target.y);	// Calculate vertical distance from selected Pac-Man
			var x			= [];								// Ordered horizontal direction
			var y			= [];								// Ordered vertical direction
			var direction	= [];								// Ordered direction
			var d;												// Direction iterator
			
			// If the current ghost is to the right of the selected Pac-Man...
			if(this.x > this.target.x)
			{
				// Try going away before going toward
				x = [this.right, this.left];
			}
			
			// If the current ghost is to the left of the selected Pac-Man...
			else
			{
				// Try going away before going toward
				x = [this.left, this.right];
			}
			
			// If the current ghost is lower than the selected Pac-Man...
			if(this.y > this.target.y)
			{
				// Try going away before going toward
				y = [this.down, this.up];
			}
			
			// If the current ghost is higher than the selected Pac-Man...
			else
			{
				// Try going away before going toward
				y = [this.up, this.down];
			}
			
			// If the current ghost is closer horizontally than vertically...
			if(deltaX < deltaY)
			{
				// Try going away horizontally, vertically, around and then toward
				direction = [x[0], y[0], y[1], x[1]];
			}
			
			// If the current ghost is closer vertically than horizontally...
			else
			{
				// Try going toward vertically, horizontally, around and then toward
				direction = [y[0], x[0], x[1], y[1]];
			}
			
			// For each direction...
			for(d = 0; d < direction.length; d ++)
			{
				// If direction is not blocked...
				if(!this.isBlocked(direction[d]))
				{
					// Move in that direction
					return(direction[d]);
				}
			}
			
			// If no available direction found, stay in place
			return(this.direction);
		}
	}
}
