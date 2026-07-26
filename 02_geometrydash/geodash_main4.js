//player box
let box;
let cube;
let bg;

const maxjump = 1;
let jumpChance = maxjump;
  

// game variables


// world building groups
let tileMap1;
let ground;
let orbs;
let sharp;
let finishline;

// image sprites
let spike;

// menu


// sound assets


function preload() {
    cube = loadImage('assets/cube.png');
    bg = loadImage('assets/geobg.png');

    tileMap1 = loadStrings('stages/tiles1.txt');
    sharp = loadImage('assets/spike.png');
}

function setup() {
  new Canvas(700,600);
  world.gravity.y = 32

  box = new Sprite(50, height, 50, 50);
  box.img = cube;
  box.friction = 0;
  box.bounciness = 0;
  box.collider = "None";

  startCoordinates = [50, height - box.height/2];
  box.x = startCoordinates[0];
  box.y = startCoordinates[1];

  ground = new Group();
  ground.tile = "g";

  ground.w = 50;
  ground.h = 50;
  ground.collider = "static";
  ground.color = "black";
  ground.stroke = "rgba(0,0,0,0)";

  orbs = new Group();
  orbs.tile = "o";

  orbs.d = 24;
  orbs.collider = "static";
  orbs.color = "white";
  orbs.strokeWeight = 0;

  finishline = new Group();
  finishline.tile = "f";
  finishline.w = 50;
  finishline.h = 1200;
  finishline.visible = false;
  finishline.collider = "static";

  sharp = new Group();
  sharp.tile = "s";
  sharp.w = 50;
  sharp.h = 50;
  sharp.collider = "static";
  sharp.color = "black";

  new Tiles(tileMap1, 0, 0, 50, 50);
}

function draw() {
  clear();
  image(bg,0,0,width,height);

  box.collider = "dynamic";
  box.vel.x = 8;
  
  if (box.x >= width/2) {
    camera.x = box.x;
  }
  else {
    camera.x = width/2;
  }

  if ((kb.presses("space")) || (mouse.presses()) && (jumpChance > 0)) {
    box.vel.y = -10;
    box.rotateTo(box.rotation + 359, 15);
    jumpChance -= 1;
  }

  if (box.collides(ground) && jumpChance < maxjump) {
    jumpchance = maxjump;
  }

  if (box.collides(sharp)) {
    resetGame();
  }

  for (let tile of ground) {
    if (box.colliding(tile)) {
      let leftedge = tile.x - tile.w/2;
      let leftedgeheight = tile.y - tile.h/2;

      if (box.x < leftedge && box.y > leftedgeheight) {
        resetGame();
        break;
      }
    }

  }
  
  for (let orb of orbs) {
    if (box.colliding(orb)) {
      orb.visible = false;
      orb.collider = false;
      box.vel.y = -5;
      jumpChance = maxjump;
    }
  }
}

function resetGame() {
  box.rotation = 0;

  box.x = startCoordinates[0];
  box.y = startCoordinates[1];

  jumpChance = maxjump;

  camera.x = width/2;

  for (let orb of orbs) {
    
  }
}











