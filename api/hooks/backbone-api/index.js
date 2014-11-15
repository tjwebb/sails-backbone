var BackboneGenerator = require('../../../lib/generator');
var Promise = require('bluebird');

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
  var backboneApi = BackboneGenerator.generate(sails);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    model.index = index;
    return BackboneModel.create({ name: model.name, json: model, index: index });
  });

  return Promise
    .settle(backboneModels)
    .then(function (results) {
      next();
    });
}
