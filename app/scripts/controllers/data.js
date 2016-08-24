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
    'use strict';

    myService.setInterestedData(['issues']);
    var issues = myService.allIssues,
        filtered = [];

    $scope.filterText = '';

    $scope.sortingField = 'submissionTimestamp';
    $scope.sortingDirection = 'asc';

    $scope.displayNumber = 10;
    $scope.displayPage = 1;
    $scope.displayPagerPages = [];
    $scope.displayPageCount = 0;


    $scope.displayIssues = [];

    function fixDisplay(){
        $scope.displayStart = ($scope.displayPage - 1)  * $scope.displayNumber;
        $scope.displayEnd = Math.min($scope.displayStart + $scope.displayNumber, filtered.length-1);

        $scope.filteredTotal = filtered.length;

        var candidates = filtered.slice($scope.displayStart, $scope.displayEnd);
        $scope.displayIssues.length = 0;
        for(var x in candidates){
            $scope.displayIssues.push(candidates[x]);
        }
    }

    function performSorting(){
        var sortAsc = ($scope.sortingDirection === 'asc');
        filtered.sort(function(a,b){
            var av = a[$scope.sortingField],
                bv = b[$scope.sortingField];
            if(av === bv){ return 0; }
            if(av > bv){ return sortAsc ? 1 : -1; }
            return sortAsc ? -1 : 1;
        });
        fixDisplay();
    }

    function fixFilter(){
        if(!$scope.filterText.length){
            filtered = issues;
        }else{
            filtered = issues.filter(function(entry){
                for(var k in entry){
                    if((''+entry[k]).indexOf($scope.filterText)>=0) {
                        return true;
                    }
                }
                return false;
            });
        }
        $scope.displayPageCount = Math.ceil(filtered.length / $scope.displayNumber);
        performSorting();
    }

    $scope.toggleSorting = function(newKey){
        if(newKey !== $scope.sortingField){
            $scope.sortingDirection = 'asc';
            $scope.sortingField = newKey;
        }else{
            $scope.sortingDirection = ($scope.sortingDirection === 'asc') ? 'desc' : 'asc';
        }
    };

    $scope.setPage = function(toPage){
        $scope.displayPage = toPage;
        fixDisplay();
    };

    $scope.$watch('displayNumber', fixDisplay);
    $scope.$watch('filterText', fixFilter);

    $scope.$watch('sortingField', performSorting);
    $scope.$watch('sortingDirection', performSorting);

    $rootScope.$on('issuesUpdated', function(){
        issues = myService.allIssues;
        fixFilter();
    });
}]);
