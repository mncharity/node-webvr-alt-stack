module.exports = {
  config: {
    windows: {
      main: {
        preloadRequires: [
          __dirname+"/preloadServer"
        ]
      }
    },
    mainProcessRequires: [
      __dirname+"/mainProcess"
    ],
    windowsPreloadRequires: [
      __dirname+"/preloadClient"
    ],
  }
}
