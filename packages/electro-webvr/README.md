An insecure alternative [WebVR](https://en.wikipedia.org/wiki/WebVR) stack for the [HTC Vive](https://en.wikipedia.org/wiki/HTC_Vive) on Linux.  Intended for software development, not browsing.

Built on [node.js](https://nodejs.org/)'s [electron](http://electron.atom.io/).  Uses full-screen chromium as the compositor.  Does tracking with Valve's SteamVR [OpenVR](https://github.com/ValveSoftware/openvr) low-level lighthouse [device driver](../steamvr-lighthouse-driver/).

But it's capped at 60 fps.  And has no lens-distortion correction.  The author didn't mind this, but YMMV.

Why yet another stack?  When it was created in 2016 Q3, there was still no way to use an HTC Vive on Linux.  At all.  Not WebVR, OSVR, SteamVR, Vrui, WebVR-polyfill, nor anything else.  So this app was a placeholder, to permit using my Vive on Linux, until that improved.

No, this will *not* help you run Steam, Unreal, Unity, or much of anything else.  It was built for exploratory VR development in the node js ecosystem.  WebVR pages may or may not work - the spec is/was still in flux.

## Insecurity

**Only use this tool on web pages you entirely trust.**

Electron was designed for creating apps, not being used as a browser.  It disables browser security features like sandboxing.  Just one little compromise, and malware can own your computer.  Worse, this tool is only a one-letter typo away from having no security at all.

This tool is intended for software development on mostly local web pages.

If you really insist on using this tool on untrusted webpages, at least do it in a dedicated user account, to reduce your exposure.  `sudo useradd -m compromised` and `sudo -iu compromised`, or as root `useradd -m compromised` and `su - compromised`.

## Other warnings

When tracking goes bad, **the world does not go gray**.  Unlike on Steam.  If you find that disturbs your balance, then do whatever you need to to remain safe.

## Install

See the installation instructions in the [mono repo README](../../README.md).


Plug in your HTC Vive.  Check that tracking works:

    ./bin/electro-webvr-unsafe examples/welcome.html

You should get tracking and controllers after the usual Vive "swing things around while waiting" delay.

## Usage

    ./bin/electro-webvr-unsafe [--add ADDIN]* [--opt.V.A.R=VAL]* URL

## Getting started

### Vive on desktop? Or is it a new X screen?

When you plug in your Vive, depending on your system, it may become part of your desktop, or become a new X screen.

We'll use this demo as an example below:

    export DEMOURL=https://cdn.rawgit.com/mncharity/three.js/electro-webvr-compatible/examples/webvr_cubes.html

#### Vive on desktop

    ./bin/electro-webvr-unsafe $DEMOURL

Now chase down the windows that opened.  You will need the small "Move main window between Desktop and HMD" window, and the main window showing the URL.  Some may have landed on the Vive monitor.  A workspace switching tool is one way to see where things landed.

If the URL page has an "Enter VR" button, click it.  Then use the "Move main window..." window to move the main window to the Vive.

#### Vive on new screen

This is not as well supported.  Windows other than main won't be easily accessible.  If the URL page needs something clicked, something that `./addins/clickEnterVR` doesn't recognize, then you will need to add it.  It's easy jquery.

If the Vive created X display.screen 0.1, then

    DISPLAY=:0.1 ./bin/electro-webvr-unsafe --add ./addins/startFullscreen --add ./addins/clickEnterVR $DEMOURL

The URL page should have opened on the Vive.

### Demos

    ./bin/electro-webvr-unsafe https://cdn.rawgit.com/mncharity/three.js/electro-webvr-compatible/examples/webvr_vive_paint.html
    ./bin/electro-webvr-unsafe https://cdn.rawgit.com/mncharity/three.js/electro-webvr-compatible/examples/webvr_vive_dragging.html

You can also try the current <a href="https://threejs.org/examples/">threejs.org/examples</a>, in the webvr section.  They may or may not work.

### Options

If your Vive basestations are 1.8 meters above the ground,

    ./bin/electro-webvr-unsafe --opt.pose.translate.y=1.8   URL


Or

    cat >> ./your_room.json
    {
      "pose": {
        "translate": { "x":-1, "y":1.8, "z":-1 },
        "rotate": 0
      }
    }

And then

    ./bin/electro-webvr-unsafe --add ./your_room   URL

On slow machines, like my old laptop, you can `--opt.render.scale=0.5`.  This changes getEyeParameter's renderWidth.  But the threejs demos, for instance, don't change.  I've not yet looked into why.  For perspective on performance, I usually work on an old laptop with integrated graphics (using scenes with a low-res border and high-res insets).

To see an FPS panel, `--add addins/stats` .

## Sites

### which work(ed)

Not all of the WebVR spec has implemented, and the spec itself is in flux, so "working" tends to be transient.

* [HTML5 Gamepad Tester](http://html5gamepad.com/)
* https://threejs.org/examples/webvr_cubes.html
* https://threejs.org/examples/webvr_panorama.html *"Works" - but as of 2016-09, the "skybox" is only a 1 meter cube.  It's over by the origin.*
* https://threejs.org/examples/webvr_shadow.html
* https://threejs.org/examples/webvr_video.html
* https://threejs.org/examples/webvr_vive.html

### which didn't

* https://bryik.github.io/aframe-ball-throw/
* https://aframe.io/aframe/examples/showcase/tracked-controls/
* https://webvr.info/samples/  *Requires WebVR API 1.1*

## Notes

If you *really* want lens distortion, you might look at [cardboard-distorter.js](https://github.com/googlevr/webvr-polyfill/blob/master/src/cardboard-distorter.js) in [webvr-polyfill](https://github.com/googlevr/webvr-polyfill), or [vertex-distorter.js](https://github.com/googlevr/vrview/blob/master/src/vertex-distorter.js) in [vrview](https://github.com/googlevr/vrview).  But you might have more impact helping out with the Firefox/OSVR/OSVR-Vive stack. ...  Though, if it doesn't already exist, it could be nice to have a stand-alone three.js module that takes distortion coefficients and gives you back a distorted flat mesh to drop textures on.  Which could also be used for physical camera lens correction.  An extract from cardboard-distorter.js.

You may find lighthouse tracking more stable using only one Vive base ("b").  Sometimes with two, it gets persistently confused, requiring restart.