'use strict';

angular.module('champagneRocksApp')
  .controller('CoverCtrl', function ($scope, $http) {
  	// remove any previous canvases
  	$('canvas').remove();
  	
  	$scope.about = 'Album We are trying to create a visualization of mommy blogs. In our opinion these blogs are the cultural vanguard of cultural innovation.';
  	$scope.title = 'Album art'
  	$scope.previous = '/travel';
  	$scope.next = '/record'

  });
