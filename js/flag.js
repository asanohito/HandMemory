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
let avr_1x = new Array(3);
let avr_2x = new Array(3);
let avr_3x = new Array(3);
let avr_4x = new Array(3);
let avr_5x = new Array(3);
let avr_1y = new Array(3);
let avr_2y = new Array(3);
let avr_3y = new Array(3);
let avr_4y = new Array(3);
let avr_5y = new Array(3);



// Load the MediaPipe handpose model assets.
handpose.load().then(function (_model) {
  // console.log("model initialized.")
  statusText = "Model loaded.";
  handposeModel = _model;
});

function setup() {

  const constraints = {
    audio: false,
    video: {
      facingMode: { exact: "environment" }  // リアカメラを利用する場合
    }
  };
  
  capture = createCapture(VIDEO);

  // this is to make sure the capture is loaded before asking handpose to take a look
  // otherwise handpose will be very unhappy
  capture.elt.onloadeddata = function () {
    // console.log("video initialized");
    videoDataLoaded = true;
    createCanvas(capture.width*2.1, capture.height*2.1);
    console.log(capture.width,capture.height);
  };

  capture.hide();

  img[0] = loadImage("../image/ADL.png");
  img[1] = loadImage("../image/ALL.png");
  img[2] = loadImage("../image/GBL.png");
  img[3] = loadImage("../image/IEL.png");
  img[4] = loadImage("../image/ISL.png");

  textSize(20);
}

//配列の平均
const sumArray = array => {
  let sum = 0;
  for (let i = 0, len = array.length; i < len; i++) {
    sum += array[i];
  }
  return sum/3;
};

// draw a hand object returned by handpose
function drawShape(hands) {
  fill(255, 0, 0);
  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j]; //指の位置座標取得
      x = x*2.1;
      y = y*2.1;


      if (j == 4) {
        //配列の先頭を削除、末尾に追加
        avr_1x.shift();
        avr_1y.shift();
        avr_1x.push(x);
        avr_1y.push(y);
        x = sumArray(avr_1x);
        y = sumArray(avr_1y);
        image(img[0], x - 30, y - 30, 50, 30);
        text("アンドラ",x-30,y+10);
      }
      if (j == 8) {
        avr_2x.shift();
        avr_2y.shift();
        avr_2x.push(x);
        avr_2y.push(y);
        x = sumArray(avr_2x);
        y = sumArray(avr_2y);
        image(img[1], x - 30, y- 30, 50, 30);
        text("アルバニア",x-30,y+10);
      }
      if (j == 12) {
        avr_3x.shift();
        avr_3y.shift();
        avr_3x.push(x);
        avr_3y.push(y);
        x = sumArray(avr_3x);
        y = sumArray(avr_3y);
        image(img[2], x - 30, y- 30, 50, 30);
        text("イギリス",x-30,y+10);
      }
      if (j == 16) {
        avr_4x.shift();
        avr_4y.shift();
        avr_4x.push(x);
        avr_4y.push(y);
        x = sumArray(avr_4x);
        y = sumArray(avr_4y);
        image(img[3], x - 30, y- 30, 50, 30);
        text("アイルランド",x-30,y+10);
      }
      if (j == 20) {
        avr_5x.shift();
        avr_5y.shift();
        avr_5x.push(x);
        avr_5y.push(y);
        x = sumArray(avr_5x);
        y = sumArray(avr_5y);
        image(img[4], x - 30, y - 30, 50, 30);
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
/*
  push();
  fill(255, 255, 0);
  text(statusText, 2, 60);
  pop();*/
}
