var SailsBackbone = require('../../../');

/**
 * Generate the Backbone Models and cache in the datastore. 
 */
module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:orm:loaded', function () {
        sails.log('backbone-api hook running');
        BackboneModel.find()
          .then(function (models) {
            sails.log('found', models.length, 'backbone models.');
            if (_.isArray(models) && models.length > 0) return next();

            createBackboneModels(sails, next);
          })
          .catch(next);
      });
    }
  };
};

function createBackboneModels (sails, next) {
  var pkg;
  var backboneApi = SailsBackbone.generate(sails);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    model.index = index;
    console.log('creating backbone model', model);
    return BackboneModel.create({ name: model.name, json: model });
  });

  return Promise
    .all(backboneModels)
    .then(function (models) {
      sails.log('backbone models created');
      next();
    })
    .catch(next);
}
