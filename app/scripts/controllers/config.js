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

        //options extracted from painter
        $scope.data_options = _.map($scope.painter.data_values, function(opt) {
            var option = {
                description: opt.description,
                possible: _.map(opt.options, function(val) {
                    return { name: val, value: val };
                }),
                selected: { name: opt.options[0], value: opt.options[0]}
            };
            return option;
        });

        //aditional options
        var extra_options = [];
        _.forIn($scope.painter.options, function(opt, key) {
            var option = {
                name: key,
                description: opt.description,
                possible: _.map(opt.options, function(val) {
                    return { name: val, value: val };
                }),
                selected: { name: opt.options[0], value: opt.options[0]}
            };
            extra_options.push(option);
        });

        $scope.extra_options = extra_options;

        $scope.confirmConfig = function() {
            $rootScope.settings.config = {
                data_options: _.map($scope.data_options, function(k) {
                    return k.selected.value;
                }),
                extra_options: {}
            };

            _.each($scope.extra_options, function(item) {
                $rootScope.settings.config.extra_options[item.name] = item.selected.value;
            });

            location.href = "#/canvas";
            return;
        };

        $rootScope.prev = "config";
    });