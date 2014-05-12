## Broccoli Template Builder
 [![Build Status](https://travis-ci.org/moudy/broccoli-template-builder.svg)](https://travis-ci.org/moudy/broccoli-template-builder)

A flexible Broccoli transform plugin for client-side templates.

### Install
```
npm install --save broccoli-template-builder
```

### Example
``` js
module.exports = function (broccoli) {
  var compiler = require('ember-template-compiler');
  var broccoliTemplateBuilder = require('broccoli-template-builder');

  var templates = broccoli.makeTree('your/templates');

  templates = broccoliTemplateBuilder(templates, {
    extensions: ['hbs']               // required
  , outputFile: 'assets/templates.js' // required
  , namespace: 'Ember.TEMPLATES'      // optional (defaults to 'JST')
  , compile: function (string) {      // optional (defaults to using plain template string)
      return 'Ember.Handlebars.template('+compiler.precompile(string)+')';
    }
  });

  return templates;
};
```
