const { remote } = require('electron');
const dotty = require('dotty');

const local = {};

function config (dots) {
  if (!local.configuration)
    local.configuration = JSON.parse(JSON.stringify(remote.getGlobal('configuration'))) || {};
  return dotty.get(local.configuration,dots);
}

function moduleLoad (_module) {
  var _name = _module.require ? _module.require : _module;
  var _post = _module.post;

  //ISSUE: main process error reporting.
  //This console.log is often the only hint at what failed.
  console.log("moduleLoad: ",_module);

  var _req = require(_name);
  if (_post) {
    var _expr = "_req"+_post;
    eval(_expr);
  }
  else if (_req.pluginE) {
    _req.pluginE({config,local});
  }
}

function loadModules (modules) {
  if (modules) modules.forEach((module)=>{
    moduleLoad(module);
  });
}

module.exports = {
  loadModules,
  local,
  config,
}
