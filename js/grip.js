// 右手親指1 + 左手小指6
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

var dis_w = 1366; //iPad Pro 12.9インチ(2732×2048)
var dis_h = 981; //ウィンドウ 1366*981

const top_space = 66;
const bottom_space = 872;
const left_space = 43;
const right_space = 1323; //64

//画像
let images = []; //暗記画像

//暗記文字
let finger_text = [
  "佐藤",
  "鈴木",
  "高橋",
  "田中",
  "伊藤",
  "渡辺",
  "山本",
  "中村",
  "小林",
  "加藤",
];

//フレーム間の平均
let avr_0x = new Array(6);
let avr_1x = new Array(6);
let avr_2x = new Array(6);
let avr_3x = new Array(6);
let avr_4x = new Array(6);
let avr_5x = new Array(6);

let avr_0y = new Array(6);
let avr_1y = new Array(6);
let avr_2y = new Array(6);
let avr_3y = new Array(6);
let avr_4y = new Array(6);
let avr_5y = new Array(6);

let avr_6x = new Array(6);
let avr_7x = new Array(6);
let avr_8x = new Array(6);
let avr_9x = new Array(6);

let avr_6y = new Array(6);
let avr_7y = new Array(6);
let avr_8y = new Array(6);
let avr_9y = new Array(6);

//右手か左手か
var right_hand = true;
//画面に触れているか
var touch_hand = false;

// Load the MediaPipe handpose model assets.
// handpose.load().then(function (_model) {
//   // console.log("model initialized.")
//   statusText = "Model loaded.";
//   handposeModel = _model;
// });

function preload() {
  images[0] = loadImage("images/MISSCOLE/miss0.jpeg");
  images[1] = loadImage("images/MISSCOLE/miss1.jpeg");
  images[2] = loadImage("images/MISSCOLE/miss2.jpeg");
  images[3] = loadImage("images/MISSCOLE/miss3.jpeg");
  images[4] = loadImage("images/MISSCOLE/miss4.jpeg");
  images[5] = loadImage("images/MISSCOLE/mr0.jpeg");
  images[6] = loadImage("images/MISSCOLE/mr1.jpeg");
  images[7] = loadImage("images/MISSCOLE/mr2.jpeg");
  images[8] = loadImage("images/MISSCOLE/mr3.jpeg");
  images[9] = loadImage("images/MISSCOLE/mr4.jpeg");

  // Load the MediaPipe handpose model assets.
  handpose.load().then(function (_model) {
    // console.log("model initialized.")
    statusText = "Model loaded.";
    handposeModel = _model;
  });
}
/*
window.onload = function() {
  // 画面に触れはじめたときのイベントに関数を登録
  document.body.addEventListener("touchstart", handle_touch);
};*/

function setup() {
  let constraints = {
    video: {
      width: { min: 1280 }, //映像は1280*720
      height: { min: 720 },
      facingMode: { exact: "environment" },
    },
  };

  capture = createCapture(constraints);

  // this is to make sure the capture is loaded before asking handpose to take a look
  // otherwise handpose will be very unhappy
  capture.elt.onloadeddata = function () {
    // console.log("video initialized");
    videoDataLoaded = true;
    // createCanvas(capture.width, capture.height);
    createCanvas(dis_w, dis_h); //スマホ横にしたときの可視領域
    console.log(capture.width, capture.height);
  };

  capture.hide();

  textSize(100);

  fill(100);
  rect(0, 0, 90, dis_h);
  rect(1290, 0, 90, dis_h);
}

document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

// function changehand() {
//   right_hand = !right_hand;
//   if (right_hand) {
//     button.style.backgroundColor = "lightblue";
//   } else {
//     button.style.backgroundColor = "#00b8ff";
//   }
// }

function touchStarted() {
  if (mouseX < 300) {
    touch_hand = true;
    right_hand = false;
    fill(80);
    noStroke();
    rect(0, 0, 90, dis_h);
    rect(1290, 0, 90, dis_h);
  } else if (mouseX > 1100) {
    touch_hand = true;
    right_hand = true;
    fill(80);
    noStroke();
    rect(0, 0, 90, dis_h);
    rect(1290, 0, 90, dis_h);
  }
}
function touchEnded() {
  touch_hand = false;
  fill(100);
  noStroke();
  rect(0, 0, 90, dis_h);
  rect(1290, 0, 90, dis_h);
}

//配列の平均
const sumArray = (array) => {
  let sum = 0;
  for (let i = 0, len = array.length; i < len; i++) {
    sum += array[i];
  }
  return sum / 6;
};
/*
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
*/

// draw a hand object returned by handpose
function drawShape(hands) {
  fill(0, 0, 255);
  textAlign(CENTER, CENTER);
  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j]; //指の位置座標取得
      // x = x*2.1;
      // y = y*2.1;
      var adjustment = 1; //画面サイズに合わせて暗記項目の配置を調整
      if (!touch_hand) {
        if (j == 4) {
          //配列の先頭を削除、末尾に追加
          avr_0x.shift();
          avr_0y.shift();
          avr_0x.push(x);
          avr_0y.push(y);
          x = adjustment * sumArray(avr_0x) + left_space;
          y = adjustment * sumArray(avr_0y) + top_space;

          image(images[0], x - 40, y - 30, 80, 100);
          text(finger_text[0], x, y + 75);
        }

        if (j == 8) {
          avr_1x.shift();
          avr_1y.shift();
          avr_1x.push(x);
          avr_1y.push(y);
          x = adjustment * sumArray(avr_1x) + left_space;
          y = adjustment * sumArray(avr_1y) + top_space;
          image(images[1], x - 40, y - 30, 80, 100);
          text(finger_text[1], x, y + 75);
        }

        if (j == 12) {
          avr_2x.shift();
          avr_2y.shift();
          avr_2x.push(x);
          avr_2y.push(y);
          x = adjustment * sumArray(avr_2x) + left_space;
          y = adjustment * sumArray(avr_2y) + top_space;
          image(images[2], x - 40, y - 30, 80, 100);
          text(finger_text[2], x, y + 75);
        }

        if (j == 16) {
          avr_3x.shift();
          avr_3y.shift();
          avr_3x.push(x);
          avr_3y.push(y);
          x = adjustment * sumArray(avr_3x) + left_space;
          y = adjustment * sumArray(avr_3y) + top_space;
          image(images[3], x - 40, y - 30, 80, 100);
          text(finger_text[3], x, y + 75);
        }

        if (j == 20) {
          avr_4x.shift();
          avr_4y.shift();
          avr_4x.push(x);
          avr_4y.push(y);
          x = adjustment * sumArray(avr_4x) + left_space;
          y = adjustment * sumArray(avr_4y) + top_space;
          image(images[4], x - 40, y - 30, 80, 100);
          text(finger_text[4], x, y + 75);
        }
        if (j == 2) {
          avr_5x.shift();
          avr_5y.shift();
          avr_5x.push(x);
          avr_5y.push(y);
          x = adjustment * sumArray(avr_5x) + left_space;
          y = adjustment * sumArray(avr_5y) + top_space;
          image(images[5], x - 40, y - 50, 80, 100);
          text(finger_text[5], x, y + 55);
        }
        if (j == 5) {
          avr_6x.shift();
          avr_6y.shift();
          avr_6x.push(x);
          avr_6y.push(y);
          x = adjustment * sumArray(avr_6x) + left_space;
          y = adjustment * sumArray(avr_6y) + top_space;
          image(images[6], x - 50, y - 50, 80, 100);
          text(finger_text[6], x - 10, y + 55);
        }
        if (j == 17) {
          avr_7x.shift();
          avr_7y.shift();
          avr_7x.push(x);
          avr_7y.push(y);
          x = adjustment * sumArray(avr_7x) + left_space;
          y = adjustment * sumArray(avr_7y) + top_space;
          image(images[7], x - 30, y - 50, 80, 100);
          text(finger_text[7], x + 10, y + 55);
        }
        if (j == 13) {
          center_x =
            (landmarks[0][0] + landmarks[9][0] + landmarks[13][0]) / 3.0;
          center_y =
            (landmarks[0][1] + landmarks[9][1] + landmarks[13][1]) / 3.0;
          avr_8x.shift();
          avr_8y.shift();
          avr_8x.push(center_x);
          avr_8y.push(center_y);
          x = adjustment * sumArray(avr_8x) + left_space;
          y = adjustment * sumArray(avr_8y) + top_space;
          image(images[8], x - 40, y - 80, 80, 100);
          text(finger_text[8], x, y + 25);
        }
        if (j == 0) {
          avr_9x.shift();
          avr_9y.shift();
          avr_9x.push(x);
          avr_9y.push(y);
          x = adjustment * sumArray(avr_9x) + left_space;
          y = adjustment * sumArray(avr_9y) + top_space;
          image(images[9], x - 40, y - 70, 80, 100);
          text(finger_text[9], x, y + 35);
        }
      }
    }
  }
}

function draw() {
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
    //   }

    // background(200);

    // first draw the debug video and annotations
    push();
    noStroke();
    fill(80);
    rect(0, 0, dis_w, dis_h);
    image(img, left_space, top_space, 1280, 720);
    fill(255, 0, 0, 80);
    stroke(255);
    strokeWeight(3);
    textSize(20);
    drawShape(myHands); // draw my hand skeleton
    pop();
    if (touch_hand == true) {
      fill(80);
    } else {
      fill(100);
    }
    noStroke();
    rect(0, 0, left_space, dis_h);
    rect(1290, 0, right_space, dis_h);
    /*
  push();
  fill(255, 255, 0);
  text(statusText, 2, 60);
  pop();*/
  }
}
