let imageNumber = 0;
function changeImage() {
  if (imageNumber == 0) {
    document.getElementById("iNumber2").style.visibility = "visible";
    document.getElementById("iNumber1").style.visibility = "collapse";
    imageNumber = 1;
    console.log(imageNumber);
  } else {
    document.getElementById("iNumber1").style.visibility = "visible";
    document.getElementById("iNumber2").style.visibility = "collapse";
    imageNumber = 0;
    console.log(imageNumber);
  }
}
