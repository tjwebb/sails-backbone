'use strict';

var _ = require('lodash');
var rules = _.keys(require('anchor/lib/match/rules'));
var path = require('path');

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
      throw new Error('Model '+ name + 'is trying to extend from itself.');
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
module.exports = function (sails, pkg) {
  return {
    models: _.chain(_.keys(sails.models))
      .map(_.partial(createModel, sails, pkg))
      .compact()
      .sortBy(depthComparator)
      .value(),
    version: pkg.version
  };
};

function createModel (sails, pkg, name) {
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
    validations: getValidations(sails, model)
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

function getValidations (sails, model) {
  return _.object(
    _.keys(model.definition),
    _.map(model.definition, function (attribute, key) {
      return _.compact(_.intersection(_.keys(attribute), rules).concat(attribute.type));
    })
  );
}

function getDefaults (model) {
  return _.object(
    _.filter(_.keys(model.definition), _.partial(_.has, 'defaultsTo')),
    _.pluck(_.values(model.definition), 'defaultsTo')
  );
}
