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

// Load the MediaPipe handpose model assets.
handpose.load().then(function (_model) {
	// console.log("model initialized.")
	statusText = "Model loaded."
	handposeModel = _model;
})


function setup() {
	// createCanvas(window.innerWidth, window.innerHeight);
	// createCanvas(640, 360);
	capture = createCapture(VIDEO);

	// this is to make sure the capture is loaded before asking handpose to take a look
	// otherwise handpose will be very unhappy
	capture.elt.onloadeddata = function () {
		// console.log("video initialized");
		videoDataLoaded = true;
		createCanvas(capture.width, capture.height);
	}

	capture.hide();

	// textSize(50);
	// strokeWeight(3);

}

// draw a hand object returned by handpose
function drawShape(hands) {
	 fill(255,0,0);
	// Each hand object contains a `landmarks` property,
	// which is an array of 21 3-D landmarks.
	for (var i = 0; i < hands.length; i++) {
		var landmarks = hands[i].landmarks;
/* 
		beginShape();
		for (var j = 0; j < landmarks.length; j++) {
			var [x, y, z] = landmarks[j];

			if (j == 4 || j == 8 || j == 12 || j == 16 || j == 20) {
				vertex(x, y);
			}
		}
		endShape(CLOSE);
		*/
		for (var j = 0; j < landmarks.length; j++) {
			var [x, y, z] = landmarks[j];
/*
			if (j == 4 || j == 8 || j == 12 || j == 16 || j == 20) {
				ellipse(x,y,10,10); //指先に円を表示
			}*/
			if(j==4){
				text("りんご",x,y);
			}
				if(j==8){
				text("バナナ",x,y);
			}
				if(j==12){
				text("玉ねぎ",x,y);
			}
				if(j==16){
				text("人参",x,y);
			}
				if(j==20){
				text("豚肉",x,y);
			}
			
		}
	}
}


function draw() {

	if (handposeModel && videoDataLoaded) { // model and video both loaded, 

		handposeModel.estimateHands(capture.elt).then(function (_hands) {
			// we're handling an async promise
			// best to avoid drawing something here! it might produce weird results due to racing

			myHands = _hands; // update the global myHands object with the detected hands
			if (!myHands.length) {
				// haven't found any hands
				statusText = "Show some hands!"
			} else {
				// display the confidence, to 3 decimal places
				statusText = "Confidence: " + (Math.round(myHands[0].handInViewConfidence * 1000) / 1000);

			}

		})
	}

	background(200);

	// first draw the debug video and annotations
	push();
	image(capture,0,0, width, height);
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