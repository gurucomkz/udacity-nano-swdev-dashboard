/**
 * @ngdoc service
 * @name dashboardApp.myService
 * @description
 * # myService
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')

.service('myService', [
    '$interval',
    '$rootScope',
    'cachedIO',
function ($interval, $rootScope, cachedIO) {
    'use strict';

    var service = this;
    var issuesPath = 'data/issues.json';
    var employeesPath = 'data/employees.csv';
    var customersPath = 'data/customers.csv';
    var citiesPath = 'data/cities.json';

    this.allIssues = [];
    this.allCustomers = null;
    this.allEmployees = null;
    this.allCities = null;

    var pollDisabler,
        pollFiles = {
            issues: false,
            cities: false,
            customers: false,
            employees: false
        };

    var pollFunction = function(){
        if(pollFiles.customers){
            service.getAllCustomers();
        }
        if(pollFiles.employees){
            service.getAllEmployees();
        }
        if(pollFiles.cities){
            service.getAllCities();
        }
        if(pollFiles.issues){
            service.getAllIssues();
        }
    };

    function pollEnable(){
        pollDisabler = $interval(pollFunction, 1000);
    }

    this.setInterestedData = function(keys){
        if(!keys) {
            keys = [];
        }
        var anyPositive = false;
        for(var k in pollFiles){
            pollFiles[k] = keys.indexOf(k)>=0;
            if(pollFiles[k]){
                anyPositive = true;
            }
        }
        if(!anyPositive && pollDisabler){
            pollDisabler();
            pollDisabler = null;
        }else{
            pollEnable();
        }
    };

    this.getAllIssues = function(){
        cachedIO.get(issuesPath, false, !!this.allIssues.length)
        .then(function(data){
            service.allIssues.length = 0;
            for(var k in data){
                service.allIssues.push(data[k]);
            }
            $rootScope.$broadcast('issuesUpdated');
        });
    };

    this.getAllCities = function(){
        cachedIO.get(citiesPath, false, this.allCities !== null)
        .then(function(data){
            service.allCities = data;
            $rootScope.$broadcast('citiesUpdated');
        });
    };

    this.getAllCustomers = function(){
        cachedIO.get(customersPath, false, this.allCustomers !== null)
        .then(function(data){
            service.allCustomers = array2object(parseCSV(data),'id');

            $rootScope.$broadcast('customersUpdated');
        });
    };

    this.getAllEmployees = function(){
        cachedIO.get(employeesPath, false, this.allEmployees !== null)
        .then(function(data){
            service.allEmployees = array2object(parseCSV(data),'id');

            $rootScope.$broadcast('employeesUpdated');
        });
    };

    function checkCityNEmployees(){
        if(service.allCustomers && service.allEmployees){
            $rootScope.$broadcast('employeesDataFull');
        }
    }

    $rootScope.$on('citiesUpdated', checkCityNEmployees);
    $rootScope.$on('employeesUpdated', checkCityNEmployees);

    //utils

    function array2object(data, keyField){
        var ret = {};
        for(var e = 0; e < data.length; e++){
            ret[data[e][keyField]] = data[e];
        }
        return ret;
    }

    function parseCSV(data){
        var ret = [],
            keys = [],
            exploded = data.split(/\r?\n/);
        if(!exploded.length){
            return ret;
        }
        //keys
        keys = exploded[0].split(';');
        //lines
        for(var line = 1; line < exploded.length-1; line++)
        {
            var lineExploded = exploded[line].split(';'),
                entry = {};
            for(var ki=0; ki < keys.length; ki++){
                var key = keys[ki],
                    strVal = lineExploded[ki].replace(/^\"/,'').replace(/\"$/,'');
                if(strVal.match(/^-?\d+(\.\d+)?$/)){
                    entry[key] = parseFloat(strVal);
                }else{
                    entry[key] = strVal;
                }
            }
            ret.push(entry);
        }
        return ret;
    }
}]);
