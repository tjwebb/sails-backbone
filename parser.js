'use strict';

var _ = require('underscore');
var rules = _.keys(require('anchor/lib/match/rules'));
var Backbone = require('backbone');
require('backbone-relational');

/**
 * Parse a schema into Backbone Relational models.
 */
module.exports = function (schema) {
  return _.object(_.pluck(schema.models, 'name'), _.map(schema.models, function (model) {
    return Backbone.RelationalModel.extend(model);
  }));
};
