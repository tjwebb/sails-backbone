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
