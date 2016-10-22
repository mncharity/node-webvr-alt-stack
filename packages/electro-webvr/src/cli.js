const { resolve } = require('require-relative');
const minimist = require('minimist');
const deepmerge = require('deepmerge');
const { loadModules } = require('./loadModules');

// [--app ADDIN_BASE] [--add ADDIN]* [--opt.I.N.D.E.X=VALUE]* [[--url] URL]

function configFromCLI (options) {
  const { argv, trimElectron, appDefault, cwd } = options;
  var args = argv;

  // Parse

  if (trimElectron) args = _trimElectronInvocationArgs(args);

  const argo = minimist(args);

  // URL

  if (!argo.url && argo._.length == 1) {
    argo.url = argo._.shift();
  }
  if (argo.url) {
    var url = argo.url;
    argo.url = (url.match(/^\w+:/) ? url :
                url.match(/^\//) ? "file:"+url :
                "file:"+cwd+"/"+url);
  }

  // Gather configs

  if (argo.app && argo.app instanceof Array)
    throw("More than one --app given: ",JSON.stringify(argo.app));

  const filesDirect = [].concat(
    argo.app || appDefault || [],
    argo.add || []
  );

  var data = [];
  var files = Array.from(filesDirect);
  for (var i=0; i< files.length; i++) {
    const file = files[i];

    const path = resolve(file,cwd);
    if (!path) throw("Can't find module '"+file+"'");
    var dat = require(path);
    if (dat.config) dat = dat.config;
    data.push(dat);

    if (dat.add) {
      if (! dat.add instanceof Array) throw("add: must be array: "+file);
      files = [].concat(files.slice(0,i+1), dat.add, files.slice(i+1));
    }
  }

  // Add cli arguments

  const argoPruned = Object.assign({},argo);
  delete argoPruned.app;
  delete argoPruned.add;
  delete argoPruned.opt;
  if (argo._.length == 0) delete argoPruned._;
  data = data.concat(argo.opt || [], [argoPruned]);

  // Merge configs

  const config = data.reduce((a,b)=>{return deepmerge(a,b)},{});

  return {
    config,
  };
}

function _trimElectronInvocationArgs (argv0) {
  const fail = ()=>{
    throw("BUG: Expected: ...electron APP [--ELECTRON-CHROME-ARG ...] --");
  };
  var argv = Array.from(argv0);
  if (!argv[0].match(/electron$/)) fail();
  if (!argv[1]) fail();
  argv = argv.slice(2);
  var arg, saw_dashes = false;
  while (arg = argv.shift()) {
    if (arg == '--') { saw_dashes = true; break; }
    else if (arg.match(/^--/)) continue;
    else fail();
  }
  if (!saw_dashes) fail();
  return argv;
}

module.exports = {
  configFromCLI,
  _trimElectronInvocationArgs,
}
