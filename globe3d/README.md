Glob3d
=======
3D Graphical visualization for earth based on [Threejs](https://threejs.org/ "Threejs link")

Screenshot
==========
![Screenshot](https://github.com/vboluda/3d-lab/blob/master/graph3d/example/resources/globe3d.jpg)

Example
=======
* [DEMO](https://htmlpreview.github.io/?https://github.com/vboluda/3d-lab/blob/master/globe3d/example/example.html "Graph3D demo")
* [SOURCE](https://github.com/vboluda/3d-lab/tree/master/globe3d/lib "Globe3d source")


Usage
=====
* First, instance graph3D object
```
var gr = new Graph3D({
    showStats: true,
    domElement: document.body,
    showdata:function(dataProvider){
        return showText([
                'Serie: ' + dataProvider.serie, //Example. Use your own dataprovider
                'Value: ' + dataProvider.mag //Example. Use your own dataprovider
            ], {fontsize: 12,
                borderThickness: 2,
                borderColor: {r: 130, g: 94, b: 53, a: 1},
                backgroundColor: {r: 240, g: 182, b: 116, a: 0.7},
                textColor: {r: 130, g: 94, b: 53, a: 1}
            });
    }});
```

* Initialize with data
```
 gr.init(data);
```

* Create auxiliary functions and events
```
function animate() {
    requestAnimationFrame(animate);
    gr.render();
    gr.update();
}

function onWindowResize(event) {
    gr.onWindowResize(event);
}

function onMouseMove(event) {
    gr.onMouseMove(event);
}

function onMouseDown(event) {
    gr.onMouseDown(event);
}
 function onMouseUp(event) {
    gr.onMouseUp(event);
}
function onMouseDblClk(event) {
    gr.onMouseDblClk(event);
}
document.body.addEventListener('resize', onWindowResize, false);
document.body.addEventListener('mousemove', onMouseMove, false);
document.body.addEventListener('mousedown', onMouseDown, false);
document.body.addEventListener('mouseup', onMouseUp, false);
document.body.addEventListener('dblclick', onMouseDblClk, false);
```

[See complete example](https://github.com/vboluda/3d-lab/tree/master/globe3d/example/example.html "Globe3d example")

License
========
MIT License

Donation
========
Thanks for donating a cup of coffee...

<div>
 <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Bitcoin" width="15px" height="15px">
<a href="bitcoin:14YeKAkWSqj2Y61rWAJu3dWZgBUca4G4LK](bitcoin:14YeKAkWSqj2Y61rWAJu3dWZgBUca4G4LK">14YeKAkWSqj2Y61rWAJu3dWZgBUca4G4LK</a>
</div>