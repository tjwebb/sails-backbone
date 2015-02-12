# <img src="http://cdn.tjw.io/images/sails-logo.png" height='43px' />-backbone

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Generate client-side Backbone.js Models from a Sails.js API. Uses Backbone
Relational to generate relations, and implements validation rules using Anchor,
the same library used to validate Sails.js/Waterline Models and Attributes.

## Install
```sh
$ npm install lodash sails-backbone --save
```

## Usage

### 1. update sailsrc

```json
{
  "generators": {
    "modules": {
      "backbone-api": "sails-backbone"
    }
  }
}
```

### 2. run generator
```sh
$ sails generate backbone-api
```

#### Browser
See [sails-backbone-client](https://github.com/tjwebb/sails-backbone-client)


## License
MIT

[sails-logo]: http://cdn.tjw.io/images/sails-logo.png
[sails-url]: https://sailsjs.org
[npm-image]: https://img.shields.io/npm/v/sails-backbone.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sails-backbone
[travis-image]: https://img.shields.io/travis/tjwebb/sails-backbone.svg?style=flat-square
[travis-url]: https://travis-ci.org/tjwebb/sails-backbone
[daviddm-image]: http://img.shields.io/david/tjwebb/sails-backbone.svg?style=flat-square
[daviddm-url]: https://david-dm.org/tjwebb/sails-backbone
