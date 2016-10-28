// Why alwaysOnTop?  Avoids redraw flicker on Ubuntu 16.04.

module.exports = {
  config: {
    windows: {
      main: {
        optionsForBrowserWindow: {
          fullscreen: true,
          alwaysOnTop: true,
        }
      }
    }
  }
}
