/**
 * @ngdoc service
 * @name dashboardApp.AppSettings
 * @description
 * # AppSettings
 * Factory in the dashboardApp.
 */
angular.module('dashboardApp')
.factory('appSettings', [function() {
    'use strict';

    var me,
        _settingsKey = 'dashboardSettings',
        defaultSettings = {
          'filesVersions':{}
        };

    function _retrieveSettings() {
        var settings = localStorage[_settingsKey];
        if(settings){
            return angular.fromJson(settings);
        }
        return defaultSettings;
    }

    function _saveSettings(settings) {
        localStorage[_settingsKey] = angular.toJson(settings);
    }

     me = {
        instance: function(){
            var _tmp = _retrieveSettings();
            return {
                get:function(k){
                    return typeof _tmp[k] === 'undefined' ? (defaultSettings[k] || null) : _tmp[k];
                },
                set:function(k,v){ _tmp[k] = v; return v; },
                save: function(){ _saveSettings(_tmp); }
            };
        },
        val: function(k, v)
        {
            var settings = _retrieveSettings();
            if(typeof v === 'undefined'){
                return typeof settings[k] === 'undefined' ? (defaultSettings[k] || null) : settings[k];
            }
            settings[k] = v;
            _saveSettings(settings);
            return me;
        }
    };

    return me;
}]);
