EARTH3D
=======
3D Graphical visualization based on [Threejs](https://threejs.org/ "Threejs link") for geolocalized data

Screenshot
==========
![Screenshot](https://github.com/vboluda/3d-lab/blob/master/earth3d/example/resources/Screenshot.jpg)

Example
=======
* [DEMO](https://vboluda.github.io/earth3d/example/example.html "EARTH3D demo")
* [SOURCE](https://github.com/vboluda/3d-lab/blob/master/earth3d/lib/earth3d.js "Earth3d source")


Usage
=====
* First, instance graph3D object
```
var spr = new GeoPosition({ 
                domElement: element,
                showStats: true,
                texture:'resources/world_black.jpg',
                onSelectBox: function (dataProvider) {
                    return showText([
                        'IP: ' + dataProvider.ip,
                        'Num Access: ' + dataProvider.accesos,
                        'Country: ' + dataProvider.country,
                        'City: ' + dataProvider.city
                    ],{         
                        fontsize: 12,
                        borderThickness: 0,
                        borderColor: {r: 0, g: 100, b: 160, a: 1},
                        backgroundColor: {r: 151, g: 182, b: 204, a: 0.7}
                    });
                }
            }); 
```

* Initialize with data
```
 spr.init(data);
```

* Create auxiliary functions and events
```
function animate() {
    requestAnimationFrame(animate);
    gr.render();
    gr.update();
}

function onWindowResize(event) {
    spr.onWindowResize(event);
}

function onMouseMove(event) {
    spr.onMouseMove(event);
}
element.addEventListener('resize', onWindowResize, false);
element.addEventListener('mousemove', onMouseMove, false);
```

[See complete example](https://github.com/vboluda/3d-lab/blob/master/earth3d/example/example.html "Graph3D example")

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