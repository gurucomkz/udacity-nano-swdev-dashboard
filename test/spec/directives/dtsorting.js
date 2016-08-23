'use strict';

describe('Directive: dtSorting', function () {

  // load the directive's module
  beforeEach(module('dashboardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dt-sorting></dt-sorting>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dtSorting directive');
  }));
});
