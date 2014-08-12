var assert = require('assert');
var rigger = require('sails-rigged');
var SailsBackbone = require('./');
var pkg = require('xtuple-api/package');
var Backbone = require('backbone-relational');

describe('sails-backbone-generator', function () {
  var sails;

  before(function (done) {
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
      assert(_.all(schema.models, function (model) {

        console.log(model);



        return true;
      }));
    });


  });

});
