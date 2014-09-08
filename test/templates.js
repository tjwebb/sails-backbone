'use strict';

var _ = require('lodash');
_.mixin(require('congruence'));

exports.model = {
  name: _.isString,
  idAttribute: _.isString,
  urlRoot: _.isString,
  defaults: function (defaults) {
    return _.isFunction(defaults) || _.isObject(defaults);
  },
  relations: _.isArray,
  definition: _.isObject
};

exports.relation = {
  type: _.isString,
  key: _.isString,
  relatedModel: _.isString
};
