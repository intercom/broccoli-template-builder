const fs = require('fs');
const http = require('http');
const request = require('request');
const { app, watcher } = require('./app');
const { expect } = require('chai');

const PORT = 4321;
const path = '/assets/templates.js';
const url = 'http://localhost:'+PORT+path;
const server = http.createServer(app).listen(PORT);

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
      expect(body).to.include('compiler');
      done();
    });
  });

  it('strips file extention', function (done) {
    request(url, function (error, response, body) {
      expect(body).to.not.include('.hbs');
      done();
    });
  });

  after(function () {
    server.close();
    watcher.quit();
  });

});
