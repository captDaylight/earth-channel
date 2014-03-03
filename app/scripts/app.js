'use strict';

angular.module('champagneRocksApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'partials/main',
      //   controller: 'MainCtrl'
      // })
      .when('/interactive',{
        templateUrl: 'partials/interactive',
        controller: 'InteractiveCtrl'
      })
      .when('/record',{
        templateUrl: 'partials/record',
        controller: 'MainCtrl'
      })
      .when('/cover',{
        templateUrl: 'partials/cover',
        controller: 'MainCtrl'
      })
      .when('/travel',{
        templateUrl: 'partials/travel',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/record'
      });
      
    $locationProvider.html5Mode(true);
  });