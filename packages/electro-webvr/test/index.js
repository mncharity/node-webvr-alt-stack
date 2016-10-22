var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
var cs = require('coffee-script/register');

var testDir = './test/'

var mocha = new Mocha({});

fs.readdirSync(testDir).filter(function(file){
  return file.match(/^test-/);
}).forEach(function(file){
  console.log(file);
  mocha.addFile(path.join(testDir, file));
});

mocha.run(function(failures){
  process.exit(failures);
});
