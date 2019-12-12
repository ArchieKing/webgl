
const CamMgr = function() {

    var videoSetting = {width: 320, height: 240};
    var videoElement = null;
    var videoDeviceElement = null;

    var canvasElement = null;
    var canvasContext = null;

    var timer = null;
    var isRecognizing = false;

    /**
     * 列出所有摄像头
     * @param videoDevice
     * @returns {Promise}
     */
    this.listCamera = function(videoDevice) {
        videoDeviceElement = videoDevice;

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    devices.find((device) => {
                        if (device.kind === 'videoinput') {
                            const option = document.createElement('option');
                            option.text = device.label || 'camera '+ (videoDeviceElement.length + 1).toString();
                            option.value = device.deviceId;

                            // 将摄像头id存储在select元素中，方便切换前、后置摄像头
                            videoDeviceElement.appendChild(option);
                        }
                    });

                    if (videoDeviceElement.length === 0) {
                        reject('没有摄像头');
                    } else {
                        videoDeviceElement.style.display = 'inline-block';

                        // 创建canvas，截取摄像头图片时使用
                        canvasElement = document.createElement('canvas');
                        canvasContext = canvasElement.getContext('2d');

                        resolve(true);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    /**
     * 打开摄像头
     * @param video
     * @param deviceId
     * @param setting
     * @returns {Promise}
     */
    this.openCamera = function(video, deviceId, setting) {
        videoElement = video;
        if (setting) {
            videoSetting = setting;
        }
// console.log(webarjs openCamera);
        // 摄像头参数
        // 更多参数请查看 https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
        const constraints = {
            audio: false,
            video: {deviceId: {exact: deviceId}}
        };

        canvasElement.setAttribute('width', videoSetting.width + 'px');
        canvasElement.setAttribute('height', videoSetting.height + 'px');

        // 如果是切换摄像头，则需要先关闭。
        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
        }

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    videoElement.srcObject = stream;
                    videoElement.style.display = 'block';
                    videoElement.onloadedmetadata = function(){
                        resolve(true);
                    };
                    videoElement.play();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
};
