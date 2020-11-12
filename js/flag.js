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
let images = [];


//フレーム間の平均
let avr_1x = new Array(4);
let avr_2x = new Array(4);
let avr_3x = new Array(4);
let avr_4x = new Array(4);
let avr_5x = new Array(4);

let avr_1y = new Array(4);
let avr_2y = new Array(4);
let avr_3y = new Array(4);
let avr_4y = new Array(4);
let avr_5y = new Array(4);

let avr_6x = new Array(4);
let avr_7x = new Array(4);
let avr_8x = new Array(4);
let avr_9x = new Array(4);
let avr_10x = new Array(4);
let avr_6y = new Array(4);
let avr_7y = new Array(4);
let avr_8y = new Array(4);
let avr_9y = new Array(4);
let avr_10y = new Array(4);

//右手か左手か
// var hands = true;


// Load the MediaPipe handpose model assets.
handpose.load().then(function (_model) {
  // console.log("model initialized.")
  statusText = "Model loaded.";
  handposeModel = _model;
});

function preload() {
  images[0] = loadImage('images/ADL.png');
  images[1] = loadImage('images/ALL.png');
  images[2] = loadImage('images/GBL.png');
  images[3] = loadImage('images/IEL.png');
  images[4] = loadImage('images/ISL.png');
  images[5] = loadImage('images/ITL.png');
  images[6] = loadImage('images/EEL.png');
  images[7] = loadImage('images/ATL.png');
  images[8] = loadImage('images/NLL.png');
  images[9] = loadImage('images/MKL.png');

}
/*
window.onload = function() {
  // 画面に触れはじめたときのイベントに関数を登録
  document.body.addEventListener("touchstart", handle_touch);
};*/

function setup() {

  let constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720,
      },
      facingMode: { exact: "environment" }
    },
  };

  capture = createCapture(constraints);

  // this is to make sure the capture is loaded before asking handpose to take a look
  // otherwise handpose will be very unhappy
  capture.elt.onloadeddata = function () {
    // console.log("video initialized");
    videoDataLoaded = true;
    createCanvas(capture.width, capture.height);
    console.log(capture.width, capture.height);
  };

  capture.hide();

  textSize(100);
}

//配列の平均
const sumArray = (array) => {
  let sum = 0;
  for (let i = 0, len = array.length; i < len; i++) {
    sum += array[i];
  }
  return sum / 4;
};

// タッチデバイスの情報
function handle_touch(event) {
  // clear("touch-area");
  try {
    for (var i=0; i<event.touches.length; i++) {
      var touch = event.touches.item(i);
      // Touch.force: 圧力を0.0〜1.0の値で取得する
      // add("touch-area", "Touch[" + i + "].force", touch.force);
      if(touch.force>=0.1){
        hands = false;
      }else{
        hands = true;
      }
    }
  } catch(e) {
    // add("touch-area", "error", e);
  }
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
      // x = x*2.1;
      // y = y*2.1;

//       if (j == 2) {
//         //配列の先頭を削除、末尾に追加
//         avr_6x.shift();
//         avr_6y.shift();
//         avr_6x.push(x);
//         avr_6y.push(y);
//         x = sumArray(avr_6x);
//         y = sumArray(avr_6y);
//         image(images[5], x - 30, y - 30, 50, 30);
//         text("イタリア", x - 30, y + 10);
//       }

      if (j == 4) {
        //配列の先頭を削除、末尾に追加
        avr_1x.shift();
        avr_1y.shift();
        avr_1x.push(x);
        avr_1y.push(y);
        x = sumArray(avr_1x);
        y = sumArray(avr_1y);
        image(images[0], x - 30, y - 30, 50, 30);
        text("アンドラ", x - 30, y + 10);
      }
//       if (j == 5) {
//         //配列の先頭を削除、末尾に追加
//         avr_7x.shift();
//         avr_7y.shift();
//         avr_7x.push(x);
//         avr_7y.push(y);
//         x = sumArray(avr_7x);
//         y = sumArray(avr_7y);
//         image(images[6], x - 30, y - 30, 50, 30);
//         text("エストニア", x - 30, y + 10);
//       }
      if (j == 8) {
        avr_2x.shift();
        avr_2y.shift();
        avr_2x.push(x);
        avr_2y.push(y);
        x = sumArray(avr_2x);
        y = sumArray(avr_2y);
        image(images[1], x - 30, y - 30, 50, 30);
        text("アルバニア", x - 30, y + 10);
      }
//       if (j == 9) {
//         //配列の先頭を削除、末尾に追加
//         avr_8x.shift();
//         avr_8y.shift();
//         avr_8x.push(x);
//         avr_8y.push(y);
//         x = sumArray(avr_8x);
//         y = sumArray(avr_8y);
//         image(images[7], x - 30, y - 30, 50, 30);
//         text("オーストリア", x - 30, y + 10);
//       }
      if (j == 12) {
        avr_3x.shift();
        avr_3y.shift();
        avr_3x.push(x);
        avr_3y.push(y);
        x = sumArray(avr_3x);
        y = sumArray(avr_3y);
        image(images[2], x - 30, y - 30, 50, 30);
        text("イギリス", x - 30, y + 10);
      }
//       if (j == 13) {
//         //配列の先頭を削除、末尾に追加
//         avr_9x.shift();
//         avr_9y.shift();
//         avr_9x.push(x);
//         avr_9y.push(y);
//         x = sumArray(avr_9x);
//         y = sumArray(avr_9y);
//         image(images[8], x - 30, y - 30, 50, 30);
//         text("オランダ", x - 30, y + 10);
//       }
      if (j == 16) {
        avr_4x.shift();
        avr_4y.shift();
        avr_4x.push(x);
        avr_4y.push(y);
        x = sumArray(avr_4x);
        y = sumArray(avr_4y);
        image(images[3], x - 30, y - 30, 50, 30);
        text("アイルランド", x - 30, y + 10);
      }
//       if (j == 17) {
//         //配列の先頭を削除、末尾に追加
//         avr_10x.shift();
//         avr_10y.shift();
//         avr_10x.push(x);
//         avr_10y.push(y);
//         x = sumArray(avr_10x);
//         y = sumArray(avr_10y);
//         image(images[9], x - 30, y - 30, 50, 30);
//         text("北マケドニア", x - 30, y + 10);
//       }
      if (j == 20) {
        avr_5x.shift();
        avr_5y.shift();
        avr_5x.push(x);
        avr_5y.push(y);
        x = sumArray(avr_5x);
        y = sumArray(avr_5y);
        image(images[4], x - 30, y - 30, 50, 30);
        text("アイスランド", x - 30, y + 10);
      }
    }
  }
}

function draw() {
  image(images[0],0,0,images[0].width,images[0].height);
  let img = capture.get(); //画像にして軽量化

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
  image(img, 0, 0);
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
