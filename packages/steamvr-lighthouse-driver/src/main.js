const addon = require('./addon/');
const openvr = require('./openvr');

addon.userDriverConfigDir = "/tmp";
addon.driverInstallDir = "/tmp";

addon.openvr = openvr;

module.exports = addon;
