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
    json: {
      type: 'json'
    }
  }
};

