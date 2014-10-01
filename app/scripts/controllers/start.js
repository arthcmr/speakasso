'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
  .controller('StartCtrl', function ($scope) {
    $scope.initStart = function() {
		$(function() {
			var formWrap = document.getElementById( 'fs-form-wrap' );
			new FForm( formWrap, {});
		});
    };

    $scope.initStart();

  });
