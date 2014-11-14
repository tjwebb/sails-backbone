'use strict';

var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var templates = require('./templates');
var BackboneGenerator = require('../lib/generator');
var _ = require('lodash');
_.mixin(require('congruence'));

describe('sails-backbone', function () {
  var schema;
  var app = new SailsApp();
  var config = {
    appPath: path.dirname(require.resolve('xtuple-api')),
    hooks: {
      grunt: false
    }
  };

  before(function (done) {
    this.timeout(60 * 1000);

    app.load(config, function (error, sails) {
      app = sails;
      done(error);
    });
  });

  describe('#generate()', function () {
    before(function () {
      schema = BackboneGenerator.generate(app);
    });

    it('should generate a json array', function () {
      assert(_.isObject(schema));
      assert(_.isArray(schema.models));
    });

    it('should produce valid backbone models', function () {
      _.each(schema.models, function (model) {
        assert(_.similar(templates.model, model));
      });
    });

    it('should produce valid backbone relations', function () {
      _.each(schema.models, function (model) {
        _.each(model.relations, function (relation) {
          assert(_.similar(templates.relation, relation));
        });
      });
    });

    it('should append model definition in a .definition property ', function () {
      _.each(schema.models, function (model) {
        _.each(model.definition, function (attribute) {
          assert(!_.isEmpty(attribute));
        });
      });
    });

    it('should be fast (t < 20ms) * 100', function () {
      this.timeout(2000);
      var devnull = [ ];
      for (var i = 0; i < 100; i++) {
        BackboneGenerator.generate(app);
      }
    });

  });

});
