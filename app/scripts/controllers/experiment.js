'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
  .controller('ExperimentCtrl', function ($scope, $rootScope) {

  	if($rootScope.prev!="instructions") {
  		location.href = "#/";
  		return;
  	}

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $rootScope.prev = "experiment";
  });
