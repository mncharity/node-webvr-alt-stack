deepcopy = require('deepcopy')
{expect} = require('chai')
{ _trimElectronInvocationArgs } = require('../src/cli')

trim = _trimElectronInvocationArgs
e = 'blah/bin/electron'
f = 'f'
a = 'a'
b = 'b'
dd = '--'
z = '--z=3'
y = '--y'

check = (argsE,args) ->
  argv = [].concat([e,'f'],argsE,['--'],args)
  expect(trim(argv)).to.eql args

ftrim = (argv) ->
  -> trim(argv)

describe "_trimElectronInvocationArgs", ->

  it "throws on malformed invocations", ->
    expect(ftrim([e])).to.throw()
    expect(ftrim([e,f])).to.throw()
    expect(ftrim([e,f,a])).to.throw()
    expect(ftrim([e,f,z])).to.throw()
    expect(ftrim([e,f,z,z])).to.throw()
    expect(ftrim([e,f,y,a])).to.throw()

  it "works on simple invocations", ->
    check([],[])
    check([],[a])
    check([],[y])
    check([],[z])
    check([],[dd])
    check([],[a,b])
    check([],[y,b])
    check([],[z,b])
    check([],[dd,b])
    check([],[a,y])
    check([],[a,z])
    check([],[a,dd])

  it "works with electron/chrome arguments", ->
    check([z],[])
    check([z],[a])
    check([z],[y])
    check([z],[z])
    check([z],[dd])
    check([z,z],[])
    check([z,z],[a])
    check([z,z],[y])
    check([z,z],[z])
    check([z,z],[dd])
