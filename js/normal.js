let imageNumber = 0;
function changeImage() {
  if (imageNumber == 0) {
    document.getElementById("iNumber2").style.display = "block";
    document.getElementById("iNumber1").style.display = "none";
    document.getElementById("iNumber2_text").style.display = "block";
    document.getElementById("iNumber1_text").style.display = "none";
    imageNumber = 1;
  } else {
    document.getElementById("iNumber1").style.display = "block";
    document.getElementById("iNumber2").style.display = "none";
    document.getElementById("iNumber1_text").style.display = "block";
    document.getElementById("iNumber2_text").style.display = "none";
    imageNumber = 0;
  }
}
