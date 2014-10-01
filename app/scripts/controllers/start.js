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

  	if($rootScope.prev!="main") {
  		location.href = "#/";
  		return;
  	}

  	$scope.languages = [
  		{ value: "english", name: "English", image: "United-States-of-America.png"},
  		{ value: "swedish", name: "Swedish", image: "Sweden.png"},
  		{ value: "chinese", name: "Chinese", image: "China.png"},
  		{ value: "german", name: "German", image: "Germany.png"},
  		{ value: "portuguese", name: "Portuguese", image: "Brazil.png"},
  	];

  	$scope.form = {
  		name: "",
  		email: "",
  		language: ""
  	};

    $scope.initStart = function() {
		$(function() {
			var formWrap = document.getElementById( 'fs-form-wrap' );
			new FForm( formWrap, {});
		});
    };

    $scope.submitForm = function() {
    	$rootScope.settings = $scope.form;
    	location.href="#/instructions";
    }

    $scope.initStart();

    $rootScope.prev = "start";

  });
