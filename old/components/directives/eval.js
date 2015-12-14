app.directive('render', function ($compile) {
  return {
    restrict: 'C',
    link: function (scope, elem, attrs) {
        // eva4luate attribute contents
        attrs.$set('id',scope.$eval(attrs.vid));
    }
  }
 })