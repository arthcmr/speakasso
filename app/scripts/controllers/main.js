'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
    .controller('MainCtrl', function($scope, $rootScope) {

        $scope.languages = [{
            value: "english",
            name: "English",
            image: "United-States-of-America.png"
        }, {
            value: "swedish",
            name: "Swedish",
            image: "Sweden.png"
        }, {
            value: "chinese",
            name: "Chinese",
            image: "China.png"
        }, {
            value: "german",
            name: "German",
            image: "Germany.png"
        }, {
            value: "portuguese",
            name: "Portuguese",
            image: "Brazil.png"
        }, ];

        $scope.selectLanguage = function(lang) {
            $rootScope.settings = {
                language: lang
            }
            location.href = "#/intro";
            return;
        }

        $rootScope.prev = "main";
    });