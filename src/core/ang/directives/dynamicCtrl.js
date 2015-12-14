app.directive('dynamicCtrl', ['$compile', '$parse',function($compile, $parse) {
  return {
    restrict: 'A',
    terminal: true,
    priority: 100000,
    link: function(scope, elem) {
      var name = $parse(elem.attr('dynamic-ctrl'))(scope);
      elem.removeAttr('dynamic-ctrl');
      elem.attr('ng-controller', name);
      $compile(elem)(scope);
    }
  };
}]);