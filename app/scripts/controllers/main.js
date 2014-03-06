'use strict';

angular.module('champagneRocksApp')
  .controller('MainCtrl', function ($scope, $http) {
	
	function isThere(element){
		if($(element).length !== 0){
			return true;
		}else{
			return false;
		}
	}

	if(isThere('canvas')){
		$('canvas').remove();
	}	

  	function updateContainer(wH){
		// hero block height
		$('.top').css({
			'height': $(window).height() - 50
		});
	}


	updateContainer();	
    $(window).resize(function() {
    	
    	updateContainer();
    });

  });
