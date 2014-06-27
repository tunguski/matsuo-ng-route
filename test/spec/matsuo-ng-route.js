/// <reference path='counter.js'>
'use strict';

var log = function() {}
var toastr = {
  error: function () {}
}

var routeConfiguration;

angular.module('mt.route')
    .config(function(mtRouteConfig) {
      mtRouteConfig.extension = '.xtest';
      routeConfiguration = mtRouteConfig;
    });
beforeEach(module('mt.route'));

var rootScope, scope, http, compile, route, mtRouteConfig;

beforeEach(inject(function ($httpBackend, $rootScope, $compile, $route, _mtRouteConfig_) {
  http = $httpBackend;
  rootScope = $rootScope;
  scope = $rootScope.$new();
  compile = $compile;
  route = $route;
  mtRouteConfig = _mtRouteConfig_;
}));


describe('Matsuo Routing -', function () {

  it('It contains correct routing definitions', function () {
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView']).not.toBeNull();
    expect(route.routes['/:dir/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:idView']).not.toBeNull();
  });

  it('returns correct view address', function () {
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
    routeConfiguration.file = false;
  });

  it('is defined uniformly', function () {
    var templateUrl = route.routes['/:dir/:idView'].templateUrl;

    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:idView/:idEntity'].templateUrl).toBe(templateUrl);
    expect(route.routes['/:dir/:idView'].templateUrl).toBe(templateUrl);
  });

  describe('contextPathInterceptor', function() {

    var contextPathInterceptor;
    beforeEach(inject(function (_contextPathInterceptor_) {
      contextPathInterceptor = _contextPathInterceptor_;
    }));

    it('work with absolute path', function () {
      var config = { url: '/api/7' };
      contextPathInterceptor.request(config);
      expect(config.url).toBe('/api/7');
    });

    it('append base_app_location when needed', function () {
      mtRouteConfig.base_app_location = 'test';
      var config = { url: '/api/7' };
      contextPathInterceptor.request(config);
      expect(config.url).toBe('test/api/7');
    });
  });

  describe('unauthorizedInterceptor', function() {

    var unauthorizedInterceptor;
    beforeEach(inject(function (_unauthorizedInterceptor_) {
      unauthorizedInterceptor = _unauthorizedInterceptor_;
    }));

    it('work', function () {
      unauthorizedInterceptor.responseError({ status: 401, data: 'data' });
      expect(rootScope.loggedIn).toBe(false);

      unauthorizedInterceptor.responseError({ status: 403, data: 'data' });
      // no possible test actually

      unauthorizedInterceptor.responseError({ status: 500, data: 'data' });
      // no possible test actually
    });
  });

  describe('apiRedirectsInterceptor', function() {

    var apiRedirectsInterceptor;
    beforeEach(inject(function (_apiRedirectsInterceptor_) {
      apiRedirectsInterceptor = _apiRedirectsInterceptor_;
    }));

    it('apiRedirects works', function () {
      mtRouteConfig.apiRedirects.classified = 'https://strictly.classified.com';
      var config = { url: '/classified/api/7' };
      apiRedirectsInterceptor.request(config);
      expect(config.url).toBe('https://strictly.classified.com/classified/api/7');
      delete mtRouteConfig.apiRedirects.classified;
    });

    it('apiRedirects does not change any request', function () {
      mtRouteConfig.apiRedirects.classified = 'https://strictly.classified.com';
      var config = { url: '/classifie/api/7' };
      apiRedirectsInterceptor.request(config);
      expect(config.url).toBe('/classifie/api/7');
      delete mtRouteConfig.apiRedirects.classified;
    });
  });
});