app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
          if( html )
            html = html.replace(/(dynamic=[",'])(.*?)([",'])/g, '');
        var $html = $('<p>').html(html);
        $html.find('iframe').each(function() {
          $(this).wrap('<div class="video_container"></div>');
        });
        elem.html( $html.html() );
        $compile( elem.contents() )(scope);
      });
    }
  };
});