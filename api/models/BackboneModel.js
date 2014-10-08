/**
 * BackboneModel.js
 */
module.exports = {
  autoPK: false,
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

