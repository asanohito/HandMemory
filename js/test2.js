// 左手親指1 + 右手小指6
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
let images = []; //暗記画像

let finger_text = [
  "宮城県",
  "鹿児島県",
  "群馬県",
  "福岡県",
  "岐阜県",
  "佐賀県",
  "奈良県",
  "岡山県",
  "愛知県",
  "大分県",
]; //暗記文字

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
  // images[0] = loadImage("images/ADL.png");
  // images[1] = loadImage("images/ALL.png");
  // images[2] = loadImage("images/GBL.png");
  // images[3] = loadImage("images/IEL.png");
  // images[4] = loadImage("images/ISL.png");
  // images[5] = loadImage("images/ITL.png");
  // images[6] = loadImage("images/EEL.png");
  // images[7] = loadImage("images/ATL.png");
  // images[8] = loadImage("images/NLL.png");
  // images[9] = loadImage("images/MKL.png");

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
      mandatory: {
        // minWidth: 1280,
        // minHeight: 720,
      },
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
    createCanvas(980, 482); //スマホ横にしたときの可視領域
    console.log(capture.width, capture.height);
  };

  capture.hide();

  textSize(100);

  fill(100);
  rect(0, 0, 90, 482);
  rect(890, 0, 90, 482);
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
  if (mouseX < 120) {
    touch_hand = true;
    right_hand = false;
    fill(80);
    noStroke();
    rect(0, 0, 90, 482);
    rect(890, 0, 90, 482);
  } else if (mouseX > 860) {
    touch_hand = true;
    right_hand = true;
    fill(80);
    noStroke();
    rect(0, 0, 90, 482);
    rect(890, 0, 190, 482);
  }
}
function touchEnded() {
  touch_hand = false;
  fill(100);
  noStroke();
  rect(0, 0, 90, 482);
  rect(890, 0, 190, 482);
}

//配列の平均
const sumArray = (array) => {
  let sum = 0;
  for (let i = 0, len = array.length; i < len; i++) {
    sum += array[i];
  }
  return sum / 4;
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
  fill(255, 0, 0);
  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks;

    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j]; //指の位置座標取得
      // x = x*2.1;
      // y = y*2.1;
      var adjustment = 1.25; //画面サイズに合わせて暗記項目の配置を調整
      if (touch_hand) {
        if (j == 4) {
          //配列の先頭を削除、末尾に追加
          avr_1x.shift();
          avr_1y.shift();
          avr_1x.push(x);
          avr_1y.push(y);
          x = adjustment * sumArray(avr_1x) + 90;
          y = sumArray(avr_1y);
          if (right_hand) {
            // image(images[0], x - 30, y - 30, 50, 30);
            text(finger_text[0], x - 30, y + 10);
          } else {
            // image(images[5], x - 30, y - 30, 50, 30);
            text(finger_text[9], x - 30, y + 10);
          }
        }

        if (j == 8) {
          avr_2x.shift();
          avr_2y.shift();
          avr_2x.push(x);
          avr_2y.push(y);
          x = adjustment * sumArray(avr_2x) + 90;
          y = sumArray(avr_2y);
          if (right_hand) {
            // image(images[1], x - 30, y - 30, 50, 30);
            text(finger_text[1], x - 30, y + 10);
          } else {
            // image(images[6], x - 30, y - 30, 50, 30);
            text(finger_text[8], x - 30, y + 10);
          }
        }

        if (j == 12) {
          avr_3x.shift();
          avr_3y.shift();
          avr_3x.push(x);
          avr_3y.push(y);
          x = adjustment * sumArray(avr_3x) + 90;
          y = sumArray(avr_3y);
          if (right_hand) {
            // image(images[2], x - 30, y - 30, 50, 30);
            text(finger_text[2], x - 30, y + 10);
          } else {
            // image(images[7], x - 30, y - 30, 50, 30);
            text(finger_text[7], x - 30, y + 10);
          }
        }

        if (j == 16) {
          avr_4x.shift();
          avr_4y.shift();
          avr_4x.push(x);
          avr_4y.push(y);
          x = adjustment * sumArray(avr_4x) + 90;
          y = sumArray(avr_4y);
          if (right_hand) {
            // image(images[3], x - 30, y - 30, 50, 30);
            text(finger_text[3], x - 30, y + 10);
          } else {
            // image(images[8], x - 30, y - 30, 50, 30);
            text(finger_text[6], x - 30, y + 10);
          }
        }

        if (j == 20) {
          avr_5x.shift();
          avr_5y.shift();
          avr_5x.push(x);
          avr_5y.push(y);
          x = adjustment * sumArray(avr_5x) + 90;
          y = sumArray(avr_5y);
          if (right_hand) {
            // image(images[4], x - 30, y - 30, 50, 30);
            text(finger_text[4], x - 30, y + 10);
          } else {
            // image(images[9], x - 30, y - 30, 50, 30);
            text(finger_text[5], x - 30, y + 10);
          }
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
    image(img, 90, -80, 800, 640);
    fill(255, 0, 0, 80);
    stroke(255);
    strokeWeight(3);
    drawShape(myHands); // draw my hand skeleton
    pop();
    if (touch_hand == true) {
      fill(80);
    } else {
      fill(100);
    }
    noStroke();
    rect(0, 0, 90, 482);
    rect(890, 0, 190, 482);
    /*
  push();
  fill(255, 255, 0);
  text(statusText, 2, 60);
  pop();*/
  }
}
