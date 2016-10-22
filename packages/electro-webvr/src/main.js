const { app } = require('electron');
const { configFromCLI } = require('./cli');
const { loadModules, local } = require('./loadModules');

const { config } = configFromCLI({
  cwd: process.cwd(),
  argv: process.argv,
  trimElectron: true,
  appDefault: __dirname+"/../addins/default"
});

(function processArgs () {

  if (config.help) {
    console.log("\n"+
                "  [--add ADDIN]* [--opt.I.N.D.E.X=VALUE]* [[--url] URL]"+
                "\n");
    app.quit();
  }

  if (config.timeout) setTimeout(()=>{app.quit()},parseInt(config.timeout)*1000);

  if (config.verbose) console.log(JSON.stringify(config,null,2));

  if (config.windows && config.windows.main && !config.windows.main.url)
    config.windows.main.url = config.url;

})();

global.state = {};
global.configuration = config;
local.configuration = config;

loadModules(config.mainProcessRequiresEarly);

function createWindows () {
  loadModules(config.mainProcessRequires);
}

app.on('ready', createWindows);

app.on('window-all-closed', ()=>{ app.quit() });
