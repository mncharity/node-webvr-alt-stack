module.exports = {
  windows: {
    main: {
      preloadRequires: [
        __dirname+"/mover",
      ],
    },
    showMainWindowOnHMD: {
      optionsForBrowserWindow: {
        title: "Toggle VR window placement",
        width: 300,
        height: 50,
        webPreferences: {
          nodeIntegration: true,
        },
      },
      url: "file:"+__dirname+"/control.html",
      quitOnClose: true,
    }
  }
}
