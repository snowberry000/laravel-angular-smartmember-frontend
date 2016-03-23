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

	$scope.promptRemoveMe = function( $event,$argSite )
	{
		$event.preventDefault();
		$event.stopPropagation();
		swal( {
			title: "Are you sure?",
			text: "Removing this account will remove all of your roles from "+$argSite.name+"!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, remove it!",
			closeOnConfirm: true
		}, function()
		{
			$scope.revoke($argSite);
		} );
	}

	$scope.deleteResource = function( $event , $site )
	{
		$event.preventDefault();
		$event.stopPropagation();
		swal( {
			title: "Are you sure?",
			text: "Are you sure want to delete this site?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: true
		}, function()
		{
			$scope.delete($site);
		} );
		
	}

	$scope.delete = function( site )
	{

		RestangularV3.all('site').customDELETE(site._id).then( function()
		{
			$scope.data = _.without( $scope.data , site);
		} );
	};

	$scope.revoke = function ($argSite) {
    	RestangularV3.all('site/removeUserFromSite').customPOST({'site_id': $argSite.id ,'user_id' : $scope.user.id }).then(function(response){
            $scope.sites_to_show = _.filter($scope.sites_to_show, function($tempSite){ return $tempSite.id!=$argSite.id; });
            toastr.success(response.length+' roles of you are removed from '+$argSite.name);
        });
    }

	$scope.deleteSite = function( site )
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return site.id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			RestangularV3.one( 'site', site.id ).remove().then( function()
			{
				$scope.sites = _.without( $scope.sites, site );
				toastr.success( "Site deleted successfully!" );
			} );
		} )
	};

} );