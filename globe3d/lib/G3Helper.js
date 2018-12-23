/* 
 * G3HELPER 3D
 * (C) Vicente Boluda Vias 2016
 */
G3HELPER = {};
G3HELPER.version = "0.3";
G3HELPER.raycaster=new THREE.Raycaster();
console.log("G3HELPER", G3HELPER.version);

G3HELPER.intersectedObjects = function (event, camera,objects,W,H) {
    var intersects = null, mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - 7) / W) * 2 - 1;
    mouse.y = -((event.clientY - 7) / H) * 2 + 1;
    G3HELPER.raycaster.setFromCamera(mouse, camera);
    //intersects = this.raycaster.intersectObjects(scene.children);
    intersects = G3HELPER.raycaster.intersectObjects(objects);
    return intersects;
}


