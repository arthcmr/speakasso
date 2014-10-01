'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('InstructionsCtrl', function($scope, $rootScope) {

        $rootScope.settings = {
            name: "Arthur",
            email: "arthurcamara@gmail.com",
            language: "english"
        }


        if (!$rootScope.settings) {
            location.href = "#/";
            return;
        }

        function hideRoutine() {
            setTimeout(function() {
                $(".words").hide();
                setTimeout(function() {
                    $(".words").show();
                }, 1500);
            }, 2500);
        }

        $(function() {
            hideRoutine();
            setInterval(function() {
                hideRoutine();
            }, 4000);
        });

        $rootScope.prev = "instructions";

        //slide control
        $scope.slide = 1;
        $scope.nextSlide = function() {
            $scope.slide = $scope.slide + 1;
            console.log($scope.slide);
        };
    });