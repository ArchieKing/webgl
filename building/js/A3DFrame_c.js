var scene, camera, renderer, light;
var pointerV2 = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var loader;
var controls;
//摄像机望向位置
var lookAtPos = new THREE.Vector3(0, 0, 0);
//摄像机移动到的位置
var moveTargetPos = new THREE.Vector3();
var isChange = false;
var isMove = false;
var rotateTarget;
var touchStartPos, touchMovePos;
var degree = new THREE.Vector2();
//展示类型 ，是否漫游模式 ， 场景名称
var showUI, isRoam = false, sceneName;
var path = 'imgs/skybox/';
var format = '.jpg';
var envMap;

var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
				lon = 0, onMouseDownLon = 0,
				lat = 0, onMouseDownLat = 0,
				phi = 0, theta = 0;

(function() {

  awake();

})();

function awake() {
  if (!Detector.webgl) Detector.addGetWebGLMessage();

  // envmap
  envMap = new THREE.CubeTextureLoader().load([
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ]);

  scene = new THREE.Scene();
  scene.background = envMap;

  light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.5);
	// light.position.set( 0, 9999, 0 );
	scene.add( light );


  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(15, 15, 10);
  camera.lookAt(lookAtPos);
  camera.updateMatrixWorld();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // alpha: true
  });
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.autoUpdate = true;
  // renderer.shadowMapSoft = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.setSize(window.innerWidth, 468);
  // renderer.setCleatColor(0xffffff);
  renderer.gammaOutput = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("#container").append(renderer.domElement);
  // document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 5;
  // controls.maxDistance = 25;
  // controls.maxPolarAngle = Math.PI / 2.5;
  controls.update();

  // THREE.DefaultLoadingManager.onStart = function(url, itemsLoaded, itemsTotal) {
  //
  //   // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  //   $(".loading").css("display", "inline");
  //   // $(".label").text("加载中："+(Math.random()*10).toFixed(2)+"%");
  //   // $(".label").text('初始化: ' + itemsLoaded + ' / ' + itemsTotal);
  // };
  THREE.DefaultLoadingManager.onLoad = function() {

    // console.log('Loading Complete!');
    // $(".label").text("加载完成！！！");
    $(".loading").css("display", "none");

  };
  // THREE.DefaultLoadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
  //
  //   // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  //
  //   // $(".label").text("加载中："+((itemsLoaded/itemsTotal*100+Math.random()*30).toFixed(2))+"%");
  //   $(".label").text('加载文件: ' + itemsLoaded + ' / ' + itemsTotal);
  //
  // };
  THREE.DefaultLoadingManager.onError = function(url) {

    // console.log('There was an error loading ' + url);
    $(".label").text("加载失败");

  };

  // loader = new THREE.ObjectLoader(THREE.DefaultLoadingManager);
  loader = new THREE.GLTFLoader(THREE.DefaultLoadingManager);

  registeredEventListener();

  start();

  update();

}

function start() {

  getInfo();

  // loadScene("https://smar-home-media.oss-cn-hangzhou.aliyuncs.com/shJson/" + sceneName + ".json");
  loadScene("models/CreativePark/building.gltf");
  // loadScene("https://smar-home-media.oss-cn-hangzhou.aliyuncs.com/shModels/CreativePark/" + sceneName + ".gltf");
}

function update() {

  requestAnimationFrame(update);

  if (isChange) {

    camera.position.lerp(moveTargetPos, 0.05);

    camera.lookAt(lookAtPos.lerp(lookAtPos, 0.001));

    if (camera.position.distanceTo(moveTargetPos) < 0.5) {

      isChange = false;

    }
  }

  if (isRoam) {
    if (isMove) {

      camera.translateZ(-0.03);
      // camera.rotation.x = 0;
      // camera.rotation.y -= degree.y * 4;
      // camera.rotation.z = 0;
      // lat = Math.max( - 85, Math.min( 85, lat ) );
				// phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );
      //
      theta = theta>0.01?0.01:theta;
      theta = theta<-0.01?-0.01:theta;
      //       console.log(theta);

      // lat = lat>0.01?0.01:lat;
      // lat = lat<-0.01?-0.01:lat;

            camera.rotation.x = 0;

      camera.rotateOnAxis( new THREE.Vector3(0,1,0), theta);
      // camera.rotateOnAxis( new THREE.Vector3(1,0,0), lat);
      camera.rotation.z = 0;
    }
  }

  renderer.render(scene, camera);
};

function registeredEventListener() {

  // window.addEventListener('resize', () => {
  //
  //   // camera.aspect = window.innerWidth / window.innerHeight;
  //   // camera.updateProjectionMatrix();
  //   // renderer.setSize(window.innerWidth, window.innerHeight);
  //   location.reload();
  //
  // }, false);

  window.addEventListener('mousedown', () => {

    isMove = true;

  }, false);

  window.addEventListener('mousemove', () => {

    if (isMove) {

      pointerV2.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerV2.y = -(event.clientY / window.innerHeight) * 2 + 1;

      degree.x = (pointerV2.y * Math.PI) / 180;
      degree.y = (pointerV2.x * Math.PI) / 180;
    }

  }, false);

  window.addEventListener('mouseup', () => {

    isMove = false;

  }, false);

  window.addEventListener('touchstart', () => {

    // event.preventDefault();

    isMove = true;

    var clientX = event.clientX || event.touches[ 0 ].clientX;
    				var clientY = event.clientY || event.touches[ 0 ].clientY;
    				onMouseDownMouseX = clientX;
    				onMouseDownMouseY = clientY;
    				onMouseDownLon = lon;
    				onMouseDownLat = lat;

  }, false);

  window.addEventListener('touchmove', () => {

    // event.preventDefault();

    if (isMove) {

      // pointerV2.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
      // pointerV2.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
      //
      // degree.x = (pointerV2.y * Math.PI) / 180;
      // degree.y = (pointerV2.x * Math.PI) / 180;

      var clientX = event.clientX || event.touches[ 0 ].clientX;
  var clientY = event.clientY || event.touches[ 0 ].clientY;
  lon = ( onMouseDownMouseX - clientX ) * 0.1 + onMouseDownLon;
  lat = ( clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
    }

  }, false);

  window.addEventListener('touchend', () => {

    // event.preventDefault();

    isMove = false;

  }, false);
}

// function loadScene(path) {
//
//   loader.load(path, function(obj) {
//     scene.add(obj);
//
//     //c
//     scene.children[0].children[2].visible = false;
//     //a
//     scene.children[0].children[3].children[0].visible = true;
//     //b
//     scene.children[0].children[3].children[1].visible = false;
//   });
//
//   console.log(scene);
// }

function loadScene(path) {

  //'models/building/building.gltf'
  loader.load(path, function(gltf) {

    gltf.scene.traverse(function(child) {

      if (child.isMesh) {

        child.material.envMap = envMap;

      }

    });

    scene.add(gltf.scene);

    // console.log("scene : " + scene);

  });
}

function moveLookAt(movePos, lookPos) {

  moveTargetPos = movePos;

  lookAtPos = lookPos;

  isChange = true;
}

function getInfo() {

  showUI = ATools.getQueryStr("ui") || "room";
  sceneName = ATools.getQueryStr("scene") || "building";

  initUI();
}

function initUI() {

  switch (showUI) {
    case "building":
      $(".btnsBuilding").css("display", "inline");
      break;

    case "room":
      $(".btnsRoom").css("display", "inline");
      break;

    default:

      break;
  }
}

function roamOn() {

  // console.log(camera.rotation.y);

  moveLookAt(new THREE.Vector3(2.8, 2.5, 7), new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 100));

  isRoam = true;

  controls.enablePan = false;
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enabled = false;
}

function roamOff() {
  moveLookAt(new THREE.Vector3(15, 15, 10), new THREE.Vector3(0, 0, 0));

  isRoam = false;

  controls.enablePan = true;
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enabled = true;
}
