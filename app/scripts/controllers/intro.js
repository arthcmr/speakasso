'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('IntroCtrl', function($scope, $rootScope, $http) {

        $rootScope.settings = $rootScope.settings || {
            language: "english"
        }

        if ($rootScope.prev != "main" && !$rootScope.settings) {
            location.href = "#/";
            return;
        }

        $scope.goFullscreen = function() {
            $(document).fullScreen(true);
        }

        $scope.loading = true;
        //load data
        $http({
            method: "get",
            url: API_BASE + "getAll",
            params: {
                lang: $rootScope.settings.language
            }
        }).success(function(data) {
            var lang = $rootScope.settings.language;
            console.log("Retrieved data successfully");
            $rootScope.text = data.i18n[lang].text;
            $rootScope.words = data.i18n[lang].words;
            $rootScope.experiment = data.experiment;
            $scope.loading = false;

            replaceText();

        }).error(function(e) {
            alert("Error connecting to the server! Refresh.");
        });

        function replaceText() {
            $scope.intro_hello = $rootScope.text.intro_hello;
            $scope.intro_laptop = $rootScope.text.intro_laptop;
            $scope.intro_time = $rootScope.text.intro_time;
            $scope.participate_btn = $rootScope.text.participate_btn;
        }

        $rootScope.prev = "intro";
    });