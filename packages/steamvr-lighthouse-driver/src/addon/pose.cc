#include "internal.h"

v8::Local<v8::Object> objectFromPose (vr::DriverPose_t pose) {
  v8::Local<v8::Array> arr;
  v8::Local<v8::Object> obj = Nan::New<v8::Object>();

  obj->Set(Nan::New("timeOffset").ToLocalChecked(), Nan::New(pose.poseTimeOffset));
  
  arr = Nan::New<v8::Array>(4);
  arr->Set(0, Nan::New(pose.qWorldFromDriverRotation.x));
  arr->Set(1, Nan::New(pose.qWorldFromDriverRotation.y));
  arr->Set(2, Nan::New(pose.qWorldFromDriverRotation.z));
  arr->Set(3, Nan::New(pose.qWorldFromDriverRotation.w));
  obj->Set(Nan::New("qWorldFromDriverRotation").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecWorldFromDriverTranslation[0]));
  arr->Set(1, Nan::New(pose.vecWorldFromDriverTranslation[1]));
  arr->Set(2, Nan::New(pose.vecWorldFromDriverTranslation[2]));
  obj->Set(Nan::New("vecWorldFromDriverTranslation").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(4);
  arr->Set(0, Nan::New(pose.qDriverFromHeadRotation.x));
  arr->Set(1, Nan::New(pose.qDriverFromHeadRotation.y));
  arr->Set(2, Nan::New(pose.qDriverFromHeadRotation.z));
  arr->Set(3, Nan::New(pose.qDriverFromHeadRotation.w));
  obj->Set(Nan::New("qDriverFromHeadRotation").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecDriverFromHeadTranslation[0]));
  arr->Set(1, Nan::New(pose.vecDriverFromHeadTranslation[1]));
  arr->Set(2, Nan::New(pose.vecDriverFromHeadTranslation[2]));
  obj->Set(Nan::New("vecDriverFromHeadTranslation").ToLocalChecked(), arr);

  // right, up, back
  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecPosition[0]));
  arr->Set(1, Nan::New(pose.vecPosition[1]));
  arr->Set(2, Nan::New(pose.vecPosition[2]));
  obj->Set(Nan::New("vecPosition").ToLocalChecked(), arr);
  
  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecVelocity[0]));
  arr->Set(1, Nan::New(pose.vecVelocity[1]));
  arr->Set(2, Nan::New(pose.vecVelocity[2]));
  obj->Set(Nan::New("vecVelocity").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecAcceleration[0]));
  arr->Set(1, Nan::New(pose.vecAcceleration[1]));
  arr->Set(2, Nan::New(pose.vecAcceleration[2]));
  obj->Set(Nan::New("vecAcceleration").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(4);
  arr->Set(0, Nan::New(pose.qRotation.x));
  arr->Set(1, Nan::New(pose.qRotation.y));
  arr->Set(2, Nan::New(pose.qRotation.z));
  arr->Set(3, Nan::New(pose.qRotation.w));
  obj->Set(Nan::New("qRotation").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecAngularVelocity[0]));
  arr->Set(1, Nan::New(pose.vecAngularVelocity[1]));
  arr->Set(2, Nan::New(pose.vecAngularVelocity[2]));
  obj->Set(Nan::New("vecAngularVelocity").ToLocalChecked(), arr);

  arr = Nan::New<v8::Array>(3);
  arr->Set(0, Nan::New(pose.vecAngularAcceleration[0]));
  arr->Set(1, Nan::New(pose.vecAngularAcceleration[1]));
  arr->Set(2, Nan::New(pose.vecAngularAcceleration[2]));
  obj->Set(Nan::New("vecAngularAcceleration").ToLocalChecked(), arr);

  obj->Set(Nan::New("result").ToLocalChecked(), Nan::New(pose.result));  

  obj->Set(Nan::New("poseIsValid").ToLocalChecked(), Nan::New(pose.poseIsValid));
  obj->Set(Nan::New("willDriftInYaw").ToLocalChecked(), Nan::New(pose.willDriftInYaw));  
  obj->Set(Nan::New("shouldApplyHeadModel").ToLocalChecked(), Nan::New(pose.shouldApplyHeadModel));  
  obj->Set(Nan::New("deviceIsConnected").ToLocalChecked(), Nan::New(pose.deviceIsConnected));

  return obj;
}
