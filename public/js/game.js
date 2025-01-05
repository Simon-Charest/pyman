import stages from './stages.js';
import Stage from './Stage.js';
import Pyman from './Pyman.js';
import Blinky from './Blinky.js';
import Pinky from './Pinky.js';
import Inky from './Inky.js';
import Clyde from './Clyde.js';

let interval, stage, ghosts, pymen, deadPymen = [], timer = 0;

const SPEED = 30; // Example speed
const CANVAS = document.getElementById('stage');
const SIZE = 20; // Example size
const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

function init() {
    console.log("Initializing game...");
    const stageIndex = Math.floor(Math.random() * stages.length);
    stage = new Stage(stages[stageIndex], CANVAS, SIZE);

    stage.play(stage.MUSIC);

    ghosts = [
        new Blinky('Blinky', 'red', SIZE, stage.ghost[1], stage.ghost[0]),
        new Pinky('Pinky', 'pink', SIZE, stage.ghost[1], stage.ghost[0]),
        new Inky('Inky', 'cyan', SIZE, stage.ghost[1], stage.ghost[0]),
        new Clyde('Clyde', 'orange', SIZE, stage.ghost[1], stage.ghost[0]),
    ];

    pymen = [
        new Pyman('Yellow Pyman', 'yellow', SIZE, stage.pymen[0][1], stage.pymen[0][0], LEFT, UP, RIGHT, DOWN),
        new Pyman('Pink Pyman', 'pink', SIZE, stage.pymen[1][1], stage.pymen[1][0], 65, 87, 68, 83), // WASD
    ];

    interval = setInterval(draw, SPEED);
}

function draw() {
    stage.draw();
    ghosts.forEach(ghost => ghost.move());
    pymen.forEach(pyman => pyman.move());

    // Additional game logic...
    if (pymen.length === 0) {
        console.log("Game Over!");
        clearInterval(interval);
    }
}

window.init = init;
