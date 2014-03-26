
module.exports = function (broccoli) {
  var compiler = require('ember-template-compiler');
  var broccoliTemplateBuilder = require('./index');

  var templates = broccoli.makeTree('test/templates');

  templates = broccoliTemplateBuilder(templates, {
    extensions: ['hbs']
  , namespace: 'Ember.TEMPLATES'
  , outputFile: 'assets/templates.js'
  , compile: function (string) {
      return 'Ember.Handlebars.template('+compiler.precompile(string)+')';
    }
  });

  return templates;
};
