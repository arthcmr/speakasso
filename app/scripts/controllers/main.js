'use strict';

/**
 * @ngdoc function
 * @name speakassoClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the speakassoClientApp
 */
angular.module('speakassoClientApp')
    .controller('MainCtrl', function($scope, $rootScope) {

        $scope.painters = [{
            value: "leonardo",
            name: "Leonardo",
            image: "images/leonardo.jpg",
            description: "The ephemeral nature of speech represented through deformed rings",
            tags: ["energy", "color", "expressiveness"]
        }, {
            value: "picasso",
            name: "Picasso",
            image: false,
            description: "Like Heraclitus' river, this meandering stream shows the everchanging flow of conversations",
            tags: ["pitch", "energy", "silence"]
        }];

        $scope.selectPainter = function(painter) {
            $rootScope.settings = {
                painter: painter
            }
            location.href = "#/config";
            return;
        }

        $rootScope.prev = "main";
    });