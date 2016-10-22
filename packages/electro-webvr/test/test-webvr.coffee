{expect} = chai = require('chai')
chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

schema = require('./schema-webvr')
{ getVRDisplays, VRFrameData, getGamepads, _init } = require('../addins/webvr')

_init();

display = undefined

describe "getVRDisplays", ->
  it "provides a display", (done) ->
    getVRDisplays().then(
      ((res) ->
        expect(res).to.be.an 'array'
        expect(res.length).to.be.at.least 1
        expect(res[0].requestPresent).to.be.a 'function'
        done()),
      (err) -> done(err))
    undefined

describe "VRDisplay", ->
  before ->
    getVRDisplays().then(
      (ds) -> display = ds[0])

  describe "getEyeParameters", ->

    it "is a function", ->
      expect(display.getEyeParameters).is.a 'function'

    it "matches schema", ->
      data = display.getEyeParameters('left')
      expect(schema.check_VREyeParameters(data)).to.equal null
      data = display.getEyeParameters('right')
      expect(schema.check_VREyeParameters(data)).to.equal null

    it "has sane values", ->
      data = display.getEyeParameters('left')
      expect(data.renderWidth).is.within(100,3000)
      expect(data.renderHeight).is.within(100,3000)
      expect(data.offset[0]).is.within(-.1,.1)
      expect(data.offset[1]).is.within(-.1,.1)
      expect(data.offset[2]).is.within(-.1,.1)
      expect(data.fieldOfView.upDegrees).is.within(10,100)
      expect(data.fieldOfView.downDegrees).is.within(10,100)
      expect(data.fieldOfView.leftDegrees).is.within(10,100)
      expect(data.fieldOfView.rightDegrees).is.within(10,100)

  describe "depthNear", ->
    it "has sane values", ->
      expect(display.depthNear).is.within(0,.2)
      
  describe "depthFar", ->
    it "has sane values", ->
      expect(display.depthFar).is.within(1,100000)

  describe "getPose", ->
    
    it "matches schema", ->
      data = display.getPose()
      expect(schema.check_VRPose(data)).to.equal null
      
    describe "position", ->
      before ->
        @skip() if not display?.position

      it "has sane values", ->
        expect(display.position[0]).is.within(-5,5)

      it "has sane values", ->
        expect(display.position[2]).is.within(-5,5)

      it "has sane values", ->
        expect(display.position[1]).is.within(-1,3)

    describe "orientation", ->
      before ->
        @skip if not display?.orientation

      it "has tests"

    describe "linearVelocity", ->

      it "has tests"

    describe "angularVelocity", ->

      it "has tests"
