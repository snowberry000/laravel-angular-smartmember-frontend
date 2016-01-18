var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.sites", {
			url: "/sites",
			templateUrl: "/templates/components/public/app/admin/sites/sites.html",
			controller: "SitesController"
		} )
} );

app.controller( "SitesController", function( $scope, $rootScope, $filter , $localStorage, toastr, $location, Restangular, $state, notify )
{
	$scope.can_create_sites = true; //TODO: fix this to use proper SM customer detection

	$scope.domain = $location.host().split( "." ).splice( -2, 1 ).pop();
	$scope.isCollapsed = false;
	$scope.env = $scope.app.env;
    $scope.site_query = '';

	$scope.iter = 0;

	$scope.sites = [];
	$scope.siteCounters={};

	$scope.sites = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: $rootScope.sites.length
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.promptRemoveMe = function( $event,$argSite )
	{
		$event.preventDefault();
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

		Restangular.all('site').customDELETE(site.id).then( function()
		{
			$scope.sites_to_show = _.without( $scope.sites_to_show , site);
		} );
	};

	$scope.paginate = function() {
        var begin = (($scope.pagination.current_page - 1) * $scope.pagination.per_page),
            end = begin + $scope.pagination.per_page;

        $scope.sites_to_show = $rootScope.sites;
        $scope.sites_to_show = $filter('orderBy')($scope.sites_to_show, ['-total_revenue', '-total_lessons', '-total_members']);
        $scope.sites_to_show = $filter('filter')( $scope.sites_to_show, $scope.site_query );
        $scope.pagination.total_count = $scope.sites_to_show.length;
        $scope.sites_to_show = $scope.sites_to_show.slice(begin, end);

        $scope.countSites('admin');
        $scope.countSites('editor');
        $scope.countSites('support');
        $scope.countSites('member');
    }

    $scope.revoke = function ($argSite) {
    	Restangular.all('siteRole/removeUserFromSite').customPOST({'site_id': $argSite.id ,'user_id' : $scope.user.id }).then(function(response){
            $scope.sites_to_show = _.filter($scope.sites_to_show, function($tempSite){ return $tempSite.id!=$argSite.id; });
            toastr.success(response.length+' roles of you are removed from '+$argSite.name);
        });
    }

	$scope.filterBy = function(role){
        $scope.pagination.current_page = 1;
		if(role == 'admin'){
            $scope.sites_to_show = $rootScope.sites;
            $scope.sites_to_show = $filter('orderBy')($scope.sites_to_show, ['-total_revenue', '-total_lessons', '-total_members']);
            $scope.sites_to_show = $filter('filter')( $scope.sites_to_show, $scope.site_query );
			$scope.sites = $filter('filter')($scope.sites_to_show,{role : 'admin'});
			var sites_2 = $filter('filter')($scope.sites_to_show,{role : 'owner'});
			$scope.sites_to_show = $scope.sites.concat(sites_2);
		}else{
            $scope.sites_to_show = $rootScope.sites;
            $scope.sites_to_show = $filter('orderBy')($scope.sites_to_show, ['-total_revenue', '-total_lessons', '-total_members']);
            $scope.sites_to_show = $filter('filter')( $scope.sites_to_show, $scope.site_query );
			$scope.sites_to_show = $filter('filter')($scope.sites_to_show,{role : role});
		}
		$scope.siteCounters[role] = $scope.sites_to_show.length;
		$scope.pagination.total_count = $scope.sites_to_show.length;
	}

	$scope.countSites = function(role){
		if(role == 'admin'){
			$scope.tempSites = $filter('filter')($rootScope.sites,{role : 'admin'});
			var sites_2 = $filter('filter')($rootScope.sites,{role : 'owner'});
			$scope.tempSites = $scope.tempSites.concat(sites_2);
		}else{
			$scope.tempSites = $filter('filter')($rootScope.sites,{role : role});
		}
		$scope.siteCounters[role] = $scope.tempSites.length;
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
			Restangular.one( 'site', site.id ).remove().then( function()
			{
				$scope.sites = _.without( $scope.sites, site );
				toastr.success( "Site deleted successfully!" );
			} );
		} )
	};

	$scope.loadMore = function()
	{
		// TODO: this is until scroll-based loading works
		$scope.sites = $rootScope.sites;
		$scope.countSites('admin');
		$scope.countSites('editor');
		$scope.countSites('support');
		$scope.countSites('member');

		return;

		console.log( "doing loadMore" );

		for( var i = 1; i <= 20; i++ )
		{
			console.log( '$rootScope.sites.length', $rootScope.sites.length );
			console.log( '$scope.iter', $scope.iter, $scope.sites );

			if( $rootScope.sites.length > $scope.iter )
			{
				$scope.sites.push( $rootScope.sites[ $scope.iter ] );
				$scope.iter++;
			}
		}
	};

	$scope.$on('$destroy', function() {
        alert("In destroy");
        $( "body *" ).unbind( 'scroll' );
    });
} );