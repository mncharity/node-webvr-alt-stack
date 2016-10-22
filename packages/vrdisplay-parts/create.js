const { VRDisplayCapabilities , VRStageParameters , VRFieldOfView , VREyeParameters , VRPose, VRFrameData } = require('webvr-types-constructors');

//ISSUE: Could ignore immutability, and do simpler object merge assembly?

// https://w3c.github.io/webvr/#interface-vrdisplay
module.exports = {
  proto: function (opts) {
    var base = {
      isConnected: true,
      isPresenting: false,

      // capabilities
      hasPosition: false,
      hasOrientation: false,
      hasExternalDisplay: false,
      canPresent: false,
      maxLayers: 0, //"MUST be 1 if canPresent is true, 0 otherwise."
      capabilitiesCreate: function () {
        return new VRDisplayCapabilities(
          this.hasPosition,
          this.hasOrientation,
          this.hasExternalDisplay,
          this.canPresent,
          this.maxLayers
        );
      },

      // stageParameters
      sittingToStandingTransform: new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]), // new Float32Array(16),
      sizeX: 2,
      sizeZ: 2,
      stageParametersCreate: function () {
        return new VRStageParameters(
          this.sittingToStandingTransform,
          this.sizeX,
          this.sizeZ
        );
      },

      // VRFieldOfView
      // Deprecated
      // left eye values
      upDegrees: 0,
      rightDegrees: 0,
      downDegrees: 0,
      leftDegrees: 0,
      fieldOfViewCreate: function (whichEye) {
        if (whichEye == "left")
          return new VRFieldOfView(
            this.upDegrees,
            this.rightDegrees,
            this.downDegrees,
            this.leftDegrees
          );
        else
          return new VRFieldOfView(
            this.upDegrees,
            this.leftDegrees,
            this.downDegrees,
            this.rightDegrees
          );
      },

      // VREyeParameters
      offset_left: new Float32Array(3),
      offset_right: new Float32Array(3),
      //fieldOfView
      renderWidth: 0,
      renderHeight: 0,
      getEyeParameters: function (whichEye) {
        return new VREyeParameters(
          (whichEye == "left") ? this.offset_left : this.offset_right,
          this.fieldOfViewCreate(whichEye),
          this.renderWidth,
          this.renderHeight
        );
      },

      displayId: 0,

      displayName: "",

      // Deprecated in WebVR 1.1
      getPose: function () {
        return new VRPose(null, null, null, null, null, null);
      },
      
      // "This should be called in only sitting-space experiences."
      resetPose: function () {},

      depthNear: 0.01,
      depthFar: 10000.0,

      requestAnimationFrame: function (callback) {
        return window.requestAnimationFrame(callback);
      },
      cancelAnimationFrame: function (callback) {
        return window.cancelAnimationFrame(callback);
      },

      requestPresent: function (layers) {
        return new Promise(function(cb,err){err()});
      },
      exitPresent: function () {
        return new Promise(function(cb,err){err()});
      },

      getLayers: function () {
        return [];
      },

      submitFrame: function () {},

      createVRDisplay: function () {
        return {
          isConnected: this.isConnected,
          isPresenting: this.isPresenting,
          capabilities: this.capabilitiesCreate(),
          stageParameters: this.stageParametersCreate(),
          getEyeParameters: this.getEyeParameters.bind(this),
          getFrameData: this.getFrameData,
          getPose: this.getPose,
          resetPose: this.resetPose,
          depthNear: this.depthNear,
          depthFar: this.depthFar,
          requestAnimationFrame: this.requestAnimationFrame,
          cancelAnimationFrame: this.cancelAnimationFrame,
          requestPresent: this.requestPresent,
          exitPresent: this.exitPresent,
          getLayers: this.getLayers,
          submitFrame: this.submitFrame,
        };
      },
    };
    var webvr_1_1 = {
      getFrameData: function (frameData) {
        //TODO: Use toji's polyfill.
        return false;
      },
      VRFrameData
    };
    if (opts && opts.version == 1.1) {
      Object.assign(base,webvr_1_1);
    }
    return base;
  },
  combine: function (a,b,c,d,e) {
    return Object.assign({},a,b,c,d,e); //FIXME
  },
  emit_vrdisplaypresentchange: function (display,reason) {
    if (!(reason == null) &&
        !{"navigation":1,"mounted":1,"unmounted":1}[reason])
      //console.log("onvrdisplaypresentchange: unknown reason: "+reason);
      true;
    var event = new Event('vrdisplaypresentchange');
    event.display = display;
    event.reason = reason;
    setTimeout(function(){
      window.dispatchEvent(event);
    },1);
  },
};
