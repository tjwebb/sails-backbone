'use strict';

var _ = require('lodash');

var SailsBackbone = {
  generate: require('./lib/generator'),
  parse: require('./lib/parser')
};

_.extend(SailsBackbone, require('sails-generate-backbone-api'));
_.extend(exports, SailsBackbone);

