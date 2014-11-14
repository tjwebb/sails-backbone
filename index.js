'use strict';

module.exports = require('sails-generate-entities')({
  module: 'sails-backbone',
  id: 'backbone-api',
  statics: [
    'api/models/BackboneModel.js',
    'api/controllers/BackboneModelController.js'
  ],
  functions: [
    'api/hooks/backbone-api/index.js'
  ]
});

/*
var _ = require('lodash');

var SailsBackbone = {
  generate: require('./lib/generator'),
};

_.extend(SailsBackbone, require('sails-generate-backbone-api'));
_.extend(exports, SailsBackbone);

*/
