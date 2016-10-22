var addon = require('bindings')('addon');

function TrackedDevice (idx) {
  this.trackedDeviceIndex = idx;
  this.pose = undefined;
  this.properties = undefined;
  this.controllerState = undefined;
  this.extras = undefined;

  //TODO: If the device doesn't support these, set them to undefined, as a hint.
  this.triggerHapticPulse = triggerHapticPulse;
  this.powerOff = powerOff;
  
  this.update();
}
TrackedDevice.prototype = {
  constructor: TrackedDevice,
  update: function () {
    this._updateProperties();
    this._updateControllerState();
    this._updateExtras();
    this.updatePose();
  },
  _updateProperties: function () {
    var onlyIfChanged = !!this.properties;
    var props = addon.deviceProperties(this.trackedDeviceIndex,(onlyIfChanged?1:0));
    if (props) this.properties = props;
  },
  _updateControllerState: function () {
    this.controllerState = addon.controllerState(this.trackedDeviceIndex);
  },
  _updateExtras: function () {
    if (this.controllerState) return; //FIXME explain or improve
    this.extras = addon.deviceExtras(this.trackedDeviceIndex);
  },
  updatePose: function () {
    this.pose = addon.devicePose(this.trackedDeviceIndex);
  },
};
function triggerHapticPulse ( axisIndex, pulseDurationMicroseconds ) {
  addon.triggerHapticPulse(this.trackedDeviceIndex, axisIndex, pulseDurationMicroseconds );
}
function powerOff () {
  addon.powerOff(this.trackedDeviceIndex);
}


var started = false;

function startup (_this,opts) {
    if (opts && opts.userDriverConfigDir)
      _this.userDriverConfigDir = opts.userDriverConfigDir;
    if (opts && opts.driverInstallDir)
      _this.driverInstallDir = opts.driverInstallDir;

    if (started) _this.shutdown();
    addon.startup(_this.userDriverConfigDir, _this.driverInstallDir);
    started = true;
  }


module.exports = {
  devices: [],
  userDriverConfigDir: "./",
  driverInstallDir: "./",

  shutdown: function () {
    started = false;
    this.devices = [];
    addon.shutdown();
  },

  update: function () {
    if (!started) startup(this);

    addon.RunFrame();
    addon.activateAnyNewDevices();

    var count = addon.getTrackedDeviceCount() || 0;
    this.devices.length = count;
    for(var idx=0;idx<count;idx++) {
      if (this.devices[idx]) {
        this.devices[idx].update();
      }
      else {
        this.devices[idx] = new TrackedDevice(idx);
      }
    }
  },
};
