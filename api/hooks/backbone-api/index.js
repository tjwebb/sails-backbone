var Backbone = require('backbone');
require('backbone-relational');
var BackboneGenerator = require('../../../lib/generator');
var BackboneParser = require('sails-backbone-client/lib/parser');
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
      });
    }
  };
};

function createBackboneModels (sails, next) {
  var pkg;
  var backboneApi = BackboneGenerator.generate(sails);
  var backboneModels = _.map(backboneApi.models, function (model, index) {
    sails.log('sails-backbone:', model.name);
    model.index = index;
    return BackboneModel.findOrCreate(model.name, { id: model.name, json: model, index: index });
  });

  return Promise
    .all(backboneModels)
    .then(function (results) {
      _.isObject(sails.api) || (sails.api = { });

      Backbone.Relational.showWarnings = false;
      Backbone.Relational.store.addModelScope(sails.api);
      sails.api = BackboneParser.parse(backboneApi.models, sails.api);

      next();
    });
}
