import Stage from './Stage.js';
import Pyman from './Pyman.js';
import Blinky from './Blinky.js';
import Pinky from './Pinky.js';
import Inky from './Inky.js';
import Clyde from './Clyde.js';

const SPEED = 30; 
const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

async function init() {
    console.log("Loading stages data...");
    const stages = await loadStages();

    console.log("Selecting random stage...");
    const stageIndex = Math.floor(Math.random() * stages.length);

    let stage = stages[stageIndex];
    let id = "canvas"
    let tileSize = 20;

    console.log("Loading stage...");

    // @TODO: Dev this
    stage = new Stage(stage, id, tileSize);
    //stage.play(stage.MUSIC);

    return;

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

async function loadStages() {
    const stages = await fetch('data/stages.json');
    const json = await stages.json();

    return json;
}

function draw() {
    stage.draw();
    ghosts.forEach(ghost => ghost.move());
    pymen.forEach(pyman => pyman.move());

    if (pymen.length === 0) {
        console.log("Game Over!");
        clearInterval(interval);
    }
}

window.init = init;
