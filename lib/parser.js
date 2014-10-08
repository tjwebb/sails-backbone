'use strict';

var _ = require('lodash');
var Backbone = require('backbone');
require('backbone-relational');
require('backbone-validation');

var anchorRules = _.transform(require('anchor/lib/match/rules'), function (rules, rule, name) {
  rules[name] = function (value) {
    return rule(value) === true ? undefined : 'failed "' + name + '" validation';
  };
});

// <https://github.com/balderdashy/waterline-docs/blob/master/models.md#data-types-and-attribute-properties>
var instanceMethods = {
  defaults: function () {
    return _.cloneDeep(this._defaults);
  },
  validation: function () {
    return _.cloneDeep(this._validation);
  }
};

/**
 * Parse a schema into Backbone Relational models.
 * @param schema - list of backbone model definitions ordered by inheritance depth
 * @param [ns] - existing namespace
 */
module.exports = function (schema, ns) {
  ns || (ns = { });
  if (!_.isObject(schema) || !_.isArray(schema.models) || !_.isString(schema.version)) {
    throw new TypeError('First argument to parser must be a schema object');
  }

  Backbone.Relational.store.addModelScope(ns);
  _.extend(Backbone.Validation.validators, anchorRules);
  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  _.each(_.sortBy(schema.models, 'index'), function (model) {
    _.extend(model, ns[model.name]);
    _.extend(model, instanceMethods);

    if (_.isUndefined(model.extend)) {
      ns[model.name] = Backbone.RelationalModel.extend(model);
    }
    else {
      ns[model.name] = ns[model.extend].extend(model);
    }
  });

  return ns;
};
