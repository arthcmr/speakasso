'use strict';

/**
 * @ngdoc function
 * @name speakassoClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the speakassoClientApp
 */
angular.module('speakassoClientApp')
    .controller('ConfigCtrl', function($scope, $rootScope, $http) {

        if ($rootScope.prev != "main" || !$rootScope.settings) {
            location.href = "#/";
            return;
        }

        $scope.painter = $rootScope.settings.painter;
        $scope.data_options = [{
            possible: [{
                name: "Silence",
                value: "silence"
            }, {
                name: "Energy",
                value: "energy"
            }, {
                name: "Pitch",
                value: "pitch"
            }, {
                name: "Loudness",
                value: "loudness"
            }],
            selected: {
                name: "Silence",
                value: "silence"
            },
            description: "used to determine vertical position"
        }, {
            possible: [{
                name: "Pitch",
                value: "pitch"
            }, {
                name: "Energy",
                value: "energy"
            }],
            selected: {
                name: "Pitch",
                value: "pitch"
            },
            description: "used to determine color"
        }, {
            possible: [{
                name: "Pitch",
                value: "pitch"
            }, {
                name: "Energy",
                value: "energy"
            }],
            selected: {
                name: "Energy",
                value: "energy"
            },
            description: "used to determine size"
        }];

        $scope.extra_options = [{
            name: "Color",
            possible: [{
                name: "Red",
                value: "red"
            }, {
                name: "Blue",
                value: "blue"
            }, {
                name: "Green",
                value: "green"
            }],
            selected: {
                name: "Red",
                value: "red"
            },
            description: "used to determine the color palette"
        }, {
            name: "Brush",
            possible: [{
                name: "Ink",
                value: "ink"
            }, {
                name: "Pencil",
                value: "pencil"
            }],
            selected: {
                name: "Ink",
                value: "ink"
            },
            description: "main brush used"
        }];

        $scope.confirmConfig = function() {
            $rootScope.settings.config = {};
            location.href = "#/canvas";
            return;
        };

        $rootScope.prev = "config";
    });