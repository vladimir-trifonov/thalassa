var registrations = require('thalassa-registrations')
  , stats = require('./stats')
  , pjson = require('../../package.json')
  ;

module.exports = function (server) {

  server.apiServer.route({
    method: 'GET',
    path: '/registrations/{name}/{version}',
    handler: function (request, reply) {
      var name = request.params.name;
      var version = request.params.version;
      server.data.getRegistrations(name, version, function (err, registrations) {
        reply(registrations);
      });
    }
  });

  server.apiServer.route({
    method: 'GET',
    path: '/registrations/{name}',
    handler: function (request, reply) {
      var name = request.params.name;
      server.data.getRegistrations(name, function (err, registrations) {
        reply(registrations);
      });
    }
  });

  server.apiServer.route({
    method: 'GET',
    path: '/registrations',
    handler: function (request, reply) {
      server.data.getRegistrations(function (err, registrations) {
        reply(registrations);
      });
    }
  });

  server.apiServer.route({
    method: 'POST',
    path: '/registrations/{name}/{version}/{host}/{port}',
    handler: function (request, reply) {
      var reg = {
        name: request.params.name,
        version: request.params.version,
        host: request.params.host,
        port: request.params.port,
        meta: request.payload || {}
      };

      server.data.update(reg, reg.meta.secondsToExpire, function (err) {
        if (err) reply(err);
        else reply(200);
      });
    }
  });

  server.apiServer.route({
    method: 'DELETE',
    path: '/registrations/{name}/{version}/{host}/{port}',
    handler: function (request, reply) {
      var reg = {
        name: request.params.name,
        version: request.params.version,
        host: request.params.host,
        port: request.params.port
      };

      var regId = registrations.create(reg).id;

      server.data.del(regId, function (err) {
        if (err) reply(err);
        else reply(200);
      });
    }
  });

  server.apiServer.route({
    method: 'GET',
    path: '/status',
    handler: function (request, reply) {
      var status = {
        name:        pjson.name,
        version:     pjson.version,
        uptime:      process.uptime(),
        memoryUsage: process.memoryUsage(),
        stats:       stats.toJSON()
      };

      reply(status);
    }
  });
};
