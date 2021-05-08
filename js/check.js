myButton = 0; // [Start]/[Stop]のフラグ

let ansHide = document.getElementById("answerHide");
console.log(ansHide);

function startCheck() {
  // Startボタンを押した
  myStart = new Date(); // スタート時間を退避
  // myButton = 1;
  myInterval = setInterval("myDisp()", 1);
  var inputElement = document.querySelector('input[name="startButton"]');
  inputElement.disabled = true;
  inputElement.style.backgroundColor = "#096CB3";
  document.getElementById("answerHide").style.visibility = "visible";
}

function stopCheck() {
  // Stopボタンを押した
  myDisp();
  clearInterval(myInterval);

  var time = document.answerForm.myFormTime.value;
  var ans_text1 = document.answerForm.answer1.value;
  var ans_text2 = document.answerForm.answer2.value;
  var ans_text3 = document.answerForm.answer3.value;
  var ans_text4 = document.answerForm.answer4.value;
  var ans_text5 = document.answerForm.answer5.value;
  var ans_text6 = document.answerForm.answer6.value;
  var ans_text7 = document.answerForm.answer7.value;
  var ans_text8 = document.answerForm.answer8.value;
  var ans_text9 = document.answerForm.answer9.value;
  var ans_text10 = document.answerForm.answer10.value;

  document.answerForm.answerResult.value =
    time +
    "/" +
    ans_text1 +
    "/" +
    ans_text2 +
    "/" +
    ans_text3 +
    "/" +
    ans_text4 +
    "/" +
    ans_text5 +
    "/" +
    ans_text6 +
    "/" +
    ans_text7 +
    "/" +
    ans_text8 +
    "/" +
    ans_text9 +
    "/" +
    ans_text10;

  // var inputElement = document.querySelector('input[name="answer1"]');
  // inputElement.disabled = true;
  // 回答終了後に編集不可にする
  var inputElement = document.querySelectorAll("input.Inputfield");
  for (var i = 0; i < 10; i++) {
    inputElement[i].disabled = true;
  }

  var inputElement = document.querySelector('input[name="StopButton"]');
  inputElement.disabled = true;
  inputElement.style.backgroundColor = "#096CB3";
}

function myDisp() {
  myStop = new Date(); // 経過時間を退避
  myTime = myStop.getTime() - myStart.getTime(); // 通算ミリ秒計算
  myH = Math.floor(myTime / (60 * 60 * 1000)); // '時間'取得
  myTime = myTime - myH * 60 * 60 * 1000;
  myM = Math.floor(myTime / (60 * 1000)); // '分'取得
  myTime = myTime - myM * 60 * 1000;
  myS = Math.floor(myTime / 1000); // '秒'取得
  myMS = myTime % 1000; // 'ミリ秒'取得
  document.answerForm.myFormTime.value =
    myH + ":" + myM + ":" + myS + ":" + myMS;
}

function checkText() {
  //   var ans_text1 = document.answerForm.answer1.value;
  var ans_text1 = document.getElementById("an1");
  var ans_text2 = document.answerForm.answer2.value;
  var ans_text3 = document.answerForm.answer3.value;
  alert(ans_text1.value);
}

function myFunction() {
  /* Get the text field */
  var copyText = document.getElementById("result");
  console.log(copyText);

  /* Select the text field */
  copyText.select();
  //   copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  // alert("Copied the text: " + copyText.value);
  alert("コピー完了");
}
