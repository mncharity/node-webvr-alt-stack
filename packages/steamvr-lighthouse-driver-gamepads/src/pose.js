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

function worldPoseFromDevicePose (pose,dp) {
  vector3Add(pose.position, dp.vecPosition, dp.vecWorldFromDriverTranslation);
  multiplyQuaternions(pose.orientation, dp.qRotation, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.linearVelocity, dp.vecVelocity, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.linearAcceleration, dp.vecAcceleration, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.angularVelocity, dp.vecAngularVelocity, dp.qWorldFromDriverRotation);
  applyQuaternion(pose.angularAcceleration, dp.vecAngularAcceleration, dp.qWorldFromDriverRotation);
}

//ISSUE we're throwing away DriverPose_t's poseTimeOffset.
//Perhaps timeStamp = performance.now - poseTimeOffset?


function setPose (gamepad,device) {
  var dp = device.pose;
  var pose;
  if (dp) {
    gamepad.connected = dp.deviceIsConnected;
    if (dp.poseIsValid) {
      if (false) {
        //ISSUE qWorldFromDriverRotation breaks HMD orientation.
        // Makes orientation different, depending on which base is tracking.
        // And causes freezes in transition.
        // It's not swapped quaternion multiply arguments.
        // Better to use the raw data.
        pose = new_VRPose_from(
          dp.vecPosition,
          dp.vecVelocity,
          dp.vecAcceleration,
          dp.qRotation,
          dp.vecAngularVelocity,
          dp.vecAngularAcceleration
        );
      }
      else {
        pose = new_VRPose_withEverything();
        worldPoseFromDevicePose(pose,device.pose);
      }

      //FIXME BUG electron ipc Float32Array workaround
      if (true) { // Providing Array, instead of Float32Array
        pose.position = Array.prototype.slice.call(pose.position);
        pose.linearVelocity = Array.prototype.slice.call(pose.linearVelocity);
        pose.linearAcceleration = Array.prototype.slice.call(pose.linearAcceleration);
        pose.orientation = Array.prototype.slice.call(pose.orientation);
        pose.angularVelocity = Array.prototype.slice.call(pose.angularVelocity);
        pose.angularAcceleration = Array.prototype.slice.call(pose.angularAcceleration);
      }
    }
  }
  //ISSUE Gamepad.pose isn't spec as of 2016-09-30.
  gamepad.pose = pose;
}

module.exports = {
  setPose
}
