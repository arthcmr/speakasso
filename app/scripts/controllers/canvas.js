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
            $scope.sidebar_middle = true;
            $scope.sidebar = true;

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
                    name: "Choose...",
                    value: false
                }, {
                    name: "I have a dream (16:15)",
                    value: "https://soundcloud.com/luke1966/martin-luther-king-jr-i-have-a-dream-full-speech"
                }, {
                    name: "Steve Jobs (14:34)",
                    value: "https://soundcloud.com/internetsuccess/steve-jobs-commencement-speech"
                }, {
                    name: "Hitler 1933  (00:55)",
                    value: "https://soundcloud.com/silv3rr/adolf-hitler-speech-1933"
                }, {
                    name: "Tada  (00:55)",
                    value: "tada.mp3"
                }],

                selected: {
                    name: "Choose...",
                    value: false
                }
            };

            $scope.started = false;
            $scope.playing = false;
            $scope.loading = false;
            $scope.ready = false;
            $scope.mic = false;

            var config = $rootScope.settings.config,
                data_options = config.data_options,
                options = config.extra_options;

            //painter options
            var canvas = document.getElementById("visualization"),
                ctx = canvas.getContext("2d"),
                painter = ARTGEN.init("visualization", "circle", options);

            //audio variables
            var context = new AudioContext(),
                audio = new Audio(),
                source;

            //soundcloud variables
            var client_id = 'f247cf34fbe0f23b9dfc2e6a52dbb400';

            //initialize Soundcloud
            SC.initialize({
                client_id: client_id
            });

            //ask microphone permission in the beginning
            var mic_source, mic_context;

            // resize the canvas to fill browser window dynamically
            resizeCanvas();

            window.addEventListener('resize', resizeCanvas, false);
            window.AudioContext = window.AudioContext || window.webkitAudioContext;

            //watch changes
            $scope.$watch('input.selected.value', function() {
                changePreset();
            });

            //helper functions

            var watching_preset = false;

            function changePreset() {
                var preset = $scope.input.selected.value;

                stopUpdate();
                stopPainter();
                stopPlay();

                if (_.isFunction(watching_preset)) {
                    watching_preset();
                    watching_preset = false;
                }

                if (preset === "preset") {
                    watching_preset = $scope.$watch('preset.selected.value',
                        function() {
                            setUpSoundCloud($scope.preset.selected.value);
                        });
                } else if (preset === "microphone") {
                    setUpMicrophone(function() {
                        startIfStarted();
                    });
                }
            }

            function startIfStarted() {
                if ($scope.started) {
                    startUpdate();
                    startPainter();
                }
            }

            function setUpSoundCloud(track_url) {


                console.log("loading " + track_url);

                if (!track_url) return;

                stopUpdate();
                stopPainter();
                stopPlay();

                $scope.loading = true;
                $scope.mic = false;
                $scope.ready = false;

                SC.get('/resolve', {
                    url: track_url
                }, function(track) {

                    var url = 'http://api.soundcloud.com/tracks/' + track.id + '/stream' +
                        '?client_id=' + client_id;


                    console.log(track_url, "activated successfully");
                    audio = new Audio();
                    audio.src = url;
                    source = context.createMediaElementSource(audio);
                    source.connect(context.destination);

                    NCSOUND.init(context, source, 512);

                    $scope.ready = true;
                    $scope.loading = false;
                    $scope.$apply();

                });
            }

            function setUpMicrophone(cb) {

                console.log("start microphone");

                $scope.loading = true;
                $scope.mic = true;
                $scope.ready = false;

                if (!mic_context || !mic_source) {
                    navigator.getUserMedia({
                            video: false,
                            audio: true
                        },
                        function(media) {
                            context = new AudioContext();
                            source = context.createMediaStreamSource(media);
                            mic_context = context;
                            mic_source = source;
                            NCSOUND.init(context, source, 512);
                            console.log("Microphone activated successfully");

                            $scope.ready = true;
                            $scope.loading = false;
                            $scope.$apply();

                            if (_.isFunction(cb)) cb();
                        },
                        function(err) {
                            console.warn("Microphone Error");
                            alert("Microphone Error");
                        });
                } else {
                    context = mic_context;
                    source = mic_source;

                    NCSOUND.init(context, source, 512);
                    console.log("Microphone reactivated successfully");

                    $scope.ready = true;
                    $scope.loading = false;

                    if (_.isFunction(cb)) cb();
                }
            }

            $scope.togglePlayPreset = function() {
                if (!$scope.ready) return;
                if ($scope.playing) {
                    stopPlay();
                } else {
                    startPlay();
                    startIfStarted();
                }
            }

            $scope.startAll = function() {
                if (!$scope.ready) return;

                $scope.started = true;
                $scope.sidebar = false;
                startAll();
                _.delay(function() {
                    $scope.sidebar_middle = false;
                    $scope.$apply();
                }, 1000)
            }

            function startAll() {
                if (!$scope.ready) return;

                if (!$scope.mic) {
                    restartPlay();
                }
                restartUpdate();
                restartPainter();
            }

            function update() {
                if (!$scope.ready) return;
                var data = 0;
                try {
                    data = _.values(NCSOUND.get(data_options));
                } catch (err) {
                    console.warn("NCSOUND could not get data");
                }
                painter.data = data;
            }

            var update_interval = false;

            function startUpdate() {
                update_interval = setInterval(function() {
                    update();
                }, 10);
            }

            function stopUpdate() {
                clearInterval(update_interval);
            }

            function restartUpdate(p) {
                stopUpdate(p);
                startUpdate(p);
            }

            function stopPlay() {
                if (!$scope.playing) return;
                source.mediaElement.pause();
                $scope.playing = false;
            }

            function startPlay() {
                if (!$scope.ready) return;
                $scope.playing = true;
                source.mediaElement.play();
            }

            function restartPlay() {
                if (!$scope.ready) return;
                if (source && source.mediaElement && $scope.playing) {
                    source.mediaElement.pause();
                }
                startPlay();
            }

            function startPainter(p) {
                if (!$scope.ready) return;
                painter.paint();
            }

            function stopPainter(p) {
                painter.stop();
            }

            function restartPainter(p) {
                stopPainter(p);
                startPainter(p);
            }

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

        });