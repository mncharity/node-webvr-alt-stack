This is a [node](https://nodejs.org/) package with shell scripts for downloading an old version of a device driver for the [HTC Vive](https://en.wikipedia.org/wiki/HTC_Vive) on Linux.

The files downloaded are driver_lighthouse.so and libaitcamlib.so from Valve's [SteamVR](https://steamdb.info/app/250820/) (appId 250820), ["OpenVR Linux" depot](https://steamdb.info/depot/250823/) (depotId 250823).  The old version downloaded is manifestId 2825382862669742424 July 27, 2016.  It works with Valve's OpenVR  [openvr_driver.h](https://github.com/ValveSoftware/openvr/blob/b20b25705d8dd82be221fe68a61db36ae7e2608e/headers/openvr_driver.h), OpenVR SDK 1.0.2.  And with mid-2016 firmware.

Why was this useful in 2016 Q3?  The rest of the SteamVR stack didn't work on Linux.  The more recent versions of the driver were not compatible with available OpenVR header files.  The Steam UI pulldown for installing old versions had recently been removed.  The Steam command-line tools for downloading were variously misbehaving on Linux.

Why doesn't this use the version of steamcmd available from linux distributions?  It didn't yet exist.  If it had, this module likely wouldn't.

## Install

### Install OS dependencies

On Debian/Ubuntu 64bit:

    sudo apt-get install  curl  lib32gcc1

On RedHat/CentOS 64bit:

    yum install  curl  glibc.i686 libstdc++.i686

### Download driver files

    npm install

This will download and run [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD), which will need a Steam username and password, and likely a Steam Guard response.

### Save the driver files

After a successful download, copy the files somewhere, so you don't have to go through this again.

    mkdir somewhere
    cp files/*  somewhere/

And for later installs, skip the downloading:

    LIGHTHOUSE_DRIVER_DIR=somewhere npm install

## Known working versions

* [OpenVR SDK 1.0.3](https://github.com/ValveSoftware/openvr/blob/5bc41e4b55d11dfc8fb4b958a6600aa7f8cee051/headers/openvr_driver.h) - Oct 10
 * ["OpenVR Linux" depot 250823](https://steamdb.info/depot/250823/manifests/)
   * unknown.  Maybe Oct 5 or 11?
* [OpenVR SDK 1.0.2](https://github.com/ValveSoftware/openvr/blob/b20b25705d8dd82be221fe68a61db36ae7e2608e/headers/openvr_driver.h) - July 5
 * ["OpenVR Linux" depot 250823](https://steamdb.info/depot/250823/manifests/)
   * ~~manifest 5819071193357431861 Sep 1, 2016.~~ Incompatible.
   * ~~manifest 2095506300624838638 Aug 29, 2016.~~  Incompatible.
   * manifest 2825382862669742424 July 27, 2016.  Works.
   * manifest 9183475244149741279 July 5, 2016.  Works.


