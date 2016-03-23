var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.smart-sites.list", {
			url: "/list/:segment",
			templateUrl: "/templates/components/admin/app/smart-sites/list/list.html",
			controller: "SmartSitesListController"
		} )
} );

app.controller( "SmartSitesListController", function( $scope, Restangular,RestangularV3, $stateParams, $state ,$rootScope)
{
	if( !$stateParams.segment )
	{
		$state.params.segment = 'all';

		$state.go( $state.current, $state.params, {reload:true} );
		return;
	}

	$scope.loading = false;
	$scope.segment = $stateParams.segment;
	$scope.query = '';
	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.getMetaValue = function($site,$key){
		$meta = _.find($site.meta,function($meta_item){
			return ($meta_item.key == $key);
		});
		if($meta)
			return $meta.value;
		else
			return "";
	}

	$scope.paginate = function( search )
	{
		if(!$scope.data || $scope.data.length==0)
			$scope.loading = true;
		$scope.pagination.disable=true;
		if( search )
		{
			$scope.pagination.current_page = 1;
		}

		var $params = { p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		if( $scope.segment == 'all' )
		{
			RestangularV3.all( '' ).customGET( '/sites/getAll' + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.current_page++;
				$scope.pagination.total_count = data.total_count;
				$rootScope.all_smartSites_count= $scope.pagination.total_count;

				if(data && data.items && data.items.length > 0)
				{
					$scope.pagination.disable = false;
				}
				$scope.data =$scope.data.concat(data.items);
			});
		}
		/*else
		 {
		 Restangular.all( '' ).customGET( 'user/members' + '?type=member&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		 {
		 $scope.loading = false;
		 $scope.pagination.total_count = data.total_count;
		 $rootScope.all_avenues_count= $scope.pagination.total_count;
		 $scope.data = Restangular.restangularizeCollection( null, data.items, 'user/members' );
		 } );
		 }*/

	}

	$scope.paginate();

} );