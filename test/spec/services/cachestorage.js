'use strict';

describe('Service: cacheStorage', function () {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var cacheStorage;
  beforeEach(inject(function (_cacheStorage_) {
    cacheStorage = _cacheStorage_;
  }));

  it('should do something', function () {
    expect(!!cacheStorage).toBe(true);
  });

});
