
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

  // vr::Prop_TrackingSystemName_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_TrackingSystemName_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("TrackingSystemName").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_ModelNumber_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_ModelNumber_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("ModelNumber").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_SerialNumber_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_SerialNumber_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("SerialNumber").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_RenderModelName_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_RenderModelName_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("RenderModelName").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_WillDriftInYaw_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_WillDriftInYaw_Bool,&error);
  if (!error) obj->Set(Nan::New("WillDriftInYaw").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_ManufacturerName_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_ManufacturerName_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("ManufacturerName").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_TrackingFirmwareVersion_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_TrackingFirmwareVersion_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("TrackingFirmwareVersion").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_HardwareRevision_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_HardwareRevision_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("HardwareRevision").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_AllWirelessDongleDescriptions_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_AllWirelessDongleDescriptions_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("AllWirelessDongleDescriptions").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_ConnectedWirelessDongle_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_ConnectedWirelessDongle_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("ConnectedWirelessDongle").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_DeviceIsWireless_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_DeviceIsWireless_Bool,&error);
  if (!error) obj->Set(Nan::New("DeviceIsWireless").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DeviceIsCharging_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_DeviceIsCharging_Bool,&error);
  if (!error) obj->Set(Nan::New("DeviceIsCharging").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DeviceBatteryPercentage_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DeviceBatteryPercentage_Float,&error);
  if (!error) obj->Set(Nan::New("DeviceBatteryPercentage").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_StatusDisplayTransform_Matrix34
  error = vr::TrackedProp_Success; vM34 = driver->GetMatrix34TrackedDeviceProperty(vr::Prop_StatusDisplayTransform_Matrix34,&error);
  if (!error) {
    v8::Local<v8::Array> arr = Nan::New<v8::Array>(12);
    arr->Set(0, Nan::New(vM34.m[0][0])); arr->Set(1, Nan::New(vM34.m[0][1]));
    arr->Set(2, Nan::New(vM34.m[0][2])); arr->Set(3, Nan::New(vM34.m[0][3]));
    arr->Set(4, Nan::New(vM34.m[1][0])); arr->Set(5, Nan::New(vM34.m[1][1]));
    arr->Set(6, Nan::New(vM34.m[1][2])); arr->Set(7, Nan::New(vM34.m[1][3]));
    arr->Set(8, Nan::New(vM34.m[2][0])); arr->Set(9, Nan::New(vM34.m[2][1]));
    arr->Set(10, Nan::New(vM34.m[2][2])); arr->Set(11, Nan::New(vM34.m[2][3]));
    obj->Set(Nan::New("StatusDisplayTransform").ToLocalChecked(), arr );
  }

  // vr::Prop_HardwareRevision_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_HardwareRevision_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("HardwareRevisionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("HardwareRevisionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_FirmwareVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_FirmwareVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("FirmwareVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("FirmwareVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_FPGAVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_FPGAVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("FPGAVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("FPGAVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_VRCVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_VRCVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("VRCVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("VRCVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_RadioVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_RadioVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("RadioVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("RadioVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_DongleVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_DongleVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("DongleVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("DongleVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_BlockServerShutdown_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_BlockServerShutdown_Bool,&error);
  if (!error) obj->Set(Nan::New("BlockServerShutdown").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_CanUnifyCoordinateSystemWithHmd_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_CanUnifyCoordinateSystemWithHmd_Bool,&error);
  if (!error) obj->Set(Nan::New("CanUnifyCoordinateSystemWithHmd").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_ContainsProximitySensor_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_ContainsProximitySensor_Bool,&error);
  if (!error) obj->Set(Nan::New("ContainsProximitySensor").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DeviceProvidesBatteryStatus_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_DeviceProvidesBatteryStatus_Bool,&error);
  if (!error) obj->Set(Nan::New("DeviceProvidesBatteryStatus").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DeviceCanPowerOff_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_DeviceCanPowerOff_Bool,&error);
  if (!error) obj->Set(Nan::New("DeviceCanPowerOff").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DeviceClass_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_DeviceClass_Int32,&error);
  if (!error) obj->Set(Nan::New("DeviceClass").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_HasCamera_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_HasCamera_Bool,&error);
  if (!error) obj->Set(Nan::New("HasCamera").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DriverVersion_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_DriverVersion_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("DriverVersion").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_ReportsTimeSinceVSync_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_ReportsTimeSinceVSync_Bool,&error);
  if (!error) obj->Set(Nan::New("ReportsTimeSinceVSync").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_SecondsFromVsyncToPhotons_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_SecondsFromVsyncToPhotons_Float,&error);
  if (!error) obj->Set(Nan::New("SecondsFromVsyncToPhotons").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplayFrequency_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayFrequency_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayFrequency").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_UserIpdMeters_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_UserIpdMeters_Float,&error);
  if (!error) obj->Set(Nan::New("UserIpdMeters").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_CurrentUniverseId_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_CurrentUniverseId_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("CurrentUniverseIdLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("CurrentUniverseIdHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_PreviousUniverseId_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_PreviousUniverseId_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("PreviousUniverseIdLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("PreviousUniverseIdHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_DisplayFirmwareVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_DisplayFirmwareVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("DisplayFirmwareVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("DisplayFirmwareVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_IsOnDesktop_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_IsOnDesktop_Bool,&error);
  if (!error) obj->Set(Nan::New("IsOnDesktop").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_DisplayMCType_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_DisplayMCType_Int32,&error);
  if (!error) obj->Set(Nan::New("DisplayMCType").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_DisplayMCOffset_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayMCOffset_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayMCOffset").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplayMCScale_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayMCScale_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayMCScale").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_EdidVendorID_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_EdidVendorID_Int32,&error);
  if (!error) obj->Set(Nan::New("EdidVendorID").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_DisplayMCImageLeft_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_DisplayMCImageLeft_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("DisplayMCImageLeft").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_DisplayMCImageRight_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_DisplayMCImageRight_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("DisplayMCImageRight").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_DisplayGCBlackClamp_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayGCBlackClamp_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayGCBlackClamp").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_EdidProductID_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_EdidProductID_Int32,&error);
  if (!error) obj->Set(Nan::New("EdidProductID").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_CameraToHeadTransform_Matrix34
  error = vr::TrackedProp_Success; vM34 = driver->GetMatrix34TrackedDeviceProperty(vr::Prop_CameraToHeadTransform_Matrix34,&error);
  if (!error) {
    v8::Local<v8::Array> arr = Nan::New<v8::Array>(12);
    arr->Set(0, Nan::New(vM34.m[0][0])); arr->Set(1, Nan::New(vM34.m[0][1]));
    arr->Set(2, Nan::New(vM34.m[0][2])); arr->Set(3, Nan::New(vM34.m[0][3]));
    arr->Set(4, Nan::New(vM34.m[1][0])); arr->Set(5, Nan::New(vM34.m[1][1]));
    arr->Set(6, Nan::New(vM34.m[1][2])); arr->Set(7, Nan::New(vM34.m[1][3]));
    arr->Set(8, Nan::New(vM34.m[2][0])); arr->Set(9, Nan::New(vM34.m[2][1]));
    arr->Set(10, Nan::New(vM34.m[2][2])); arr->Set(11, Nan::New(vM34.m[2][3]));
    obj->Set(Nan::New("CameraToHeadTransform").ToLocalChecked(), arr );
  }

  // vr::Prop_DisplayGCType_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_DisplayGCType_Int32,&error);
  if (!error) obj->Set(Nan::New("DisplayGCType").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_DisplayGCOffset_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayGCOffset_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayGCOffset").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplayGCScale_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayGCScale_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayGCScale").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplayGCPrescale_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_DisplayGCPrescale_Float,&error);
  if (!error) obj->Set(Nan::New("DisplayGCPrescale").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplayGCImage_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_DisplayGCImage_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("DisplayGCImage").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_LensCenterLeftU_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_LensCenterLeftU_Float,&error);
  if (!error) obj->Set(Nan::New("LensCenterLeftU").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_LensCenterLeftV_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_LensCenterLeftV_Float,&error);
  if (!error) obj->Set(Nan::New("LensCenterLeftV").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_LensCenterRightU_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_LensCenterRightU_Float,&error);
  if (!error) obj->Set(Nan::New("LensCenterRightU").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_LensCenterRightV_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_LensCenterRightV_Float,&error);
  if (!error) obj->Set(Nan::New("LensCenterRightV").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_UserHeadToEyeDepthMeters_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_UserHeadToEyeDepthMeters_Float,&error);
  if (!error) obj->Set(Nan::New("UserHeadToEyeDepthMeters").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_CameraFirmwareVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_CameraFirmwareVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("CameraFirmwareVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("CameraFirmwareVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_CameraFirmwareDescription_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_CameraFirmwareDescription_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("CameraFirmwareDescription").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_DisplayFPGAVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_DisplayFPGAVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("DisplayFPGAVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("DisplayFPGAVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_DisplayBootloaderVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_DisplayBootloaderVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("DisplayBootloaderVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("DisplayBootloaderVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_DisplayHardwareVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_DisplayHardwareVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("DisplayHardwareVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("DisplayHardwareVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_AudioFirmwareVersion_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_AudioFirmwareVersion_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("AudioFirmwareVersionLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("AudioFirmwareVersionHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_CameraCompatibilityMode_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_CameraCompatibilityMode_Int32,&error);
  if (!error) obj->Set(Nan::New("CameraCompatibilityMode").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_ScreenshotHorizontalFieldOfViewDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_ScreenshotHorizontalFieldOfViewDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("ScreenshotHorizontalFieldOfViewDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_ScreenshotVerticalFieldOfViewDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_ScreenshotVerticalFieldOfViewDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("ScreenshotVerticalFieldOfViewDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_DisplaySuppressed_Bool
  error = vr::TrackedProp_Success; vBool = driver->GetBoolTrackedDeviceProperty(vr::Prop_DisplaySuppressed_Bool,&error);
  if (!error) obj->Set(Nan::New("DisplaySuppressed").ToLocalChecked(), Nan::New(vBool));

  // vr::Prop_AttachedDeviceId_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_AttachedDeviceId_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("AttachedDeviceId").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  // vr::Prop_SupportedButtons_Uint64
  error = vr::TrackedProp_Success; vUint64 = driver->GetUint64TrackedDeviceProperty(vr::Prop_SupportedButtons_Uint64,&error);
  if (!error) {
     obj->Set(Nan::New("SupportedButtonsLO").ToLocalChecked(), Nan::New((uint32_t)vUint64));
     obj->Set(Nan::New("SupportedButtonsHI").ToLocalChecked(), Nan::New((uint32_t)(vUint64 >> 32)));
  }

  // vr::Prop_Axis0Type_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_Axis0Type_Int32,&error);
  if (!error) obj->Set(Nan::New("Axis0Type").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_Axis1Type_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_Axis1Type_Int32,&error);
  if (!error) obj->Set(Nan::New("Axis1Type").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_Axis2Type_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_Axis2Type_Int32,&error);
  if (!error) obj->Set(Nan::New("Axis2Type").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_Axis3Type_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_Axis3Type_Int32,&error);
  if (!error) obj->Set(Nan::New("Axis3Type").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_Axis4Type_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_Axis4Type_Int32,&error);
  if (!error) obj->Set(Nan::New("Axis4Type").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_ControllerRoleHint_Int32
  error = vr::TrackedProp_Success; vInt32 = driver->GetInt32TrackedDeviceProperty(vr::Prop_ControllerRoleHint_Int32,&error);
  if (!error) obj->Set(Nan::New("ControllerRoleHint").ToLocalChecked(), Nan::New(vInt32));

  // vr::Prop_FieldOfViewLeftDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_FieldOfViewLeftDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("FieldOfViewLeftDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_FieldOfViewRightDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_FieldOfViewRightDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("FieldOfViewRightDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_FieldOfViewTopDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_FieldOfViewTopDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("FieldOfViewTopDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_FieldOfViewBottomDegrees_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_FieldOfViewBottomDegrees_Float,&error);
  if (!error) obj->Set(Nan::New("FieldOfViewBottomDegrees").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_TrackingRangeMinimumMeters_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_TrackingRangeMinimumMeters_Float,&error);
  if (!error) obj->Set(Nan::New("TrackingRangeMinimumMeters").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_TrackingRangeMaximumMeters_Float
  error = vr::TrackedProp_Success; vFloat = driver->GetFloatTrackedDeviceProperty(vr::Prop_TrackingRangeMaximumMeters_Float,&error);
  if (!error) obj->Set(Nan::New("TrackingRangeMaximumMeters").ToLocalChecked(), Nan::New(vFloat));

  // vr::Prop_ModeLabel_String
  error = vr::TrackedProp_Success; len = driver->GetStringTrackedDeviceProperty(vr::Prop_ModeLabel_String, pchValue, unBufferSize, &error);
  if (!error) {
    std::string str(pchValue,len-1);
    obj->Set(Nan::New("ModeLabel").ToLocalChecked(), Nan::New(str).ToLocalChecked());
  }

  free(pchValue);
  return obj;
}
