'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
.controller('MainCtrl', [
    '$scope',
    '$rootScope',
    'myService',
function ($scope, $rootScope, myService) {
    $scope.markers = [];
    // 
    // $scope.$on('leafletDirectiveMap.popupopen', function(event){
    //     $scope.eventDetected = "ZoomStart";
    // });

    $rootScope.$on('employeesDataFull', function(){
        $scope.markers.length = 0;
        for(var k in myService.allEmployees){
            var emp = myService.allEmployees[k],
                city = myService.allCities[emp.city];
            $scope.markers.push({
                lat: parseFloat(city.lat),
                lng: parseFloat(city.lon),
                message: emp.name + ". " + city.name + ", " + city.country,
                focus: true,
                draggable: false
            });
        };
    });
}]);
