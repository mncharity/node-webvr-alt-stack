#include "internal.h"

namespace vr
{
  class ServerDriverHost : public vr::IServerDriverHost
  {
  public:

    /** Notifies the server that a tracked device has been added. If this function returns true
    * the server will call Activate on the device. If it returns false some kind of error
    * has occurred and the device will not be activated. */
    bool TrackedDeviceAdded( const char *pchDeviceSerialNumber )
    {
      SDH_DEBUG_LOG << "TrackedDeviceAdded " << pchDeviceSerialNumber << std::endl;
      return true;
    }

    /** Notifies the server that a tracked device's pose has been updated */
    void TrackedDevicePoseUpdated( uint32_t unWhichDevice, const DriverPose_t & newPose )
    {
      SDH_DEBUG_POSE << "TrackedDevicePoseUpdated " << unWhichDevice << std::endl;
    }

    /** Notifies the server that the property cache for the specified device should be invalidated */
    void TrackedDevicePropertiesChanged( uint32_t unWhichDevice )
    {
      SDH_DEBUG_LOG << "TrackedDevicePropertiesChanged " << unWhichDevice << std::endl;      
      glue::SDH_TrackedDevicePropertiesChanged |= (1 << unWhichDevice);
    }

    /** Notifies the server that vsync has occurred on the the display attached to the device. This is
    * only permitted on devices of the HMD class. */
    void VsyncEvent( double vsyncTimeOffsetSeconds )
    {
    }

    /** notifies the server that the button was pressed */
    void TrackedDeviceButtonPressed( uint32_t unWhichDevice, EVRButtonId eButtonId, double eventTimeOffset )
    {
      SDH_DEBUG_IO << "TrackedDeviceButtonPressed " << unWhichDevice << " " << eButtonId << std::endl;      
      glue::SDH_buttons_seen[unWhichDevice] |= (1 << eButtonId);
      glue::SDH_buttons_pressed[unWhichDevice] |= (1 << eButtonId);
      glue::SDH_change_counter++;
    }

    /** notifies the server that the button was unpressed */
    void TrackedDeviceButtonUnpressed( uint32_t unWhichDevice, EVRButtonId eButtonId, double eventTimeOffset )
    {
      SDH_DEBUG_IO << "TrackedDeviceButtonUnpressed " << unWhichDevice << " " << eButtonId << std::endl;
      glue::SDH_buttons_seen[unWhichDevice] |= (1 << eButtonId);
      glue::SDH_buttons_pressed[unWhichDevice] &= ~(1 << eButtonId);
      glue::SDH_change_counter++;
    }

    /** notifies the server that the button was pressed */
    void TrackedDeviceButtonTouched( uint32_t unWhichDevice, EVRButtonId eButtonId, double eventTimeOffset )
    {
      SDH_DEBUG_IO << "TrackedDeviceButtonTouched " << unWhichDevice << " " << eButtonId << std::endl;
    }

    /** notifies the server that the button was unpressed */
    void TrackedDeviceButtonUntouched( uint32_t unWhichDevice, EVRButtonId eButtonId, double eventTimeOffset )
    {
      SDH_DEBUG_IO << "TrackedDeviceButtonUntouched " << unWhichDevice << " " << eButtonId << std::endl;
    }

    /** notifies the server than a controller axis changed */
    void TrackedDeviceAxisUpdated( uint32_t unWhichDevice, uint32_t unWhichAxis, const VRControllerAxis_t & axisState )
    {
      SDH_DEBUG_IO << "TrackedDeviceAxisUpdated " << unWhichDevice << std::endl;      
    }

    /** Notifies the server that the MC image has been updated for the display attached to the device. This is
    * only permitted on devices of the HMD class. */
    void MCImageUpdated()
    {
    }

    /** always returns a pointer to a valid interface pointer of IVRSettings */
    IVRSettings *GetSettings( const char *pchInterfaceVersion )
    {
      SDH_DEBUG_LOG << "GetSettings" << std::endl;
      return glue::settings;
    }

    /** Notifies the server that the physical IPD adjustment has been moved on the HMD */
    void PhysicalIpdSet( uint32_t unWhichDevice, float fPhysicalIpdMeters )
    {
      SDH_DEBUG_HF << "PhysicalIpdSet " << unWhichDevice << ": " << fPhysicalIpdMeters << " meters" << std::endl;
      // Called continuously - only note changes.
      if (glue::SDH_fPhysicalIpdMeters[unWhichDevice] != fPhysicalIpdMeters) {
        glue::SDH_change_counter++;
        glue::SDH_fPhysicalIpdMeters[unWhichDevice] = fPhysicalIpdMeters;
      }
    }

    /** Notifies the server that the proximity sensor on the specified device  */
    void ProximitySensorState( uint32_t unWhichDevice, bool bProximitySensorTriggered )
    {
      SDH_DEBUG_HF << "ProximitySensorState " << unWhichDevice << ": " << bProximitySensorTriggered << std::endl;
      // Called continuously - only note changes.
      if ((glue::SDH_bProximitySensorTriggered & (1 << unWhichDevice)) != bProximitySensorTriggered) {
        glue::SDH_change_counter++;
        if (bProximitySensorTriggered)
          glue::SDH_bProximitySensorTriggered |= (1 << unWhichDevice);
        else
          glue::SDH_bProximitySensorTriggered &= ~(1 << unWhichDevice);
      }
    }

    /** Sends a vendor specific event (VREvent_VendorSpecific_Reserved_Start..VREvent_VendorSpecific_Reserved_End */
    void VendorSpecificEvent( uint32_t unWhichDevice, vr::EVREventType eventType, const VREvent_Data_t & eventData, double eventTimeOffset )
    {
      SDH_DEBUG_LOG << "VendorSpecificEvent " << unWhichDevice << std::endl;      
    }

    /** Returns true if SteamVR is exiting */
    bool IsExiting()
    {
      return false;
    }
  };
}

vr::IServerDriverHost* new_ServerDriverHost() {
  return(new vr::ServerDriverHost());
}
