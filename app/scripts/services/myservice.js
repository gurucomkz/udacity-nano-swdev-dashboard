'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.myService
 * @description
 * # myService
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')

.service('myService', ['$http', function ($http) {
    var service = this;
    var issuesPath = 'data/issues.csv';
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
        for(var line = 1; line < exploded.length; line++)
        {
            var lineExploded = exploded[line],
                entry = {};
            for(var ki=0; ki<keys.length; ki++){
                var key = keys[ki];
                entry[key] = lineExploded[ki];
            }
            ret.push(entry);
        }
        return ret;
    }
    this.allIssues = {};

    this.getAllIssues = function(){
        $http.get(issuesPath).then(function(data){
            service.addIssues = parseCSV(data);
        });
    };

}]);
