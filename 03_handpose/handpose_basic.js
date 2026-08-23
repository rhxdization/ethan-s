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

    fingertip = new Sprite();
    fingertip.diameter = 60;
    fingertip.collider = 'kinematic';
    fingertip.color = 'rgba(0,255,0,0.05';

    balloon = new Sprite();
    balloon.diameter = 50
}

function gotHands(results) {
    hands = results
}

function draw() {
    image(video, 0, 0, videoW, videoH);

//     for (let i = 0; i < hands.length; i++) {
//         let hand = hands[i];

//         for (let j = 0; j < hand.keypoints.length; j++) {
//             let keypoint = hand.keypoints[j];
//             circle(keypoint.x, keypoint.y, 10);
//         }
        
//     }

    if (hands.length > 0) {
        let hand = hands[0];
        let keypoint = hand.keypoints[8];

        circle(keypoint.x, keypoint.y, 30);

        fingertip.x = keypoint.x;
        fingertip.y = keypoint.y;
        fingertip.visible = true;
    }
    else {
        fingertip.visible = false;
    }
}


//=========================================
// Function Created
//=========================================
