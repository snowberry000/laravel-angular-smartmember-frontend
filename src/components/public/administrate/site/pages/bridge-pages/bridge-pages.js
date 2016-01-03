var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.pages.bridge-pages",{
			url: "/bridge-pages",
			templateUrl: "/templates/components/public/administrate/site/pages/bridge-pages/bridge-pages.html",
			controller: "BridgePagesController"
		})
}); 

app.controller("BridgePagesController", function ($scope, $localStorage, $state, $rootScope ,$stateParams,  $filter, Restangular, toastr) {
	$scope.template_data = {
        title: 'BRIDGE PAGES',
        description: 'Bridge Pages are your "marketing" pages. They are stand-alone designed pages used to collect leads or inform visitors of something - like a product, service, update, video, you name it! They exist on their own url\'s and stand separate from your site\'s normal theme.',
        singular: 'bridge page',
        edit_route: 'public.administrate.site.pages.bridge-page',
        api_object: 'bridgePage'
    }
    $site = $rootScope.site;
    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.cloneBridgePage = function(page_id) {
        Restangular.one('bridgePage' , page_id).get().then(function(page){

            var seo = {};
            if (page.seo_settings) {
                $.each(page.seo_settings, function (key, data) {
                    seo[data.meta_key] = data.meta_value;

                });
            }
            page.seo_settings = seo;

            var swapspot = {};
            //initiate default swapspot value
            if (page.swapspots)
            {
                $.each(page.swapspots, function (key, data) {
                    swapspot[data.name] = data.value;
                });
            }
            page.swapspot = swapspot;

            var clonedBridgePage = {
                access_level_type: page.access_level_type,
                permalink: page.permalink,
                seo_settings: page.seo_settings,
                site_id: page.site_id,
                swapspot: page.swapspot,
                template_id: page.template_id,
                title: page.title
            };

            Restangular.all('bridgePage').post(clonedBridgePage).then(function (page) {
                $scope.data[ $scope.pagination.current_page ].shift(page);
                toastr.success("Bridge page has been cloned!");
                $state.go("public.administrate.site.pages.bridge-page" , {"id" : page.id});
            });
        });
    }

    $scope.deleteResource = function (id) {

        var page = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
            return next_item.id === parseInt(id);
        });
        page.remove().then(function () {
            $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], page);
        });
    };
});