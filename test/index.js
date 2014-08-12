'use strict';

var assert = require('assert');
var rigger = require('sails-rigged');
var templates = require('./templates');
var SailsBackbone = require('../');
var pkg = require('xtuple-api/package');
var Backbone = require('backbone-relational');
var _ = require('lodash');
_.mixin(require('congruence'));

describe('sails-backbone-generator', function () {
  var sails;

  before(function (done) {
    this.timeout(10000);
    rigger.lift('xtuple-api', function (_sails) {
      sails = _sails;
      done();
    });
  });

  describe('#generate', function () {
    var schema;
    before(function () {
      schema = SailsBackbone.generate(sails, pkg);
    });

    it('should generate a json array', function () {
      assert(_.isObject(schema));
      assert(_.isArray(schema.models));
      assert(_.isString(schema.version));
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

    it('should produce valid anchor validations', function () {
      _.each(schema.models, function (model) {
        _.each(model.validations, function (validation) {
          assert(validation.length > 0);
        });
      });
    });

    it('should be fast (t < 10ms)', function () {
      this.timeout(1000);
      var devnull = [ ];
      for (var i = 0; i < 100; i++) {
        SailsBackbone.generate(sails, pkg);
      }
    });

  });

});
