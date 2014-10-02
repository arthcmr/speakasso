'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('ThankyouCtrl', function($scope, $rootScope) {

        if (!$rootScope.settings || !$rootScope.results) {
            location.href = "#/";
            return;
        }

        function computeResults() {
            if ($rootScope.results) {
            	var total = $rootScope.results.length,
            		correct = 0,
            		speed = 0,
            		count_colored = 0,
            		speed_colored = 0,
            		count_achromatic = 0,
            		speed_achromatic = 0;
            	
            	for(var i=0; i<total; i++) {
            		var result = $rootScope.results[i];
            		if(result.correct == result.response) {
            			correct += 1;
            			speed += result.time;
            			if(result.color === true) {
            				count_colored += 1;
            				speed_colored += result.time;
            			} else {
            				count_achromatic += 1;
            				speed_achromatic += result.time;
            			}
            		}
            	}

            	var avg_colored = speed_colored / count_colored,
            		avg_achromatic = speed_achromatic / count_achromatic,
            		faster = 0,
            		string = 'faster';

            	if(avg_colored < avg_achromatic) {
            		faster = avg_achromatic / avg_colored;
            	}
            	else {
            		faster = avg_colored / avg_achromatic;
            		string = 'slower';
            	}
            	faster = Math.round(faster * 10) / 10;

            	string = (faster == 1) ? 'at about the same speed' : faster + 'x ' + string;

            	$scope.total = total;
            	$scope.correct = correct;
            	$scope.speed = Math.round(speed/correct);
            	$scope.colored_faster = string;
            }
        }

        $scope.firstName = $rootScope.settings.firstName;
        $scope.correct = 0;
        $scope.total = 0;
        $scope.speed = 0;
        $scope.colored_faster = "at about the same speed";

        computeResults();

        $scope.closeExperiment = function() {
            $(document).fullScreen(false);
            location.href = '#/';
        }
    });