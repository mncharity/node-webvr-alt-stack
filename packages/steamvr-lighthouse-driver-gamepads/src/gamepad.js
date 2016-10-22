const performance_now = require('performance-now');
const { setButtonsAndAxes } = require('./input')
const { setPose } = require('./pose')

function GamepadLighthouse () {
  this.index = 0
  this.id = ""
  this.mapping = ""
  this.connected = false
  this.buttons = []
  this.axes = []
  this.pose = null
  this.timestamp = 0;
}

function idFor (device) {
  if (! device.properties) return "Unknown lighthouse device";
  var p = device.properties;
  var s = " ";
  s += p.ManufacturerName ? p.ManufacturerName+" " : "";
  s += p.ModelNumber ? p.ModelNumber+" " : "";
  s += p.SerialNumber ? p.SerialNumber+" " : "";
  s += p.ModeLabel ? '"'+p.ModeLabel+'"'+" " : ""; // Vive Base "b" or "c"
  s = s.substr(1);
  return s;
}

function gamepadFromDevice (device) {
  var gamepad = new GamepadLighthouse();
  gamepad.timestamp = performance_now();
  gamepad.id = idFor(device);
  setButtonsAndAxes(gamepad,device);
  setPose(gamepad,device);
  return gamepad;
}

module.exports = {
  gamepadFromDevice
}
