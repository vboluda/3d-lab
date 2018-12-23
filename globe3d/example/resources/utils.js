
function showLabel(obj, px, py) {
    var texto = [
        'Country: ' + obj.properties.name,
        'GDP: ' + (!obj.gdp ? 'no data' : obj.gdp),
        'Position: ' + (!obj.position ? 'no data' : obj.position)
    ];
    if (obj.nombre == "indefined") {
        texto = ['NO DATA'];
    }
    var canvas = makeTextSprite(texto, {fontsize: 24,
        borderThickness: 5,
        borderColor: {r: 130, g: 94, b: 53, a: 1},
        backgroundColor: {r: 240, g: 182, b: 116, a: 0.7},
        textColor: {r: 130, g: 94, b: 53, a: 1}
    });
    canvas.style.position = "absolute";
    canvas.style.top = "" + py + "px";
    canvas.style.left = "" + px + "px";
    canvas.zIndex = 8;
    return canvas;
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