module.exports = {
  windows: {
    main: {
      optionsForBrowserWindow: {
        title: "Vive HMD",
        width: 1080,
        height: 600,
      },
      url: null,
      quitOnClose: true,
      rememberWindowPosition: false,
      devtools: true,
    },
  },
  mainProcessRequires: [
    __dirname+"/../src/openWindows"
  ],
  present: {
    package: 'vrdisplay-parts/present-simple',
    scale: 1,
  },
  pose: {
    translate: { x:0, y:2, z:0 },
    rotateY: 0,
  },
  gamepads: {
    activeOnLoad: true,
  },
}
