/// <reference path="counter.js">
"use strict";

var log = function() {}
var toastr = {
  error: function () {}
}

angular.module('mt.route')
    .constant('routeConfiguration', {
      rootPath: 'views',
      extension: '.jsp'
    });
beforeEach(module('mt.route'));

var rootScope, scope, http, compile, route;

beforeEach(inject(function ($httpBackend, $rootScope, $compile, $route) {
  http = $httpBackend;
  rootScope = $rootScope;
  scope = $rootScope.$new();
  compile = $compile;
  route = $route;
}));


describe("Matsuo Routing -", function () {
  it("It contains correct routing definitions", function () {
    expect(route).not.toBeNull();
    expect(route.routes).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView']).not.toBeNull();
    expect(route.routes['/:dir/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:idView']).not.toBeNull();
  });

  describe("contextPathInterceptor", function() {
    var contextPathInterceptor, mtRouteConfig;
    beforeEach(inject(function (_contextPathInterceptor_, _mtRouteConfig_) {
      contextPathInterceptor = _contextPathInterceptor_;
      mtRouteConfig = _mtRouteConfig_;
    }));

    it("work with absolute path", function () {
      var config = { url: '/api/7' };
      contextPathInterceptor.request(config);
      expect(config.url).toBe('/api/7');
    });

    it("append base_app_location when needed", function () {
      mtRouteConfig.base_app_location = 'test';
      var config = { url: '/api/7' };
      contextPathInterceptor.request(config);
      expect(config.url).toBe('test/api/7');
    });
  });

  describe("unauthorizedInterceptor", function() {
    var unauthorizedInterceptor;
    beforeEach(inject(function (_unauthorizedInterceptor_) {
      unauthorizedInterceptor = _unauthorizedInterceptor_;
    }));

    it("work", function () {
      unauthorizedInterceptor.responseError({ status: 401, data: 'data' });
      expect(rootScope.loggedIn).toBe(false);

      unauthorizedInterceptor.responseError({ status: 403, data: 'data' });
      // no possible test actually

      unauthorizedInterceptor.responseError({ status: 500, data: 'data' });
      // no possible test actually
    });
  });
});