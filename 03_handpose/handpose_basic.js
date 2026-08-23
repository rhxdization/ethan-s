//=========================================
// Variables
//=========================================

let handpose;

//=========================================
// Code
//=========================================

function preload() {
    let options = {
        flipped: true,
        runtime: "tfjs",
        modelType: "full",
        detectorModelUrl: undefined,
        landmarkModelUrl: undefined,
    }

    handpose = ml5.handpose(options);

    let videoW = 640;
    let videoH = 480;
    
}


function setup() {
    createCanvas(videoW, videoH);
}

function draw() {}

//=========================================
// Function Created
//=========================================
