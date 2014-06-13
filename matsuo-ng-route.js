/**
 * Created by marek on 03.03.14.
 */
angular.module('mt.route', [ 'ngRoute'])
    .constant('mtRouteConfig', {
      base_app_location: '',
      file: false,
      rootPath: 'views',
      extension: '.html',
      defaultRoute: ''
    })

    .config(function($routeProvider, $httpProvider, mtRouteConfig) {

      var routeDefinition = {
        templateUrl : function (routePathParams) {
          return (mtRouteConfig.file ? '.' : '') + '/' + mtRouteConfig.rootPath + '/'
              + (routePathParams.parent ? routePathParams.parent + '/' : '')
              + routePathParams.dir + '/'
              + routePathParams.idView + mtRouteConfig.extension;
        }
      };

      angular.forEach([
        '/:dir/:parent/:idParentEntity/:idView/:idEntity',
        '/:dir/:parent/:idParentEntity/:idView',
        '/:dir/:idView/:idEntity',
        '/:dir/:idView'
      ], function (path) {
        $routeProvider.when(path, routeDefinition);
      });

      $httpProvider.interceptors.push('contextPathInterceptor', 'unauthorizedInterceptor');
    })


    /**
     * Helper interceptor for selenium. It adds application prefix for absolute requests that are not for templates if
     * application prefix is declared. Interceptor looks up for prefix on mtRouteConfig.base_app_location.
     */
    .factory('contextPathInterceptor', function(mtRouteConfig) {
      return {
        'request': function(config) {
          if (mtRouteConfig.base_app_location &&
              config.url.indexOf('/') == 0 &&
              !_.strContains(config.url, "template")) {
            config.url = (mtRouteConfig.base_app_location + config.url).replace(/\/\//g, '/');
            return config;
          }

          return config;
        }
      }
    })


    /**
     * Interceptor for response statuses 401, 403, 500
     */
    .factory('unauthorizedInterceptor', function($q, $rootScope) {
      return {
        'responseError': function(rejection) {
          if (rejection.status === 401) {
            // unauthorized
            log('unauthorized request ' + (rejection.data || ''));
            $rootScope.loggedIn = false;
          } else if (rejection.status === 403) {
            // forbidden
            log('forbidden request ' + (rejection.data || ''));
          } else if (rejection.status === 500) {
            // internal server error
            toastr.error("Error occurred. Please contact your system's administrators.");
            log('Internal Server Error' + (rejection.data || ''));
          }

          return $q.reject(rejection);
        }
      }
    })
;

