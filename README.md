# sails-backbone-generator

[![Build Status](https://travis-ci.org/tjwebb/sails-backbone.svg?branch=master)](https://travis-ci.org/tjwebb/sails-backbone)

Generate client-side Backbone.js Models from a Sails.js API. Uses Backbone
Relational to generate relations, and implements validation rules using Anchor,
the same library used to validate Sails.js models attributes.

## Install
```sh
$ npm install sails-backbone-generator --save
```

## Usage

### Sails.js (Server)

#### Model
```js
// Automobile.js
module.exports = {
  attributes: {
    name: {
      type: 'string',
      alphanum: true,
      primaryKey: true
    },
    color: {
      type: 'string',
      enum: [ 'black', 'black' ]
    }
  }
};

// Truck.js
_.merge(module.exports, require('./Automobile'), {
  extend: 'Automobile',
  attributes: {
    bedlength: {
      type: 'integer'
    }
  }
};
```
#### Controller
```js
var SailsBackbone = require('sails-backbone-generator');
var schema = SailsBackbone.generate(sails);
res.json(schema);
```

### Browser (Client)
```js
app.models = SailsBackbone.parse(schema);
Backbone.Relational.store.addModelScope(app.models);
```

Translated into Backbone:
```js
xm.Automobile = Backbone.RelationalModel.extend({
  idAttribute: 'name',
  urlRoot: 'http://example.com/automobile',
  validations: {
    name: {
      alphanum: true
    }
  }
});

xm.Truck = xm.Automobile.extend({
  idAttribute: 'name',
  urlRoot: 'http://example.com/truck',
  validations: {
    name: {
      alphanum: true
    },
    bedlength: {
      integer: true
    }
  }
});
```

## More
- npm: https://www.npmjs.org/package/sails-backbone-generator
- github: https://github.com/tjwebb/sails-backbone
- License: MIT
