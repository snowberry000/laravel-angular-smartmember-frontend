var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.pages.custom-pages",{
			url: "/custom-pages",
			templateUrl: "/templates/components/public/administrate/site/pages/custom-pages/custom-pages.html",
			controller: "CustomPagesController"
		})
}); 

app.controller("CustomPagesController", function ($scope, $localStorage, $rootScope, $state, $stateParams,  $filter, Restangular, toastr) {
	$scope.template_data = {
        title: 'PAGES',
        description: 'Create pages to fill your site with content for your members to read / watch / hear.',
        singular: 'page',
        edit_route: 'public.administrate.site.pages.custom-page',
        api_object: 'customPage'
    }

    var page = Restangular.all("customPage");
    $site = $rootScope.site;
    $scope.data = [];
    $scope.pagination = {
        current_page: 1,
        per_page: 2,
        total_count: 0
    };

    $scope.$watch( 'pagination.current_page', function( new_value, old_value )
    {
        if( new_value != old_value )
        {
            $scope.paginate();
        }
    } );

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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
        $scope.pagination = {
        current_page: 1,
        per_page: 2,
        total_count: 0
    };

        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }
    
    $scope.deleteResource = function (id) {
        var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
            return next_item.id == id;
        });

        itemWithId.remove().then(function () {
            $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
        });
    };
});