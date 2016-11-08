{expect} = require('chai')
pkg = require('../')

#//TODO There are tests elsewhere, made non-local by refactoring.  Review.

describe "new_VRPose_withEverything", ->

  it "has no nulls",->
    pose = pkg.new_VRPose_withEverything()
    expect(pose.position).to.be.an.instanceof Float32Array
    expect(pose.linearVelocity).to.be.an.instanceof Float32Array
    expect(pose.linearAcceleration).to.be.an.instanceof Float32Array
    expect(pose.orientation).to.be.an.instanceof Float32Array
    expect(pose.angularVelocity).to.be.an.instanceof Float32Array
    expect(pose.angularAcceleration).to.be.an.instanceof Float32Array

describe "rest of api", ->
  it "has tests"
