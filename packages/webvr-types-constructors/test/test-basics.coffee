{expect} = require('chai')
pkg = require('../')

#//TODO There are tests elsewhere, made non-local by refactoring.  Review.

describe "new_VRPose_withEverything", ->

  it "has no nulls",->
    pose = pkg.new_VRPose_withEverything()
    expect(pose.position).to.be.a 'float32array'
    expect(pose.linearVelocity).to.be.a 'float32array'
    expect(pose.linearAcceleration).to.be.a 'float32array'
    expect(pose.orientation).to.be.a 'float32array'
    expect(pose.angularVelocity).to.be.a 'float32array'
    expect(pose.angularAcceleration).to.be.a 'float32array'

describe "rest of api", ->
  it "has tests"
