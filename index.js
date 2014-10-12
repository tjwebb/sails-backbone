'use strict';

var _ = require('lodash');

var SailsBackbone = {
  generate: require('./lib/generator'),
};

_.extend(SailsBackbone, require('sails-generate-backbone-api'));
_.extend(exports, SailsBackbone);

