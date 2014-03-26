var http = require('http');

var broccoli = require('broccoli');
var Watcher = require('broccoli/lib/watcher');
var middleware = require('broccoli/lib/middleware');

var tree = broccoli.loadBrocfile();
var builder = new broccoli.Builder(tree);
var watcher = new Watcher(builder);
var assets = middleware(watcher);

var app = exports.app = require('connect')();
app.use(assets);

if (!module.parent) http.createServer(app).listen(4321);
