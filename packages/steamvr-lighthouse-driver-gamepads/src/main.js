const performance_now = require('performance-now');
const driver = require('steamvr-lighthouse-driver')
const { gamepadFromDevice } = require('./gamepad')
const { GamepadEvent, emit_gamepadconnected, emit_gamepaddisconnected } = require('./events')
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
    this.customizations = opts && opts.customizations || [];
    this.deactivate();
  }
  deactivate () {
    this.active = false;
    this.gamepadProperties = [undefined];
    this.gamepads.forEach((gamepad)=>{
      if (gamepad) emit_gamepaddisconnected(gamepad);
    });
    this.devices = [];
    this.gamepads = [];
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
  getGamepads () {
    this._update();
    this.gamepads = gamepadsFrom(driver.devices);
    if (!this.active) {
      //FIXME TODO expose focus check for testing and options
      if (((typeof document == 'undefined') || document.hasFocus())
          && (thereIsUserInput(this.gamepads)))
        this.activate();
      else
        return [null];
    }
    this.gamepadProperties = propertiesFrom(driver.devices);
    this.gamepads = this._customize(this.gamepads);
    return this.gamepads;
  }
  _customize (gamepads) {
    var pads = gamepads;
    this.customizations.forEach((customize)=>{
      pads = customize(pads);
    });
    return pads;
  }
}
Object.assign(ProvideGamepads,{
  GamepadEvent,
  customizePoseWith,
  customizeForBrowser,
});

module.exports = ProvideGamepads
