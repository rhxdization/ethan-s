//=========================================
// Variables
//=========================================

let handpose;
let videoH = 480;
let videoW = 640;
let hands = [];
let balloon;
let fingertip;
let score;
let gameoversound;
let bottomwall, topwall, rightwall, leftwall, boundarygroup;

let gamestarted = false;
let gameover = false;

let bouncesound;

let bouncecooldown = 0;
let bouncedelay = 200;


//=========================================
// Code
//=========================================

function preload() {
    let options = {
        flipped: true,
        runtime: "tfjs",
        modelType: "lite",
        detectorModelUrl: undefined,
        landmarkModelUrl: undefined,
    }

    handpose = ml5.handPose(options);

    bouncesound = createAudio('assets/LowBoing.mp3');
    gameoversound = createAudio('assets/DunDunn.mp3');
    
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

    world.gravity.y = 6;
    
    fingertip = new Sprite();
    fingertip.diameter = 60;
    fingertip.collider = 'kinematic';
    fingertip.color = 'rgba(0,255,0,0)';

    balloon = new Sprite();
    balloon.diameter = 50;
    balloon.color = 'red';
    balloon.x = width/2;
    balloon.y = 100;
    balloon.collider = "static";

    topwall = new Sprite(width/2,0,width,10,'static');
    bottomwall = new Sprite(width/2,height,width,10,'static');
    leftwall = new Sprite(0,height/2,10,height,'static');
    rightwall = new Sprite(width,height/2,10,height,'static');

    boundarygroup = new Group();
    boundarygroup.add(topwall);
    boundarygroup.add(bottomwall);
    boundarygroup.add(leftwall);
    boundarygroup.add(rightwall);
    boundarygroup.visible = false;


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

    if (gameover === false) {
        if (hands.length > 0) {
            let hand = hands[0];
            let keypoint = hand.keypoints[8];

            fingertip.x = keypoint.x;
            fingertip.y = keypoint.y;
            fingertip.visible = true;
        }
        else {
            fingertip = false;
        }
    }


    if(balloon.collides(fingertip) && bouncecooldown <= 0){
        bouncesound.play();
        score++;
        bouncecooldown = bouncedelay;
    }

    if (gamestarted === false) {
        textSize(28);
        textAlign(CENTER, CENTER);
        fill('limegreen');
        textSize(20);
        text("Use Index Finger to bounce the ball.",width/2,height/2-40);
        textSize(28);
        text("Press SPACE to start the game",width/2,height/2);
    }

    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Score: " + score, 10, 10);

    if (bouncecooldown > 0) {
        bouncecooldown = bouncecooldown - deltaTime;
    }

    if (balloon.collides(bottomwall)) {
        gameover = true;
        gameoversound.play();
        balloon.vel.y = 0;
        balloon.vel.x = 0;
        balloon.collider = 'none';
    }

    if(gameover === true) {
        textSize(36);
        textAlign(CENTER,CENTER);
        fill('magenta');
        text("Game Over", width/2, height/2);
        textSize(18);
        text("Press SPACE to restart", width/2, height/2 + 40); 
    }
}
//=========================================
// Function Created
//=========================================

function keyPressed() {
    if (key === ' ') {
        gamestarted = true;
        gameover = false;
        score = 0;
        
        balloon.x = width/2;
    balloon.y = 100;
    balloon.vel.x = 0;
    balloon.vel.y = 0;
    balloon.collider = "dynamic";
    balloon.bounciness = 1;
    balloon.drag = 0.01;
    balloon.mass = 2;
    }


}