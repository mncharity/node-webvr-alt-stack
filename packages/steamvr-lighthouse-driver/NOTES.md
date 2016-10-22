# NOTES

## Dependencies

* git - Obtain this code.
* node-gyp - Build the addon.
* libsdl2-dev - Provide headers for the SD2 stub.
* patchelf - Force Valve's binary blob driver_lighthouse.so to build sanely.

## SDL2 stub

As of 2016-09, driver_lighthouse uses libSDL2, but only to detect if a Vive-sized screen is present.  Stubbing the few SDL2 functions used both simplifies the system, and permits driving Vive controllers (connected by USB) without the HMD present.

`nm files/driver_lighthouse.so |grep SDL` reports

    U SDL_GetCurrentDisplayMode
    U SDL_GetDisplayBounds
    U SDL_GetDisplayName
    U SDL_GetNumVideoDisplays

`src/SDL2_spy.cc` provided the stub values.  It's not part of the build.

Note also that driver_lighthouse uses libSDL2 without itself calling SDL_Init.

## Interaction with steamvr-lighthouse-driver-download

The interaction with steamvr-lighthouse-driver-download via "that package has got to be around here somewhere" copying of files/* is a kludge.  What's the right way to do this?

Note that getting users comfortable with giving their passwords to random npm installs would be a bad thing.

## TODO

* TODO clean up addon state.  handle restart.
* TODO clean up c++ namespace.  get my stuff out of vr, and into something else.
* TODO provide more test/samples for use by package client tests.
* TODO use joi-schema-vector to simplify test/schema.
* TODO expose test samples for client mocks.
* TODO note that I'm not doing anything careful with the driver config dirs, just dropping them mindlessly in /tmp.  Using a new tmpdir each time, to simplify state.
