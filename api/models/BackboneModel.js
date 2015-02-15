module.exports = {
  autoPK: false,
  autoCreatedBy: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
    name: {
      type: 'string',
      primaryKey: true
    },
    index: {
      type: 'integer'
    },
    json: {
      type: 'json'
    }
  }
};

