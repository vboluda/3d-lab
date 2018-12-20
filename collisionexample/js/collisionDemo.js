console.info("COLLISION DEMO  Vicente Boluda Vias 2015-2018")
var renderer = new THREE.WebGLRenderer({antialias: false});
renderer.autoClear = false;
var scene = new THREE.Scene();
var camera;
var floorRect;
var W = window.innerWidth;
var H = window.innerHeight;
var pointlight;
//TRACK Controls camera
var trackballControls;
var clock = new THREE.Clock();
var toRAD = Math.PI / 180;
var floorRect;
var sphere;
var cube, cubeBody

/*OIMO*/
var world = new OIMO.World()
var sphereBody;
var floorBody;
var all = 0xffffffff;
var updater;
var sphereBodies = [];
var contacts=0;

function init(element,num_balls) {
    renderer.setSize(this.W, this.H);
    element.appendChild(renderer.domElement);
    element.style.cursor = "crosshair";
    /****/
    content = new THREE.Object3D();
    scene.add(content);
    //SCENE FOG
    this.scene.fog = new THREE.Fog(0xf2f7ff, 1, 10000);
    camera = new THREE.PerspectiveCamera(50, this.W / this.H, 1, 10000);
    camera.position.z = 600;
    camera.position.x = 250;
    camera.position.y = 250;
    trackballControls = new THREE.TrackballControls(this.camera);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;
    var config = [
        55, //density
        0.2, //Friction
        2, //Restitution
        1, //Group
        all //Collides with
    ];
    floorRect = drawFloor(0, 0, 0, 600, 20, 400);
    floorRect.rotation.z = -16 * toRAD;
    scene.add(floorRect);
    floorBody = THREEx.Oimo.createBodyFromMesh(world, floorRect, {move: false, name: "table"});
    for (var i = 0; i < num_balls; i++) {
        sphere = drawSphere(Math.random()*30-15, 350+Math.random()*100, Math.random()*300-150, 3);
        var nameSphere="sphere";
        sphereBody = THREEx.Oimo.createBodyFromMesh(world, sphere, {config: config, name: nameSphere});
        sphereBody.body.linearVelocity.x = -1;
        sphereBody.body["onCollide"]=function (n1,n2) {
            //console.log("COLLISION [SPHERE] " + body.name + " collides with" + body1.name);
            var body1=n1;
            if (body1.relatedMesh == cube) {
                //console.log("COLLISION [SPHERE] " + body.name + " collides with" + body1.name);
                body1.relatedMesh.material.materials[0].color.setHex(Math.random() * 65536 * 256);
                body1.relatedMesh.material.materials[1].color.setHex(Math.random() * 65536 * 256);
                body1.relatedMesh.material.materials[2].color.setHex(Math.random() * 65536 * 256);
                body1.relatedMesh.material.materials[3].color.setHex(Math.random() * 65536 * 256);
                body1.relatedMesh.material.materials[4].color.setHex(Math.random() * 65536 * 256);
                body1.relatedMesh.material.materials[5].color.setHex(Math.random() * 65536 * 256);
            }
        };
        sphereBody.body["relatedMesh"] = sphere;
        scene.add(sphere);
        sphereBodies.push(sphereBody);
    }
    cube = drawFloor(200, 70, 0, 100, 150, 160);
    cube.rotation.y = 16 * toRAD;
    config[0] = 5;
    config[1] = 0.8;
    config[2] = 0.01;
    cubeBody = THREEx.Oimo.createBodyFromMesh(world, cube, {config: config, name: "cube"});
    cubeBody.body["onCollide"]=function (n1,n2) {
        //console.log("COLLISION [CUBE] " + n1.name + " collides with" + n2.name);
        if (n2.name == "sphere") {
            //console.log("COLLISION [CUBE] " + body.name + " collides with" + body1.name);
            n2.relatedMesh.material.color.setHex(Math.random() * 65536 * 256);
            contacts++;
        }
    };
    cubeBody.body["relatedMesh"] = cube;
    cubeBody.body.linearVelocity.y = 0.01;
    scene.add(cube);
    camera.lookAt(floorRect);
    pointlight = new THREE.PointLight(0xFFFFFF, 3, 1500);
    pointlight.position.set(-50, 50, 50);
    var spherelight = new THREE.SphereGeometry(1);
    pointlight.add(new THREE.Mesh(spherelight, new THREE.MeshBasicMaterial({color: 0x00FF00})));
    scene.add(pointlight);
    var axis = new THREE.AxisHelper(400);
    //this.scene.add(axis);
}

function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();

    //console.log("Y: "+sphereBody.getPosition().y);
    for (var i = 0, sz = sphereBodies.length; i < sz; i++) {
        var body=sphereBodies[i];
        if (body.getPosition().y < -200) {
            body.resetPosition(Math.random()*30-15, 350+Math.random()*100, Math.random()*300-150, 5);
            body.body.linearVelocity.x = -1;
            body.body.relatedMesh.material.color.setHex(0x829E35);
        }
        THREEx.Oimo.updateObject3dWithBody(body.body.relatedMesh, body);
    }
    if (cubeBody.getPosition().y < -200) {
        cubeBody.resetPosition(100, 80, 0);
        cubeBody.resetRotation(0, 0, 0);
        cubeBody.body.linearVelocity.x = 0;
        cubeBody.body.linearVelocity.y = 0;
        cubeBody.body.linearVelocity.z = 0;
    }
    if (cubeBody.body.linearVelocity.x + cubeBody.body.linearVelocity.y + cubeBody.body.linearVelocity.z == 0) {
        //cubeBody.body.setupMass(0x2);
    }

    THREEx.Oimo.updateObject3dWithBody(floorRect, floorBody);
    THREEx.Oimo.updateObject3dWithBody(cube, cubeBody);
    world.step();
    //console.log("******************");
//    for(var contact=world.contacts,i=0;contact;contact=contact.next,i++){
//        console.log("Contact: "+)
//    }
    //console.log("******************************")
    trackballControls.update(delta);
    pointlight.position.copy(this.camera.position);
    processContacts(world);
    renderer.render(scene, camera);
//    pointlight.position.y = this.camera.position.y;
//    pointlight.position.z = this.camera.position.z;
}

function drawFloor(px, py, pz, width, heigh, depth) {
    var floorRect;
    var materialA, materialB, geometry;
    //texture=new THREE.Texture(this.generateFloorTexture(width, heigh,nWidth,nHeigh)), //THREE.ImageUtils.loadTexture("images/earthmap1k.jpg")

    //texture.needsUpdate=true;
    materialA = new THREE.MeshLambertMaterial({
        color: 0x825E35,
        specular: 0x555555,
        ambient: 0x555555,
        shininess: 10

    });
    materialB = new THREE.MeshLambertMaterial({
        color: this.floorRectColor,
        specular: 0x555555,
        ambient: 0x000000,
        shininess: 10
    });
    geometry = new THREE.BoxGeometry(width, heigh, depth);
    materials = [materialB, materialB, materialA, materialB, materialB, materialB];
    cubeMaterials = new THREE.MeshFaceMaterial(materials);
    floorRect = new THREE.Mesh(geometry, cubeMaterials);
    floorRect.position.x = px;
    floorRect.position.y = py;
    floorRect.position.z = pz;
    return floorRect;
}

function drawSphere(px, py, pz, radius) {
    var sphere;
    sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), new THREE.MeshLambertMaterial({
        color: 0x829E35,
        ambient: 0x555555,
        shininess: 3}))
    sphere.position.x = px;
    sphere.position.y = py;
    sphere.position.z = pz;
    return sphere;
}

function processContacts(world) {
    var n1, n2,num=0;
    var contact = world.contacts;
    while (contact !== null) {
        n1 = contact.body1;
        n2 = contact.body2;
        if (n1["onCollide"]) {
            n1["onCollide"](n1, n2);
//            var event = new Event('Collide');
//            event["collideWith"]=n2;
//            n1.dispatchEvent(event);
        }
        if (n2["onCollide"]) {
            n2["onCollide"](n2, n1);
//            var event = new Event('Collide');
//            event["collideWith"]=n1;
//            n2.dispatchEvent(event);
        }
        contact = contact.next;
        num++;
    }
    //console.log("NUM "+num+" Contacts: "+contacts);
    contacts=0;
    
}