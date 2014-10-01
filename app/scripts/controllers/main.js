'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('MainCtrl', function($scope, $rootScope) {

        $scope.goFullscreen = function() {
            $(document).fullScreen(true);
        }

        $rootScope.prev = "main";
    });