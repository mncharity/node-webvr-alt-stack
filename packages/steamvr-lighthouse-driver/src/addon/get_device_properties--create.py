#!/bin/env python
import os
import re

dir = os.path.dirname(os.path.realpath(__file__))
with open(dir+"/get_device_properties.cc",'w') as fout:
    fout.write(
'''
#include <stdlib.h>
#include <nan.h>
#include "openvr_driver.h"
#include "internal.h"

v8::Local<v8::Value> propertiesOfDevice (vr::ITrackedDeviceServerDriver *driver) {
  v8::Local<v8::Object> obj = Nan::New<v8::Object>();
  v8::Local<v8::String> key;
  vr::ETrackedPropertyError error;
  char* pchValue = (char*) malloc(vr::k_unMaxPropertyStringSize+1);
  uint32_t unBufferSize = vr::k_unMaxPropertyStringSize;
  uint32_t len;
  bool vBool;
  int32_t vInt32;
  float vFloat;
  uint64_t vUint64;
  vr::HmdMatrix34_t vM34;

  if (!driver) return Nan::Undefined();
''')

    with open(dir+"/../../files/openvr_driver.h") as fin:
        pat = re.compile(r'^\s+(Prop_([^_]+)_(Bool|Int32|Float|Uint64|String|Matrix34))\s+=')
        for line in fin:
            m = pat.match(line)
            if m:
                prop = "vr::" + m.group(1)
                name = m.group(2)
                kind = m.group(3)
                get = "Get{kind}TrackedDeviceProperty({prop},&error)".format(kind=kind,prop=prop)


                if kind == 'String':
                    fout.write('''
  // {prop}
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty({prop}, pchValue, unBufferSize, &error);
  if (!error) {{
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("{name}").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }}
'''.format(prop=prop,name=name))


                elif kind == 'Matrix34': # HmdMatrix34_t
                    fout.write('''
  // {prop}
  error = vr::TrackedProp_Success; vM34 = driver->{get};
  if (!error) {{
    v8::Local<v8::Array> arr = Nan::New<v8::Array>(12);
    arr->Set(0, Nan::New(vM34.m[0][0])); arr->Set(1, Nan::New(vM34.m[0][1]));
    arr->Set(2, Nan::New(vM34.m[0][2])); arr->Set(3, Nan::New(vM34.m[0][3]));
    arr->Set(4, Nan::New(vM34.m[1][0])); arr->Set(5, Nan::New(vM34.m[1][1]));
    arr->Set(6, Nan::New(vM34.m[1][2])); arr->Set(7, Nan::New(vM34.m[1][3]));
    arr->Set(8, Nan::New(vM34.m[2][0])); arr->Set(9, Nan::New(vM34.m[2][1]));
    arr->Set(10, Nan::New(vM34.m[2][2])); arr->Set(11, Nan::New(vM34.m[2][3]));
    obj->Set(Nan::New("{name}").ToLocalChecked(), arr );
  }}
'''.format(prop=prop,name=name,get=get))


                elif kind == 'Uint64':
                    fout.write('''
  // {prop}
  error = vr::TrackedProp_Success; vUint64 = driver->{get};
  if (!error) {{
     obj->Set(Nan::New("{name}LO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("{name}HI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }}
'''.format(prop=prop,name=name,get=get))


                else: # Bool, Int32, Float
                    fout.write('''
  // {prop}
  error = vr::TrackedProp_Success; v{kind} = driver->{get};
  if (!error) obj->Set(Nan::New("{name}").ToLocalChecked(), Nan::New(v{kind}));
'''.format(prop=prop,name=name,get=get,kind=kind))

    fout.write(
'''
  free(pchValue);
  return obj;
}
''')

