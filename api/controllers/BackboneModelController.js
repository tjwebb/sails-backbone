module.exports = {
  /**
   * Return ordered list of Backbone.js Models. This output can be fed into
   * SailsBackbone.parse().
   *
   * @see <https://github.com/tjwebb/sails-backbone#browser-client>
   */
  index: function (req, res) {
    BackboneModel.find({ sort: 'index ASC', limit: 999 })
      .then(function (models) {
        res.json(_.pluck(models, 'json'));
      })
      .catch(function (error) {
        sails.log.error(error);
        res.json(500, error);
      });
  }
};
