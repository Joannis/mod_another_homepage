"use strict"

var express = require('express');
var http = require('http');
//var async = require('async');
var breach = require('breach_module');

var bootstrap = function(port) {
  breach.init(function(cb_) {
    breach.register('core', 'inst:.*');

    breach.expose('init', function(src, args, cb_) {
      breach.module('core').call('tabs_new_tab_url', {
        url: 'http://127.0.0.1:' + port + '/newtab'
      }, function(err) {
        console.log('New tab page set! [' + err + ']');
      });
      return cb_();
    });

    breach.expose('kill', function(args, cb_) {
      process.exit(0);
    });

    console.log('Exposed: `http://127.0.0.1:' + port + '/newtab`');
  });
};

(function setup()
{
  var page = express();
  
  page.use('/', express.static(__dirname + '/home'));
  page.use(require('body-parser')());
  page.use(require('method-override')())
  
  var http_srv = http.createServer(page).listen(0, '127.0.0.1');
  
  http_srv.on('listening', function() {
    return bootstrap(http_srv.address().port);
  });
  
})();