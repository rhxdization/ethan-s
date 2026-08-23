//=========================================
// Variables
//=========================================

let handpose;
let videoH = 480;
let videoW = 640;
let hands = [];


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

    handpose = ml5.handPose(options);
    
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
        audio: false,
        flipped: true,
    };

    video = createCapture(constraints);
    video.size(640,480);
    video.hide();

    handpose.detectStart(video, gotHands);

}

function gotHands(results) {
    hands = results
}

function draw() {
    image(video, 0, 0, videoW, videoH);

    for (let i = 0; i < hands.length; i++) {
        
    }
}

//=========================================
// Function Created
//=========================================
