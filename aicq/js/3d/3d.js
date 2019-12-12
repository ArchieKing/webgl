var camera,renderer,scene;
var light;
var control;
var clock,mixers;
var raycaster,mouse;
var mesh,loadingObj;

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(-30, 30, 25);
camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.setAttribute('class', 'mainCanvas');
document.body.appendChild(renderer.domElement);

scene = new THREE.Scene();

light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
light.intensity = 2.5;
light.position.set( 0, 200, 0 );
scene.add( light );

control = new THREE.OrbitControls(camera, renderer.domElement);
control.update();


clock = new THREE.Clock();
mixers = [];

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

loadingObj = createLoading();
scene.add(loadingObj);

window.addEventListener('mousedown', () => {
    // console.log('click');

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    	// calculate objects intersecting the picking ray
    	var intersects = raycaster.intersectObjects(scene.children,true);
        // console.log(intersects.length);
    	for ( var i = 0; i < intersects.length; i++ ) {
        console.log(intersects[0].object.name);
        var clickName = intersects[0].object.name;
    		if (!clickName.indexOf('button')) {
          window.location.href = 'https://www.jd.com/';
        }
    	}

}, false);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

var loadMgr = new THREE.LoadingManager();

loadMgr.onLoad = function ( ) {

    scene.remove(loadingObj);
	console.log( '加载完成!');

};

loadMgr.onError = function ( url ) {

	console.log( '加载错误： ' + url );

};

function createLoading(){
  var geometry = new THREE.OctahedronGeometry(10,0);
  var material = new THREE.MeshNormalMaterial();
    var loadingObj = new THREE.Mesh( geometry, material );
  return loadingObj;
}

function render() {
    renderer.render(scene, camera);

    for (const mixer of mixers) {
        mixer.update(clock.getDelta());
    }

    window.requestAnimationFrame(() => {
        render();
    });

    loadingObj.rotation.y += 0.03;
};

function loadObject(modelUrl) {
    const loader = new THREE.FBXLoader(loadMgr);
    loader.load(modelUrl, (object) => {
        mesh = object;
        loadTexture();
        scene.add(object);

        if (object.animations.length > 0) {
            object.mixer = new THREE.AnimationMixer(object);
            mixers.push(object.mixer);
            object.mixer.clipAction(object.animations[0]).play();
            object.mixer.timeScale = 0.5;
        }
    })
};

function loadTexture() {
  var textureLoader = new THREE.TextureLoader(loadMgr);
  // textureLoader.setCrossOrigin("anonymous");
  // textureLoader.load("users/"+userId+"/"+cardId+"/"+cardId+".png", function (texture) {
    textureLoader.load("res/"+cardId+".png", function (texture) {

    // mesh is a group contains multiple sub-objects. Traverse and apply texture to all.
    mesh.traverse(function (child) {
      if (child instanceof THREE.Mesh) {

        // apply texture
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });

  });
}

// scene.visible = false;
// loadObject("res/"+cardId+".fbx");
// render();
