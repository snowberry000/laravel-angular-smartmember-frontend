app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
          if( html )
            html = html.replace(/(dynamic=[",'])(.*?)([",'])/g, '');

        elem.html( html );
        $compile( elem.contents() )(scope);
      });
    }
  };
});