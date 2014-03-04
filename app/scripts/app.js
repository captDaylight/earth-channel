'use strict';

angular.module('champagneRocksApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/interactive',{
        templateUrl: 'partials/interactive',
        controller: 'InteractiveCtrl'
      })
      .when('/cover',{
        templateUrl: 'partials/cover',
        controller: 'CoverCtrl'
      })
      .when('/travel',{
        templateUrl: 'partials/travel',
        controller: 'TravelCtrl'
      })
      .when('/record', {
        templateUrl: 'partials/record',
        controller: 'RecordCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });