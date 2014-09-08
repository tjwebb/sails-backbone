'use strict';

var _ = require('underscore');
var rules = _.keys(require('anchor/lib/match/rules'));
var Backbone = require('backbone');
require('backbone-relational');

/**
 * Parse a schema into Backbone Relational models.
 */
module.exports = function (schema) {
  if (!_.isObject(schema) || !_.isArray(schema.models) || !_.isString(schema.version)) {
    throw new TypeError('First argument to parser must be a schema object');
  }

  var ns = { };

  _.each(schema.models, function (model) {
    if (_.isUndefined(model.extend)) {
      ns[model.name] = Backbone.RelationalModel.extend(model);
    }
    else {
      ns[model.name] = ns[model.extend].extend(model);
    }
  });

  return ns;
};
