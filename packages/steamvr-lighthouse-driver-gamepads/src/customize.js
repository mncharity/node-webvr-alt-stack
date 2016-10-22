const { multiplyQuaternions, vector3Add, applyQuaternion, setFromAxisAngle } = require('./math')

function gamepadLooksLikeViveHMD (gamepad) {
  return (gamepad && gamepad.buttons &&
          gamepad.buttons.length == 2);
  // buttons
  // 0 Vive Base
  // 2 Vive HMD (side button, proximity sensor)
  // 4 Vive Controller
}

function rotateOnXAxis180 (orientation) {
  if (!orientation) return orientation;
  var flipped = new Float32Array(4);
  var xAxis180 = [1,0,0,0];
  multiplyQuaternions(flipped,orientation,xAxis180)
  return flipped;
}

function customizeForBrowser_gamepad (gamepad) {
  // Mutations required for Three.js demos to work.
  // And thus, by implication, to mimic browser behavior.
  if (!gamepad || !gamepad.pose) return gamepad;
  var pose = gamepad.pose;
  const looksLikeController = gamepad.buttons.length > 2;
  if (gamepadLooksLikeViveHMD(gamepad))
    pose.orientation = rotateOnXAxis180(pose.orientation);
  else if (looksLikeController) {
    var offset = [.01,.12,.005];
    var dpos = new Float32Array(3);
    applyQuaternion(dpos,offset,pose.orientation);
    var oldpos = new Float32Array(pose.position);
    vector3Add(pose.position,oldpos,dpos);
    var old = new Float32Array(pose.orientation);
    multiplyQuaternions(pose.orientation,old,[0,.75,-.65,0])

    // Reorder buttons
    // THREE.ViveController: thumbpad, trigger, grips, menu 
    // 3, 4, 2, 1, # 0
    const remap = [3,4,2,1,0];
    const b = Array.from(gamepad.buttons);
    remap.forEach((iold,inew)=>{ gamepad.buttons[inew] = b[iold] });
  }
  return gamepad;
}

function customizeForBrowser () {
  return function (gamepads) {
    return gamepads.map(customizeForBrowser_gamepad);
  };
}

function customizePoseWith (rotate,dxdydz) {
  return function (gamepads) {
    var qrot = new Float32Array(4);
    if (rotate) setFromAxisAngle(qrot,[0,1,0],rotate/180*3.14);
    return gamepads.map((gamepad)=>{
      if(!gamepad || !gamepad.pose) return gamepad;
      var pose = gamepad.pose;
      if (rotate && pose.position) {
        var old = new Float32Array(pose.position);
        applyQuaternion(pose.position,old,qrot);
      }
      if (rotate && pose.orientation) {
        var oldq = new Float32Array(pose.orientation);
        multiplyQuaternion(pose.orientation,oldq,qrot);
      }
      if (dxdydz) {
        vector3Add(pose.position,pose.position,dxdydz);
      }
      return gamepad;
    });
  }
}


module.exports = {
  customizePoseWith,
  customizeForBrowser,
};
