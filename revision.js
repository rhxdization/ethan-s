let box;
let platform;

function setup() {
    new Canvas(640,480);
    
    world

    box = new Sprite(100, height/2, 50, 50);
    box.collision = 'dynamic';
    box.color = 'rgb(255,0,0)';

    platform = new Sprite(320, 480, 1000, 50);
    platform.collision = 'static';
    platform.color = 'rgb(0,0,0)';


    
}

function draw() {
    clear();
    box.vel.x = 4;
}