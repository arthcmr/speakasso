'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('ExperimentCtrl', function($scope, $rootScope, $http) {

        //force settings and instructions to be present
        if (!$rootScope.settings || !$rootScope.experiment) {
            location.href = "#/";
            return;
        }

        var current = 0,
            words = $rootScope.experiment,
            total = words.length;

        /* Just to make it quick * /
        words = [];
        for (var i = 0; i < 5; i++) {
            words.push($rootScope.experiment[i]);
        }
        total = words.length;
        /* Just to make it quick */

        //calculate progress
        function calculateProgress() {
            $scope.progress = current / total * 100;
        }

        //count down and proceed
        function countDown(callback, step) {
            if ($scope.countdown < 0) {
                if (typeof callback == 'function') {
                    callback();
                }
                return;
            } else {
                setTimeout(function() {
                    $scope.countdown = $scope.countdown - 1;
                    $scope.$apply(); //force apply because of async
                    countDown(callback, step);
                }, step);
            }
        }

        function clearIntervals() {
            var interval_id = window.setInterval("", 9999);
            for (var i = 1; i < interval_id; i++) {
                window.clearInterval(i);
            }
        }

        function keypress(activate, callback) {
            $(document).unbind('keypress');
            if (activate) {
                $(document).bind('keypress', function(event) {
                    var pressed = false;
                    if (event.which == 113 || event.which == 81) {
                        pressed = 'l';
                    } else if (event.which == 112 || event.which == 80) {
                        pressed = 'r';
                    }
                    if (pressed && typeof callback === 'function') {
                        var time = new Date().getTime();
                        callback(pressed, time);
                    }
                });
            }
        }

        function showWords() {
            $scope.show_words = true;
            $scope.words = {
                left: words[current].left,
                right: words[current].right
            };
            $scope.$apply();

            setTimeout(function() {
                showImage();
            }, 2500);
        }

        function showImage() {
            $scope.show_words = false;
            $scope.image = 'images/images/' + words[current].image;
            $scope.$apply();
            var time = new Date().getTime();
            keypress(true, function(response, timestamp) {
                words[current].response = response;
                words[current].time = timestamp - time;
                next();
            });
        }

        function next() {
            keypress(false);
            current++;
            calculateProgress();
            if (current == total) {
                finish();
            } else {
                showWords();
            }
        }

        function finish() {
            $scope.finished = true;
            $scope.$apply();
            console.log("FINISHED!");

            $rootScope.results = {
                email: $rootScope.settings.email,
                blindness: $rootScope.settings.blindness,
                language: $rootScope.settings.language,
                responses: words,
                browser: window.navigator.userAgent
            };

            $http({
                method: "post",
                url: API_BASE + "insert",
                data: $rootScope.results
            }).success(function(data) {
                if(data.success) {
                    location.href = '#/thankyou';
                }
                else if (data.exists) {
                    alert("Your response can't be recorded because you already participated before. But you can still check your results here! :)");
                    location.href = '#/thankyou';
                }
                else {
                    alert("Error connecting to the server :( Try again.");
                    location.href = '#/';
                }
            }).error(function(e) {
                alert("Error connecting to the server! Refresh.");
                console.log(e);
            });
        }

        clearIntervals();
        //initialize experiment
        $scope.get_ready = $rootScope.text.get_ready;
        $scope.sending_data = $rootScope.text.sending_data;
        $scope.countdown = 10;
        $scope.progress = 0;
        $scope.finished = false;

        $scope.show_words = false;
        $scope.words = {
            left: "",
            right: ""
        };
        $scope.image = false;

        //init
        calculateProgress();
        countDown(function() {
            $scope.$apply(); //force apply because of async

            showWords();

        }, 1000);

    });