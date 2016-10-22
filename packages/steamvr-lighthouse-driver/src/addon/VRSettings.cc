#include "internal.h"

namespace vr {
  class VRSettings : public IVRSettings
  {
  public:
    const char *GetSettingsErrorNameFromEnum( EVRSettingsError eError )
    {
      SETTINGS_DEBUG << "GetSettingsErrorNameFromEnum" << std::endl;
      return "steamvr-lighthouse-driver__GetSettingsErrorNameFromEnum__undifferentiated-error";
    }

    // Returns true if file sync occurred (force or settings dirty)
    bool Sync( bool bForce = false, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "Sync" << std::endl;
      if (bForce) return true;
      return false;
    }
    
    bool GetBool( const char *pchSection, const char *pchSettingsKey, bool bDefaultValue, EVRSettingsError *peError = nullptr )
    {
      bool ret = bDefaultValue;
      if (0 == strcmp(pchSettingsKey,"enableCamera")) ret = true;
      SETTINGS_DEBUG << "GetBool: " << pchSection << " " << pchSettingsKey << ": default: " << bDefaultValue << " returning: " << ret << std::endl;
      return ret;
    }
    void SetBool( const char *pchSection, const char *pchSettingsKey, bool bValue, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "SetBool" << std::endl;
    }
    int32_t GetInt32( const char *pchSection, const char *pchSettingsKey, int32_t nDefaultValue, EVRSettingsError *peError = nullptr )
    {
      int32_t ret = nDefaultValue;
      SETTINGS_DEBUG << "GetInt32: " << pchSection << " " << pchSettingsKey << ": default: " << nDefaultValue << " returning: " << ret << std::endl;
      return ret;
    }
    void SetInt32( const char *pchSection, const char *pchSettingsKey, int32_t nValue, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "SetInt32" << std::endl;
    }
    float GetFloat( const char *pchSection, const char *pchSettingsKey, float flDefaultValue, EVRSettingsError *peError = nullptr )
    {
      float ret = flDefaultValue;
      SETTINGS_DEBUG << "GetFloat: " << pchSection << " " << pchSettingsKey << ": default: " << flDefaultValue << " returning: " << ret << std::endl;
      return ret;
    }
    void SetFloat( const char *pchSection, const char *pchSettingsKey, float flValue, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "SetFloat" << std::endl;
    }
    void GetString( const char *pchSection, const char *pchSettingsKey, VR_OUT_STRING() char *pchValue, uint32_t unValueLen, const char *pchDefaultValue, EVRSettingsError *peError = nullptr )
    {
      const char *pstr = pchDefaultValue;
      const char *pdef = pchDefaultValue;
      if (strcmp(pchSettingsKey,"lighthousename") == 0) pstr = "ADefaultName";
      SETTINGS_DEBUG << "GetString: " << pchSection << " " << pchSettingsKey << ": default: \"" << (pdef  || "<NULL>") << "\" returning \"" << (pstr || "<NULL>") << "\"" << std::endl;
      if (pstr) strncpy(pchValue,pstr,unValueLen);
    }
    void SetString( const char *pchSection, const char *pchSettingsKey, const char *pchValue, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "SetString" << std::endl;
    }
    
    void RemoveSection( const char *pchSection, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "RemoveSection" << std::endl;
    }
    void RemoveKeyInSection( const char *pchSection, const char *pchSettingsKey, EVRSettingsError *peError = nullptr )
    {
      SETTINGS_DEBUG << "RemoveKeyInSection" << std::endl;
    }
  };
}

vr::IVRSettings* new_VRSettings() {
  return(new vr::VRSettings());
}
