const { ipcMain } = require('electron')
const channels = require('./channels')

var waitinglist = [];

ipcMain.on( channels.clientRequest, (event)=>{
  const serverWindow = global.state.windows.main.window;
  if (waitinglist.length == 0)
    serverWindow.webContents.send(channels.serverRequest);
  waitinglist.push(event);
});

ipcMain.on( channels.serverResponse, (event,data)=>{
  const replyTo = waitinglist;
  waitinglist = [];
  replyTo.forEach((event)=>{event.returnValue = data});
})

ipcMain.on( channels.pulseRequest, (event,data) =>{
  const serverWindow = global.state.windows.main.window;
  serverWindow.webContents.send(channels.pulseRequest, data);
});
