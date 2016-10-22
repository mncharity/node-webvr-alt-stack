process = require('process')
deepcopy = require('deepcopy')
{expect} = require('chai')
{ configFromCLI } = require('../src/cli')
cli = configFromCLI

e = 'blah/bin/electron'
f = 'f'
a = 'a'
b = 'b'
dd = '--'
z = '--z=3'
y = '--y'


config_a = ->
  {config:deepcopy(require("./configs/a"))}

it_check = (argv,result) ->
  it argv.join(" "), ->
    expect(cli({argv:argv})).to.eql {config:result}

clia = (argv) -> cli({argv:argv,cwd:process.cwd()})


describe "cli", ->

  describe "trimElectron", ->

    it "false leaves array unchanged", ->
      v0 = [e,f,dd,'a']
      expect(cli({argv:v0})).to.eql {
        config:
          "_": [e,f,'a']
      }

    it "true removes electron invocation args", ->
      v0 = [e,f,dd,'a']
      expect(cli({argv:v0,trimElectron:true})).to.eql {
        config:
          url: "file:undefined/a"
      }

  describe "--opt", ->

    it_check(['--opt.a'], {a:true})
    it_check(['--opt.a=3'], {a:3})
    it_check(['--opt.a','--opt.a=3'],{a:3})
    it_check(['--opt.a.b=3'],{a:{b:3}})

  describe "--add", ->

    it "loads .json", ->
      expect(clia(["--add","./test/configs/a"])).to.eql {config:require("./configs/a")}

    it "loads .js", ->
      expect(clia(["--add","./test/configs/b"])).to.eql {config:require("./configs/b")}

    it "combines files", ->
      expect(clia(["--add","./test/configs/a","--add","./test/configs/b"])).to.eql {config:require("./configs/a_b")}

    it "is overridden by --opt", ->
      ca = config_a()
      ca.config.c = "saw"
      expect(clia(["--add","./test/configs/a","--opt.c=saw"])).to.eql ca

  describe "--app", ->

    it "can't be used twice", ->
      expect(-> clia([
        "--app","test/configs/a",
        "--app","test/configs/b"])).to.throw()

    it "loads .json", ->
      expect(clia(["--app","./test/configs/a"])).to.eql {config:require("./configs/a")}

    it "loads .js", ->
      expect(clia(["--app","./test/configs/b"])).to.eql {config:require("./configs/b")}

