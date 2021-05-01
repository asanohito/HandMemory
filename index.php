<?php
$number = $_POST['number'];
echo $number;
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>HandMemory!</title>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script>
  
  <!-- Be sure to use tfjs 1.7.4, in tfjs 2 they broke their own handpose model-->
  <!-- Require the peer dependencies of handpose. -->
  <script src="https://unpkg.com/@tensorflow/tfjs-core@2.1.0/dist/tf-core.min.js"></script>
  <script src="https://unpkg.com/@tensorflow/tfjs-converter@2.1.0/dist/tf-converter.min.js"></script>

  <!-- You must explicitly require a TF.js backend if you're not using the tfs union bundle. -->
  <script src="https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.1.0/dist/tf-backend-webgl.min.js"></script>
  <!-- Alternatively you can use the WASM backend: <script src="https://unpkg.com/@tensorflow/tfjs-backend-wasm@2.1.0/dist/tf-backend-wasm.js"></script> -->

  <script src="https://unpkg.com/@tensorflow-models/handpose@0.0.6/dist/handpose.min.js"></script>
  <script src="js/grip.js"></script>

  
  <link rel="stylesheet" type="text/css" href="style.css">
  <meta charset="utf-8" />


<!-- <input type="file" accept="image/*;capture=camera"> -->
</head>

<body>
  <script>
    
    //framerate via stats.js
    // ;;; (function () { var script = document.createElement('script'); script.onload = function () { var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop) }); }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script); })()
  </script>

</html>
