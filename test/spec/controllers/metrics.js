'use strict';

describe('Controller: MetricsCtrl', function () {

  // load the controller's module
  beforeEach(module('dashboardApp'));

  var MetricsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetricsCtrl = $controller('MetricsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MetricsCtrl.awesomeThings.length).toBe(3);
  });
});
