{usleep} = require('sleep')
{expect} = require('chai')
schema = require './schema'
driver = require '../'


validate = ->
  expect(schema.validate_driver(driver)).to.eql null

updateFor = (sec) ->
  console.log("Running for ",sec," seconds.")
  [1..(sec*4)].map ->
    driver.update()
    usleep(250000)

describe "driver", ->

  describe "before first update",->
    it "validates",-> validate()
    it ".devices is an empty array",->
      expect(driver.devices).to.eql []
    

  describe "first update",->
    it "doesn't explode",->
      driver.update()

  describe "after first start",->
    it "validates",-> validate()

  describe "first shutdown",->
    it "doesn't explode",->
      driver.shutdown()

  describe "after first shutdown",->
    it "validates",-> validate()
    it ".devices is an empty array",->
      expect(driver.devices).to.eql []

  describe ".devices",->
    before ->
      updateFor 10
      if not driver.devices > 0
        @skip()
    
    it "validates",-> validate()

    after ->
      driver.shutdown()

  describe "directory configuration",->
    before ->
      @skip()

    it "is tested",-> @skip()

  describe "state reset by restart",->
    before ->
      @skip()

    it "is tested",-> @skip()
  
