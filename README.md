# <img src="http://cdn.tjw.io/images/sails-logo.png" height='40px' />-backbone

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Generate client-side Backbone.js Models from a Sails.js API. Uses Backbone
Relational to generate relations, and implements validation rules using Anchor,
the same library used to validate Sails.js/Waterline Models and Attributes.

## Install
```sh
$ npm install sails-backbone --save
```

## Usage

### Sails.js (Server)

#### Example Model
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
var SailsBackbone = require('sails-backbone');
var schema = SailsBackbone.generate(sails);
res.json(schema);
```

### Browser (Client)
```js
var app = { };
app.models = SailsBackbone.parse(schema);
Backbone.Relational.store.addModelScope(app.models);
```

Translated into Backbone:
```js
app.models..Automobile = Backbone.RelationalModel.extend({
  idAttribute: 'name',
  urlRoot: 'http://example.com/automobile',
  validations: {
    name: {
      alphanum: true
    }
  }
});

app.models.Truck = app.models.Automobile.extend({
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

## License
MIT

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-backbone.svg?style=flat
[npm-url]: https://npmjs.org/package/sails-backbone
[travis-image]: https://img.shields.io/travis/tjwebb/sails-backbone.svg?style=flat
[travis-url]: https://travis-ci.org/tjwebb/sails-backbone
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-backbone.svg?style=flat
[daviddm-url]: https://david-dm.org/tjwebb/sails-backbone
