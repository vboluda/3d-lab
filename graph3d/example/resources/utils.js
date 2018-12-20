
function showText(message, parameters)
{
    var fontface = null, fontsize = null, borderThickness = null,
            borderColor = null, backgroundColor = null, vpadding = null,
            hpadding = null, rectWidth = 0, rectHeight = 0,
            canvas = null, context = null,
            i = 0, sz = 0, s = "", textColor;
    if (parameters === undefined)
        parameters = {};

    fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

    fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

    borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

    borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : {r: 0, g: 0, b: 0, a: 1.0};

    backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : {r: 255, g: 255, b: 255, a: 1.0};
    textColor = parameters.hasOwnProperty("textColor") ?
            parameters["textColor"] : {r: 0, g: 0, b: 0, a: 1.0};
    vpadding = parameters.hasOwnProperty("vpadding") ?
            parameters["vpadding"] : 4;
    hpadding = parameters.hasOwnProperty("hpadding") ?
            parameters["hpadding"] : 4;

    canvas = document.createElement('canvas');
    canvas.id = "canvasInfo_" + Math.random();
    context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;


    // get size data (height depends only on font size)
    // Calculate rect dimension. Width=MAX message[i].widt ; Heigh=numLines*fontsize;
    for (i = 0, sz = message.length; i < sz; i++) {
        s = message[i], metrics = context.measureText(s), textWidth = metrics.width, textHeigh = null;
        if (textWidth > rectWidth) {
            rectWidth = textWidth;
        }
        textHeigh = fontsize;
        rectHeight = rectHeight + textHeigh;
    }
    rectHeight = (rectHeight * 1.4) + vpadding * 2;
    rectWidth = rectWidth + hpadding * 2;
    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";


    roundRectangle(context, borderThickness / 2, borderThickness / 2, rectWidth + borderThickness, rectHeight + borderThickness, 6, borderThickness);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + ","
            + textColor.b + "," + textColor.a + ")";
    for (i = 0, sz = message.length; i < sz; i++) {
        s = message[i];
        context.fillText(s, borderThickness + hpadding, (fontsize * 1.4 * i) + fontsize + borderThickness + vpadding);
    }
    return canvas;
}

// function for drawing rounded rectangles
function roundRectangle(ctx, x, y, w, h, r, border)
{
    var oldlineWidth = ctx.lineWidth;
    ctx.lineWidth = border;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    if (border > 0) {
        ctx.stroke();
    }
    ctx.lineWidth = oldlineWidth;
}

function controlDialog() {
    this.modal = document.getElementById('myModal');
    var _this=this;
// Get the button that opens the modal
    this.btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
    this.span = document.getElementsByClassName("close")[0];


//    this.btn.onclick = function () {
//         _this.modal.style.display = "block";
//    }

// When the user clicks on <span> (x), close the modal
    this.span.onclick = function () {
         _this.modal.style.display = "none";
         _this.whenClose();
    }

// When the user clicks anywhere outside of the modal, close it
    this.whenClose=function(){};
    window.onclick = function (event) {
        if (event.target == modal) {
             _this.modal.style.display = "none";
              _this.whenClose();
        }
    }
    
    
    this.show=function(){
        this.modal.style.display = "block";
       
    }

    return this;
}