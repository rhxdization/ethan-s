let handPose;
let hands = [];
let video;
let videoW = 640;
let videoH = 480;

function preload(){

    let options = {
        flipped: true,
        runtime: "tfjs",
        modelType: "lite",
        detectorModelUrl: undefined,
        landmarkModeUrl: undefined,
    }

    handPose = ml5.handPose(options);
}

function setup () {

    new Canvas(640, 480);

    let constraints = {
        video:{
            mandatory:{
                midWidth: width,
                minHeight: height
            },
            optional: [{minFrameRate: 60}]
        },
        audio: false,
        flipped: true,
        };  

    video = createCapture(constraints);
    video.size(width, height);
    video.hide();

    handPose.detectStart(video, gotHands);

    fingertip = new Sprite();
    fingertip.diameter = 25;
    fingertip.collider = 'kinematic';
    fingertip.color = 'rgb(255,255,255)';

}

function gotHands(results){
    
    hands = results;

}

function draw () {
    background("black");
    image(video, 0, 0, videoW, videoH);

    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i]; 
    }

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

    if (gameover === false) {
        if (hands.length > 0) {
            let hand = hands[0];
            let keypoint = hand.keypoints[8];

            fingertip.x = keypoint.x;
            fingertip.y = keypoint.y;
            fingertip.visible = true;
        }
        else {
            fingertip.visible = false;
        }
    }
    
}
