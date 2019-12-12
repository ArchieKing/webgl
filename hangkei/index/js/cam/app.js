const webAR = new WebAR();

openCam();
function openCam() {
  const videoSetting = {width: 480, height: 360};

  const video = document.querySelector('#video');
  const videoDevice = document.querySelector('#videoDevice');

  const openCamera = (video, deviceId, videoSetting) => {
      webAR.openCamera(video, deviceId, videoSetting)
          .then((msg) => {
              // 打开摄像头成功
              // 将视频铺满全屏(简单处理)
              let videoWidth = video.offsetWidth;
              let videoHeight = video.offsetHeight;

              if (window.innerWidth < window.innerHeight) {
                  // 竖屏
                  if (videoHeight < window.innerHeight) {
                      video.setAttribute('height', window.innerHeight.toString() +'px');
                  }
              }  else {
                  // 横屏
                  if (videoWidth < window.innerWidth) {
                      video.setAttribute('width', window.innerWidth.toString() +'px');
                  }
              }
          })
          .catch((err) => {
              alert(err);
              alert('打开视频设备失败');
          });
  };

  // 列出视频设备
  webAR.listCamera(videoDevice)
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
}
