#ifndef INTERNAL_H
#define INTERNAL_H

#include <iostream>
#include <node.h>
#include <nan.h>
#include "openvr_driver.h"


namespace glue {
  extern vr::IVRSettings *settings;
  extern vr::IServerDriverHost *pServerDriverHost;

  /** ServerDriverHost **/

  // Getting properties is expensive.
  // A bitmap indexed by unWhichDevice.
  extern uint64_t SDH_TrackedDevicePropertiesChanged;

  // The Vive HMD has controls, but no IVRControllerComponent.
  extern uint32_t SDH_change_counter;
  // * headset button
  extern uint64_t SDH_buttons_seen[vr::k_unMaxTrackedDeviceCount];
  extern uint64_t SDH_buttons_pressed[vr::k_unMaxTrackedDeviceCount];
  // * proximity sensor
  //   Even though my Prop_ContainsProximitySensor_Bool says false.
  extern uint32_t SDH_bProximitySensorTriggered;
  // * ipd knob, reported by PhysicalIpdSet().
  //   Even though mine don't change, and don't match Prop_UserIpdMeters_Float.
  extern float SDH_fPhysicalIpdMeters[vr::k_unMaxTrackedDeviceCount];
}

v8::Local<v8::Value> propertiesOfDevice (vr::ITrackedDeviceServerDriver *driver);
v8::Local<v8::Object> objectFromPose (vr::DriverPose_t pose);

vr::IVRSettings* new_VRSettings();
vr::IServerDriverHost* new_ServerDriverHost();

#define SETTINGS_DEBUG if(1) std::cerr << "[Lighthouse](Settings) "

#define SDH_DEBUG_LOG if(1) std::cerr << "[Lighthouse](Host) "
#define SDH_DEBUG_IO if(0) std::cerr << "[Lighthouse](Host) "
#define SDH_DEBUG_POSE if(0) std::cerr << "[Lighthouse](Host) "
#define SDH_DEBUG_HF if(0) std::cerr << "[Lighthouse](Host) "


#endif /* INTERNAL_H */
