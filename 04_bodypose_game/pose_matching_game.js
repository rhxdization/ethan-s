// ====================================================
// Canvas and layout variables
// ====================================================

// Width of the webcam/game area.
let cameraWidth = 800;

// Height of the webcam/game area.
let cameraHeight = 450;

// Width of each side panel.
let sidePanelWidth = 220;

// Total canvas width = left panel + webcam area + right panel.
let totalCanvasWidth = cameraWidth + sidePanelWidth * 2;

// x-position where the webcam area starts.
let cameraX = sidePanelWidth;

// x-position of the left panel.
let leftPanelX = 0;

// x-position of the right panel.
let rightPanelX = sidePanelWidth + cameraWidth;

let bodypose;
let detectedPeople = [];

let skeletoncolor;

let player1person = null;
let player2person = null;
let player1color;
let player2color;

let leftPanelCenterX = sidePanelWidth/2;
let rightPanelCenterX = rightPanelX + sidePanelWidth/2;

let poselist = [];
let currentpose = null;
let bothhandsupimg;
let lefthandupimg;
let righthandupimg;
let tposeimg;
let handsonheadimg;

// ====================================================
// Preload
// ====================================================

function preload(){
    bodypose = ml5.bodyPose("MoveNet", {flipped: true});

    bothhandsupimg = loadImage("assets/poseBattle_bothHandsUp.img");
    lefthandupimg = loadImage("assets/poseBattle_leftHandUp.img");
    righthandupimg = loadImage("assets/poseBattle_rightHandUp.img");
    tposeimg = loadImage("assets/poseBattle_tpose.img");
    handsonheadimg = loadImage("assets/poseBattle_handsOnHead.img");
}

// ====================================================
// Setup
// ====================================================

// setup() runs once at the start.
function setup() {
    new Canvas(totalCanvasWidth, cameraHeight);
    // Set up text.
    textAlign(CENTER, CENTER);

    let constraints = {
        video: {
            width: cameraWidth,
            height: cameraHeight,
            aspectRatio: cameraWidth/cameraHeight
        },
        audio: false,
        flipped: true
    };
    video = createCapture(constraints);
    video.hide();

    bodypose.detectStart(video, gotPoses);

    skeletoncolor = color(80,180,255);

    player1color = color(255,0,0);
    player2color = color(0,0,255);

    setupposelist();
    currentpose = poselist[0];
}


// ====================================================
// Main draw loop
// ====================================================

// draw() runs again and again.
function draw() {
    findplayers();
    // Clear the canvas with a dark background.
    background(30);
    // Draw the side panels.
    drawUIPanel();
    // Draw the middle line that separates Player 1 and Player 2 areas.
    drawMiddleLine();

    image(video, cameraX, 0, cameraWidth, cameraHeight);

    drawdetectionstatus();

    if(detectedPeople.length > 0) {
        let pose = detectedPeople[0];

        let x = pose.nose.x + cameraX;
        let y = pose.nose.y;
        fill(255,0,0);
    }

    drawplayerskeletons();
}

// ====================================================
// Draw side UI panels
// ====================================================

// Draws the left and right UI panels.
function drawUIPanel() {
    // Remove outlines.
    noStroke();

    // Set panel colour.
    fill(20);

    // Draw left panel.
    rect(leftPanelX, 0, sidePanelWidth, cameraHeight);

    // Draw right panel.
    rect(rightPanelX, 0, sidePanelWidth, cameraHeight);

    // Set divider line colour.
    stroke(255, 180);

    // Set divider line thickness.
    strokeWeight(2);

    // Draw line between left panel and webcam.
    line(sidePanelWidth, 0, sidePanelWidth, cameraHeight);

    // Draw line between webcam and right panel.
    line(rightPanelX, 0, rightPanelX, cameraHeight);
}


// ====================================================
// Draw middle divider line
// ====================================================

// Draws the vertical line that separates Player 1 and Player 2.
function drawMiddleLine() {
    // Set line colour to white with transparency.
    stroke(255, 180);

    // Set line thickness.
    strokeWeight(2);

    // Draw the middle line inside the webcam area.
    line(width / 2, 0, width / 2, cameraHeight);
}

function drawdetectionstatus() {
    fill(0);
    textSize(24);
    text("People: " + detectedPeople.length, width/2, 55);

    console.log(detectedPeople);
}

function gotPoses(results) {
    detectedPeople = results;
}

function drawplayerskeletons() {
    if (player1person !== null) {
        drawSkeleton(player1person, player1color);
    }

    if (player2person !== null) {
        drawSkeleton(player2person, player2color);
    }
}

// Draws one person's skeleton.
function drawSkeleton(person, skeletoncolor) {
    // Set skeleton line colour.
    stroke(skeletoncolor);

    // Set skeleton line thickness.
    strokeWeight(3);

    // Draw shoulder line.
    drawBodyLine(person.left_shoulder, person.right_shoulder);

    // Draw left upper arm.
    drawBodyLine(person.left_shoulder, person.left_elbow);

    // Draw left lower arm.
    drawBodyLine(person.left_elbow, person.left_wrist);

    // Draw right upper arm.
    drawBodyLine(person.right_shoulder, person.right_elbow);

    // Draw right lower arm.
    drawBodyLine(person.right_elbow, person.right_wrist);

    // Draw left body side.
    drawBodyLine(person.left_shoulder, person.left_hip);

    // Draw right body side.
    drawBodyLine(person.right_shoulder, person.right_hip);

    // Draw hip line.
    drawBodyLine(person.left_hip, person.right_hip);

    // Remove outlines for the body point circles.
    noStroke();

    // Set circle colour.
    fill(skeletoncolor);

    // Draw important body points.
    drawBodyPoint(person.nose);
    drawBodyPoint(person.left_shoulder);
    drawBodyPoint(person.right_shoulder);
    drawBodyPoint(person.left_elbow);
    drawBodyPoint(person.right_elbow);
    drawBodyPoint(person.left_wrist);
    drawBodyPoint(person.right_wrist);
    drawBodyPoint(person.left_hip);
    drawBodyPoint(person.right_hip);
}

function drawBodyLine(point1, point2) {
    if (pointIsReady(point1) && pointIsReady(point2)) {
        line(point1.x + cameraX, point1.y, point2.x + cameraX, point2.y);
    }
}

function drawBodyPoint(point) {
    if (pointIsReady(point)) {
        circle(point.x + cameraX, point.y, 8);
    }
}

function pointIsReady(point) {
    if (point === null || point === undefined) {
        return false;
    }
    
    if (point.confidence > 0.25) {
        return true;
    } else {
        return false;
    }   
}

function findplayers() {
    player1person = null;
    player2person = null;

    let bestplayer1distance = 99999;
    let bestplayer2distance = 99999;
    let cameraMiddlex = cameraX + cameraWidth/2;

    let player1centerx = cameraX + cameraWidth/4;
    let player2centerx = cameraX + cameraWidth*3/4;

    for (let i = 0; i<detectedPeople.length; i++) {
        let person = detectedPeople[i];
        let nose = person.nose;

        if (pointIsReady(nose)) {
            let noseX = cameraX + nose.x;
            if (noseX < cameraMiddlex ) {
                let distancefromplayer1area = abs(noseX - player1centerx);
                if (distancefromplayer1area < bestplayer1distance) {
                    player1person = person;
                    bestplayer1distance = distancefromplayer1area;
                }
            } else {
                let distancefromplayer2area = abs(noseX - player2centerx);

                if (distancefromplayer2area < bestplayer2distance) {
                    player2person = person;
                    bestplayer2distance = distancefromplayer2area;
                }
            }
        }
     }
}

function drawplayerstatus() {
    noStroke();
    textSize(28);
    fill(255);

    if (player1person !== null) {
        text("detected", leftPanelCenterX, 125);
    } else {
        text("not detected", leftPanelCenterX, 125);
    }

    if (player2person !== null) {
        text("detected", rightPanelCenterX, 125);
    } else {
        text("not detected", rightPanelCenterX, 125);
    }
}