driver = require('steamvr-lighthouse-driver')
{usleep} = require('sleep')
{expect} = require('chai')
Pkg = require('../')
schema = require './schema'

pkg = undefined

updateFor = (sec) ->
  console.log("Running for ",sec," seconds.")
  [1..(sec*4)].map ->
    pkg.getGamepads()
    usleep(250000)

expectAlmostEmpty = (array, item) ->
  expect(array).is.eql [item]
  expect(array[0]).is.equal item
  
output = undefined

describe "lifecycle",->
  before ->
    driver.shutdown()
    pkg = new Pkg()
  after ->
    pkg = undefined
    driver.shutdown()

  describe "intially",->
  
    it ".getGamepads a function",->
      expect(pkg.getGamepads).is.a 'function'

    it ".active is false",->
      expect(pkg.active).is.equal false

    it ".gamepadsProperties is almost empty",->
      expectAlmostEmpty(pkg.gamepadsProperties,undefined);

  describe "after first call to getGamepads",->
    before ->
      output = pkg.getGamepads()
    
    it ".active is false",->
      expect(pkg.active).is.equal false

    it ".gamepadsProperties is almost empty",->
      expectAlmostEmpty(pkg.gamepadsProperties, undefined);
  
    it ".getGamepads() output is almost empty",->
      expectAlmostEmpty(output, null)

  describe "after many calls to gamePads",->
    before ->
      updateFor(3);
      output = pkg.getGamepads()
  
    it ".active is false",->
      expect(pkg.active).is.equal false

    it ".gamepadsProperties is almost empty",->
      expectAlmostEmpty(pkg.gamepadsProperties, undefined);
  
    it ".getGamepads() output is almost empty",->
      expectAlmostEmpty(output, null)

  describe "after activation",->
    before ->
      pkg.activate();
      output = pkg.getGamepads()
      @skip() if output.length < 2
  
    it ".active is true",->
      expect(pkg.active).is.equal true

    it ".gamepadsProperties is not empty",->
      expect(pkg.gamepadsProperties.length).is.at.least 2
  
    it ".getGamepads() output is not empty",->
      expect(output.length).is.at.least 2

    it ".gamepadsProperties is valid",->
      data = pkg.gamepadsProperties
      expect(schema.validate_properties(data)).is.eql null

    it ".getGamepads() output is valid",->
      expect(schema.validate_gamepads(output)).is.eql null

  describe "after deactivation",->
    before ->
      pkg.deactivate();
      output = pkg.getGamepads()

    it ".active is false",->
      expect(pkg.active).is.equal false

    it ".gamepadsProperties is almost empty",->
      expectAlmostEmpty(pkg.gamepadsProperties, undefined);
  
    it ".getGamepads() output is almost empty",->
      expectAlmostEmpty(output, null)

