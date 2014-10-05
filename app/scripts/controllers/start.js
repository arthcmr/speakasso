'use strict';

/**
 * @ngdoc function
 * @name perceptionClientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the perceptionClientApp
 */
angular.module('perceptionClientApp')
  .controller('StartCtrl', function ($scope, $rootScope) {

  	if($rootScope.prev!="main" && !$rootScope.settings) {
  		location.href = "#/";
  		return;
  	}

  	$scope.form = {
  		email: "",
  		blindness: ""
  	};

    $scope.initStart = function() {
		$(function() {
			var formWrap = document.getElementById( 'fs-form-wrap' );
			new FForm( formWrap, {});
		});
    };

    $scope.submitForm = function() {
    	$rootScope.settings.email = $scope.form.email;
      $rootScope.settings.blindness = $scope.form.blindness;
      //next page
    	location.href="#/instructions";
    }

    $scope.initStart();

    $scope.questions_title = $rootScope.text.questions_title;
    $scope.questions_email = $rootScope.text.questions_email;
    $scope.questions_email_info = $rootScope.text.questions_email_info;
    $scope.questions_blind = $rootScope.text.questions_blind;
    $scope.questions_blind_1 = $rootScope.text.questions_blind_1;
    $scope.questions_blind_2 = $rootScope.text.questions_blind_2;
    $scope.questions_confirm = $rootScope.text.questions_confirm;

    $rootScope.prev = "start";

  });
