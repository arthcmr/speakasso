'use strict';

/**
 * @ngdoc overview
 * @name perceptionClientApp
 * @description
 * # perceptionClientApp
 *
 * Main module of the application.
 */
angular
  .module('perceptionClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/instructions', {
        templateUrl: 'views/instructions.html',
        controller: 'InstructionsCtrl'
      })
      .when('/experiment', {
        templateUrl: 'views/experiment.html',
        controller: 'ExperimentCtrl'
      })
      .when('/thankyou', {
        templateUrl: 'views/thankyou.html',
        controller: 'ThankyouCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
