module.exports = {
  /**
   * Return ordered list of Backbone.js Models. This output can be fed into
   * SailsBackboneClient.parse().
   *
   * @see <https://github.com/tjwebb/sails-backbone#browser-client>
   */
  index: function (req, res) {
    BackboneModel
      .find(_.extend({ limit: 999 }, req.query))
      .then(function (models) {
        res.json(_.pluck(models, 'json'));
      })
      .catch(function (error) {
        sails.log.error(error);
        res.status(500).json(error);
      });
  }
};
