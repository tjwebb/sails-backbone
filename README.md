sails-backbone-generator
====================

[![Build Status](https://travis-ci.org/tjwebb/sails-backbone-generator.svg?branch=master)](https://travis-ci.org/tjwebb/sails-backbone-generator)

Generate client-side Backbone.js Models from a Sails.js API. Uses Backbone
Relational to generate relations, and Backbone Validator to generate validation
functions.

## Install
```sh
$ npm install sails-backbone-generator --save
```

## Usage

#### Server
In a sails controller or service:
```js
var SailsBackbone = require('sails-backbone-generator');
var schema = SailsBackbone.generate(sails);
res.json(schema);
```

#### Client
```js
// where xm might be the name of your model namespace
window.xm = SailsBackbone.parse(schema);
Backbone.Relational.store.addModelScope(xm);
```

## More
- npm: https://www.npmjs.org/package/sails-backbone-generator
- github: https://github.com/tjwebb/sails-backbone-generator
- License: MIT
