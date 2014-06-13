/// <reference path="counter.js">
"use strict";

var log = function() {}
var toastr = {
  error: function () {}
}

var routeConfiguration = {
  rootPath: 'views',
  extension: '.xtest'
};

angular.module('mt.route')
    .constant('routeConfiguration', routeConfiguration);
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
  var contextPathInterceptor, mtRouteConfig;
  beforeEach(inject(function (_contextPathInterceptor_, _mtRouteConfig_) {
    contextPathInterceptor = _contextPathInterceptor_;
    mtRouteConfig = _mtRouteConfig_;
  }));

  it("It contains correct routing definitions", function () {
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView']).not.toBeNull();
    expect(route.routes['/:dir/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:idView']).not.toBeNull();
  });

  it("returns correct view address", function () {
    var templateUrl = route.routes['/:dir/:idView'].templateUrl;

    var params = {
        dir: 'lemur',
      idView: 'access'
    };
    expect(templateUrl(params)).toBe('/views/lemur/access.xtest');
    params.parent = 'uber';
    expect(templateUrl(params)).toBe('/views/uber/lemur/access.xtest');
    routeConfiguration.file = true;
    expect(templateUrl(params)).toBe('./views/uber/lemur/access.xtest');
    routeConfiguration.file = undefined;
  });

  it("is defined uniformly", function () {
    var templateUrl = route.routes['/:dir/:idView'].templateUrl;

    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:idView/:idEntity'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:idView'].templateUrl).toBe(templateUrl);
  });

  describe("contextPathInterceptor", function() {
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