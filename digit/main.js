var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'); // get 2D context

    ctx.rect(0,0,20,20);
    ctx.fillStyle="#6E6E6E";
    ctx.fill(); 

ratio = 100/20;

document.getElementById('clear').addEventListener('click', function() {
        document.getElementById("guess").innerHTML = "";
        document.getElementById("one").style.height = "0px";
        document.getElementById("two").style.height = "0px";
        document.getElementById("three").style.height = "0px";
        document.getElementById("four").style.height = "0px";
        document.getElementById("five").style.height = "0px";
        document.getElementById("six").style.height = "0px";
        document.getElementById("seven").style.height = "0px";
        document.getElementById("eight").style.height = "0px";
        document.getElementById("nine").style.height = "0px";
        document.getElementById("zero").style.height = "0px";
        ctx.rect(0,0,20,20);
        ctx.fillStyle="#6E6E6E";
        ctx.fill(); 
      }, false);

/*********** handle mouse events on canvas **************/
var mousedown = false;
// ctx.strokeStyle = '#FFFFFF';
// ctx.lineWidth = 2;
canvas.onmousedown = function(e) {
    var pos = fixPosition(e, canvas);
    mousedown = true;
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.moveTo(pos.x/ratio, pos.y/ratio);
    return false;
};

canvas.onmousemove = function(e) {
    var pos = fixPosition(e, canvas);
    if (mousedown) {
        ctx.lineTo(pos.x/ratio, pos.y/ratio);
        ctx.strokeStyle = '#606060';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};


canvas.onmouseup = function(e) {
    if (!mousedown) {
        return;
    }
    mousedown = false;
    var imgData=ctx.getImageData(0,0,20,20);
    //console.log(imgData);
    var myArr = imgData.data;
    // var str = "";
    var featureVector = [];
    featureVector.push(1); //the bias neuron
    for (var row = 0; row < 20; row++) {
        for (var col = 0; col < 20; col++) {
            // val = myArr[(row*20 + col)*4] > 110 ? "X" : "O";
            // str += val + " ";
            featureVector.push((myArr[(col*20 + row)*4] - 110)/ 145);
        }
        // str += "\n";
    }
    // console.log(str);
    // console.log(featureVector);
    var x = Papa.parse("./theta1.csv", {
        download: true,
        complete: function(results) {
            var theta1 = results.data;
            for (var row = 0; row < 25; row++) {
                for (var col = 0; col < 401; col++) {
                    theta1[row][col] = Number(theta1[row][col]);
                }
            }
            theta1 = theta1.slice(0,25);
            var x = Papa.parse("./theta2.csv", {
                download: true,
                complete: function(results2) {
                    var theta2 = results2.data;
                    for (var row = 0; row < 10; row++) {
                        for (var col = 0; col < 26; col++) {
                            theta2[row][col] = Number(theta2[row][col]);
                        }
                    }
                    theta1 = math.matrix(theta1);
                    theta2 = math.matrix(theta2.slice(0,10)); //10 x 26
                    theta1 = math.transpose(theta1); // 401 x 25
                    theta2 = math.transpose(theta2); //26 x 10
                    featureVector = math.matrix(featureVector);
                    var Z2 = math.multiply(featureVector, theta1); // 1 x 25
                    // console.log(Z2);
                    var A2 = Z2._data;
                    for (var i = 0; i < 25; i++) {
                        A2[i] = sigmoid(A2[i]);
                    }
                    A2.unshift(1);
                    A2 = math.matrix(A2);
                    // console.log(A2);
                    var A3 = math.multiply(A2, theta2)._data;
                    // console.log(A3);
                    for (var i = 0; i < 10; i++) {
                        A3[i] = sigmoid(A3[i]);
                    }
                    // console.log(A3);
                    var i = A3.indexOf(Math.max.apply(Math, A3));
                    var guess = ((i+1)%10) + ", Confidence: " + Math.round(A3[i]*100) + "%";
                    if (A3[i] < 0.5) {
                        guess = "???";
                    }
                    document.getElementById("guess").innerHTML = "Guess: " + guess ;
                    document.getElementById("one").style.height = "" + A3[0]*100 + "px";
                    document.getElementById("two").style.height = "" + A3[1]*100 + "px";
                    document.getElementById("three").style.height = "" + A3[2]*100 + "px";
                    document.getElementById("four").style.height = "" + A3[3]*100 + "px";
                    document.getElementById("five").style.height = "" + A3[4]*100 + "px";
                    document.getElementById("six").style.height = "" + A3[5]*100 + "px";
                    document.getElementById("seven").style.height = "" + A3[6]*100 + "px";
                    document.getElementById("eight").style.height = "" + A3[7]*100 + "px";
                    document.getElementById("nine").style.height = "" + A3[8]*100 + "px";
                    document.getElementById("zero").style.height = "" + A3[9]*100 + "px";
                }
            });
        }
    });
};

canvas.onmouseleave = canvas.onmouseup;

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

/********** utils ******************/
// Thanks to http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/4430498#4430498
function fixPosition(e, gCanvasElement) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    } 
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    return {x: x, y:y};
}