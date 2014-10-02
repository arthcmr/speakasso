'use strict';

var instructions = {
    'english': {
        'continue': 'Continue',
        'press_enter': 'or press ENTER',
        'previous': 'Previous',
        'start': 'Start',
        'explanation': 'here are a few instructions. Read carefully.',
        'slide1': {
            'title': 'Two words will appear on the screen:',
            'subtitles': ['One word will be on the left side and one word will be on the right side.', 'Read them carefully, because they will disappear after 2.5 seconds.'],
            'words': {
                'left': 'turtle',
                'right': 'cat'
            }
        },
        'slide2': {
            'title': 'An image will be shown:',
            'subtitles': ['If the image corresponds to the left word, press Q.', 'If the image corresponds to the right word, press P.'],
            'keys': {
                'left': 'Q',
                'right': 'P'
            }
        },
        'slide3': {
            'title': 'Identify all images.',
            'subtitles': ['There will be 96 pairs of words and images. But it will be quick.', 'After you click START, you will be given 10 seconds to get ready'],
            'keys': {
                'left': 'Q',
                'right': 'P'
            }
        },
        'getready': "Get ready... Position your fingers over the letters Q and P"
    },
    'portuguese': {
        'continue': 'Próximo',
        'press_enter': 'ou pressione ENTER',
        'previous': 'Anterior',
        'start': 'Iniciar',
        'explanation': 'aqui vão algumas instruções. Leia com atenção.',
        'slide1': {
            'title': 'Duas palavras aparecerão na tela:',
            'subtitles': ['Uma palavra no lado esquerdo e uma palavra no lado direito da tela.', 'Leia atenciosamente, porque elas desaparecerão em  2,5 segundos.'],
            'words': {
                'left': 'tartaruga',
                'right': 'gato'
            }
        },
        'slide2': {
            'title': 'Uma imagem será mostrada:',
            'subtitles': ['Se a imagem corresponde à palavra da esquerda, pressione Q.', 'Se a imagem corresponde à palavra da direita, pressione P.'],
            'keys': {
                'left': 'Q',
                'right': 'P'
            }
        },
        'slide3': {
            'title': 'Identifique todas as imagens.',
            'subtitles': ['Serão 96 pares de palavras e 96 imagens. Mas será rápido.', 'Após clicar em INICIAR, você terá 10 segundos para se preparar'],
            'keys': {
                'left': 'Q',
                'right': 'P'
            }
        },
        'getready': "Prepare-se... Esteja pronto para pressionar as teclas Q e P"
    }
};

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('InstructionsCtrl', function($scope, $rootScope) {

        $rootScope.settings = $rootScope.settings || {
            name: "Arthur Camara",
            email: "arthurcamara@gmail.com",
            language: "portuguese",
            firstName: "Arthur"
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

        //instructions
        $scope.instructions = $rootScope.instructions = instructions[$rootScope.settings.language] || instructions['english'];
        $scope.firstName = $rootScope.settings.firstName; 

        //slide control
        $scope.slide = 1;
        $scope.num_slides = 3;
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
            if(activate) {
                $(document).bind('keypress', function(event) {
                    var pressed = false;
                    if(event.which == 13 && typeof callback === 'function') {
                        callback();
                    }
                });
            }
        }

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
                }
                else {
                    keypress(false);
                    location.href = "#/experiment";
                }
            });
        });
    });