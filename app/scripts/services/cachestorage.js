/**
 * @ngdoc service
 * @name dashboardApp.cacheStorage
 * @description
 * # cacheStorage
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
.service('cacheStorage', [
    '$q',

function ($q) {
    'use strict';

    var storageKey = 'dashboardStorage';

    function _checkStorage(){
        if(typeof localStorage[storageKey] !== 'object'){
            localStorage[storageKey] = {};
        }
    }

    this.writeFile = function(name, data){
        _checkStorage();
        var D = $q.defer();
        localStorage[storageKey][name] = data;
        D.resolve();
        return D.promise;
    };

    this.checkFile = function(name){
        _checkStorage();

        var D = $q.defer();
        if(localStorage[storageKey][name]){
            D.resolve();
        }else{
            D.reject();
        }
        return D.promise;
    };
    this.readAsText = function(name){
        _checkStorage();

        var D = $q.defer();
        if(localStorage[storageKey][name]){
            D.resolve(localStorage[storageKey][name]);
        }else{
            D.reject();
        }
        return D.promise;
    };

}]);
