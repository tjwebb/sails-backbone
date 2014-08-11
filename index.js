'use strict';

var rules = _.keys(require('anchor/lib/match/rules'));
var path = require('path');
var _ = require('lodash');

/**
 * Generate Backbone Models and Collections objects from the Sails.js API.
 * @param sails
 * @param pkg
 */
exports.create = function (sails, pkg) {
  var domain = _.intersection(_.keys(sails.models), _.keys(sails.controllers));

  return {
    models: _.map(domain, _(createModel).partial(sails, pkg)),
    version: pkg.version
  };
};

function createModel (sails, pkg, name) {
  var model = sails.models[name];
  var globalId = model.globalId;

  return {
    idAttribute: getPrimaryKey(model),
    urlRoot: path.join(sails.config.blueprints.prefix, name),
    defaults: getDefaults(model),
    relations: getRelations(sails, model),
    validations: getValidations(sails, model)
  };
}

function getPrimaryKey (model) {
  var pk = _.where(model.definition, { primaryKey: true });
  return pk || 'id';
}

function getRelations (sails, model) {
  var relationAttributes = _.filter(_.keys(model.definition), function (key) {
    var attribute = model.attribute[key];
    return attribute.model || attribute.collection;
  });
  return _.map(relationAttributes, function (key) {
    var relation = model.definition[key];

    return {
      type: relation.model ? 'HasOne' : 'HasMany',
      key: key,
      relatedModel: sails.models[relation.model || relation.collection].globalId,
      reverseRelation: relation.via ? {
        key: relation.via
      } : undefined
    };

  });
}

function getValidations (sails, model) {
  return _.transform(model.definition, function (result, attribute, key) {
    result[key] = _.pick(attribute, rules);
  });
}

function getDefaults (model) {
  return _.object(
    _.filter(_.keys(model.definition), _.partial(_.has, 'defaultsTo')),
    _.pluck(_.values(model.definition), 'defaultsTo')
  );
}
