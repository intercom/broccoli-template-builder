const http = require('http');
const connect = require('connect');
const { loadBrocfile, Builder } = require('broccoli');
const Watcher = require('broccoli/lib/watcher');
const middleware = require('broccoli/lib/middleware');

var brocfile = loadBrocfile();
var builder = new Builder(brocfile());
var watcher = new Watcher(builder);
watcher.start()

var assets = middleware(watcher);
var app = connect();
app.use(assets);

if (!module.parent) http.createServer(app).listen(4321);

exports.watcher = watcher;
exports.app = app;
