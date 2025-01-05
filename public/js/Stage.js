export default class Stage {
    constructor(stage, id, tileSize, soundConfig = {}) {
        // Sounds
        this.MUSIC = soundConfig.music || 'sounds/pyman_start.wav';
        this.SOUND_PACDOT = soundConfig.pacDot || 'sounds/pyman_pacdot.wav';
        this.SOUND_POWERPELLET = soundConfig.powerPellet || 'sounds/pyman_powerpellet.mp3';
        this.SOUND_FRUIT = soundConfig.fruit || 'sounds/pyman_fruit.wav';

        // Item colors
        this.DOTS_COLOR = 'yellow';
        this.FRUIT_COLOR = 'red';

        // Stage
        this.color = stage['color'];
        this.stage = stage['tiles'];
        this.rows = this.stage.length;
        this.columns = this.stage[0].length;

        // Canvas	
        this.id = id;
        this.canvas = this.getCanvas(this.id);
        this.tileSize = tileSize;
        this.canvas.height = this.tileSize * this.rows;
        this.canvas.width = this.tileSize * this.columns;
        this.height = this.canvas.height;
        this.width = this.canvas.width;

        // Context
        this.context = this.getContext(this.canvas);

        // Parse stage
        this.walls = [];
        this.floors = [];
        this.pacDots = [];
        this.powerPellets = [];
        this.ghost = null;
        this.pymen = [];
        this.fruit = null;
        this.parseStage();
    }

    getCanvas(id) {
        return document.getElementById(id);
    }

    getContext(canvas) {
        return canvas.getContext('2d');
    }

    parseStage() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const tile = this.stage[y][x];
                switch (tile) {
                    case 'X':
                        this.walls.push([y, x]);
                        break;
                    case '.':
                        this.pacDots.push([y, x]);
                        break;
                    case 'o':
                        this.powerPellets.push([y, x]);
                        break;
                    case 'G':
                        this.ghost = [y, x];
                        break;
                    case 'f':
                        this.fruit = [y, x];
                        break;
                    default:
                        if (!isNaN(parseInt(tile))) {
                            this.pymen.push([y, x]);
                        } else {
                            this.floors.push([y, x]);
                        }
                }
            }
        }
    }

    play(sound) {
        const queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.on('complete', () => createjs.Sound.play('sound'));
        queue.loadFile({ id: 'sound', src: sound });
    }

    removePacDot(pyman) {
        for (let i = 0; i < this.pacDots.length; i++) {
            if (this.pacDots[i][0] === pyman.j && this.pacDots[i][1] === pyman.i) {
                this.play(this.SOUND_PACDOT);
                pyman.pacDot++;
                this.pacDots.splice(i, 1);
                break;
            }
        }
    }

    removePowerPellet(pyman, ghosts) {
        for (let i = 0; i < this.powerPellets.length; i++) {
            if (this.powerPellets[i][0] === pyman.j && this.powerPellets[i][1] === pyman.i) {
                ghosts.forEach(ghost => ghost.mode = 'frightened');
                this.play(this.SOUND_POWERPELLET);
                pyman.size = 2;
                pyman.powerPellet++;
                this.powerPellets.splice(i, 1);
                break;
            }
        }
    }

    removeFruit(pyman) {
        if (this.fruit && this.fruit[0] === pyman.j && this.fruit[1] === pyman.i) {
            this.play(this.SOUND_FRUIT);
            pyman.fruit++;
            this.fruit = null;
        }
    }

    removeItems(pyman, ghosts) {
        this.removePacDot(pyman);
        this.removePowerPellet(pyman, ghosts);
        this.removeFruit(pyman);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    draw() {
        const tileHeight = this.height / this.rows;
        const tileWidth = this.width / this.columns;

        // Clear stage
        this.clear();

        // Draw walls
        this.walls.forEach(([row, col]) => {
            this.drawTile(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
        });

        // Draw items
        this.drawItems();
    }

    drawTile(x, y, width, height) {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.rect(x, y, width, height);
        this.context.fill();
    }

    drawItems() {
        this.drawCollection(this.pacDots, this.DOTS_COLOR, this.tileSize / 8);
        this.drawCollection(this.powerPellets, this.DOTS_COLOR, this.tileSize / 4);
        this.drawFruit();
    }

    drawCollection(items, color, diameter) {
        items.forEach(([row, col]) => {
            const x = col * this.tileSize + this.tileSize / 2;
            const y = row * this.tileSize + this.tileSize / 2;
            this.context.beginPath();
            this.context.arc(x, y, diameter, 0, 2 * Math.PI);
            this.context.fillStyle = color;
            this.context.fill();
        });
    }

    drawFruit() {
        if (this.fruit) {
            const [row, col] = this.fruit;
            const x = col * this.tileSize + this.tileSize / 2;
            const y = row * this.tileSize + this.tileSize / 2;
            const diameter = this.tileSize / 4;

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
