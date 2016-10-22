A node addon for reading the HTC Vive device driver on Linux.

## Install

### Install OS dependencies

On Debian/Ubuntu:

    sudo apt-get install  patchelf libsdl2-dev

Next, install [node](https://nodejs.org/) and [node-gyp](https://github.com/nodejs/node-gyp).

There is a Debian/Ubuntu `node-gyp`.  I don't recommend it.  If you do try it, and then switch to the above, make sure to first completely remove all node related packages.

### Give yourself permission to use the Vive

See [doc/Vive-udev-rules](doc/Vive-udev-rules.md).

### Download the drivers

Go to [../steamvr-lighthouse-driver-download](../steamvr-lighthouse-driver-download), and follow the Install instructions in the README there.

### Build

    npm install


## Usage

    var driver = require('steamvr-lighthouse-driver');
    driver.update();
    console.log(driver.devices); //-> array of devices
    driver.shutdown();

You can run it with:

    node examples/dump.js

There is a schema in test/.


## Files needed

### From Valve's SteamVR "OpenVR Linux" depot:

    driver_lighthouse.so
    libaitcamlib.so

### From Valve's OpenVR github repo:

    openvr_driver.h

The driver_lighthouse must be a version compatible with the openvr_driver.h.

### From your OS:

    libudev.so.0

`libudev.so.1` works, but must be named `libudev.so.0`.


## Known issues

### IPD

The values of Prop_UserIpdMeters_Float and ServerDriverHost::PhysicalIpdSet() don't match, and don't change.

