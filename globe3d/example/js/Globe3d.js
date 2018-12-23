
/* 
 * GLOBE 3D
 * Based on Mr.Doob's Threejs
 * (C) Vicente Boluda Vias 2016
 */

function Globe3d(opts) {
    this.version = "0.3";
    console.log("Globe 3d", this.version);
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = null;
    this.trackballControls = null;
    this.pointed = null;
    this.W = 0;
    this.H = 0;
    this.isFullScreen = true;
    this.root_object = null;
    //OPTIONS
    opts = opts || {};
    this.domElement = opts.domElement || document.body;
    this.W = opts.width || window.innerWidth;
    this.H = opts.heigh || window.innerHeight;
    this.minExtrude = opts.minExtrude || 3;
    this.maxExtrude = opts.maxExtrude || 40;
    this.onPointed = opts.onPointed || function (elem) {
    }
    this.pointedColor = opts.pointedColor || 0xFF0000;
    this.countryColor = opts.countryColor || function (elem) {
        return 0x664400;
    }

    this.init = function (data) {
        this.globeData = data;
        if (!Detector.webgl)
            Detector.addGetWebGLMessage(),
                    elem = null;
        if (this.domElement == document.body) { //ie Is full screen
            this.W = window.innerWidth;
            this.H = window.innerHeight;
            this.isFullScreen = true;
        } else {
            this.isFullScreen = false;
        }
        //SET RENDERER AND DOCK TO WEB PAGE
        this.renderer.setSize(this.W, this.H);
        this.domElement.appendChild(this.renderer.domElement);
        this.domElement.style.cursor = "crosshair";
        //INIT 3D ELEMENTS
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.z = 400;
        this.camera.position.y = 400;

        var alight = new THREE.AmbientLight(0xA9A9A9); // soft white light
        this.scene.add(alight);
        var light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
        light.position.set(1, 0, 0);
        this.scene.add(light);
        var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.5);
        light2.position.set(0, 0, 1);
        this.scene.add(light2);
        var light3 = new THREE.DirectionalLight(0xAAAAAA, 1);
        light3.position.set(0, 0, -1);
        this.scene.add(light3);

        this.initGlobe();

        this.trackballControls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    }

    this.add_country = function (shape_points, _offset, data) {
        var shape = new THREE.Shape(shape_points);
        var shape_geom;
        var inner_radius = 300.0;
        var outer_radius = 305.0;

        shape_geom = shape.extrude({
            amount: outer_radius - inner_radius,
            bevelEnabled: false
        });

        var offset = 0;
        //if ( ! uniform_height )
        offset = _offset;//Math.pow( Math.random(),5) * extrusion_amount;

        shape_geom.vertices.forEach(function (vert, index) {
            var radius = 0.0;
            if (index < shape_geom.vertices.length / 2) {
                radius = inner_radius;
            } else {
                radius = inner_radius + offset;
            }
            var phi = (90.0 - vert.y) * Math.PI / 180.0;
            var theta = (360.0 - vert.x) * Math.PI / 180.0;
            vert.x = radius * Math.sin(phi) * Math.cos(theta);
            vert.y = radius * Math.cos(phi);
            vert.z = radius * Math.sin(phi) * Math.sin(theta);
        });

        var color = new THREE.Color(this.countryColor(data));
        //if (! uniform_color)
        //    color.setHSL(Math.random(),Math.random(),Math.random() );

        var shape_material = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide,
            specular: 0x555555,
            ambient: 0x555555,
            shininess: 5
        });
//                var materialSide = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
        var shape_mesh = new THREE.Mesh(shape_geom, shape_material);
        shape_mesh.data = data;
        shape_mesh.onPointed = this.onPointed;
        shape_mesh.realColor = this.countryColor(data);
        this.root_object.add(shape_mesh);
        return shape_mesh;
    }

    this.initGlobe = function () {
        this.merge_gdp();
        if (this.root_object) {
            this.scene.remove(this.root_object);
        }

        this.root_object = new THREE.Object3D();
        this.scene.add(this.root_object);
        var _this = this;
        countries.features.forEach(function (country) {
            if (country.geometry.coordinates.length === 1) {
                var shape_points = [];
                country.geometry.coordinates[0].forEach(function (points) {
                    shape_points.push(new THREE.Vector2(points[0], points[1]));
                });
                var mesh = _this.add_country(shape_points, country.gdph, country);
                var cAgregator = [mesh];
                mesh.countryAgregator = cAgregator;
            } else {
                var cAgregator = [];
                var mesh = null;
                country.geometry.coordinates.forEach(function (coord_set) {
                    if (coord_set.length == 1) {
                        var shape_points = [];
                        coord_set[0].forEach(function (points) {
                            shape_points.push(new THREE.Vector2(points[0], points[1]));
                        });
                        mesh = _this.add_country(shape_points, country.gdph, country);
                    } else {
                        var shape_points = [];
                        coord_set.forEach(function (points) {
                            shape_points.push(new THREE.Vector2(points[0], points[1]));
                        });
                        mesh = _this.add_country(shape_points, country.gdph, country);
                    }
                    cAgregator.push(mesh);
                    mesh.countryAgregator = cAgregator;
                });
            }
        });
    }

    this.merge_gdp = function () {
        //countries_gdp
        var countries_gdp = this.globeData;
        var feat = countries.features;
        for (var i = 0, szi = feat.length; i < szi; i++) {
            var country = countries.features[i];
            country.gdp = 0.0;
            for (var j = 0, szj = countries_gdp.length; j < szj; j++) {
                if (country.id == countries_gdp[j].id) {
                    country.gdp = countries_gdp[j].gdp;
                    country.nombre = countries_gdp[j].nombre;
                    country.position = countries_gdp[j].posicion;
                    break;
                }
            }
        }
        var min = Number.MAX_SAFE_INTEGER, max = 0.0;
        //GET MAX, MIN
        feat.forEach(function (c) {
            var num = Number(c.gdp);
            if (num > Number(max)) {
                max = c.gdp
            }
            if (num < Number(min)) {
                min = c.gdp
            }
        });
        console.log("1. MAXIMO: " + max + "   MINIMO:" + min);
        //HHOMOGENEIZAR
        var lmaxExtrude = this.maxExtrude;
        var lminExtrude = this.minExtrude;
        feat.forEach(function (c) {
            c.gdph = c.gdp * ((lmaxExtrude - lminExtrude) / (max - min)) + lminExtrude;
        });
        min = Number.MAX_SAFE_INTEGER;
        max = 0.0;
        feat.forEach(function (c) {
            if (c.gdph > max) {
                max = c.gdph
            }
            if (c.gdph < min) {
                min = c.gdph
            }
        });
        console.log("2. MAXIMO: " + max + "   MINIMO:" + min);
    }

    this.onWindowResize = function (event, _this) {
        _this.camera.aspect = window.innerWidth / window.innerHeight;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.render = function () {
        this.trackballControls.update();
        this.renderer.render(this.scene, this.camera);
    }

    this.onMouseMove = function (event, _this) {
        var intersects = null;
        event.preventDefault();
        intersects = G3HELPER.intersectedObjects(event, _this.camera, _this.root_object.children, _this.W, _this.H);
        if (intersects.length > 0) {
            var elem = intersects[0].object;
            var tc;
            var px = event.clientX - 7;
            var py = event.clientY - 7;
            if (elem.textCanvas == null) {
                tc = text(elem.data, px, py);
                elem.textCanvas = tc;
                _this.domElement.appendChild(tc);
            } else {
                tc = elem.textCanvas;
                tc.style.top = "" + py + "px";
                tc.style.left = "" + px + "px";
            }
            if (elem != this.pointed) {
                elem.onPointed(elem);
                elem.material.color.setHex(_this.pointedColor);
                var cAgregator = elem.countryAgregator;
                cAgregator.forEach(function (e) {
                    e.material.color.setHex(_this.pointedColor);
                });
                if (_this.pointed != null) {
                    var cPointedAgregator = this.pointed.countryAgregator;
                    cPointedAgregator.forEach(function (e) {
                        e.material.color.setHex(_this.pointed.realColor);
                        //e.material.color.setHex(0x664400);
                        //console.log("nombre: " + e.data.nombre)
                    });
                    _this.domElement.removeChild(_this.pointed.textCanvas);
                    _this.pointed.textCanvas = null;
                }
                _this.pointed = elem;
            }
            ;
        } else {
            if (_this.pointed != null) {
                var cPointedAgregator = _this.pointed.countryAgregator;
                cPointedAgregator.forEach(function (e) {
                    e.material.color.setHex(_this.pointed.realColor);
                    //console.log("nombre: " + e.data.nombre)
                });
                document.body.removeChild(_this.pointed.textCanvas);
                _this.pointed.textCanvas = null;
            }
            _this.pointed = elem;
        }
        ;
    }
}

