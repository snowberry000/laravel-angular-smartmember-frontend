app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        elem.html(html);
        $compile(elem.contents())(scope);
      });
    }
  };
});