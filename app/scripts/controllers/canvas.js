'use strict';

/**
 * @ngdoc function
 * @name speakassoClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the speakassoClientApp
 */
angular.module('speakassoClientApp')
    .controller('CanvasCtrl', function($scope, $rootScope, $http) {

        //force settings and instructions to be present
        if (!$rootScope.settings || !$rootScope.settings.config) {
            location.href = "#/";
            return;
        }

    });