'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
  .controller('InstructionsCtrl', function ($scope, $rootScope) {

  	$rootScope.settings = {
  		name: "Arthur",
  		email: "arthurcamara@gmail.com",
  		language: "english"
  	}

  	if(!$rootScope.settings) {
  		location.href = "#/";
  		return;
  	}

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    console.log($scope);
    console.log($rootScope);

    $rootScope.prev = "instructions";
  });
