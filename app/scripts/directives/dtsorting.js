'use strict';

/**
 * @ngdoc directive
 * @name dashboardApp.directive:dtSorting
 * @description
 * # dtSorting
 */
angular.module('dashboardApp')
.directive('dtSorting', function(){
    return {
        restrict: 'A',
        scope: {
            sortKey: '@dtSorting',
            sortField: '=',
            sortDirection: '='
        },
        replace: true,
        transclude: true,
        template: '<th ng-click="$parent.toggleSorting(sortKey)" ng-transclude ng-class="{ \'sorting\': sortKey!=sortField, \'sorting_asc\' : sortKey==sortField && sortDirection == \'asc\', \'sorting_desc\' : sortKey==sortField && sortDirection == \'desc\' }">{{title}}</th>'
    };
});
