const { multiplyQuaternions, vector3Add, applyQuaternion, setFromAxisAngle } = require('./math')

// buttons
// 0 Vive Base
// 2 Vive HMD (side button, proximity sensor)
// 4 Vive Controller
function gamepadLooksLikeViveHMD (gamepad) {
  return (gamepad && gamepad.buttons &&
          gamepad.buttons.length > 0 &&
          gamepad.buttons.length < 4 );
}
function gamepadLooksLikeViveController (gamepad) {
  return (gamepad && gamepad.buttons &&
          gamepad.buttons.length >= 4);
}

function rotateOnXAxis180 (orientation) {
  if (!orientation) return orientation;
  const old = Float32Array.from(orientation);
  const xAxis180 = [1,0,0,0];
  multiplyQuaternions(orientation,old,xAxis180)
}

function customizeForBrowser_gamepad (gamepad) {
  // Data alterations required for Three.js demos to work.
  // And thus, by implication, to mimic browser behavior.

  if (!gamepad) return gamepad;

  if (gamepadLooksLikeViveController(gamepad)) {
    // Reorder buttons
    // THREE.ViveController: thumbpad, trigger, grips, menu
    // 3, 4, 2, 1, # 0
    const remap = [3,4,2,1,0];
    const old = Array.from(gamepad.buttons);
    remap.forEach((iold,inew)=>{ gamepad.buttons[inew] = old[iold] });
  }

  if (!gamepad.pose) return gamepad;
  const pose = gamepad.pose;

  if (gamepadLooksLikeViveHMD(gamepad)) {
    rotateOnXAxis180(pose.orientation);
  }
  else if (gamepadLooksLikeViveController(gamepad)) {
    //DOABLE improve eyeballed numbers
    const translate = [.01,.12,.005];
    const rotate = [0,.75,-.65,0];

    const dpos = new Float32Array(3);
    applyQuaternion(dpos,translate,pose.orientation);
    const oldpos = Float32Array.from(pose.position);
    vector3Add(pose.position,oldpos,dpos);

    const oldo = Float32Array.from(pose.orientation);
    multiplyQuaternions(pose.orientation,oldo,rotate)
  }
  return gamepad;
}

function customizeForBrowser () {
  return function (gamepads) {
    return gamepads.map(customizeForBrowser_gamepad);
  };
}

function customizePoseWith (dxdydz,rotate) {
  return function (gamepads) {
    const qrot = new Float32Array(4);
    if (rotate) setFromAxisAngle(qrot,[0,1,0],rotate/180*3.14);
    return gamepads.map((gamepad)=>{
      if(!gamepad || !gamepad.pose) return gamepad;
      const pose = gamepad.pose;
      if (dxdydz) {
        vector3Add(pose.position,pose.position,dxdydz);
      }
      if (rotate && pose.position) {
        const old = Float32Array.from(pose.position);
        applyQuaternion(pose.position,old,qrot);
      }
      if (rotate && pose.orientation) {
        const oldq = Float32Array.from(pose.orientation);
        multiplyQuaternions(pose.orientation,qrot,oldq);
      }
      return gamepad;
    });
  }
}


module.exports = {
  customizePoseWith,
  customizeForBrowser,
};
