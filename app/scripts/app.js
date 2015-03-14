'use strict';

var API_BASE = 'http://178.62.207.54:3000/';

/**
 * @ngdoc overview
 * @name speakassoClientApp
 * @description
 * # speakassoClientApp
 *
 * Main module of the application.
 */
angular
    .module('speakassoClientApp ', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngDropdowns'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/config', {
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            })
            .when('/canvas', {
                templateUrl: 'views/canvas.html',
                controller: 'CanvasCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });


window.onload = function() {
    angular.bootstrap(document.body, ['speakassoClientApp']);
}