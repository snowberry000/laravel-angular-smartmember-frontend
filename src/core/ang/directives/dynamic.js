app.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                if (html)
                    html = html.replace(/(dynamic=[",'])(.*?)([",'])/g, '');
                var $html = $('<p>').html(html);
                $html.find('*').removeAttr('contenteditable');
                $html.find('iframe').each(function () {
                    if (!$(this).hasClass('no-responsive'))
                        $(this).wrap('<div class="video_container"></div>');
                });
                $('video').bind('contextmenu',function() { return false; });
                elem.html($html.html());
                $compile(elem.contents())(scope);
            });
        }
    };
});