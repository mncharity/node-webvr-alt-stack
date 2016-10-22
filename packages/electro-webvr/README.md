An insecure alternative [WebVR](https://en.wikipedia.org/wiki/WebVR) stack for the [HTC Vive](https://en.wikipedia.org/wiki/HTC_Vive) on Linux.  Intended for software development, not browsing.

Built on [node.js](https://nodejs.org/)'s [electron](http://electron.atom.io/).  Uses full-screen chromium as the compositor.  Does tracking with Valve's SteamVR [OpenVR](https://github.com/ValveSoftware/openvr) low-level lighthouse [device driver](../steamvr-lighthouse-driver/).

But it's capped at 60 fps.  And has no lens-distortion correction.  The author didn't mind this, but YMMV.

Why yet another stack?  When it was created in 2016 Q3, there was still no way to use an HTC Vive on Linux.  At all.  Not WebVR, OSVR, SteamVR, WebVR-polyfill, nor anything else.  So this app was a placeholder, to permit using my Vive on Linux, until that improved.

No, this will *not* help you run Steam, Unreal, Unity, or much of anything else.  It was built for exploratory VR development in the node js ecosystem.  WebVR pages may or may not work - the spec is/was still in flux.

## Insecurity

**Only use this tool on web pages you entirely trust.**

Electron was designed for creating apps, not being used as a browser.  It disables browswer security features like sandboxing.  Just one little compromise, and malware can own your computer.  Worse, this tool is only a one-letter typo away from having no security at all.

This tool is intended for software development on mostly local web pages.

If you really insist on using this tool on untrusted webpages, at least do it in a dedicated user account, to reduce your exposure.  `sudo useradd -m compromised` and `sudo -iu compromised`, or as root `useradd -m compromised` and `su - compromised`.


## Install

See the installation instructions in the [mono repo README](../../README.md).

## Usage

Plug in your HTC Vive.  It should become part of your desktop, as an extra monitor.

    ./bin/electro-webvr-unsafe examples/welcome.html

## Demos

    ./bin/electro-webvr-unsafe https://cdn.rawgit.com/mncharity/three.js/electro-webvr-compatible/examples/webvr_vive_paint.html
    ./bin/electro-webvr-unsafe https://cdn.rawgit.com/mncharity/three.js/electro-webvr-compatible/examples/webvr_vive_dragging.html

First, find the little "Move browser between Desktop and HMD" window - you'll need it in a moment.  Then click "Enter VR".  Then move it to the HMD.  You should get tracking and controllers after the usual Vive "swing things around while waiting" delay.  There is no back button.

You can also try the current <a href="https://threejs.org/examples/">threejs.org/examples</a>, in the webvr section.  They may or may not work.

## Options

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

On slow machines, like my old laptop, you can `--opt.render.scale=0.5`.  This changes getEyeParameter's renderWidth.  But the threejs demos, for instance, don't change.  I've not yet looked into why.  For perspective, I usually work on an old laptop with integrated graphics (using scenes with a low-res border and high-res insets).

To see an FPS panel, `--add addins/stats` .

## Sites

### which work(ed)

Not all of the WebVR spec has implemented, and the spec itself is in flux, so "working" tends to be transient.

* [HTML5 Gamepad Tester](http://html5gamepad.com/)
* https://threejs.org/examples/webvr_cubes.html
* https://threejs.org/examples/webvr_panorama.html *"Works" - but as of 2016-09, the "skybox" is only a 1 meter cube.*
* https://threejs.org/examples/webvr_shadow.html
* https://threejs.org/examples/webvr_video.html
* https://threejs.org/examples/webvr_vive.html

### which didn't

* https://bryik.github.io/aframe-ball-throw/
* https://aframe.io/aframe/examples/showcase/tracked-controls/
* https://webvr.info/samples/  *Requires WebVR API 1.1*

## Notes

If you *really* want lens distortion, you might look at [cardboard-distorter.js](https://github.com/googlevr/webvr-polyfill/blob/master/src/cardboard-distorter.js) in [webvr-polyfill](https://github.com/googlevr/webvr-polyfill), or [vertex-distorter.js](https://github.com/googlevr/vrview/blob/master/src/vertex-distorter.js) in [vrview](https://github.com/googlevr/vrview).  But you might have more impact helping out with the Firefox/OSVR/OSVR-Vive stack.

Though, if it doesn't already exist, it could be nice to have a stand-alone three.js module that takes distortion coefficients and gives you back a distorted flat mesh to drop textures on.  Which could also be used for physical camera lens correction.  An extract from cardboard-distorter.js.
