const { ipcRenderer } = require('electron')
const {Gamepad, VRPose, GamepadHapticActuator} = require('webvr-types-constructors');
const channels = require('./channels')

// We are using JSON for IPC, which mangles Float32Arrays.
// JSON.parse(JSON.stringify(float32Array)) //=> {"0":42,...}, no "length".
// So there's repair to be done.
//TODO protocol buffers?  some json extension?
function repair_Float32ArrayUnknownLength (array) {
  const max = -1;
  for (var k in array) {
    const n = parseInt(k);
    if (!isNan(n) && n > max) max = n;
  }
  return repair_Float32Array(max+1,array);
}
function repair_Float32Array (len,array) {
  if (!array) return array;
  if (array instanceof Float32Array) return array;
  if (array instanceof Array) return Float32Array.from(array);
  const obj = (array.length != undefined ? array
               : Object.assign({length:len},array));
  return Float32Array.from(obj);
}
function repair_VRPose (pose) {
  if (!pose) return pose;
  return new VRPose (
    repair_Float32Array(3,pose.position),
    repair_Float32Array(3,pose.linearVelocity),
    repair_Float32Array(3,pose.linearAcceleration),
    repair_Float32Array(4,pose.orientation),
    repair_Float32Array(3,pose.angularVelocity),
    repair_Float32Array(3,pose.angularAcceleration)
  );
}
function repair_Gamepad (gamepad) {
  if (!gamepad) return gamepad;
  const gp = Object.assign(new Gamepad(),gamepad);
  gp.pose = repair_VRPose(gamepad.pose);
  if (gamepad.hapticActuators) {
    gp.hapticActuators = gamepad.hapticActuators.map((actuator,idx) => {
      return repair_GamepadHapticActuator({gamepad,idx,actuator});
    });
  }
  return gp;
}
function repair_GamepadHapticActuator ({gamepad,idx,actuator}) {
  const ha = Object.assign(new GamepadHapticActuator(),actuator);
  const {index} = gamepad;
  ha.pulse = function pulseOnClient (value,duration) {
    ipcRenderer.send(channels.pulseRequest,{index,idx,value,duration});
  };
  return ha;
}


const lighthouseGamepads = {
  state: undefined,
  update: function () {
    const res = ipcRenderer.sendSync(channels.clientRequest);
    const state = JSON.parse(res);
    state.gamepads = state.gamepads.map(repair_Gamepad);
    this.state = state;
  }
}
function getGamepads () {
  lighthouseGamepads.update();
  return lighthouseGamepads.state.gamepads;
}

module.exports = {
  pluginE: function ({local}) {
    local.lighthouseGamepads = lighthouseGamepads;
    window.navigator.getGamepads = getGamepads;
  },
}
