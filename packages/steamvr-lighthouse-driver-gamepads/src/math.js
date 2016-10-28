
// Derived from https://github.com/mrdoob/three.js/blob/master/src/math/Quaternion.js
function multiplyQuaternions ( c, a, b ) {
  var qax = a[0], qay = a[1], qaz = a[2], qaw = a[3];
  var qbx = b[0], qby = b[1], qbz = b[2], qbw = b[3];
  c[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
  c[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
  c[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
  c[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
  normalizeQuaternion(c);  
  return c;
}
function normalizeQuaternion (a) {
  var l = Math.sqrt( a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] );
  if ( l === 0 ) {
    a[0] = 0;
    a[1] = 0;
    a[2] = 0;
    a[3] = 1;
  } else {
    l = 1 / l;
    a[0] = a[0] * l;
    a[1] = a[1] * l;
    a[2] = a[2] * l;
    a[3] = a[3] * l;
  }
  return a;
}
function vector3Add (c, a, b) {
  c[0] = a[0] + b[0];
  c[1] = a[1] + b[1];
  c[2] = a[2] + b[2];
  return c;
}
// From https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js
function applyQuaternion ( c, a, q ) {
  var x = a[0], y = a[1], z = a[2];
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  // calculate quat * vector
  var ix =  qw * x + qy * z - qz * y;
  var iy =  qw * y + qz * x - qx * z;
  var iz =  qw * z + qx * y - qy * x;
  var iw = - qx * x - qy * y - qz * z;
  // calculate result * inverse quat
  c[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
  c[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
  c[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;
  return c;
}


// From https://github.com/mrdoob/three.js/blob/master/src/math/Quaternion.js
function setFromAxisAngle ( q, axis, angle ) {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
  //FIXME assumes axis is normalized
  var halfAngle = angle / 2, s = Math.sin( halfAngle );
  q[0] = axis[0] * s;
  q[1] = axis[1] * s;
  q[2] = axis[2] * s;
  q[3] = Math.cos( halfAngle );
}


module.exports = {
  multiplyQuaternions,
  normalizeQuaternion,
  vector3Add,
  applyQuaternion,
  setFromAxisAngle,
}
