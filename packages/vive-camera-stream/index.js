const defaults = require('defaults');

function getDevice () {

  const enumerateDevices = navigator.mediaDevices.enumerateDevices();

  return new Promise((cb,err) => {
    enumerateDevices.then((devices,failed) => {
      if (failed) return err(failed);

      const viveCamera = devices.find( device => {
        return device.kind == "videoinput" && device.label.match("^MMP SDK");
      });

      viveCamera ? cb(viveCamera) : err("Vive camera not found")
    });
  });
}

function getMedia (constraints) {
  const cameraP = getDevice();
  return new Promise((cb,err) => {
    cameraP.then((camera,failed) => {
      if (failed) return err(failed);

      const constrain = defaults(constraints,{
        deviceId: {exact: camera.deviceId},
        audio: false,
        video: {width: 1920},
      });

      navigator.mediaDevices.getUserMedia(constrain).then((stream,failed) => {
        if (failed) err(failed);
        cb(stream);
      });
    });
  });
}

module.exports = {
  getDevice,
  getMedia,
}
