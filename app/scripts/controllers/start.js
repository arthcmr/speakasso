'use strict';

/**
 * @ngdoc function
 * @name speakassoClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the speakassoClientApp
 */
angular.module('speakassoClientApp')
    .controller('StartCtrl', function($scope, $rootScope) {

        if ($rootScope.prev != "main" && !$rootScope.settings) {
            location.href = "#/";
            return;
        }

        $scope.form = {
            email: $rootScope.settings.email || "",
            blindness: $rootScope.settings.email || ""
        };

        var form;

        $scope.thankyouOver = function() {
            $scope.thankyou_message = false;
            $scope.$apply();

            var formWrap = document.getElementById('fs-form-wrap');
            form = new FForm(formWrap, {
                onReview: function() {
                    $scope.submitForm();
                }
            });
        }
        $scope.nextSlide = function() {
            form._nextField();
        }
        $scope.back = function() {
            location.href = "#/";
        }

        $scope.submitForm = function() {
            $rootScope.settings.email = $scope.form.email;
            $rootScope.settings.blindness = $scope.form.blindness;
            //next page
            location.href = "#/instructions";
        }

        $scope.finished = false;
        $scope.thankyou_message = true;

        $scope.questions_title = $rootScope.text.questions_title;
        $scope.questions_email = $rootScope.text.questions_email;
        $scope.questions_email_info = $rootScope.text.questions_email_info;
        $scope.questions_blind = $rootScope.text.questions_blind;
        $scope.questions_blind_1 = $rootScope.text.questions_blind_1;
        $scope.questions_blind_2 = $rootScope.text.questions_blind_2;
        $scope.questions_confirm = $rootScope.text.questions_confirm;
        $scope.thankyou = $rootScope.text.thankyou;
        $scope.thankyou_text = $rootScope.text.thankyou_text;
        $scope.thankyou_ok = $rootScope.text.thankyou_ok;
        $scope.questions_confirm = $rootScope.text.questions_confirm;
        $scope.continue_btn = $rootScope.text.continue_btn;
        $scope.press_enter = $rootScope.text.press_enter;
        $scope.back_btn = $rootScope.text.back_btn;

        $rootScope.prev = "start";

    });