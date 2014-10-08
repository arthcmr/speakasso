'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perceptionClientApp
 */

google.load('visualization', '1', {
    packages: ['corechart']
});

google.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['perceptionClientApp']);
});

angular.module('perceptionClientApp')
    .controller('ResultsCtrl', function($scope, $rootScope, $http) {

        $http({
            method: "get",
            url: API_BASE + "results",
            params: {
                q: 'analysis(general,byHCDColor,byLanguage,byWord)'
            }
        }).success(function(data) {
            var processed = processData(data);
            drawChart(processed);

            $scope.total_responses = data.analysis.general.total;
            $scope.total_correct = data.analysis.general.correct;

            var processed = processDataLanguages(data);
            drawChartLanguages(processed);

            var processed = processDataWords(data);
            drawChartWords(processed);

        }).error(function(e) {
            alert("Error connecting to the server! Refresh.");
        });

        function processData(data) {
            var d = data.analysis.byHCDColor;
            d.hcd.colored.error = stringError(d.hcd.colored);
            d.hcd.achromatic.error = stringError(d.hcd.achromatic);
            d.lcd.colored.error = stringError(d.lcd.colored);
            d.lcd.achromatic.error = stringError(d.lcd.achromatic);

            d.hcd.colored.avgTime = Math.round(d.hcd.colored.avgTime);
            d.hcd.achromatic.avgTime = Math.round(d.hcd.achromatic.avgTime);
            d.lcd.colored.avgTime = Math.round(d.lcd.colored.avgTime);
            d.lcd.achromatic.avgTime = Math.round(d.lcd.achromatic.avgTime);

            return d;
        }

        function processDataLanguages(data) {
            var d = data.analysis.byLanguage;
            for (var i in d) {
                d[i] = d[i].general;
            }
            return d;
        }

        function processDataWords(data) {
            return data.analysis.byWord;
        }

        function stringError(obj) {
            return "(" + Math.round(obj.incorrect / obj.total * 100) + "%)";
        }

        function drawChart(data) {

            var g_data = google.visualization.arrayToDataTable([
                ['Type', 'Color', {
                    role: 'annotation'
                }, 'Achromatic', {
                    role: 'annotation'
                }],
                ['High', data.hcd.colored.avgTime, data.hcd.colored.error, data.hcd.achromatic.avgTime, data.hcd.achromatic.error],
                ['Low', data.lcd.colored.avgTime, data.lcd.colored.error, data.lcd.achromatic.avgTime, data.lcd.achromatic.error]
            ]);

            var options = {
                title: 'Mean reaction times for object classification',
                vAxis: {
                    title: 'Reaction Time (ms)'
                },
                hAxis: {
                    title: 'Color Diagnosticity'
                },
                colors: ['#428bca', '#999999']
            };

            var chart = new google.visualization.ColumnChart(document.getElementById('results_chart'));

            chart.draw(g_data, options);
        }

        function drawChartLanguages(data) {

            var d = [
                ['Language', 'Responses']
            ];
            for (var i in data) {
                d.push([i, data[i].total]);
            }

            var g_data = google.visualization.arrayToDataTable(d);

            var options = {
                title: 'Total number of responses per language',
                vAxis: {
                    title: 'Number of responses'
                },
                hAxis: {
                    title: 'Languages'
                },
                colors: ['#428bca', '#999999']
            };

            var chart = new google.visualization.ColumnChart(document.getElementById('languages_chart'));

            chart.draw(g_data, options);
        }

        function drawChartWords(data) {

            var d = [
                ['Word', 'correct responses', 'all responses']
            ];
            for (var i in data) {
                d.push([i, data[i].avgTimeCorrect, data[i].avgTime]);
            }
            var g_data = google.visualization.arrayToDataTable(d);

            var options = {
                title: 'Average recognition time per word (correct, all)',
                hAxis: {
                    title: 'Average Time Milliseconds'
                },
                colors: ['#428bca', '#999999'],
                chartArea: {'height': '90%'}
            };

            var chart = new google.visualization.BarChart(document.getElementById('words_chart'));

            chart.draw(g_data, options);
        }

    });