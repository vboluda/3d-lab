Glob3d
=======
3D Graphical visualization for earth based on [Threejs](https://threejs.org/ "Threejs link")

Screenshot
==========
![Screenshot](https://github.com/vboluda/3d-lab/blob/master/globe3d/example/resources/globe3d.jpg)

Example
=======
* [DEMO](https://htmlpreview.github.io/?https://github.com/vboluda/3d-lab/blob/master/globe3d/example/example.html "Graph3D demo")
* [SOURCE](https://github.com/vboluda/3d-lab/tree/master/globe3d/lib/Globe3d.js "Globe3d source")


Usage
=====
* First, instance Globe3d object
```
var globe = new Globe3d({
    onSelectBox:function(dataprovider,px,py){
        return <<show information>>
    }
});
```

* Initialize with data
```
  globe.init(data);
```

* Create auxiliary functions and events
```
function animate() {
    requestAnimationFrame(animate);
    globe.render();
}

 window.addEventListener('resize', function (event) {
    globe.onWindowResize(event, globe)
}, false);
window.addEventListener('mousemove', function (event) {
    globe.onMouseMove(event, globe)
}, false);
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