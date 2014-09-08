'use strict';

var _ = require('lodash');
var path = require('path');

// list of relevant validation rules
var rules = _.union(
  _.keys(require('anchor/lib/match/rules')),
  [ 'type', 'model', 'collection' ]
);

/**
 * Return the depth of a model's inheritance. Used as a comparator to
 * determine the correct order for loading the Backbone models.
 */
function depthComparator (model, i, list) {
  return getDepth(model.name, i, list);
}

function getDepth (name, i, list, _level) {
  var level = _level || 0;

  if (_.isUndefined(name)) {
    return level;
  }
  else {
    var model = findModel(name, list);
    if (!model) {
      return level;
    }
    if (model.extend === name) {
      throw new Error('Model '+ name + ' is trying to extend from itself.');
    }
    return getDepth(model.extend, i, list, level + 1);
  }
}

var findModel = _.memoize(function (name, list) {
  return _.find(list, { name: name });
});

/**
 * Generate Backbone-compatible schema from the Sails.js API.
 * @param sails
 * @param pkg
 */
module.exports = function (sails, version) {
  return {
    models: _.chain(_.keys(sails.models))
      .map(_.partial(createModel, sails))
      .compact()
      .sortBy(depthComparator)
      .value(),
    version: version || '0.0.0'
  };
};

function createModel (sails, name) {
  var model = sails.models[name];
  var globalId = model.globalId;

  return globalId && {
    extend: model.extend,
    name: globalId,
    mixin: model.mixin,
    idAttribute: getPrimaryKey(model),
    urlRoot: path.join(sails.config.blueprints.prefix, name),
    defaults: getDefaults(model),
    relations: getRelations(sails, model),
    validation: model.definition
  };
}

function getPrimaryKey (model) {
  var pk = _.find(_.keys(model.definition), function (key) {
    return model.definition[key].primaryKey === true;
  });
  return pk || 'id';
}

function getRelations (sails, model) {
  var relationAttributes = _.filter(_.keys(model.definition), function (key) {
    var attribute = model.attributes[key];
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

function getDefaults (model) {
  return _.object(
    _.filter(_.keys(model.definition), _.partial(_.has, 'defaultsTo')),
    _.pluck(_.values(model.definition), 'defaultsTo')
  );
}
