#include <string>
#include <dlfcn.h>

#include "internal.h"
typedef void *HmdDriverFactory_t( const char *pInterfaceName, int *pReturnCode );


class DriverLog : public vr::IDriverLog {
public:
  /** Writes a log message to the log file prefixed with the driver name */
  void Log( const char *pchLogMessage ) {
    *out << "[Lighthouse] " << pchLogMessage;
  }
  // Not part of vr::IDriverLog
  std::ostream *out = &std::cerr;
};


//FIXME: refactor state

namespace glue {
  vr::IVRSettings *settings = NULL;
  vr::IServerDriverHost *pServerDriverHost = NULL;

  uint64_t SDH_TrackedDevicePropertiesChanged = 0;

  uint32_t SDH_change_counter = 0;
  uint64_t SDH_buttons_seen[vr::k_unMaxTrackedDeviceCount];
  uint64_t SDH_buttons_pressed[vr::k_unMaxTrackedDeviceCount];
  uint32_t SDH_bProximitySensorTriggered = 0;
  float SDH_fPhysicalIpdMeters[vr::k_unMaxTrackedDeviceCount];
}

DriverLog *driverLog = NULL;
void log (const char *msg) { driverLog->Log(msg); }

void *driver_lighthouse_handle = NULL;
vr::IServerTrackedDeviceProvider *stdp = NULL;
unsigned GetTrackedDeviceCount_already_activated;



void Startup(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() < 2 || !info[0]->IsString() || !info[1]->IsString())
    return Nan::ThrowError("Invalid arguments");
  Nan::Utf8String str0(info[0]);
  Nan::Utf8String str1(info[1]);
  const char *pchUserDriverConfigDir = *str0;
  const char *pchDriverInstallDir = *str1;

  // Open the driver
  if (!driver_lighthouse_handle) driver_lighthouse_handle = dlopen("driver_lighthouse.so",RTLD_LAZY);
  if (!driver_lighthouse_handle) return Nan::ThrowError(dlerror());

  // Get the driver's factory object
  HmdDriverFactory_t *hdf = (HmdDriverFactory_t*) dlsym(driver_lighthouse_handle,"HmdDriverFactory");
  if(!hdf) return Nan::ThrowError("dlsym failed to get HmdDriverFactory from driver");

  // Get the factory's stdp
  int returnCode = 0;
  stdp = (vr::IServerTrackedDeviceProvider*) hdf(vr::IServerTrackedDeviceProvider_Version,&returnCode);
  if(returnCode || !stdp) {
    std::string failure = "HmdDriverFactory call failed:";
    std::string version = vr::IServerTrackedDeviceProvider_Version;
    std::string message = (failure +
                           " returnCode: " + std::to_string(returnCode) +
                           " ,version: " + version);
    return Nan::ThrowError(strdup(message.c_str())); //LEAK
  }

  // stdp Init prep
  driverLog = new DriverLog();
  glue::settings = new_VRSettings();
  glue::pServerDriverHost = new_ServerDriverHost();
  GetTrackedDeviceCount_already_activated = 0;
  
  // stdp Init
  int err;
  err = stdp->Init(driverLog,glue::pServerDriverHost,pchUserDriverConfigDir,pchDriverInstallDir);
  if (err) {
    std::string msg0 = "ServerTrackedDeviceProvider Init failed: returned ";
    std::string msg = msg0 + std::to_string(err);
    return Nan::ThrowError(strdup(msg.c_str())); //LEAK
  }
}

void Shutdown(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if(stdp) {
    stdp->Cleanup();
    stdp = NULL;
  }
  if(driverLog) {
    //delete driverLog; //FIXME
    driverLog = NULL;
  }
  if(driver_lighthouse_handle && 0) { //FIXME segfaults
    int err = dlclose(driver_lighthouse_handle);
    driver_lighthouse_handle = NULL;
    if (err) return Nan::ThrowError(dlerror());
  }
}

void GetTrackedDeviceCount (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (!stdp) { info.GetReturnValue().Set(Nan::Undefined()); return; }
  info.GetReturnValue().Set(Nan::New(stdp->GetTrackedDeviceCount()));
}

void RunFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (stdp) stdp->RunFrame();
}

void activate () {
  if (!stdp) return;
  int count = stdp->GetTrackedDeviceCount();
  for(int i=GetTrackedDeviceCount_already_activated; i<count; i++) {
    uint32_t unObjectId = i; //FIXME Really?
    vr::EVRInitError ierr;
    ierr = stdp->GetTrackedDeviceDriver(i)->Activate(unObjectId);
    if (ierr) {
      std::string msg0 = "GetTrackedDeviceDriver(" + std::to_string(i) + ")->Activate";
      std::string msg = msg0 + " failed with EVRInitError " + std::to_string(ierr);
      return Nan::ThrowError(strdup(msg.c_str())); //LEAK
    }
    GetTrackedDeviceCount_already_activated++;
  }
}
void ActivateAnyNewDevices(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (stdp) activate();
}

void ControllerTriggerHapticPulse (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 3 || !info[0]->IsNumber() ||
      !info[1]->IsNumber() || !info[2]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  uint32_t unAxisId = Nan::To<uint32_t>(info[1]).FromJust();
  uint32_t usPulseDurationMicroseconds = Nan::To<uint32_t>(info[2]).FromJust();
  vr::ITrackedDeviceServerDriver *driver = stdp->GetTrackedDeviceDriver(n);
  if (!driver) return Nan::ThrowError("Invalid arguments: invalid device index");
  vr::IVRControllerComponent *controller = (vr::IVRControllerComponent*) driver->GetComponent(vr::IVRControllerComponent_Version);
  if (!controller) return Nan::ThrowError("Invalid arguments: device is not a controller");
  controller->TriggerHapticPulse(unAxisId,usPulseDurationMicroseconds);
}

void DevicePowerOff (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 1 || !info[0]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  stdp->GetTrackedDeviceDriver(n)->PowerOff();
}

void DeviceProperties (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 2 || !info[0]->IsNumber() || !info[1]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  uint32_t onlyIfChanged = Nan::To<uint32_t>(info[1]).FromJust();
  if (onlyIfChanged) {
    uint32_t changed = glue::SDH_TrackedDevicePropertiesChanged & (1 << n);
    glue::SDH_TrackedDevicePropertiesChanged &= ~(1 << n);
    if (!changed) return;
  }
  info.GetReturnValue().Set(propertiesOfDevice(stdp->GetTrackedDeviceDriver(n)));
}

void DevicePose (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 1 || !info[0]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  vr::ITrackedDeviceServerDriver *driver = stdp->GetTrackedDeviceDriver(n);
  if (!driver) return;
  vr::DriverPose_t pose = driver->GetPose();
  info.GetReturnValue().Set(objectFromPose(pose));
}

v8::Local<v8::Object> objectFromControllerState (vr::VRControllerState_t state) {
  v8::Local<v8::Object> obj = Nan::New<v8::Object>();
  obj->Set(Nan::New("unPacketNum").ToLocalChecked(), Nan::New(state.unPacketNum));
  obj->Set(Nan::New("ulButtonPressedHI").ToLocalChecked(), Nan::New((uint32_t)(state.ulButtonPressed>>32)));
  obj->Set(Nan::New("ulButtonPressedLO").ToLocalChecked(), Nan::New((uint32_t)(state.ulButtonPressed)));
  obj->Set(Nan::New("ulButtonTouchedHI").ToLocalChecked(), Nan::New((uint32_t)(state.ulButtonTouched>>32)));
  obj->Set(Nan::New("ulButtonTouchedLO").ToLocalChecked(), Nan::New((uint32_t)(state.ulButtonTouched)));
  v8::Local<v8::Array> arr = Nan::New<v8::Array>(vr::k_unControllerStateAxisCount);
  obj->Set(Nan::New("rAxis").ToLocalChecked(), arr);
  for(uint i=0;i<vr::k_unControllerStateAxisCount;i++) {
    v8::Local<v8::Object> xy = Nan::New<v8::Object>();    
    xy->Set(Nan::New("x").ToLocalChecked(), Nan::New(state.rAxis[i].x));
    xy->Set(Nan::New("y").ToLocalChecked(), Nan::New(state.rAxis[i].y));
    arr->Set(i,xy);
  }
  return obj;
}
void ControllerState (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 1 || !info[0]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  vr::ITrackedDeviceServerDriver *driver = stdp->GetTrackedDeviceDriver(n);
  if (!driver) return;
  vr::IVRControllerComponent *controller = (vr::IVRControllerComponent*) driver->GetComponent(vr::IVRControllerComponent_Version);
  if (!controller) return;
  v8::Local<v8::Object> obj;
  obj = objectFromControllerState(controller->GetControllerState());
  info.GetReturnValue().Set(obj);
}

v8::Local<v8::Value> objectFromExtras (int n) {
  bool foundExtras = false;
  v8::Local<v8::Object> obj = Nan::New<v8::Object>();
  if (glue::SDH_buttons_seen[n]) {
    foundExtras = true;
    obj->Set(Nan::New("ulButtonPressedLO").ToLocalChecked(),
             Nan::New((uint32_t)(glue::SDH_buttons_pressed[n])));
  }
  if (glue::SDH_fPhysicalIpdMeters[n]) {
    foundExtras = true;
    obj->Set(Nan::New("bProximitySensorTriggered").ToLocalChecked(),
             Nan::New(!!(glue::SDH_bProximitySensorTriggered & (1 << n))));
    obj->Set(Nan::New("fPhysicalIpdMeters").ToLocalChecked(),
             Nan::New(glue::SDH_fPhysicalIpdMeters[n]));
  }
  if (foundExtras) {
    obj->Set(Nan::New("changeCounter").ToLocalChecked(),
             Nan::New(glue::SDH_change_counter));
    return obj;
  } else {
    return Nan::Undefined();
  }
}
void DeviceExtras (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.Length() != 1 || !info[0]->IsNumber())
    return Nan::ThrowError("Invalid arguments");
  uint32_t n = Nan::To<uint32_t>(info[0]).FromJust();
  info.GetReturnValue().Set(objectFromExtras(n));
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  exports->Set(Nan::New("startup").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(Startup)->GetFunction());
  exports->Set(Nan::New("shutdown").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(Shutdown)->GetFunction());

  exports->Set(Nan::New("getTrackedDeviceCount").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(GetTrackedDeviceCount)->GetFunction());

  exports->Set(Nan::New("RunFrame").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(RunFrame)->GetFunction());
  exports->Set(Nan::New("activateAnyNewDevices").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(ActivateAnyNewDevices)->GetFunction());

  exports->Set(Nan::New("controllerTriggerHapticPulse").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(ControllerTriggerHapticPulse)->GetFunction());
  exports->Set(Nan::New("devicePowerOff").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(DevicePowerOff)->GetFunction());

  exports->Set(Nan::New("devicePose").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(DevicePose)->GetFunction());
  exports->Set(Nan::New("deviceProperties").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(DeviceProperties)->GetFunction());
  exports->Set(Nan::New("controllerState").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(ControllerState)->GetFunction());
  exports->Set(Nan::New("deviceExtras").ToLocalChecked(),
      Nan::New<v8::FunctionTemplate>(DeviceExtras)->GetFunction());
}

NODE_MODULE(addon, Init)
