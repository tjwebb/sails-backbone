'use strict';

var assert = require('assert');
var rigger = require('sails-rigged');
var templates = require('./templates');
var SailsBackbone = require('../');
var pkg = require('xtuple-api/package');
var Backbone = require('backbone');
require('backbone-relational');
var _ = require('lodash');
_.mixin(require('congruence'));

describe('sails-backbone-generator', function () {
  var sails, schema;

  before(function (done) {
    this.timeout(10000);
    rigger.lift('xtuple-api', function (_sails) {
      sails = _sails;
      done();
    });
  });

  describe('#generate', function () {
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

    it('should be fast (t < 10ms) * 100', function () {
      this.timeout(1000);
      var devnull = [ ];
      for (var i = 0; i < 100; i++) {
        SailsBackbone.generate(sails, pkg);
      }
    });

  });

  describe('#parse', function () {
    var xm;

    before(function () {
      schema = SailsBackbone.generate(sails, pkg);
    });

    it('should run without error', function () {
      xm = SailsBackbone.parse(schema);
      Backbone.Relational.store.addModelScope(xm);
    });
    it('should be fast (t < 5ms) * 200', function () {
      this.timeout(1000);
      for (var i = 0; i < 200; i++) {
        SailsBackbone.parse(schema);
      }
    });
    it('can instantiate new model', function () {
      var account = new xm.Account();
    });
    it('should record proper inheritance in the prototype chain', function () {
      assert(xm.Account.__super__.name === 'xTupleObject');
      assert(xm.Country.__super__.name === 'Place');
    });

  });

  describe.skip('REST', function () {

    it('can make a rest request', function () {
      // TODO
    });

  });

});
