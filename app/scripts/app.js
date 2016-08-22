'use strict';

/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
angular
.module('dashboardApp', [
    'ngRoute',
    'leaflet-directive',
    'ng-morris-js'
])
.config([
    '$routeProvider',
function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    })
    .when('/data', {
        templateUrl: 'views/data.html',
        controller: 'DataCtrl',
        controllerAs: 'data'
    })
    .when('/metrics', {
        templateUrl: 'views/metrics.html',
        controller: 'MetricsCtrl',
        controllerAs: 'metrics'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
