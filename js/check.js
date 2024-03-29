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
  //回答者の名前取得
  var username = document.getElementById("username").value;
  //Inputfield_numクラスを持つもの(回答1~10)を配列にいれる
  var ans_text = document.getElementsByClassName("Inputfield");
  //Inputfield_numクラスを持つもの(回答1~10)を配列にいれる
  var ans_text_num = document.getElementsByClassName("Inputfield_num");
  //disabled_checkboxクラスを持つもの(画像選択)を配列にいれる
  var check_images = document.getElementsByClassName("disabled_checkbox");

  var imgless = document.getElementsByClassName("Inputfield_imgless");

  var temp = time + "/" + username + "/"; //コピー用データの格納
  for (var i = 0; i < ans_text.length; i++) {
    if (check_images[i].checked == true) {
      //画像のチェックをつけていたら
      temp += "/" + check_images[i].name + ": "; //間にスラッシュを入れてつなげる
    }
    if (ans_text[i].value.length > 0) {
      //テキストが入力されていたら
      temp += ans_text[i].name + "( " + ans_text[i].value + " )"; //間にスラッシュを入れてつなげる
    }

    if (ans_text_num[i].value.length > 0) {
      //テキストが入力されていたら
      temp += ans_text_num[i].name + "( " + ans_text_num[i].value + " )"; //間にスラッシュを入れてつなげる
    }
  }
  for (var i = 0; i < imgless.length; i++) {
    console.log(imgless[i].value);
    if (imgless[i].value.length > 0) {
      //テキストが入力されていたら
      temp += "/" + imgless[i].name + "( " + imgless[i].value + " )"; //間にスラッシュを入れてつなげる
    }
  }

  // document.getElementById("result").value = caesar(temp, 3);//暗号化してresultフォームに入力
  document.getElementById("result").value = temp;

  // var inputElement = document.querySelector('input[name="answer1"]');
  // inputElement.disabled = true;
  // 回答終了後に編集不可にする
  var inputElement = document.querySelectorAll("input.Inputfield");
  var inputElement2 = document.querySelectorAll("input.Inputfield_num");
  for (var i = 0; i < ans_text.length; i++) {
    inputElement[i].disabled = true;
    inputElement2[i].disabled = true;
  }

  var inputElement = document.querySelector('input[name="StopButton"]');
  inputElement.disabled = true; //一度しか押せない
  inputElement.style.backgroundColor = "#02328C"; //押したら色を変える
  //コピーボタンの表示
  document.getElementById("copy").style.visibility = "visible";
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

$(function () {
  // 画像がクリックされた時の処理です。
  $("img.thumbnail").on("click", function () {
    if (!$(this).is(".checked")) {
      // チェックが入っていない画像をクリックした場合、チェックを入れます。
      $(this).addClass("checked");
    } else {
      // チェックが入っている画像をクリックした場合、チェックを外します。
      $(this).removeClass("checked");
    }
  });
});
