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

        if (!$rootScope.settings || !$rootScope.experiment) {
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

        function keysRoutine() {
            setTimeout(function() {
                $(".animated-keys .key.left").addClass('keydown');
                setTimeout(function() {
                    $(".keys .key.left").removeClass('keydown');
                }, 500);
            }, 1500);

            setTimeout(function() {
                $(".animated-keys .key.right").addClass('keydown');
                setTimeout(function() {
                    $(".keys .key.right").removeClass('keydown');
                }, 500);
            }, 3500);
        }

        function calculateProgress() {
            $scope.progress = ($scope.slide) / $scope.num_slides * 100;
        }

        function clearIntervals() {
            var interval_id = window.setInterval("", 9999);
            for (var i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }
        }

        $rootScope.prev = "instructions";

        //slide control
        $scope.slide = 1;
        $scope.num_slides = 4;
        calculateProgress();

        $scope.prevSlide = function() {
            $scope.slide = $scope.slide - 1;
            if ($scope.slide < 1) $scope.slide = 1;
            calculateProgress();
        };
        $scope.nextSlide = function() {
            $scope.slide = $scope.slide + 1;
            if ($scope.slide > $scope.num_slides) $scope.slide = $scope.num_slides;
            calculateProgress();
        };

        function keypress(activate, callback) {
            $(document).unbind('keypress');
            if (activate) {
                $(document).bind('keypress', function(event) {
                    var pressed = false;
                    if (event.which == 13 && typeof callback === 'function') {
                        callback();
                    }
                });
            }
        }

        //use the time of reading the instructions to preload images
        function preloadImages(sources) {
            var images = [];
            for (var i = 0, length = $rootScope.experiment.length; i < length; i++) {
                images[i] = new Image();
                images[i].src = 'images/images/' + $rootScope.experiment[i].image;
            }
        }

        preloadImages();

        //strings
        $scope.instructions_title = $rootScope.text.instructions_title;
        $scope.instructions_1_title = $rootScope.text.instructions_1_title;
        $scope.instructions_1_text1 = $rootScope.text.instructions_1_text1;
        $scope.instructions_2_title = $rootScope.text.instructions_2_title;
        $scope.instructions_2_text1 = $rootScope.text.instructions_2_text1;
        $scope.instructions_3_title = $rootScope.text.instructions_3_title;
        $scope.instructions_3_text1 = $rootScope.text.instructions_3_text1;
        $scope.instructions_3_text2 = $rootScope.text.instructions_3_text2;
        $scope.intructions_3_key1 = $rootScope.text.intructions_3_key1;
        $scope.intructions_3_key2 = $rootScope.text.intructions_3_key2;
        $scope.instructions_4_title = $rootScope.text.instructions_4_title;
        $scope.instructions_4_text1 = $rootScope.text.instructions_4_text1;
        $scope.instructions_4_text2 = $rootScope.text.instructions_4_text2;
        $scope.start_btn = $rootScope.text.start_btn;
        $scope.continue_btn = $rootScope.text.continue_btn;
        $scope.press_enter = $rootScope.text.press_enter;
        $scope.back_btn = $rootScope.text.back_btn;

        $(function() {
            clearIntervals();
            hideRoutine();
            keysRoutine();
            window.setInterval(function() {
                hideRoutine();
                keysRoutine();
            }, 4000);

            //Enter should also activate next slide
            keypress(true, function() {
                if ($scope.slide < $scope.num_slides) {
                    $scope.nextSlide();
                    $scope.$apply();
                } else {
                    keypress(false);
                    location.href = "#/experiment";
                }
            });
        });
    });