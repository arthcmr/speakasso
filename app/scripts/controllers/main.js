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

        //valid painters from ARTGEN
        var painters = []
        _.forIn(ARTGEN.info_painters, function(v, k) {
            if (!v.title) return true;
            var info = {
                value: k,
                name: v.title,
                description: v.description,
                tags: v.tags,
                image: "images/"+ k +".jpg",
                data_values: v.data_values,
                options: v.options
            }
            painters.push(info);
        });

        $scope.painters = painters;

        $scope.selectPainter = function(painter) {
            $rootScope.settings = {
                painter: painter
            }
            location.href = "#/config";
            return;
        }

        $rootScope.prev = "main";
    });