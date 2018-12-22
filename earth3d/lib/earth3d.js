/* 
 * 3D GEO LOCATOR 
 * Based on Mr.Doob's Threejs
 * (C) Vicente Boluda Vias 2015
 */
var pi2 = Math.PI / 2;

GeoPosition.prototype.LABEL = "_AUX_SPPOS";

// Constructor
function GeoPosition(opts) {
    opts = opts || {};
    console.log("opts: "+opts);
    //this.texture = opts.texture || 'resources/world_black.jpg';
    this.texture = opts.texture || 'https://raw.githubusercontent.com/vboluda/3d-lab/master/earth3d/example/resources/world_black.jpg'
    this.color = opts.color || function (mag) {
        return 0xFF9900;// + Math.random() * 128
    };
    this.onSelectBox = opts.onSelectBox || function (item) {
        console.warn("On selected is  not defined!!!!!!!!!!!!!!!!!!!!!");
    };
    this.showStats = opts.showStats || false;
    this.domElement = opts.domElement || document.body;
    this.isFullScreen = true;
    this.width = opts.width || 600;
    this.height = opts.height || 600;
    
    this.earth = null;
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.trackballControls = null;
    this.stats = null;
    this.pointlight = null;
    this.pointed = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.W;
    this.H;


    this.earth = null;
    this.cubeList = [];

    this.init = function (data) {
        //CHECK WEBGL
        if (!Detector.webgl)
            Detector.addGetWebGLMessage(),
                    elem = null;

        //SET RENDERER AND DOCK TO WEB PAGE
        var sphere = null, maxMag = 0, maxHeigh = 50,
                i = 0, sz = 0;
        if (this.domElement == document.body) { //ie Is full screen
            this.W = window.innerWidth;
            this.H = window.innerHeight;
            this.isFullScreen = true;
        } else {
            //console.warn("HARDCODED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            this.W = this.width;//this.domElement.style.width;
            this.H = this.height;//this.domElement.style.heigh;
            this.isFullScreen = false;
        }
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.W, this.H);

        this.domElement.appendChild(this.renderer.domElement);
        this.domElement.style.cursor = "crosshair";
        //SCENE CREATION
        this.scene.fog = new THREE.Fog(0xf2f7ff, 1, 10000);
        this.createEarth();
        //CAMERA
        this.camera = new THREE.PerspectiveCamera(50, this.W / this.H, 1, 1000);
        this.camera.position.z = 1500;
        //TRACK Controls camera
        this.trackballControls = new THREE.TrackballControls(this.camera);
        this.trackballControls.rotateSpeed = 1.0;
        this.trackballControls.zoomSpeed = 1.0;
        this.trackballControls.panSpeed = 1.0;

        //STATS
        if (this.showStats) {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '8px';
            this.stats.domElement.style.zIndex = 100;
            this.domElement.appendChild(this.stats.domElement);
        }
        //AMBIENT LIGHT
        ambientLight = new THREE.AmbientLight(0x999999); // soft white light
        this.scene.add(ambientLight);

        //HEMI LIGHT
        hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
        hemiLight.color.setHSL(1, 1, 1);
        hemiLight.groundColor.setHSL(1, 1, 1);
        hemiLight.position.set(0, 2000, 0);
        this.scene.add(hemiLight);

        //POINT LIGHT
        this.pointlight = new THREE.PointLight(0xFFFFFF, 6, 1000);
        this.pointlight.position.set(-50, 50, 50);
        sphere = new THREE.SphereGeometry(1);
        this.pointlight.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x00FF00})));
        this.scene.add(this.pointlight);

        for (i = 0, sz = data.length; i < sz; i++) {
            elem = data[i];
            if (elem.accesos > maxMag) {
                maxMag = elem.accesos;
            }
        }
        for (i = 0, sz = data.length; i < sz; i++) {
            aux = data[i];
            aux.mag = aux.accesos * maxHeigh / maxMag;
            this.spherePosition(aux);
        }


        //DEBUG PURPOSES
        //axis = new THREE.AxisHelper(400);
        //scene.add(axis);

        //EFFECT
        new TWEEN.Tween(this.camera.position).to({
            z: 200
        }, 2000).easing(TWEEN.Easing.Cubic.InOut).start();

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
        this.pointlight.position.x = this.camera.position.x;
        this.pointlight.position.y = this.camera.position.y;
        this.pointlight.position.z = this.camera.position.z;
    }

    this.onWindowResize = function () {

        this.camera.aspect = this.W / this.H;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.W, this.H);

    }

    this.onMouseMove = function (event) {
        var intersects = null, propsCube = null, info = null;
        event.preventDefault();
        if (this.isFullScreen) {
            this.mouse.x = ((event.clientX - 7) / this.W) * 2 - 1;
            this.mouse.y = -((event.clientY - 7) / this.H) * 2 + 1;
        } else {
            this.mouse.x = ((event.offsetX) / this.W) * 2 - 1;
            this.mouse.y = -((event.offsetY) / this.H) * 2 + 1;
        }
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // POSITION OF MESH TO SHOOT RAYS OUT OF
        intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            elem = intersects[ 0 ].object;
            if (this.pointed) {
                this.pointed.material.color.setHex(this.pointed[GeoPosition.prototype.LABEL].color);
                this.pointed.material.transparent = true;
                if (this.pointed['_canvas_']) {
                    this.domElement.removeChild(this.pointed['_canvas_']);
                }
            }
            propsCube = elem[GeoPosition.prototype.LABEL];
            if (propsCube && propsCube.type == 'cube') {
                info = null, canvas = null;
                this.pointed = elem;
                propsCube['color'] = this.pointed.material.color.getHex();
                this.pointed.material.color.setHex(0xFF1111);
                this.pointed.material.transparent = false;
                info = propsCube['info'];
//                        scene.add(info);
                canvas = this.onSelectBox(info);
                if (canvas) {
                    canvas.style.position = "absolute";
                    if (this.isFullScreen) {
                        canvas.style.top = event.offsetY;
                        canvas.style.left = event.offsetX;
                    } else {
                        canvas.style.top = event.clientY;
                        canvas.style.left = event.clientX;
                    }
                    this.domElement.appendChild(canvas);
                }
                this.pointed['_canvas_'] = canvas;
                // alert(ddd);
            } else {
                this.pointed = null;
            }

        } else {
            if (this.pointed) {
                this.pointed.material.color.setHex(this.pointed[GeoPosition.prototype.LABEL].color);
                this.pointed.material.transparent = true;
                if (this.pointed['_canvas_']) {
                    this.domElement.removeChild(this.pointed['_canvas_']);
                }
                this.pointed = null;
            }
        }
    }

    this.spherePosition = function (obj) {
        var lat = obj.lat,
                lng = obj.lon,
                mag = obj.mag,
                phi = 0,
                theta = 0,
                radius = 0;

        // AVOID OVERLAP TWO BOXEX SAME LAT AND LONG
        lat = lat * (1 + Math.random() * 0.02 - 0.01); //+/- 1% variation for avoid overlapping
        lng = lng * (1 + Math.random() * 0.02 - 0.01); //idem
        phi = (90 - lat) * Math.PI / 180;
        theta = (-lng) * Math.PI / 180;
        radius = this.earth.geometry.parameters.radius;
        sx = radius * Math.sin(phi) * Math.cos(theta);
        sy = radius * Math.cos(phi);
        sz = radius * Math.sin(phi) * Math.sin(theta);

        cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1),
                new THREE.MeshPhongMaterial({
                    ambient: 0x000000,
                    color: this.color(mag),
                    specular: 0x555555,
                    shininess: 100,
                    opacity: 0.5,
                    transparent: true
                }));
        cube.position.x = sx;
        cube.position.y = sy;
        cube.position.z = sz;

        cube.lookAt(this.earth.position);
        cube.scale.z = mag;
        cube[this.LABEL] = {type: 'cube'};
        cube[this.LABEL]['info'] = obj;
        this.scene.add(cube);
        this.cubeList.push(cube);
        return cube;
    }

    this.createEarth = function () {
        var sphereGeometry = new THREE.SphereGeometry(50, 64, 32),
                sphereMaterial = new THREE.MeshLambertMaterial({color: 0x8888ff});
        console.log("Loading texture: "+this.texture);
        sphereMaterial.map = THREE.ImageUtils.loadTexture(this.texture)
        console.log("Texture loaded: ");
        this.earth = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.earth.position.set(0, 0, 0);
        this.earth.rotation=Math.PI;
        this.earth.rotation.y = 2 * Math.PI;
        this.scene.add(this.earth);
    }

    return this;
}

