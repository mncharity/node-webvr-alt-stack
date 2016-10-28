const { multiplyQuaternions, vector3Add, applyQuaternion } = require('./math')
const { new_VRPose_withEverything, new_VRPose_from } = require('webvr-types-constructors')

// openvr_driver.h
// /* Generally, the pose maintained by a driver
//  * is in an inertial coordinate system different
//  * from the world system of x+ right, y+ up, z+ back.
//  * Also, the driver is not usually tracking the "head" position,
//  * but instead an internal IMU or another reference point in the HMD.
//  * The following two transforms transform positions and orientations
//  * to app world space from driver world space,
//  * and to HMD head space from driver local body space. 
//  *
//  * We maintain the driver pose state in its internal coordinate system,
//  * so we can do the pose prediction math without having to
//  * use angular acceleration.  A driver's angular acceleration is generally not measured,
//  * and is instead calculated from successive samples of angular velocity.
//  * This leads to a noisy angular acceleration values, which are also
//  * lagged due to the filtering required to reduce noise to an acceptable level.
//  */

//ISSUE we're throwing away DriverPose_t's poseTimeOffset.
//Perhaps timeStamp = performance.now - poseTimeOffset?
// But that would mean trusting it.


function worldPoseFromDevicePose (pose,dp) {
  vector3Add(pose.position, dp.vecPosition, dp.vecWorldFromDriverTranslation);
  multiplyQuaternions(pose.orientation, dp.qRotation, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.linearVelocity, dp.vecVelocity, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.linearAcceleration, dp.vecAcceleration, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.angularVelocity, dp.vecAngularVelocity, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.angularAcceleration, dp.vecAngularAcceleration, dp.qWorldFromDriverRotation);
}

function setPose (gamepad,device) {
  var pose = null;
  if (device.pose) {
    gamepad.connected = device.pose.deviceIsConnected;
    if (device.pose.poseIsValid) {
      pose = new_VRPose_withEverything();
      worldPoseFromDevicePose(pose,device.pose);
    }
  }
  //ISSUE Gamepad.pose isn't spec as of 2016-09-30.
  gamepad.pose = pose;
}

module.exports = {
  setPose
}
