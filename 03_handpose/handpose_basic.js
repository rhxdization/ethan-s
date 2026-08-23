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

    let constraints = {
        video: {
            mandatory: {
                minWidth: videoW,
                minHeight: videoH,
            },
            optional: [{minFrameRate: 60}]
        },
        audio
    }
}

function draw() {}

//=========================================
// Function Created
//=========================================
