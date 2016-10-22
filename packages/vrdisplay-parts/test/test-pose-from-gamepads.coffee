{expect} = require('chai')
{ findGamepad } = require('../pose-from-gamepads')

class Device
  constructor: ->
    @pose = null
    @buttons = []
  hmd: -> @buttons = [undefined]; @posed()
  base: -> @buttons = []; @posed()
  cntrl: -> @buttons = [undefined,undefined,undefined]; @posed()
  posed: -> @pose = {position:null,orientation:null}; @
  tracked: -> @pose = {position:[],orientation:[]}; @
  nopose: -> @pose = null; @

d = -> new Device()

describe "findGamepad", ->

  it "finds nothing in [null]", ->
    gp = [null]
    expect(findGamepad(gp)).to.equal null

  it "finds a single HMD", ->
    gp = [d().hmd()]
    expect(findGamepad(gp)).to.equal gp[0]

  it "doesn't find an untracked Controller", ->
    gp = [d().cntrl()]
    expect(findGamepad(gp)).to.equal null

  it "does find a tracked Controller", ->
    gp = [d().cntrl().tracked()]
    expect(findGamepad(gp)).to.equal gp[0]

  it "prefers HMD to Controller", ->
    gp = [d().hmd(),d().cntrl()]
    expect(findGamepad(gp)).to.equal gp[0]
    gp = [d().cntrl(),d().hmd()]
    expect(findGamepad(gp)).to.equal gp[1]

  it "prefers tracked Controller to untracked HMD", ->
    h = d().hmd().posed()
    c = d().cntrl().tracked()
    gp = [h,c]
    expect(findGamepad(gp)).to.equal c
    gp = [c,h]
    expect(findGamepad(gp)).to.equal c
