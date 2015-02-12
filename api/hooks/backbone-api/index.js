var BackboneGenerator = require('../../../lib/generator');
var BackboneParser = require('sails-backbone-client/lib/parser');
var Promise = require('bluebird');
global.Backbone = require('backbone');
require('backbone-relational');

/**
 * Generate the Backbone Models and cache in the datastore. 
 */
module.exports = function (sails) {
  return {
    initialize: function (next) {

      sails.after('hook:orm:loaded', function () {
        sails.log('backbone-api hook running');
        createBackboneModels(sails, next);
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
      _.isObject(sails.api) || (sails.api = { });

      Backbone.Relational.showWarnings = false;
      Backbone.Relational.store.addModelScope(sails.api);
      sails.api = BackboneParser.parse(backboneApi.models, sails.api);

      next();
    });
}
