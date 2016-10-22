{expect} = require('chai')
fs = require('fs')
{ execSync } = require('child_process')

timeoutSec = 3

has_nodeIntegration = (args) ->
  page = __dirname+"/pages/nodeIntegration.html"
  flag = "/tmp/nodeIntegrationFlag";
  timeout = "--timeout="+timeoutSec
  argl = [].concat("./bin/electro-webvr-unsafe",timeout,args,page)
  cmd = argl.join(" ")
  fs.unlink(flag)
  try
    execSync(cmd,{timeout: (timeoutSec+3)*1000, killSignal:'SIGKILL'})
  catch e
  flagExists = fs.existsSync(flag);
  fs.unlink(flag);
  return !!flagExists

describe "nodeIntegration", ->
  @timeout((timeoutSec+5)*1000)
  
  it "can be turned on, and test jig works - CRITICAL", (done) ->
    expect(has_nodeIntegration(["--opt.windows.main.optionsForBrowserWindow.webPreferences.nodeIntegration=true"])).to.equal true
    done()

  it "defaults to off - CRITICAL", ->
    expect(has_nodeIntegration([])).to.equal false
