
/* 
 * GRAPH 3D
 * Based on Mr.Doob's Threejs
 * (C) Vicente Boluda Vias 2015-2018
 */

var pi2 = Math.PI / 2;

function Graph3D(opts) {
    // MEMBER INITIALIZATION
    this.version = "0.1";
    console.log('Graph 3D', this.version);
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = null;
    this.trackballControls = null;
    this.stats = null;
    this.pointed = null;
    this.pressTimer = 0;
    this.timerIsPressed = 500; //0.5 segs;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.W = 0;
    this.H = 0;
    this.isFullScreen = true;
    this.bars3d;
    // OPTIONS
    opts = opts || {};
    this.domElement = opts.domElement || document.body;
    this.W = opts.width || 600;
    this.H = opts.heigh || 600;
    this.showStats = opts.showStats || false;
    this.floorRectColor = opts.floorRectColor || 0xF0B674;
    this.lineRectColor = opts.lineRectColor || 0x825E35;
    this.floorRectWidth = opts.floorRectWidth || 600;
    this.floorRectHeigh = opts.floorRectHeigh || 40;
    this.floorRectDepth = opts.floorRectDepth || 300;
    this.color = opts.color || function (i, j, data, mag) {
        return 0xFF9900;// + Math.random() * 128
    };
    this.showdata=opts.showdata || function(dataProvider){return null};
    this.maxBarHigh = opts.maxBarHigh || 200;
    this.textSize = opts.textSize || 13;
    this.textHeight = opts.textHeight || 2;
    this.textFont = opts.textFont || "helvetiker";
    this.letterSize = opts.letterSize || 3;
    this.textColor = opts.textColor || 0x825E35;
    this.disabledSelector = null;
    this.plane;

    this.init = function (data) {
        var series, maxLegth, seriesNumber, key;
        data = data || {};
        if (!Detector.webgl)
            Detector.addGetWebGLMessage(), elem = null;
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
        //SCENE FOG
        this.scene.fog = new THREE.Fog(0xf2f7ff, 1, 10000);
        //CAMERA
        this.camera = new THREE.PerspectiveCamera(50, this.W / this.H, 1, 10000);
        //this.camera.position.z = 1500;
        this.camera.position.z = 600;
        this.camera.position.x = 250;
        this.camera.position.y = 250;
        //TRACK Controls camera
        this.trackballControls = new THREE.TrackballControls(this.camera);
        this.trackballControls.rotateSpeed = 1.0;
        this.trackballControls.zoomSpeed = 1.0;
        this.trackballControls.panSpeed = 1.0;
        //CALCULATE DIMENSIONS
        series = data.series;
        maxLegth = 0;
        seriesNumber = 0;
        for (key in series) {
            if (series[key].length > maxLegth) {
                maxLegth = series[key].length;
            }
            seriesNumber++;
        }

        //ADD OBJECTS TO SCENE
        this.drawFloorRect(0, 0, 0, this.floorRectWidth, this.floorRectHeigh, this.floorRectDepth,
                maxLegth, seriesNumber);
        this.drawBars(0, 0, 0, this.floorRectWidth, this.floorRectHeigh, this.floorRectDepth,
                maxLegth, seriesNumber, data);
        this.includeLegend(0, 0, 0, this.floorRectWidth, this.floorRectHeigh, this.floorRectDepth,
                maxLegth, seriesNumber, data);
        this.plane = this.createPlane(this.floorRectWidth, this.floorRectDepth);
        //POINT LIGHT
        this.pointlight = new THREE.PointLight(0xFFFFFF, 3, 1500);
        this.pointlight.position.set(-50, 50, 50);
        sphere = new THREE.SphereGeometry(1);
        this.pointlight.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x00FF00})));
        this.scene.add(this.pointlight);
        //STATS
        if (this.showStats) {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '8px';
            this.stats.domElement.style.zIndex = 100;
            this.domElement.appendChild(this.stats.domElement);
        }
        //DEBUG PURPOSES
        axis = new THREE.AxisHelper(400);
        //this.scene.add(axis);
        // Initialice Camera
        this.camera.lookAt(this.floorRect);
    }

//    this.generateFloorTexture = function (width, heigh, nwidth, nheigh) {
//        var canvas, context, r, g, b,
//                wquantum = Math.round(width / nwidth),
//                hquantum = Math.round(heigh / nheigh)
//                , i;
//        canvas = document.createElement('canvas');
//        canvas.id = "canvasFloorTexture";
//        canvas.width = width;
//        canvas.height = heigh;
//        context = canvas.getContext('2d');
//        //Extract RGB components
//        b = this.floorRectColor & 0
//        b000000000000000011111111;
//        g = this.floorRectColor & 0
//        b000000001111111100000000;
//        g = g >> 8;
//        r = this.floorRectColor & 0
//        b111111110000000000000000;
//        r = r >> 16;
//        context.fillStyle = 'rgb(' +
//                r + ',' +
//                g + ',' +
//                b + ')';
//        context.fillRect(0, 0, width, heigh);
//        for (i = 1; i < nwidth; i++) {
//            var q = i * wquantum
//            context.beginPath();
//            context.moveTo(q, 0);
//            context.lineTo(q, heigh);
//            context.stroke();
//        }
//        for (i = 1; i < nheigh; i++) {
//            var q = i * hquantum
//            context.beginPath();
//            context.moveTo(0, q);
//            context.lineTo(width, q);
//            context.stroke();
//        }
//        return canvas;
//    }


    this.drawFloorRect = function (px, py, pz, width, heigh, depth, ni, nj) {
        var materialA, materialB, geometry;
        //texture=new THREE.Texture(this.generateFloorTexture(width, heigh,nWidth,nHeigh)), //THREE.ImageUtils.loadTexture("images/earthmap1k.jpg")

        //texture.needsUpdate=true;
        materialA = new THREE.MeshPhongMaterial({
            color: this.floorRectColor,
            specular: 0x555555,
            ambient: 0x555555,
            shininess: 5

        });
        materialB = new THREE.MeshPhongMaterial({
            color: this.floorRectColor,
            specular: 0x555555,
            ambient: 0x000000,
            shininess: 10
        });
        geometry = new THREE.BoxGeometry(width, heigh, depth);
        materials = [materialB, materialB, materialA, materialB, materialB, materialB];
        cubeMaterials = new THREE.MeshFaceMaterial(materials);
        this.floorRect = new THREE.Mesh(geometry, cubeMaterials);
        this.floorRect.position.x = px;
        this.floorRect.position.y = py;
        this.floorRect.position.z = pz;
        this.scene.add(this.floorRect);
        //this.addLines(width, heigh, depth, ni, nj);
    }

//    this.addLines = function (width, heigh, depth, nWidth, nHeigh) {
//        var i, geometry, material, cylinder, hquantum, wquantum, cylinder;
//        hquantum = depth / nHeigh;
//        wquantum = width / nWidth;
//
//        for (i = 1; i < nWidth; i++) {
//            geometry = new THREE.CylinderGeometry(1, 1, depth * 0.95, 6);
//            material = new THREE.MeshBasicMaterial({color: this.lineRectColor});
//            cylinder = new THREE.Mesh(geometry, material);
//            cylinder.rotation.copy(this.floorRect.rotation);
//            cylinder.rotation.z = cylinder.rotation.z + pi2;
//            cylinder.rotation.y = cylinder.rotation.y + pi2;
//            cylinder.position.copy(this.floorRect.position);
//            cylinder.position.y = cylinder.position.y + 3 + heigh / 2;
////            cylinder.position.z = cylinder.position.z;
//            cylinder.position.x = cylinder.position.x - (width / 2) + i* wquantum;
//            this.scene.add(cylinder);
//        }
//        //repasar###########
//        for (i = 1; i < nHeigh; i++) {
//            geometry = new THREE.CylinderGeometry(1, 1, width * 0.95, 6);
//            material = new THREE.MeshBasicMaterial({color: this.lineRectColor});
//            cylinder = new THREE.Mesh(geometry, material);
//            cylinder.rotation.copy(this.floorRect.rotation);
//            cylinder.rotation.z= cylinder.rotation.z + pi2;
//            //cylinder.rotation.y = cylinder.rotation.y + pi2;
//            cylinder.position.copy(this.floorRect.position);
//            cylinder.position.y = cylinder.position.y + 3 + heigh / 2;
//            cylinder.position.z = cylinder.position.z-(depth/2)+i*hquantum;
//            //cylinder.position.x = cylinder.position.x;// - (width / 2) + i* wquantum;
//            this.scene.add(cylinder);
//        }
//
//    }

    this.addLines = function (width, heigh, depth, ni, nj) {
        var i, iquantum, jquantum, geometry, material, line;
        jquantum = depth / nj;
        iquantum = width / ni;

        for (i = 0; i <= ni; i++) {
            material = new THREE.LineBasicMaterial({
                color: this.lineRectColor,
                linewidth: 2
            });
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(iquantum * i - width / 2, -heigh / 2, -0.1 - depth / 2),
                    new THREE.Vector3(iquantum * i - width / 2, 0.1 + heigh / 2, -0.1 - depth / 2),
                    new THREE.Vector3(iquantum * i - width / 2, 0.1 + heigh / 2, 0.1 + depth / 2),
                    new THREE.Vector3(iquantum * i - width / 2, -heigh / 2, 0.1 + depth / 2));

            line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
        for (i = 0; i <= nj; i++) {
            material = new THREE.LineBasicMaterial({
                color: this.lineRectColor,
                linewidth: 40
            });
            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(-0.1 - width / 2, -heigh / 2, jquantum * i - depth / 2),
                    new THREE.Vector3(-0.1 - width / 2, 1 + heigh / 2, jquantum * i - depth / 2),
                    new THREE.Vector3(0.1 + width / 2, 0.1 + heigh / 2, jquantum * i - depth / 2),
                    new THREE.Vector3(0.1 + width / 2, -heigh / 2, jquantum * i - depth / 2));

            line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }

    }

    this.drawBars = function (px, py, pz, width, heigh, depth, ni, nj, data) {
        var radius, i, j, iquantum, jquantum, pi, pj, geometry, material, cylinder, mag, mx, serie;
        this.bars3d = {"series": {}, "iposition": [], "jposition": []};
        jquantum = depth / nj;
        iquantum = width / ni;
        radius = Math.min(iquantum, jquantum) * 0.4;
        mx = this.getMax(data);
        i = 0;
        for (key in data.series) {
            serie = data.series[key];
            pi = iquantum * i + iquantum / 2;
            for (j = 0; j < serie.length; j++) {
                pj = jquantum * j + jquantum / 2;
                mag = serie[j] || 0;
                if (mag > 0) {
                    mag = mag * this.maxBarHigh / mx;
                    geometry = new THREE.CylinderGeometry(radius, radius, mag, 16);
                    material = new THREE.MeshPhongMaterial({
                        ambient: 0x000000,
                        color: this.color(i, j, data, mag),
                        specular: 0x555555,
                        shininess: 100,
                        opacity: 0.9,
                        transparent: true
                    });
                    cylinder = new THREE.Mesh(geometry, material);
                    cylinder["mouseEvent"] = this.cylinderMouseEvent;
                    cylinder["dataProvider"] = {"parent": this, "mag": (serie[j] || 0), "serie": key, "posi": i, "posj": j, "data": data};
                    cylinder["realColor"] = this.color(i, j, data, mag);
                    cylinder.position.x = j * iquantum + iquantum / 2 - width / 2;
                    cylinder.position.z = i * jquantum + jquantum / 2 - depth / 2;
                    cylinder.position.y = heigh / 2 + mag / 2;
                    cylinder["_params_"] = {
                        "px": cylinder.position.x,
                        "py": cylinder.position.y,
                        "pz": cylinder.position.z,
                        "mag": mag,
                        "pyo": heigh / 2
                    };
                    cylinder["_reescale_"] = function (e, ratio) {
                        e.scale.y = ratio;
                        e.position.y = e._params_.pyo + e.geometry.parameters.height * ratio / 2;
                    }
                    this.scene.add(cylinder);
                } else {
                    cylinder = null;
                }
                //CONTROL SCRUCTURE CREATION
                if (this.bars3d.series[key]) {
                    this.bars3d.series[key].push(cylinder);
                } else {
                    this.bars3d.series[key] = [cylinder];
                }
                if (this.bars3d.iposition[i]) {
                    this.bars3d.iposition[i].push(cylinder);
                } else {
                    this.bars3d.iposition[i] = [cylinder];
                }

                if (this.bars3d.jposition[j]) {
                    this.bars3d.jposition[j].push(cylinder);
                } else {
                    this.bars3d.jposition[j] = [cylinder];
                }

            }
            i++
        }
    }

    this.cylinderMouseEvent = function (event, type, cylinder) {
        var parent = cylinder.dataProvider.parent, px, py, plane
        console.log("Event: " + type + " serie: " + cylinder.dataProvider.serie);
        if (false) {
            py = event.offsetY;
            px = event.offsetX;
        } else {
            py = event.clientY;
            px = event.clientX;
        }
        if (px == 0 || py == 0) {
            console.log("Alert:");
        }
        if (type == "in") {
            cylinder.material.color.setHex(0xFF0000);
            parent.cylinderLabel(event.offsetX, event.offsetY, cylinder);
            cylinder['_canvas_'] = parent.cylinderLabel(px, py, cylinder);
            parent.domElement.appendChild(cylinder['_canvas_']);

        } else {
            if (type == "out") {
                cylinder.material.color.setHex(cylinder["realColor"]);
                parent.domElement.removeChild(cylinder['_canvas_']);
            }
            if (type == "move") {
                console.log(cylinder['_canvas_']._py_);
                if ((Math.abs(cylinder['_canvas_']._py_ - py) > 10) ||
                        (Math.abs(cylinder['_canvas_']._px_ - px) > 10)) {
                    cylinder['_canvas_'].style.top = py;
                    cylinder['_canvas_'].style.left = px;
                    cylinder['_canvas_']._px_ = px;
                    cylinder['_canvas_']._py_ = py;
                }
            }
            if ((type == "dblclk") || (type == "auto")) {
                plane = parent.plane;
                if (plane._isVisible) {
                    plane._isVisible = false;
                    parent.scene.remove(plane);
                } else {
                    plane._isVisible = true;
                    plane.position.y = cylinder._params_.pyo + cylinder._params_.mag * 0.999;
                    parent.scene.add(plane);
                }
            }
        }
    }

    this.cylinderLabel = function (px, py, cylinder) {
        var canvas=this.showdata(cylinder.dataProvider);
        canvas.style.position = "absolute";
        canvas.style.top = py;
        canvas.style.left = px;
        canvas["_px_"] = px;
        canvas["_py_"] = py;
        return canvas;
    }

    this.getMax = function (data) {
        var series, maxValue, i, sz;
        series = data.series;
        maxValue = 0;
        for (key in series) {
            sz = series[key].length;
            for (i = 0; i < sz; i++) {
                if (series[key][i] > maxValue) {
                    maxValue = series[key][i];
                }
            }
        }
        return maxValue;
    }

    this.includeLegend = function (px, py, pz, width, heigh, depth, ni, nj, data) {
        var series, seriesNum = 0, j = 0, i = 0, sz, text, jquantum, titles, titleSerie,
                sphereMaterial, sphereGeometry, sphere, material, geometry, text2;
        series = data.series;
        titles = data.titles;
        jquantum = depth / nj;
        iquantum = width / ni;
        this.bars3d.legend = {"series": {}, "titles": {}};
        //SERIES LEGEND
        for (key in series) {
            seriesNum++;
            geometry = new THREE.TextGeometry(" " + key, {
                size: this.textSize,
                height: this.textHeight,
                curveSegments: 3,
                font: this.textFont,
//                weight: "bold",
                style: "normal",
                bevelEnabled: false
            });

            material = new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            text = new THREE.Mesh(geometry, material);
            sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
//            sphereMaterial=new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            sphereMaterial = new THREE.MeshPhongMaterial({
                ambient: 0x000000,
                color: this.textColor,
                specular: 0x555555,
                shininess: 100,
                opacity: 0.9,
                transparent: true
            });
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            text2geometry = new THREE.TextGeometry("Disable", {
                size: this.textSize * 0.7,
                height: this.textHeight,
                curveSegments: 3,
                font: this.textFont,
//                weight: "bold",
                style: "normal",
                bevelEnabled: false
            });

            text2material = new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            text2 = new THREE.Mesh(text2geometry, text2material);
            this.bars3d.legend.series[key] = {"parent": this, "mesh": text, "serie": this.bars3d.series[key]};
            sphere["dataProvider"] = this.bars3d.legend.series[key];
            sphere["mouseEvent"] = this.legendMouseEvent;
            sphere["realColor"] = this.textColor;
            sphere["isPressed"] = false;
            sphere["legendType"] = "serie";
            this.scene.add(text);
            this.scene.add(sphere);
            this.scene.add(text2);
            sphere.position.x = width / 2;
            sphere.position.z = jquantum * (j + 1) - depth / 2 - sphere.geometry.parameters.radius * 2.1;
            sphere.position.y = -(this.textSize / 2);
            text.rotation.y = pi2;
            text.position.x = width / 2;
            text.position.z = jquantum * (j + 1) - depth / 2;
            text.position.y = (this.textSize / 2.5);
            text2.rotation.y = pi2;
            text2.position.x = width / 2;
            text2.position.z = sphere.position.z - sphere.geometry.parameters.radius * 2.1;
            text2.position.y = sphere.position.y - sphere.geometry.parameters.radius;
            j++;
        }

        // TITLE LEGEND
        for (i = 0, sz = titles.length; i < sz; i++) {
            geometry = new THREE.TextGeometry(" " + titles[i], {
                size: this.textSize,
                height: this.textHeight,
                curveSegments: 3,
                font: this.textFont,
//                weight: "bold",
                style: "normal",
                bevelEnabled: false
            });

            material = new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            text = new THREE.Mesh(geometry, material);
            // Collect serie
            titleSerie = [];
            for (key in series) {
                titleSerie.push(this.bars3d.series[key][i] || null);
            }
            sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
//            sphereMaterial=new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            sphereMaterial = new THREE.MeshPhongMaterial({
                ambient: 0x000000,
                color: this.textColor,
                specular: 0x555555,
                shininess: 100,
                opacity: 0.9,
                transparent: true
            });
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            text2geometry = new THREE.TextGeometry("Disable", {
                size: this.textSize * 0.7,
                height: this.textHeight,
                curveSegments: 3,
                font: this.textFont,
//                weight: "bold",
                style: "normal",
                bevelEnabled: false
            });

            text2material = new THREE.MeshBasicMaterial({color: this.textColor, shininess: 0});
            text2 = new THREE.Mesh(text2geometry, text2material);
            this.bars3d.legend.titles[i] = {"parent": this, "mesh": text, "serie": titleSerie};
            sphere["dataProvider"] = this.bars3d.legend.titles[i];
            sphere["mouseEvent"] = this.legendMouseEvent;
            sphere["realColor"] = this.textColor;
            sphere["isPressed"] = false;
            sphere["legendType"] = "title";
            this.scene.add(text);
            this.scene.add(sphere);
            this.scene.add(text2);
            sphere.position.x = iquantum * i - width / 2 + sphere.geometry.parameters.radius * 2.1;
            sphere.position.z = depth / 2;
            sphere.position.y = -(this.textSize / 2);
            text.position.x = iquantum * i - width / 2;
            text.position.z = depth / 2;
            text.position.y = (this.textSize / 2.7);
            text2.position.x = sphere.position.x + sphere.geometry.parameters.radius * 2.1;
            text2.position.z = text.position.z;
            text2.position.y = sphere.position.y - sphere.geometry.parameters.radius;
            j++;
        }
    }

    this.legendMouseEvent = function (event, type, target) {
        var i, e;
        if (((type == "in") || (type == "move"))) {
            target.material.color.setHex(0xFF0000);
        } else if ((type == "out")) {
            if (target.isPressed) {
                target.material.color.setHex(0xAAAAAA);
            } else {
                target.material.color.setHex(target["realColor"]);
            }
        } else if ((type == "dblclk") || (type == "auto")) {
            if (!target.isPressed) {
                target.material.color.setHex(0xAAAAAA);
                for (i = 0; i < target.dataProvider.serie.length; i++) {
                    e = target.dataProvider.serie[i];
                    if (!e) {
                        continue;
                    }
                    new TWEEN.Tween({"value": 1.0, "e": e}).to(
                            {"value": 0.0}, 1000)
                            .easing(TWEEN.Easing.Cubic.InOut)
                            .onUpdate(function () {
                                this.e._reescale_(this.e, this.value)
                            })
                            .onComplete(function () {
                                this.e.dataProvider.parent.scene.remove(this.e);
                            })
                            .start();

                    //target.dataProvider.parent.scene.remove(e);
                }
            } else {
                target.material.color.setHex(target["realColor"]);
                for (i = 0; i < target.dataProvider.serie.length; i++) {
                    e = target.dataProvider.serie[i];
                    if (!e) {
                        continue;
                    }
                    target.dataProvider.parent.scene.add(e);
                    new TWEEN.Tween({"value": 0.00, "e": e}).to(
                            {"value": 1.0}, 1000)
                            .easing(TWEEN.Easing.Cubic.InOut)
                            .onUpdate(function () {
                                this.e._reescale_(this.e, this.value)
                            })
                            .start();
                }
            }
            target.isPressed = !target.isPressed;
        } else if (type == "up") {
            //target.material.color.setHex(target["realColor"]);
        }
    }

    this.createPlane = function (width, depth) {
        var geometry, material, plane;
        geometry = new THREE.PlaneGeometry(width, depth);
        material = new THREE.MeshBasicMaterial({color: 0xDCC355, opacity: 0.4, transparent: true, side: THREE.DoubleSide});
        plane = new THREE.Mesh(geometry, material);
        plane["_isVisible"] = false;
        plane["_parent"] = this;
        plane.position.copy(this.floorRect.position);
        plane.rotation.copy(this.floorRect.rotation);
        plane.rotation.x = pi2;
        return plane
    }

    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    }

    this.update = function () {
        var delta = this.clock.getDelta();
        if (this.showStats) {
            this.stats.update();
        }
        TWEEN.update();
        //this.stats.update(this.renderer);
        this.trackballControls.update(delta);
        //dock light to camera position
        this.pointlight.position.x = this.camera.position.x;
        this.pointlight.position.y = this.camera.position.y;
        this.pointlight.position.z = this.camera.position.z;

    }

//    this.setData = function (data) {
//        console.warn("NON IMPLEMENTED FUNCTION");
//    }

    this.onWindowResize = function () {

        this.camera.aspect = this.W / this.H;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.W, this.H);

    }

    this.intersectedObjects = function (event) {
        var intersects = null;

        if (this.isFullScreen) {
            this.mouse.x = ((event.clientX - 7) / this.W) * 2 - 1;
            this.mouse.y = -((event.clientY - 7) / this.H) * 2 + 1;
        } else {
            this.mouse.x = ((event.offsetX) / this.W) * 2 - 1;
            this.mouse.y = -((event.offsetY) / this.H) * 2 + 1;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);
        intersects = this.raycaster.intersectObjects(this.scene.children);
        return intersects;
    }

    this.intersectedObjectsTouch = function (tx, ty) {
        var intersects = null;


        this.mouse.x = ((tx) / this.W) * 2 - 1;
        this.mouse.y = -((ty) / this.H) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        intersects = this.raycaster.intersectObjects(this.scene.children);
        return intersects;
    }

    this.onMouseMove = function (event) {
        this.pressTimer = 0;
        var intersects = null;
        event.preventDefault();
        intersects = this.intersectedObjects(event);
        if (intersects.length > 0) {
            elem = intersects[ 0 ].object;
            if (this.pointed) {
                if (elem == this.pointed) {
                    if (this.pointed["mouseEvent"]) {
                        this.pointed["mouseEvent"](event, "move", this.pointed);
                    }
                } else {
                    if (this.pointed["mouseEvent"]) {
                        this.pointed["mouseEvent"](event, "out", this.pointed);
                    }
                    this.pointed = elem;
                    if (this.pointed["mouseEvent"]) {
                        this.pointed["mouseEvent"](event, "in", this.pointed);
                    }
                }
            } else {
                this.pointed = elem;
                if (this.pointed["mouseEvent"]) {
                    this.pointed["mouseEvent"](event, "in", this.pointed);
                }
            }
        } else {
            if (this.pointed) {
                if (this.pointed["mouseEvent"]) {
                    this.pointed["mouseEvent"](event, "out", this.pointed);
                }
            }
            this.pointed = null;

        }
    }

    this.onMouseDown = function (event) {
        var intersects = null;
        event.preventDefault();
        intersects = null;
        event.preventDefault();
        intersects = this.intersectedObjects(event);
        if (intersects.length > 0) {
            this.pressTimer = (new Date()).getTime();
            elem = intersects[ 0 ].object;
            if (elem["mouseEvent"]) {
                elem["mouseEvent"](event, "down", elem);
            }
        }
    }

    this.onMouseUp = function (event) {
        var intersects = null, timerAct = (new Date()).getTime();
        event.preventDefault();
        intersects = null;
        event.preventDefault();
        intersects = this.intersectedObjects(event);
        if (intersects.length > 0) {
            elem = intersects[ 0 ].object;
            if (elem["mouseEvent"]) {
                if ((this.pressTimer > 0) && (timerAct - this.pressTimer >= this.timerIsPressed)) {
                    elem["mouseEvent"](event, "auto", elem);
                } else {
                    elem["mouseEvent"](event, "up", elem);
                }
            }
        }
    }

    this.onMouseDblClk = function (event) {
        console.log("Double clk");
        var intersects = null;
        event.preventDefault();
        event.preventDefault();
        intersects = this.intersectedObjects(event);
        if (intersects.length > 0) {
            elem = intersects[ 0 ].object;
            if (elem["mouseEvent"]) {
                elem["mouseEvent"](event, "dblclk", elem);
            }
        }
    }

    this.ontouchstart = function (event) {
        var touch, intersects;
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
            intersects = this.intersectedObjectsTouch(touch.clienX, touch.clientY);
            if (intersects.length > 0) {
                this.pressTimer = (new Date()).getTime();
                elem = intersects[ 0 ].object;
                if (elem["mouseEvent"]) {
                    elem["mouseEvent"](event, "down", elem);
                }
            }
        }
    }
    this.ontouchmove = function (event) {
        var touch, intersects;
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
            intersects = this.intersectedObjectsTouch(touch.clienX, touch.clientY);
            if (intersects.length > 0) {
                elem = intersects[ 0 ].object;
                if (this.pointed) {
                    if (elem == this.pointed) {
                        if (this.pointed["mouseEvent"]) {
                            this.pointed["mouseEvent"](event, "move", this.pointed);
                        }
                    } else {
                        if (this.pointed["mouseEvent"]) {
                            this.pointed["mouseEvent"](event, "out", this.pointed);
                        }
                        this.pointed = elem;
                        if (this.pointed["mouseEvent"]) {
                            this.pointed["mouseEvent"](event, "in", this.pointed);
                        }
                    }
                } else {
                    this.pointed = elem;
                    if (this.pointed["mouseEvent"]) {
                        this.pointed["mouseEvent"](event, "in", this.pointed);
                    }
                }
            } else {
                if (this.pointed) {
                    if (this.pointed["mouseEvent"]) {
                        this.pointed["mouseEvent"](event, "out", this.pointed);
                    }
                }
                this.pointed = null;


            }
        }
    }
    this.ontouchend = function (event) {
        var touch, intersects;
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
            intersects = this.intersectedObjectsTouch(touch.clienX, touch.clientY);
            if (intersects.length > 0) {
                elem = intersects[ 0 ].object;
                if (elem["mouseEvent"]) {
                    if ((this.pressTimer > 0) && (timerAct - this.pressTimer >= this.timerIsPressed)) {
                        elem["mouseEvent"](event, "auto", elem);
                    } else {
                        elem["mouseEvent"](event, "up", elem);
                    }
                }
            }
        }
    }
    return this;
}