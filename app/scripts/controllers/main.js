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
    $scope.stats = {};
    $scope.selectedCity = null;
    $scope.selectedCityStaff = [];
    $scope.mapEvents = {
        map:{
            enable: ['popupopen', 'popupclose'],
            logic: 'emit'
        }
    };

    $scope.$on('leafletDirectiveMap.popupopen', function(event, marker){
        $scope.eventDetected = "popupopen";

        var cityId = marker.leafletObject._popup._source.options.cityId;
        $scope.selectedCity = myService.allCities[cityId];
        $scope.selectedCityStaff.length = 0;
        for(var k in  myService.allEmployees){
            var emp = myService.allEmployees[k];
            if(emp.city == cityId){
                $scope.selectedCityStaff.push(emp);
            }
        }
    });

    $scope.$on('leafletDirectiveMap.popupclose', function(){
        $scope.selectedCity = null;
    });

    $rootScope.$on('citiesUpdated', processData);
    if(myService.allCities)
    {
        processData();
    }

    function processData(){
        $scope.cities.length = 0;
        $scope.stats.countryCount = 0;
        $scope.stats.countries = {};
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
            if(typeof $scope.stats.countries[city.country] === 'undefined'){
                $scope.stats.countries[city.country] = 0;
                $scope.stats.countryCount++;
            }
            $scope.stats.countries[city.country]++;
        }
        $scope.stats.cityCount = $scope.cities.length;
        $scope.stats.staffCount = Object.keys(myService.allEmployees).length;
    }
}]);
