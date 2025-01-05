export default class Stage
{
	constructor(stage, id, tileSize)
	{
		// Sounds
		this.MUSIC				= 'snd/pyman_start.wav';
		this.SOUND_PACDOT		= 'snd/pyman_pacdot.wav';
		this.SOUND_POWERPELLET	= 'snd/pyman_powerpellet.mp3';
		this.SOUND_FRUIT		= 'snd/pyman_fruit.wav';
		
		// Item colors
		this.DOTS_COLOR			= 'yellow';
		this.FRUIT_COLOR		= 'red';
		
		// Stage
		this.color			= stage[0];
		this.stage			= stage[1];
		this.rows			= this.stage.length;
		this.columns		= this.stage[0].length;

		// Tiles
		var tiles			= this.getTiles();
		this.walls			= tiles[0];
		this.floors			= tiles[1];

		// Characters
		this.ghost			= this.getGhost();
		this.pymen			= this.getPymen();
		
		// Items
		this.pacDots		= this.getPacDots();
		this.powerPellets	= this.getPowerPellets();
		this.fruit			= this.getFruit();
		
		// Canvas
		this.id				= id;
		this.canvas			= this.getCanvas(this.id);
		this.tileSize		= tileSize;
		this.canvas.height	= this.tileSize * this.rows;
		this.canvas.width	= this.tileSize * this.columns;
		this.height			= this.canvas.height;
		this.width			= this.canvas.width;
		
		// Context
		this.context		= this.getContext(this.canvas);
	}

	getCanvas(id)
	{
		return(document.getElementById(id));
	}
	
	getContext(canvas)
	{
		return(canvas.getContext('2d'));
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
	
	getTiles()
	{
		var walls	= [];
		var floors	= [];
		
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(this.stage[y][x] == 'X')
				{
					walls.push([y, x]);
				}

				else
				{
					floors.push([y, x]);
				}
			}
		}
		
		return([walls, floors]);
	}
	
	getGhost()
	{
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(this.stage[y][x] == 'G')
				{
					return([y, x]);
				}
			}
		}
	}
	
	getPymen()
	{
		var pymen = [];
		
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(parseInt(this.stage[y][x]))
				{
					pymen.push([y, x]);
				}
			}
		}
		
		return(pymen);
	}
	
	getPacDots()
	{
		var pacDots = [];
		
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(this.stage[y][x] == '.')
				{
					pacDots.push([y, x]);
				}
			}
		}
		
		return(pacDots);
	}
	
	setPacDots()
	{
		var index;
		var pacDot;
		var floors	= this.floors;
		var pacDots	= [];
		
		for(var z = 0; z < Math.round(floors.length / 10); z ++)
		{
			index = Math.floor(Math.random() * floors.length);
			pacDot = floors[index];
			pacDots.push(pacDot);
			floors.splice(index, 1);
		}
		
		return(pacDots);
	}
	
	
	
	removePacDot(pyman)
	{
		for(var z = 0; z < this.pacDots.length; z ++)
		{
			if(this.pacDots[z][0] == pyman.j && this.pacDots[z][1] == pyman.i)
			{
				stage.play(this.SOUND_PACDOT);
				pyman.pacDot ++;
				this.pacDots.splice(z, 1);
				break;
			}
		}
	}
	
	getPowerPellets()
	{
		var powerPellets = [];
		
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(this.stage[y][x] == 'o')
				{
					powerPellets.push([y, x]);
				}
			}
		}
		
		return(powerPellets);
	}
	
	removePowerPellet(pyman, ghosts)
	{
		for(var z = 0; z < this.powerPellets.length; z ++)
		{
			if(this.powerPellets[z][0] == pyman.j && this.powerPellets[z][1] == pyman.i)
			{
				for(var g = 0; g < ghosts.length; g ++)
				{
					ghosts[g].mode = 'frightened';
				}
				
				stage.play(this.SOUND_POWERPELLET);
				pyman.size = 2;
				pyman.powerPellet ++;
				this.powerPellets.splice(z, 1);
				break;
			}
		}
	}
	
	getFruit()
	{
		for(var y = 0; y < this.rows; y ++)
		{
			for(var x = 0; x < this.columns; x ++)
			{
				if(this.stage[y][x] == 'f')
				{
					return([y, x]);
				}
			}
		}
		
		return('');
	}
	
	removeFruit(pymen)
	{
		if(this.fruit[0] == pymen.j && this.fruit[1] == pymen.i)
		{
			stage.play(this.SOUND_FRUIT);
			pymen.fruit ++;
			this.fruit = '';
		}
	}
	
	removeItems(pyman, ghosts)
	{
		this.removePacDot(pyman);
		this.removePowerPellet(pyman, ghosts);
		this.removeFruit(pyman);
	}
	
	clear()
	{
		this.context.clearRect(0, 0, this.width, this.height);
	}
	
	draw()
	{
		var x;
		var y;
		var tileHeight	= Math.round(this.height / this.rows);
		var tileWidth	= Math.round(this.width / this.columns);
		
		// Clear stage
		this.clear();
		
		// Draw stage
		for(var z = 0; z < this.walls.length; z ++)
		{
			x = this.walls[z][1] * tileWidth;
			y = this.walls[z][0] * tileHeight;
			
			this.drawTile(x, y, tileWidth, tileHeight);
		}
		
		// Draw items
		this.drawItems();
	}
	
	drawTile(x, y, width, height)
	{
		this.context.beginPath();
		this.context.fillStyle = this.color;
		this.context.rect(x, y, width, height);
		this.context.fill();
	}
	
	drawItems()
	{
		this.drawPacDots();
		this.drawPowerPellets();
		this.drawFruit();
	}
	
	drawPacDots()
	{
		for(var z = 0; z < this.pacDots.length; z ++)
		{
			var x			= this.pacDots[z][1] * SIZE + SIZE / 2;
			var y			= this.pacDots[z][0] * SIZE + SIZE / 2;
			var diameter	= SIZE / 8;
			
			this.context.beginPath();
			this.context.arc(x, y, diameter, 0, 2 * Math.PI);
			this.context.fillStyle = this.DOTS_COLOR;
			this.context.fill();
		}
	}
	
	drawPowerPellets()
	{
		for(var z = 0; z < this.powerPellets.length; z ++)
		{
			var x		= this.powerPellets[z][1] * SIZE + SIZE / 2;
			var y		= this.powerPellets[z][0] * SIZE + SIZE / 2;
			var diameter	= SIZE / 4;
			
			this.context.beginPath();
			this.context.arc(x, y, diameter, 0, 2 * Math.PI);
			this.context.fillStyle = this.DOTS_COLOR;
			this.context.fill();
		}
	}
	
	drawFruit()
	{
		if(typeof(this.fruit) !== 'undefined' && this.fruit != null)
		{
			var x			= this.fruit[1] * SIZE + SIZE / 2;
			var y			= this.fruit[0] * SIZE + SIZE / 2;
			var diameter	= SIZE / 4;
			
			// Draw left cherry
			this.context.beginPath();
			this.context.arc(x - diameter, y, diameter, 0, 2 * Math.PI);
			this.context.fillStyle = this.FRUIT_COLOR;
			this.context.fill();
			
			// Draw right cherry
			this.context.beginPath();
			this.context.arc(x + diameter, y, diameter, 0, 2 * Math.PI);
			this.context.fillStyle = this.FRUIT_COLOR;
			this.context.fill();
			
			// Draw stem
			this.context.beginPath();
			this.context.moveTo(x + diameter, y);
			this.context.lineTo(x + diameter, y - 2 * diameter);
			this.context.lineTo(x - diameter, y);
			this.context.strokeStyle = this.FRUIT_COLOR;
			this.context.lineWidth = 2;
			this.context.stroke();
		}
	}
}
