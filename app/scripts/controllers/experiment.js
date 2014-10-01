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

  	if (!$rootScope.settings) {
        location.href = "#/";
        return;
    }
    
    $rootScope.prev = "experiment";
  });
