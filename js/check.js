myButton = 0; // [Start]/[Stop]のフラグ

function startCheck() {
  // Startボタンを押した
  myStart = new Date(); // スタート時間を退避
  myInterval = setInterval("myDisp()", 1);
  var inputElement = document.querySelector('input[name="startButton"]');
  inputElement.disabled = true; //一度しか押せない
  inputElement.style.backgroundColor = "#02328C"; //押したら色を変える
  //answerHideの中身を見えるようにする
  document.getElementById("answerHide").style.visibility = "visible";
}

function stopCheck() {
  // Stopボタンを押した
  myDisp();
  clearInterval(myInterval);

  var time = document.answerForm.myFormTime.value;
  //Inputfieldクラスを持つもの(回答1~12)を配列にいれる
  var ans_text = document.getElementsByClassName("Inputfield");

  for (var i = 0; i < 12; i++) {
    console.log(ans_text[i].value); //inputの中身を表示
  }

  var temp = time; //コピー用データの格納
  for (var i = 0; i < 12; i++) {
    temp += "/" + ans_text[i].value; //間にスラッシュを入れてつなげる
  }

  document.getElementById("result").value = caesar(temp, 3);

  // var inputElement = document.querySelector('input[name="answer1"]');
  // inputElement.disabled = true;
  // 回答終了後に編集不可にする
  var inputElement = document.querySelectorAll("input.Inputfield");
  for (var i = 0; i < 12; i++) {
    inputElement[i].disabled = true;
  }

  var inputElement = document.querySelector('input[name="StopButton"]');
  inputElement.disabled = true; //一度しか押せない
  inputElement.style.backgroundColor = "#02328C"; //押したら色を変える
}

function myDisp() {
  //時間計測
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

function myFunction() {
  /* Get the text field */
  var copyText = document.getElementById("result");
  // console.log(copyText);

  /* Select the text field */
  copyText.select();
  //   copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  // alert("Copied the text: " + copyText.value);

  swal("コピー完了しました！");
}

function caesar(val, key) {
  //暗号化
  console.log(val);
  val = encodeURIComponent(val);
  var result = "";
  for (var i = 0; i < val.length; i++) {
    result += String.fromCharCode(val.charCodeAt(i) + key);
  }
  return result;
}
