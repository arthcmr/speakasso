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
                var responses = $rootScope.results.responses,
                    total = responses.length,
                    correct = 0,
                    speed = 0,
                    count_colored = 0,
                    speed_colored = 0,
                    count_achromatic = 0,
                    speed_achromatic = 0;

                for (var i = 0; i < total; i++) {
                    var result = responses[i];
                    if (result.correct == result.response) {
                        correct += 1;
                        speed += result.time;
                        if (result.color === true) {
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
                    string = $rootScope.text.results_faster;

                if (avg_colored < avg_achromatic) {
                    faster = avg_achromatic / avg_colored;
                } else {
                    faster = avg_colored / avg_achromatic;
                    string = $rootScope.text.results_slower;
                }
                faster = Math.round(faster * 10) / 10;

                var comparison = faster + 'x ' + string;
                var avg_speed = Math.round(speed / correct);

                var results1 = $rootScope.text.results_text1,
                    results2 = $rootScope.text.results_text2,
                    text_accuracy = '<span class="result">'+correct+'/'+total+'</span>',
                    text_speed = '<span class="result">'+avg_speed+' '+$rootScope.text.results_ms+'</span>',
                    text_comparison = '<span class="result">'+comparison+'</span>';

                results1 = results1.replace("[[ACCURACY]]", text_accuracy);
                results1 = results1.replace("[[SPEED]]", text_speed);
                results2 = results2.replace("[[COMPARISON]]", text_comparison);

                $scope.results_text1 = results1;
                $scope.results_text2 = results2;

            }
        }

        $scope.results_title = $rootScope.text.results_title;
        $scope.results_subtitle = $rootScope.text.results_subtitle;
        $scope.results_text1 = '';
        $scope.results_text2 = '';
        $scope.results_contact = $rootScope.text.results_contact;
        $scope.close_btn = $rootScope.text.close_btn;

        computeResults();

        $scope.closeExperiment = function() {
            $(document).fullScreen(false);
            location.href = '#/';
        }
    });