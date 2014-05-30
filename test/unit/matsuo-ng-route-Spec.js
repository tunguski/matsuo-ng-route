/// <reference path="counter.js">
"use strict";


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


describe("Matsuo Routing", function () {
  it("It contains correct routing definitions", function () {
    expect(route).not.toBeNull();
    expect(route.routes).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:parent/:idParentEntity/:idView']).not.toBeNull();
    expect(route.routes['/:dir/:idView/:idEntity']).not.toBeNull();
    expect(route.routes['/:dir/:idView']).not.toBeNull();
  });
});