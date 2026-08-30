let box;
let platform;

function setup() {
    new Canvas(640,480);
    
    box = new Sprite(50, height/2, 50, 50);
    box.collision = 'dynamic';
    //box.color = 'rgb(255,0,0)';
    
}