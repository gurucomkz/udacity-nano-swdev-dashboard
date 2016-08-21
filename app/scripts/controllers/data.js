'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
.controller('DataCtrl', [
    '$scope',
    'myService',
    '$rootScope',
function ($scope, myService, $rootScope) {
    $scope.issues = myService.allIssues;

    $rootScope.$on('issuesUpdated', function(){
        $scope.issues = myService.allIssues;
    });
}]);
