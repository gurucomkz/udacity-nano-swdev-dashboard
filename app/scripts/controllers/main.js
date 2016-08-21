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
    $scope.cities = [];
    $scope.selectedCity = null;
    $scope.selectedCityStaff = [];
    $scope.mapEvents = {
        map:{
            enable: ['popupopen', 'popupclose'],
            logic: 'emit'
        }
    };

    $scope.$on('leafletDirectiveMap.popupopen', function(event, marker, dd){
        $scope.eventDetected = "popupopen";
        console.log(event)
        var cityId = marker.leafletObject._popup._source.options.cityId;
        $scope.selectedCity = myService.allCities[cityId];
        $scope.selectedCityStaff.length = 0;
        for(var k in  myService.allEmployees){
            var emp = myService.allEmployees[k];
            if(emp.city == cityId){
                $scope.selectedCityStaff.push(emp)
            }
        }
    });

    $scope.$on('leafletDirectiveMap.popupclose', function(event){
        $scope.selectedCity = null;
    });

    $rootScope.$on('citiesUpdated', function(){
        $scope.cities.length = 0;
        $scope.selectedCity = null;

        for(var k in myService.allCities){
            var city = myService.allCities[k];
            $scope.cities.push({
                lat: parseFloat(city.lat),
                lng: parseFloat(city.lon),
                cityId: city.id,
                message: city.name + ', ' + city.country,
                focus: false,
                draggable: false
            });
        };
    });
}]);
