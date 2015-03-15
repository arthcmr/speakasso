'use strict';

/**
 * @ngdoc function
 * @name speakassoClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the speakassoClientApp
 */
angular.module('speakassoClientApp')
    .controller('CanvasCtrl', function($scope, $rootScope, $http) {

        //force settings and instructions to be present
        if (!$rootScope.settings || !$rootScope.settings.config) {
            location.href = "#/";
            return;
        }

        //start with sidebar open
        $scope.sidebar = true;
        $scope.sidebar_middle = false;

        $scope.toggleSidebar = function() {
            $scope.sidebar = !$scope.sidebar;
        };

        $scope.input = {
            possible: [{
                name: "Microphone",
                value: "microphone"
            }, {
                name: "Presets",
                value: "preset"
            }, {
                name: "Audio File",
                value: "file"
            }, {
                name: "Soundcloud",
                value: "soundcloud"
            }],

            selected: {
                name: "Microphone",
                value: "microphone"
            }
        };


        $scope.preset = {
            possible: [{
                name: "Obama's Speech (03:33)",
                value: "obama.mp3"
            }, {
                name: "Hitler 1933  (02:19)",
                value: "hitler.mp3"
            }, {
                name: "Weather  (00:11)",
                value: "weather.mp3"
            }, {
                name: "Tada  (00:55)",
                value: "tada.mp3"
            }],

            selected: {
                name: "Obama's Speech (03:33)",
                value: "obama.mp3"
            }
        };

        $scope.playing = false;
        $scope.loading = false;

        $scope.togglePlayPreset = function() {
            if ($scope.playing) {
                console.log("Pausing", $scope.preset.selected.name);
            } else {
                console.log("Playing", $scope.preset.selected.name);
            }
            $scope.playing = !$scope.playing;
        }



        var ctx, canvas = document.getElementById("visualization");
        ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function restartPainter(painter) {
            painter.stop();
            painter.paint();
        }

        // resize the canvas to fill browser window dynamically
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, false);

        var painter = ARTGEN.init("visualization", "circle");

        // NCSOUND.startMikeStream(function() {
        //     console.log("Starting microphone...");
        //     resizeCanvas();
        //     restartPainter(painter);
        //     setInterval(function() {
        //         var data = {
        //             silence: NCSOUND.getData(4)[0] || 0,
        //             energy: NCSOUND.getData(7)[0] || 0,
        //             energy2: NCSOUND.getData(9)[0] || 0
        //         };
        //         painter.data = data;
        //     }, 10);
        // });

        // get context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext(),
            meyda;

        navigator.getUserMedia({
            video: false, audio: true
        },
        function(media) {
            window.source = context.createMediaStreamSource(media);
            meyda = new Meyda(context, source, 512);

            resizeCanvas();
            restartPainter(painter);
            _.delay(function(){
                draw();
            }, 1000);
        }, function(err) {
            console.log("MIC ERROR");
        });

        function draw() {
            requestAnimationFrame(draw);
            var data = {
                silence: meyda.get('spectralKurtosis') || 0,
                energy: meyda.get('spectralKurtosis') || 0,
                energy2: meyda.get('spectralKurtosis') || 0
            };
            painter.data = data;
        }


    });