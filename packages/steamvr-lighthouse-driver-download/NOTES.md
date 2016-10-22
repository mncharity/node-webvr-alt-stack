# NOTES

## Backstory

## the problem
The SteamVR OpenVR Linux depot contains the driver and associated libraries, but no header file.

As of Summer 2016, the github OpenVR openvr_driver.h has been incompatible (ie, crashes) with current driver releases.  It lags by several weeks, by which time there's a new release.  And obtaining older-than-current releases has become difficult.

Given a header file, how can one obtain an old and compatible version of the driver?

### approaches as of 2016-09-30

#### Use the Steam UI

Ask the user to use the Steam UI to install an old version of SteamVR. An option under Properties.  Then copy the driver from the user's steam directory.

Simple. Easy.  Removed from the UI in mid 2016.

This removal, and SteamCMD yielding truncated files, are the root cause of this code.

#### Independently distribute the two driver files needed

Simple. Easy. Copyright infringement.

But perhaps Valve might give permission - explicit or tacit.

#### Save personal copies of drivers, and wait for compatible headers

Each time SteamVR updates, save a copy of the driver.  When the OpenVR header updates some weeks later, you might be able to use it.

For new users, "copy files now, then come back in a month" is a poor installation story.

This seems the most common approach since the Steam UI removal.

#### Use [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

Nice installation instructions.  Scriptable.

Sometimes provides only truncated files.  Cause unknown.  This might be a long-standing bug, consistent with failing to flush files before closing them.  Or perhaps the problem is corrupt repos... but steamdb no longer provides file lengths, so it's hard to tell.  Closed source.

We could use steamcmd to download most of the driver bytes, and separately distribute the ends of the files, likely covered by US copyright's fair use.  Then untruncate the downloads.

#### Use [DepotDownloader](https://github.com/SteamRE/DepotDownloader)

Apparently the new thing.  Open source.

C#.  There are no packaged linux binary or source distributions.  The distributed Windows exe didn't seem to work under wine?  Building from source apparently requires .NET/VisualStudio installation.  No linux build recipe exists.  Having new users build this from source seems rather heavyweight for the automated download of two small files.

## Firmware known to work

Late pre-order hardware.  Mid-2016 firmware.

Headset

    ModelNumber:                   Vive MV
    TrackingFirmwareVersion:       1462663157 steamservices@firmware-win32 2016-05-07 FPGA 1.6
    HardwareRevision:              product 128 rev 2.1.0 lot 0/0/0 0
    AllWirelessDongleDescriptions: 7509DFB224=1461100729;BA942D3920=1461100729
    HardwareRevision:              2147614976
    FirmwareVersion:               1462663157
    FPGAVersion:                   262
    DisplayFirmwareVersion:        2097432
    EdidVendorID:                  53794
    EdidProductID:                 43521

Controller

    ModelNumber:                   Vive Controller MV
    TrackingFirmwareVersion:       1465809478 htcvrsoftware@firmware-win32 2016-06-13 FPGA 1.6
    HardwareRevision:              product 129 rev 1.5.0 lot 0/0/0 0
    AllWirelessDongleDescriptions: 7509DFB224=1461100729;BA942D3920=1461100729
    HardwareRevision:              2164327680
    FirmwareVersion:               1465809478
    FPGAVersion:                   262
    DongleVersion:                 1461100729
    EdidProductID:                 34952

Base station

    ModelNumber:                   HTC V2-XD/XE
    TrackingFirmwareVersion:       244
    HardwareRevision:              150994953
    FirmwareVersion:               244


