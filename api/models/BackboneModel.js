module.exports = {
  autoPK: false,
  autoCreatedBy: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    id: {
      type: 'string',
      primaryKey: true
    },
    index: {
      type: 'integer'
    },
    json: {
      type: 'json'
    },

    toJSON: function () {
      var model = this.toObject();
      model.name = model.id;

      return model;
    }
  }
};

