'use strict';

var assert = require('assert');
var rigger = require('sails-rigged');
var templates = require('./templates');
var SailsBackbone = require('../');
var version = require('xtuple-api/package').version;
var Backbone = require('backbone');
require('backbone-relational');
require('backbone-validation');
var _ = require('lodash');
_.mixin(require('congruence'));

describe('sails-backbone', function () {
  var sails, schema;

  before(function (done) {
    this.timeout(10000);
    rigger.lift('xtuple-api', function (_sails) {
      sails = _sails;
      done();
    });
  });

  describe('#generate()', function () {
    before(function () {
      schema = SailsBackbone.generate(sails, version);
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

    it('should append model definition in a .definition property ', function () {
      _.each(schema.models, function (model) {
        _.each(model.definition, function (attribute) {
          assert(!_.isEmpty(attribute));
        });
      });
    });

    it('should be fast (t < 10ms) * 100', function () {
      this.timeout(1000);
      var devnull = [ ];
      for (var i = 0; i < 100; i++) {
        SailsBackbone.generate(sails, version);
      }
    });

  });

  describe('#parse()', function () {
    var xm;

    before(function () {
      schema = SailsBackbone.generate(sails, version);
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
    it('can instantiate new model without error', function () {
      var account = new xm.Account();
      assert(_.isObject(account));
    });
    it('should record proper inheritance in the prototype chain', function () {
      assert(xm.Account.__super__.name === 'xTupleObject');
      assert(xm.Country.__super__.name === 'Place');
    });
  });
  describe('#validate()', function () {
    var xm;

    before(function () {
      schema = SailsBackbone.generate(sails, version);
      xm = SailsBackbone.parse(schema);
      Backbone.Relational.store.addModelScope(xm);
    });

    it('should invalidate an invalid model using default validators', function (done) {
      var role = new xm.Role({
        name: 1,
        active: 'hello'
      });
      role.once('validated', function (isValid, model, errors) {
        assert(!isValid);
        if (!_.isEmpty(errors)) {
          assert(_.isString(errors.name));
          assert(_.isString(errors.active));
          return done();
        }
        else {
          done(new Error('should be invalid'));
        }
      });
      role.validate();
    });
    it('should validate an legit model using default validators', function (done) {
      var role = new xm.Role({
        name: 'role1',
        active: true
      });
      role.once('validated', function (isValid, model, errors) {
        assert(isValid);
        if (!_.isEmpty(errors)) {
          return done(new Error(JSON.stringify(errors)));
        }
        done();
      });

      role.validate();
    });
  });

  describe.skip('REST', function () {

    it('can make a rest request', function () {
      // TODO
    });

  });
});
