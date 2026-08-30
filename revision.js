let box;
let platform;

function setup() {
    new Canvas(640,480);
    
    box = new Sprite();
    box.width = 50;
    box.height = 50;
    box.collision = 'dynamic';
    box.color = 'rgb(255,0,0)'
    
}