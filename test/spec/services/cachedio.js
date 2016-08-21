'use strict';

describe('Service: cachedIO', function () {

  // load the service's module
  beforeEach(module('dashboardApp'));

  // instantiate service
  var cachedIO;
  beforeEach(inject(function (_cachedIO_) {
    cachedIO = _cachedIO_;
  }));

  it('should do something', function () {
    expect(!!cachedIO).toBe(true);
  });

});
