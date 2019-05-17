var Transform = require('broccoli-transform');
var RSVP = require('rsvp');
var mkdirp = require('mkdirp');
var walk = require('walk');
var fs = require('fs');
var path = require('path');
var jsStringEscape = require('js-string-escape');

DEFAULTS = {
  namespace: 'JST'
};

function BroccoliTemplateBuilder(inputTree, options) {
  if (!(this instanceof BroccoliTemplateBuilder)) {
    return new BroccoliTemplateBuilder(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
  this.options.namespace || (options.namespace = DEFAULTS.namespace);
}

BroccoliTemplateBuilder.prototype = Object.create(Transform.prototype);
BroccoliTemplateBuilder.prototype.constructor = BroccoliTemplateBuilder;

BroccoliTemplateBuilder.prototype.targetExtension = 'js';

BroccoliTemplateBuilder.prototype.transform = function (srcDir, destDir) {
  var options = this.options;
  var files = [];
  mkdirp.sync(path.join(destDir, path.dirname(options.outputFile)));

  function isMatch (name) {
    var extension = path.extname(name).substr(1);
    return options.extensions.indexOf(extension) !== -1;
  }

  function namespace (name, string) {
    return options.namespace+'["'+name+'"]='+string;
  }

  function buildName (file) {
    var extension = path.extname(file);
    return file.replace(srcDir+'/', '').replace(extension, '');
  }

  function compile (string) {
    return (options.compile ? options.compile(string) : '"'+string+'"')+';\n';
  }

  return new RSVP.Promise(function(resolve, reject) {
    var walker = walk.walk(srcDir);

    walker.on('file', function (root, fileStats, next) {
      if (!isMatch(fileStats.name)) return next();

      var path = root+'/'+fileStats.name;
      fs.readFile(path, {encoding: 'utf8'}, function (err, string) {
        var name = buildName(path);
        string = compile(string);
        string = namespace(name, string);
        files.push(string);
        next();
      });
    });

    walker.on('end', function () {
      var data = files.join('');
      fs.writeFile(path.join(destDir, options.outputFile), data, function (err) {
        if (err) reject(err);
        resolve(destDir);
      });
    });
  });
};

module.exports = BroccoliTemplateBuilder;

