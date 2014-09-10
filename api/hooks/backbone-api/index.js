/**
 * <%= id %> hook.
 */
var SailsBackbone = require('sails-backbone');

/**
 * Generate the Backbone Models and cache in the datastore. 
 */
module.exports = function (sails) {
  sails.after('hook:orm:loaded', function () {
    BackboneModel.count().then(function (count) {
      if (count > 0) return next();
      createBackboneModels(next);
    });
  });

  return { };
};

function createBackboneModels (next) {
  var pkg;
  try {
    pkg = require('../../package');
  }
  catch (e) {
    throw new Error('No package.json found in project root.');
  }
  var backboneApi = SailsBackbone.generate(sails, pkg);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    model.index = index;
    return BackboneModel.create(model);
  });

  return Promise
    .all(backboneModels)
    .then(function (models) {
      next();
    })
    .catch(next);
}
