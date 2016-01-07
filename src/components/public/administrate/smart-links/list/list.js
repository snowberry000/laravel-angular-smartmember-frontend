var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.smart-links.list",{
			url: "/list",
			templateUrl: "/templates/components/public/administrate/smart-links/list/list.html",
			controller: "SmartLinksListController"
		})
}); 

app.controller("SmartLinksListController", function ($scope, $rootScope, Restangular, toastr, smModal, close) {
    $site = $rootScope.site;
    $scope.template_data = {
        title: 'SMARTLINKS',
        description: 'Create rotating links',
        singular: 'Smart Link',
        edit_route: 'public.administrate.smart-links.create',
        api_object: 'smartLink'
    }

    $scope.loading = false;
    $scope.query = '';
    $scope.data = [];
    $scope.pagination = {
        current_page: 1,
        per_page: 25,
        total_count: 0
    };

    $scope.rotation_types = {
        random: 'Random',
        sequential: 'Sequential',
        least_hit: 'Least hit',
        weighted: 'Weighted'
    };

    $scope.$watch( 'pagination.current_page', function( new_value, old_value )
    {
        if( new_value != old_value )
        {
            $scope.paginate();
        }
    } );

    $scope.paginate = function()
    {
        $scope.loading = true;

        var $params = { p: $scope.pagination.current_page, site_id: $rootScope.site.id };

        if( $scope.query )
        {
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
        {
            $scope.loading = false;
            $scope.pagination.total_count = data.total_count;
            $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
        } );
    }

    $scope.paginate();

    $scope.init = function()
    {
        var clipboard = new Clipboard( '.copy-button', {
            text: function(trigger) {
                return trigger.getAttribute('data-text');
            }
        } );
    }

    $scope.deleteResource = function( id )
    {
        var itemWithId = _.find( $scope.data[ $scope.pagination.current_page ], function( next_item )
        {
            return next_item.id == id;
        } );

        itemWithId.remove().then( function()
        {
            $scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], itemWithId );
        } );
    };

    $scope.copied = function()
    {
        toastr.success("Link copied!");
    }
});