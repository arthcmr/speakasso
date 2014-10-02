'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('ExperimentCtrl', function($scope, $rootScope) {

        //force settings and instructions to be present
        if (!$rootScope.settings || !$rootScope.instructions) {
            location.href = "#/";
            return;
        }

        var current = 0,
            words = [{
                left: "turtle",
                right: "bird",
                image: "bird",
                high: true,
                color: true,
                correct: 'l',
                response: undefined,
                time: undefined
            }, {
                left: "car",
                right: "train",
                image: "car",
                high: true,
                color: false,
                correct: 'l',
                response: undefined,
                time: undefined
            }, {
                left: "banana",
                right: "apple",
                image: "apple",
                high: false,
                color: true,
                correct: 'r',
                response: undefined,
                time: undefined
            }, ],
            total = words.length;

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
        	if(activate) {
        		$(document).bind('keypress', function(event) {
        			var pressed = false;
        			if(event.which == 113 || event.which == 81) {
        				pressed = 'l';
        			}
        			else if(event.which == 112 || event.which == 80) {
        				pressed = 'r';
        			}
        			if(pressed && typeof callback === 'function') {
        				callback(pressed, event.timeStamp);
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
            $scope.image = words[current].image;
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
        	if(current == total) {
        		finish();
        	}
        	else {
        		showWords();
        	}
        }

        function finish() {
        	$scope.finished = true;
        	$scope.$apply();
        	console.log("FINISHED!");
        	console.log(words);

        	//emulate sending data
        	setTimeout(function() {
        		$rootScope.results = words;
        		location.href = '#/thankyou';
        	}, 5000);
        }

        clearIntervals();
        //initialize experiment
        $scope.explanation = $rootScope.instructions.getready;
        $scope.countdown = 10;
        $scope.progress = 0;
        $scope.finished = false;

        $scope.show_words = false;
        $scope.words = {
            left: "",
            right: ""
        };
        $scope.image = "";

        //init
        calculateProgress();
        countDown(function() {
            $scope.$apply(); //force apply because of async

            showWords();

        }, 1000);

    });