var fs = require('fs');
var http = require('http');
var request = require('request');
var app = require('./app').app;
var expect = require('chai').expect;

var PORT = 4321;
var path = '/assets/templates.js';
var url = 'http://localhost:'+PORT+path;
var server = http.createServer(app).listen(PORT);

describe('broccoli-template-compiler', function () {

  beforeEach(function (done) {
    // Force Broccoli to re-build
    fs.writeFile('test/templates/app.hbs', new Date(), done);
  });

  it('excludes files without specified extension', function (done) {
    request(url, function (error, response, body) {
      expect(body).to.include('app');
      expect(body).to.include('users/show');
      expect(body).to.not.include('users/no-include');
      done();
    });
  });

  it('namespaces', function (done) {
    request(url, function (error, response, body) {
      expect(body).to.include('Ember.TEMPLATES');
      done();
    });
  });

  it('compiles', function (done) {
    request(url, function (error, response, body) {
      expect(body).to.include('compilerInfo');
      done();
    });
  });

  it('strips file extention', function (done) {
    request(url, function (error, response, body) {
      expect(body).to.not.include('.hbs');
      done();
    });
  });

  after(function () {server.close();});

});
