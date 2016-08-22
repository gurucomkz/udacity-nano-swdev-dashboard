'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.cachedIO
 * @description
 * # cachedIO
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
.service('cachedIO', [
    '$http',
    '$q',
    'cacheStorage',
    'appSettings',
function ($http, $q, cacheStorage, appSettings) {
    var me = this;

    this.getCachedFile = function(fname)
    {
        var D = $q.defer();
        var _fail = function (/*why*/) {
                //console.log(['getCachedFile', fname, 'fail', why]);
                D.reject();
            },
            _ok = function (data) {
                // try{
                //     var dtmp = JSON.parse(data);
                //     data = dtmp;
                // }catch(e){
                //     console.log(['getCachedFile', fname, 'encode','fail', e]);
                // }
                D.resolve(data);
            },
            _getfile = function(){
                cacheStorage.readAsText(fname)
                .then(_ok, _fail);
            };
        try{
            cacheStorage.checkFile(fname)
            .then(_getfile, _fail);
        }catch(e){
            //console.log(['getCachedFile', e]);
            D.reject();
        }
        return D.promise;
    };

    this.checkFileCache = function(fname, noHead)
    {
        var D = $q.defer();
        var _fail = function(/*why*/){
                // console.log(['checkFileCache', fname, 'fail', why])
                D.reject();
            },
            _accept = function(data){
                // console.log(['checkFileCache', fname, 'ok'])
                D.resolve(data);
            },
            _get = function(){
                me.getCachedFile(fname)
                .then(_accept, _fail);
            };
        try{
            var conditions = [
                cacheStorage.checkFile(fname)
            ];
            if(!noHead){
                conditions.push(me.fileCacheValid(fname));
            }
            $q.all(conditions)
            .then( _get, _fail );
        }catch(e){
            //console.log(['checkFileCache', e]);
            D.reject();
        }
        return D.promise;
    };

    this.fileCacheValid = function(fname)
    {
        var D = $q.defer(),
            _isValid = function(){
                D.resolve();
            },
            _notValid = function(){
                D.reject();
            },
            _ok = function(rsp){
                var filesVersions = appSettings.val('filesVersions') || {},
                    serverVersion = rsp.headers('Last-Modified');
                if(filesVersions[fname] && filesVersions[fname]!==serverVersion){
                    _notValid();
                }else{
                    _isValid();
                }
            };

        $http({
            method: 'HEAD',
            timeout: 5000,
            url: fname + '?_=' +(new Date()).getTime()
        }).then(_ok, _isValid);
        return D.promise;
    };

    this.tryWriteCache = function(fname, data){
        var D = $q.defer(),
            _ok = function(data){
                //console.log(['tryWriteCache', fname, 'ok']);
                D.resolve( data );
            },
            _fail = function(/*why*/){
                //console.log(['tryWriteCache', fname, 'fail', why]);
                D.reject();
            };

        try{

            if(typeof data !== 'string'){
                try{
                    var dtmp = JSON.stringify(data);
                    data = dtmp;
                }catch(e){}
            }
            me.verifyLocalPathExists(fname)
            .then(function(){
                cacheStorage.writeFile(fname, data).then(_ok, _fail);
            },_fail);

        }catch(e){
            //console.log(['tryWriteCache', e])
            D.reject();
        }
        return D.promise;
    };

    this.fetchRemoteFile = function(fname, dontRememberDate)
    {
        var D = $q.defer();

        $http({
            method: 'GET',
            url: fname + '?_='+(new Date()).getTime()
        })
        .success(function(data, status, headers){
            if(!dontRememberDate)
            {
                var serverVersion = headers('Last-Modified'),
                    filesVersions = appSettings.val('filesVersions');

                filesVersions[fname] = serverVersion;
                appSettings.val('filesVersions', filesVersions);
            }

            me.tryWriteCache(fname, data);
            D.resolve(data);
        })
        .error(function(){
            D.reject();
        });

        return D.promise;
    };


    this.get = function(fname, force, rejectIfCached)
    {
        var D = $q.defer(),
            _success = function(data){
                //console.log(['getFile', '_success', fname]);
                D.resolve(data);
            },
            _fail = function(){
                //console.log(['getFile', '_fail', fname]);
                D.reject();
            },
            _tryFile = function(ownPromise){
                var _tfD = $q.defer(),
                    __success = function(data){
                        //console.log(['getFile', '_tryFile', '__success', fname]);
                        _tfD.resolve(data);
                    },
                    __fail = function(){
                        //console.log(['getFile', '_tryFile', '__fail', fname]);
                        _tfD.reject();
                    },
                    // __nochange = function(){
                    //     console.log(['getFile', '_tryFile', '__nochange', fname]);
                    //     _tfD.reject();
                    // },
                    __goRemote = function(){
                        me.fetchRemoteFile(fname)
                        .then(ownPromise ? __success : _success, ownPromise ? __fail : _fail);
                    };

                //console.log(['getFile', '_tryFile', fname]);
                try{
                    __goRemote();
                }catch(e){
                    //console.log(['getFile', '_tryFile', 'EXCEPTION', e.toString()]);
                    _fail(e.toString());
                    (ownPromise?__fail:_fail)();
                }
                return _tfD.promise;
            };

        var _checkCache = function(noRemote, noHead)
        {
            return function(){
                return me.checkFileCache(fname, noHead)
                        .then( _success, noRemote ? _fail : _tryFile );
            };
        };

        //console.log(['getFile', '_perform', fname, 'test']);

        if (force){
            _tryFile(true)
            .then( _success, _checkCache(true));
        }else{
            if(rejectIfCached){
                me.fileCacheValid(fname).then(_fail, _checkCache(false));
            }else{
                (_checkCache(false))();
            }
        }


        return D.promise;
    };
}]);
