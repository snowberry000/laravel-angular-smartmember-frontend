app.directive('smActiveClass', function () {
	return function (scope, element, attr) {
        var url = scope.$eval( attr['smActiveClass'] );
        var replace_host = new RegExp('http://' + location.hostname);
        var url = url.replace( replace_host, '' );

        $parent_scope = scope;

        for($parent_scope = $parent_scope.$parent;!$parent_scope.site && $parent_scope.$parent;$parent_scope = $parent_scope.$parent);

        if( $parent_scope.site )
            var home_page_meta = _.findWhere($parent_scope.site.meta_data, {key: 'homepage_url'});

        if( home_page_meta )
            var home_page = home_page_meta.value;

        if( !home_page )
            var home_page = 'lessons';

        var no_url_item = _.findWhere( $parent_scope.site.menu_items, {url: '/'}) || _.findWhere( $parent_scope.site.menu_items, {url: ''});

        if( home_page && url == '/' ) {
            if( no_url_item ) {
                var other_menu_item = _.findWhere($parent_scope.site.menu_items, {url: home_page}) || _.findWhere($parent_scope.site.menu_items, {url: '/' + home_page});

                if( !other_menu_item )
                    var other_menu_item = _.findWhere($parent_scope.site.menu_items, {url: 'http://' + location.hostname + home_page}) || _.findWhere($parent_scope.site.menu_items, {url: 'http://' + location.hostname + '/' + home_page});
            }

            var no_url_item = _.findWhere( $parent_scope.site.menu_items, {url: ""});
        }

		scope.$watch(function(){
            return {url: location.pathname};
        }, function (newValue, oldValue) {
            if( newValue.url == url || newValue.url == '/' + url || ( home_page && !other_menu_item && !no_url_item && newValue.url == '/' && ( url == home_page || url == '/' + home_page ) ) )
                $(element).addClass('active');
            else
                $(element).removeClass('active');

		}, true);
	}
});