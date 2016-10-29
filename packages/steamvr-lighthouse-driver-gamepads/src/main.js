const performance_now = require('performance-now');
const driver = require('steamvr-lighthouse-driver')
const { deepcopy_Gamepad } = require('webvr-types-constructors')
const { gamepadFromDevice } = require('./gamepad')
const { emit_gamepadconnected, emit_gamepaddisconnected } = require('./events')
const {  customizePoseWith, customizeForBrowser } = require("./customize");

function gamepadsFrom (devices) {
  var pads = devices.map(gamepadFromDevice);
  pads.forEach((pad,idx)=>{
    if (pad) pad.index = idx+1;
  });
  return [null].concat(pads);
}
function propertiesFrom (devices) {
  var props = devices.map((device)=>{return device.properties});
  return [undefined].concat(props);
}

function thereIsUserInput (gamepads) {
  return gamepads.find((gamepad)=>{
    return (gamepad &&
            (gamepad.buttons.find((button)=>{
              return button.pressed;
            }) ||
             gamepad.axes.find((axis)=>{
               return axis != 0;
             })))
  })
}

class ProvideGamepads {
  constructor (opts) {
    if (opts && opts.userDriverConfigDir)
      driver.userDriverConfigDir = opts.userDriverConfigDir;
    if (opts && opts.driverInstallDir)
      driver.driverInstallDir = opts.driverInstallDir;
    this.devices = [];
    this.gamepads = [];
    this.gamepadsRaw = [];
    this.customizations = opts && opts.customizations || [];
    this.deactivate();
  }
  deactivate () {
    this.active = false;
    this.gamepadsProperties = [undefined];
    this.gamepads.forEach((gamepad)=>{
      if (gamepad) emit_gamepaddisconnected(gamepad);
    });
    this.devices = [];
    this.gamepads = [];
    this.gamepadsRaw = [];
  }
  activate () {
    this.active = true;
    var _this = this;
    setTimeout(()=>{
      _this.gamepads.forEach((gamepad)=>{
        if (gamepad) emit_gamepadconnected(gamepad);
      });
    },1);
    console.log("gamepads active");
  }
  _update () {
    driver.update();
    this.devices = driver.devices;
  }
  _shouldActivate () {
    return (((typeof document == 'undefined') || document.hasFocus())
            && thereIsUserInput(this.gamepads));
  }
  getGamepads () {
    this._update();
    this.gamepadsProperties = propertiesFrom(driver.devices);
    this.gamepadsRaw = gamepadsFrom(driver.devices);
    this.gamepads = this._customize(this.gamepadsRaw);
    if (!this.active) {
      if (this._shouldActivate())
        this.activate();
      else
        return [null];
    }
    return this.gamepads;
  }
  _customize (gamepads) {
    var pads = gamepads.map(deepcopy_Gamepad);
    this.customizations.forEach((customize)=>{
      pads = customize(pads);
    });
    return pads;
  }
}
Object.assign(ProvideGamepads,{
  customizePoseWith,
  customizeForBrowser,
});

module.exports = ProvideGamepads
