'use strict';

var _ = require('lodash');
_.mixin(require('congruence'));

exports.model = {
  name: _.isString,
  idAttribute: _.isString,
  urlRoot: _.isString,
  relations: _.isArray,
  _defaults: _.isObject,
  _validation: _.isObject
};

exports.relation = {
  type: _.isString,
  key: _.isString,
  relatedModel: _.isString
};
