// Based on https://w3c.github.io/webvr/#interface-vrdisplay rev 2016-09-21.

//FIXME ISSUE Constructor behavior hasn't been verified.
// The argument order and behavior of these constructors has
// not been checked against browser native implementations.
// Assuming they do the same thing, we should too.

class VRDisplayCapabilitiesObject {
  constructor (a,b,c,d,e) {
    this.hasPosition = a;
    this.hasOrientation = b;
    this.hasExternalDisplay = c;
    this.canPresent = d;
    this.maxLayers = e;
  }
};

class VRStageParametersObject {
  constructor (a,b,c) {
    this.sittingToStandingTransform = a;
    this.sizeX = b;
    this.sizeZ = c;
  }
};

class VRFieldOfViewObject {
  constructor(a,b,c,d) {
    this.upDegrees = a;
    this.rightDegrees = b;
    this.downDegrees = c;
    this.leftDegrees = d;
  }
};

class VREyeParametersObject {
  constructor(a,b,c,d) {
    this.offset = a;
    this.fieldOfView = b;
    this.renderWidth = c;
    this.renderHeight = d;
  }
};

class VRPoseObject {
  constructor(a,b,c,d,e,f) {
    // x right, y up, z back
    this.position = a;
    this.linearVelocity = b;
    this.linearAcceleration = c;
    // x,y,z,w  0,0,0,1 is forward
    this.orientation = d;
    this.angularVelocity = e;
    this.angularAcceleration = f;
  }
};
// VRPose is immutable (as of WebVR draft 2016-09-21),
// so need to know which fields have data at construction time.
function new_VRPose_withNonNull (p,lv,la,o,av,aa) {
  return new VRPoseObject (
    p ? new Float32Array(3) : null,
    lv ? new Float32Array(3) : null,
    la ? new Float32Array(3) : null,
    o ? new Float32Array(4) : null,
    av ? new Float32Array(3) : null,
    aa ? new Float32Array(3) : null
  );
}
function new_VRPose_withEverything () {
  return new_VRPose_withNonNull (1,1,1,1,1,1);
}
function new_VRPose_from (p,lv,la,o,av,aa) {
  return new VRPoseObject (
    p ? new Float32Array(p) : null,
    lv ? new Float32Array(lv) : null,
    la ? new Float32Array(la) : null,
    o ? new Float32Array(o) : null,
    av ? new Float32Array(av) : null,
    aa ? new Float32Array(aa) : null
  );
}

// The readonly-ness of VRFrameData seems unclear.
// https://github.com/w3c/webvr/issues/105
class VRFrameDataObject {
  constructor() {
    this.timestamp = 0.0;
    this.leftProjectionMatrix = new Float32Array(16);
    this.leftViewMatrix = new Float32Array(16);
    this.rightProjectionMatrix = new Float32Array(16);
    this.rightViewMatrix = new Float32Array(16);
    this.pose = VRPoseObject.newWithNulls();
  }
}

module.exports = {
  VRDisplayCapabilities: VRDisplayCapabilitiesObject,
  VRStageParameters: VRStageParametersObject,
  VRFieldOfView: VRFieldOfViewObject, 
  VREyeParameters: VREyeParametersObject,
  VRPose: VRPoseObject,
  VRFrameData: VRFrameDataObject,
  new_VRPose_withNonNull,
  new_VRPose_withEverything,
  new_VRPose_from,
};
