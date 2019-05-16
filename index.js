const Plugin = require('broccoli-plugin');
const mkdirp = require('mkdirp');
const walk = require('walk');
const fs = require('fs');
const path = require('path');

DEFAULTS = {
  namespace: 'JST'
};

class BroccoliTemplateBuilder extends Plugin {

  constructor(inputNodes, options = {}) {
    super(inputNodes, options);
    this.targetExtension = 'js';
    this.outputFile = options.outputFile;
    this.namespace = options.namespace || DEFAULTS.namespace;
    this.extensions = options.extensions;
    this.compile = options.compile;
  }

  build() {
    var files = [];
    mkdirp.sync(path.join(this.outputPath, path.dirname(this.outputFile)));

    return new Promise((resolve, reject) => {
      var walker = walk.walk(this.inputPaths[0]);

      walker.on('file', (root, fileStats, next) => {
        if (!this.isMatch(fileStats.name)) return next();

        var path = root+'/'+fileStats.name;
        fs.readFile(path, {encoding: 'utf8'}, (err, string) => {
          var name = this.buildName(path);
          string = this.compileString(string);
          string = this.namespaceString(name, string);
          files.push(string);
          next();
        });
      });

      walker.on('end', () => {
        var data = files.join('');
        fs.writeFile(path.join(this.outputPath, this.outputFile), data, (err) => {
          if (err) reject(err);
          resolve(this.outputPath);
        });
      });
    });
  }

  isMatch (name) {
    var extension = path.extname(name).substr(1);
    return this.extensions.indexOf(extension) !== -1;
  }

  namespaceString (name, string) {
    return this.namespace+'["'+name+'"]='+string;
  }

  buildName (file) {
    var extension = path.extname(file);
    return file.replace(this.inputPaths[0]+'/', '').replace(extension, '');
  }

  compileString (string) {
    return (this.compile ? this.compile(string) : '"'+string+'"')+';\n';
  }
}

module.exports = function broccoliTemplateBuilder(...params) {
  return new BroccoliTemplateBuilder(...params);
}

module.exports.BroccoliTemplateBuilder = BroccoliTemplateBuilder;