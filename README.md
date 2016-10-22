An insecure alternative [WebVR](https://en.wikipedia.org/wiki/WebVR) stack for the [HTC Vive](https://en.wikipedia.org/wiki/HTC_Vive) on Linux.  Intended for software development, not browsing.

See [packages/electro-webvr/README.md](packages/electro-webvr/README.md) for more information.

## Installation

### Obtain OS dependencies

Obtain the OS dependencies mentioned in

1. [packages/steamvr-lighthouse-driver-download/README.md](packages/steamvr-lighthouse-driver-download/README.md)
2. [packages/steamvr-lighthouse-driver/README.md](packages/steamvr-lighthouse-driver/README.md)

### Give yourself permission to use the Vive

If you don't already use your Vive with linux, you will need to [set up device permissions](packages/steamvr-lighthouse-driver/doc/Vive-udev-rules.md).

### Download this code

    git clone https://github.com/mncharity/node-webvr-alt-stack
    cd node-webvr-alt-stack

### Build

Prepare the mono repo,

    npm install
    npm run clean-bootstrap

Download the Vive device driver files,

    npm run get-driver

This will download and run [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD), which will need a Steam username and password, and likely a Steam Guard response.   [steamvr-lighthouse-driver-download](packages/steamvr-lighthouse-driver-download) has more information.

Now build and test,

    npm run setup

It's ok if there's a longish pause.

If that wasn't red, installation worked, and is finished.

If it failed, try simply

    cd packages/electro-webvr
    npm install
    npm test

## Usage

    cd packages/electro-webvr

    ./bin/electro-webvr-unsafe examples/welcome.html

Read [packages/electro-webvr/README.md](packages/electro-webvr).

## Notes

What about MacOS?  Electron should work.  And node-gyp.  These modules would be easily patched.  Three potential issues come to mind.  (1) Getting Valve's MacOS drivers to sanely build.  On linux, that required patchelf-ing the library.  (2) Does the mac driver even work?  While there were a few reports suggesting the linux driver would actually work, I know of none for the mac driver. (3) Getting device access permissions right was non-trivial on linux.
