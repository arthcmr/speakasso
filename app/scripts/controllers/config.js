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

        // $scope.loading = true;
        // //load data
        // $http({
        //     method: "get",
        //     url: API_BASE + "getAll",
        //     params: {
        //         lang: $rootScope.settings.language
        //     }
        // }).success(function(data) {
        //     var lang = $rootScope.settings.language;
        //     console.log("Retrieved data successfully");
        //     $rootScope.text = data.i18n[lang].text;
        //     $rootScope.words = data.i18n[lang].words;
        //     $rootScope.experiment = data.experiment;
        //     $scope.loading = false;

        //     replaceText();

        // }).error(function(e) {
        //     alert("Error connecting to the server! Refresh.");
        // });

        $rootScope.prev = "config";
    });