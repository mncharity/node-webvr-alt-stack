fs = require('fs')
{expect} = require('chai')
glob = require('glob')
schema = require './schema'

describe "Captured sample",->
  glob.sync("test/samples/device*.json").forEach (filename) ->
    it filename+" is still valid", ->
      data = JSON.parse(fs.readFileSync(filename, 'utf8'))
      expect(schema.validate_device(data)).to.eql null
