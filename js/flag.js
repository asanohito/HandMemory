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
let img = [];

//フレーム間の平均
let avr_x = [];
let avr_y = [];

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

  img[0] = loadImage("../image/ADL.png");
  img[1] = loadImage("../image/ALL.png");
  img[2] = loadImage("../image/GBL.png");
  img[3] = loadImage("../image/IEL.png");
  img[4] = loadImage("../image/ISL.png");
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

      avr_x[j] = (avr_x[j] * 5 + x) / 6;
      avr_y[j] = (avr_y[j] * 5 + y) / 6;
      console.log(avr_y[4]);

      if (j == 4) {
        image(img[0], avr_x[4] - 30, avr_y[4] - 30, 50, 30);
        text("アンドラ",x-30,y+10);
      }
      if (j == 8) {
        image(img[1], avr_x[8] - 30, avr_y[8] - 30, 50, 30);
        text("アルバニア",x-30,y+10);
      }
      if (j == 12) {
        image(img[2], avr_x[12] - 30, avr_y[12] - 30, 50, 30);
        text("イギリス",x-30,y+10);
      }
      if (j == 16) {
        image(img[3], avr_x[16] - 30, avr_y[16] - 30, 50, 30);
        text("アイルランド",x-30,y+10);
      }
      if (j == 20) {
        image(img[4], avr_x[20] - 30, avr_y[20] - 30, 50, 30);
        text("アイスランド",x-30,y+10);
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
