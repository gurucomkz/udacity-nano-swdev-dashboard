'use strict';

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
    var service = this;
    var issuesPath = 'data/issues.json';
    var employeesPath = 'data/employees.csv';
    var customersPath = 'data/customers.csv';

    this.allIssues = [];
    this.allCustomers = null;
    this.allEmployees = null;

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

    this.getAllCustomers = function(){
        cachedIO.get(customersPath, false, this.allCustomers !== null)
        .then(function(data){
            service.allCustomers = parseCSV(data);
            $rootScope.$broadcast('customersUpdated');
        });
    };

    this.getAllEmployees = function(){
        cachedIO.get(employeesPath, false, this.addEmployees !== null)
        .then(function(data){
            service.addEmployees = parseCSV(data);
            $rootScope.$broadcast('employeesUpdated');
        });
    };


    //init

    //utils
    $interval(function(){
        // service.getAllCustomers();
        // service.getAllEmployees();
        service.getAllIssues();
    },1000);


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
            for(var ki=0; ki<keys.length-1; ki++){
                var key = keys[ki];
                entry[key] = lineExploded[ki].replace(/^\"/,'').replace(/\"$/,'');
            }
            ret.push(entry);
        }
        return ret;
    }
}]);
