/**
* Created by Archie on 2018/5/1.
*/
const camMgr = new CamMgr();

// 列出视频设备
camMgr.listCamera(videoDevice)
.then(() => {
  openCamera(video, videoDevice.value, videoSetting);
  videoDevice.onchange = () => {
    openCamera(video, videoDevice.value, videoSetting);
  };

  // document.querySelector('#openCamera').style.display = 'none';
  // document.querySelector('#start').style.display = 'inline-block';
  // document.querySelector('#stop').style.display = 'inline-block';
})
.catch((err) => {
  console.info(err);
  // alert('没有可使用的视频设备');
});

var camera,renderer,scene;
var light;
var controls;
var clock,mixers;
var raycaster,mouse;

var mesh;

THREEx.ArToolkitContext.baseURL = "../mix";

clock = new THREE.Clock();
mixers = [];
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
renderer	= new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( window.innerHeight, window.innerWidth );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );

// array of functions for the rendering loop
var onRenderFcts= [];

// init scene and camera
scene = new THREE.Scene();

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -250);
// camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
light.position.set( 0, 200, 0 );
scene.add( light );
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 200, 100 );
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = -100;
light.shadow.camera.left = -120;
light.shadow.camera.right = 120;
scene.add( light );


////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  sourceType : 'webcam',

  // // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
})

arToolkitSource.init(function onReady(){
  onResize()
})

// handle resize
window.addEventListener('resize', function(){
  onResize()
})

function onResize(){
  arToolkitSource.onResize()
  arToolkitSource.copySizeTo(renderer.domElement)
  if( arToolkitContext.arController !== null ){
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
  }
}

////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  // cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
  //cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '/imgTargetData/cam.dat',
  cameraParametersUrl: 'camData/cam.dat',
  detectionMode: 'mono',
})
// initialize it
arToolkitContext.init(function onCompleted(){
  // copy projection matrix to camera
  camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );

})

// update artoolkit on every frame
onRenderFcts.push(function(){
  if( arToolkitSource.ready === false )	return

  arToolkitContext.update( arToolkitSource.domElement );

  // update scene.visible if the marker is seen
  // scene.visible = camera.visible;
  if(camera.visible){

    mesh.position.set(0,0,0);
    mesh.rotation.set(0,0,0);
    scene.visible = true;
    camera.rotation.set(camera.rotation.x+1,0,0);
  }else {

  }
  // console.log(mesh.rotation);
  // markerControls.object3d.position.set(markerControls.object3d.position.x+1,0,0);

})

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
  type : 'pattern',
  //patternUrl : THREEx.ArToolkitContext.baseURL + '/imgTargetData/xuanzheng01.patt',
  patternUrl : 'users/vip001/card1/card1.patt',

  // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
  // changeMatrixMode: 'modelViewMatrix'
  changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false;

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

function loadObject(modelUrl) {
  const loader = new THREE.FBXLoader();
  loader.load(modelUrl, (object) => {

    object.scale.set(0.07,0.07,0.07);
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
  var textureLoader = new THREE.TextureLoader();
  // textureLoader.setCrossOrigin("anonymous");
  textureLoader.load("users/"+userId+"/"+cardId+"/"+cardId+".jpg", function (texture) {

    // mesh is a group contains multiple sub-objects. Traverse and apply texture to all.
    mesh.traverse(function (child) {
      if (child instanceof THREE.Mesh) {

        // apply texture
        child.material.map = texture
        child.material.needsUpdate = true;
      }
    });

  });
}

loadObject("models/"+cardStyle+"/"+cardStyle+".fbx");

window.addEventListener('mousedown', () => {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(scene.children,true);
  for ( var i = 0; i < intersects.length; i++ ) {
    console.log(intersects[0].object.name);

  }

}, false);

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function(){
  renderer.render( scene, camera );
    // controls.update();
})

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );

  for (const mixer of mixers) {
    mixer.update(clock.getDelta());
  }

  // measure time
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec	= nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
})
