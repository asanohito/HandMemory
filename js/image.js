/*
 * https://editor.p5js.org/LingDong-/sketches/1viPqbRMv
 */

var handposeModel = null; // this will be loaded with the handpose model
// WARNING: do NOT call it 'model', because p5 already has something called 'model'

var videoDataLoaded = false; // is webcam capture ready?

var statusText = "Loading handpose model...";

var myHands = []; // hands detected by mediapipe
// currently handpose only supports single hand, so this will be either empty or singleton

var capture; // webcam capture, managed by p5.js

//画像
let img1;

//フレーム間の平均
let avr_x, avr_y;

// Load the MediaPipe handpose model assets.
handpose.load().then(function (_model) {
  // console.log("model initialized.")
  statusText = "Model loaded.";
  handposeModel = _model;
});

function setup() {
  capture = createCapture(VIDEO);

  // this is to make sure the capture is loaded before asking handpose to take a look
  // otherwise handpose will be very unhappy
  capture.elt.onloadeddata = function () {
    // console.log("video initialized");
    videoDataLoaded = true;
    createCanvas(capture.width, capture.height);
  };

  capture.hide();

  img1 = loadImage("../image/meijiro.png");
}

// draw a hand object returned by handpose
function drawShape(hands) {
  fill(255, 0, 0);
  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j]; //指の位置座標取得

      avr_x = (avr_x * 5 + x) / 6;
      avr_y = (avr_y * 5 + y) / 6;

      if (j == 4) {
        image(img1, x - 30, y - 30, 30, 30);
      }
      if (j == 8) {
        image(img1, x - 30, y - 30, 30, 30);
      }
      if (j == 12) {
        image(img1, x - 30, y - 30, 30, 30);
      }
      if (j == 16) {
        image(img1, x - 30, y - 30, 30, 30);
      }
      if (j == 20) {
        image(img1, x - 30, y - 30, 30, 30);
      }
    }
  }
}

function draw() {
  if (handposeModel && videoDataLoaded) {
    // model and video both loaded,

    handposeModel.estimateHands(capture.elt).then(function (_hands) {
      // we're handling an async promise
      // best to avoid drawing something here! it might produce weird results due to racing

      myHands = _hands; // update the global myHands object with the detected hands
      if (!myHands.length) {
        // haven't found any hands
        statusText = "Show some hands!";
      } else {
        // display the confidence, to 3 decimal places
        statusText =
          "Confidence: " +
          Math.round(myHands[0].handInViewConfidence * 1000) / 1000;
      }
    });
  }

  background(200);

  // first draw the debug video and annotations
  push();
  image(capture, 0, 0, width, height);
  fill(255, 0, 0, 80);
  stroke(255);
  strokeWeight(3);
  drawShape(myHands); // draw my hand skeleton
  pop();

  push();
  fill(255, 255, 0);
  // text(statusText, 2, 60);
  pop();
}
