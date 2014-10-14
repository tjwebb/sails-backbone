var SailsBackbone = require('../../../');

/**
 * Generate the Backbone Models and cache in the datastore. 
 */
module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        sails.log('backbone-api hook running');
        createBackboneModels(sails, next);
        /*
        BackboneModel.find()
          .then(function (models) {
            sails.log('found', models.length, 'backbone models.');

          })
          .catch(next);
        */
      });
    }
  };
};

function createBackboneModels (sails, next) {
  var pkg;
  var backboneApi = SailsBackbone.generate(sails);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    model.index = index;
    return BackboneModel.create({ name: model.name, json: model, index: index });
  });

  return Promise
    .all(backboneModels)
    .then(function (models) {
      sails.log('backbone models created');
      next();
    })
    .catch(function (error) {
      sails.warn(error);
      next();
    });
}
