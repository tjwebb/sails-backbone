var SailsBackbone = require('sails-backbone');

/**
 * Generate the Backbone Models and cache in the datastore. 
 */
module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        BackboneModel.find().then(function (models) {
          if (_.isArray(models) && models.length > 0) return next();

          createBackboneModels(next);
        });
      });
    }
  };
};

function createBackboneModels (next) {
  var pkg;
  var backboneApi = SailsBackbone.generate(sails);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    model.index = index;
    console.log('creating', model);
    return BackboneModel.create(model);
  });

  return Promise
    .all(backboneModels)
    .then(function (models) {
      next();
    })
    .catch(next);
}
