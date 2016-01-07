var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("thankyou",{
			url: "/thankyou",
			templateUrl: "/templates/components/thankyou/thankyou.html",
			controller: "ThankyouController",
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $access_levels: function(Restangular,$site) {
                    return Restangular.all('accessLevel').getList({site_id: $site.id});
                }
            }
		})
        .state("thankyou2",{
            url: "/thank-you",
            templateUrl: "/templates/components/thankyou/thankyou.html",
            controller: "ThankyouController",
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $access_levels: function(Restangular,$site) {
                    return Restangular.all('accessLevel').getList({site_id: $site.id});
                }
            }
        })
}); 

app.controller('ThankyouController', function ($scope, $site, $access_levels,$rootScope) {
    $scope.site = $site;
    $rootScope.page_title = 'Thank you!';

    $scope.getQueryVariable = function(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    $.each($site.meta_data, function (key, data) {
        $scope.options[data.key] = data.value;
    });

    $scope.jvzoo_product_id = $scope.getQueryVariable('cproditem') || null;
    $scope.access_level_id = $scope.getQueryVariable('access_level_id') || null;
    $scope.access_level = null;

    angular.forEach( $access_levels, function (value, key){
        if( $scope.access_level_id != null && value.id == $scope.access_level_id )
            $scope.access_level = value;
        else if( $scope.jvzoo_product_id != null && value.product_id == $scope.jvzoo_product_id )
            $scope.access_level = value;
    });

    if( $scope.access_level != null ) {
        if (typeof fbq == 'function') {
            fbq('track', 'Purchase', {
                content_name: $scope.access_level.name || $site.name,
                content_category: $site.name,
                content_type: 'product',
                value: $scope.access_level.price || 0,
                currency: 'USD'
            });
        }

        if (typeof $scope.options.facebook_conversion_pixel != 'undefined') {
            window._fbq = window._fbq || [];
            window._fbq.push(['track', $scope.options.facebook_conversion_pixel, {'content_name': $scope.access_level.name || $site.name, 'value': $scope.access_level.price || 0, 'currency': 'USD'}]);
        }
    }
});