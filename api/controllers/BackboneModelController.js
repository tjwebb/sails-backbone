module.exports = {
  /**
   * Return ordered list of Backbone.js Models. This output can be fed into
   * SailsBackbone.parse().
   *
   * @see <https://github.com/tjwebb/sails-backbone#browser-client>
   */
  index: function (req, res) {
    sails.log('backbonemodels.index');
    process.nextTick(function () {
      BackboneModel.find(_.extend({ limit: 999 }, req.query))
        sails.log('about to query backbone models');
        .then(function (models) {
          sails.log('models queried');
          res.json(_.pluck(models, 'json'));
        })
        .catch(function (error) {
          sails.log(error);
          sails.log.error(error);
          res.json(500, error);
        });
    });
  }
};
