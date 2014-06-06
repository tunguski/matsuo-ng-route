/**
 * Created by marek on 03.03.14.
 */
angular.module('mt.route', [ 'ngRoute'])
    .config(function($routeProvider, $httpProvider, routeConfiguration) {

      var routeDefinition = {
        templateUrl : function (routePathParams) {
          return (routeConfiguration.file ? '.' : '') + '/' + routeConfiguration.rootPath + '/' + routePathParams.dir + '/'
              + (routePathParams.parent ? routePathParams.parent + '/' : '')
              + routePathParams.idView + routeConfiguration.extension;
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
     * application prefix is declared. Interceptor looks up for prefix on window.base_app_location.
     */
    .factory('contextPathInterceptor', function() {
      return {
        'request': function(config) {
          if (window.base_app_location &&
              config.url.indexOf('/') == 0 &&
              !config.url.contains("template")) {
            config.url = (window.base_app_location + config.url).replace(/\/\//g, '/');
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

