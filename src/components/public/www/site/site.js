var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.site", {
			url: "/site/:permalink",
			templateUrl: "/templates/components/public/www/site/site.html",
			controller: "WWWSiteController"
		} )
} );

app.controller( "WWWSiteController", function( $scope, Restangular, $stateParams , $localStorage , $rootScope , toastr , smModal)
{
	$scope.loading = true;

	Restangular.one( 'directoryByPermalink', $stateParams.permalink ).get().then( function( response )
	{
		$scope.site_listing = response;

		$scope.loading = false;
	} );

	$scope.JoinSite = function( site_id )
	{
		// Logic:
		// if not logged in, pop the Sign In modal then join the site without requiring another user action
		var member = _.findWhere($rootScope.sites , {id : site_id});
		console.log(member);
		//return;
		if(!$localStorage.user){
			$localStorage.add_user_to_site = site_id;
			smModal.Show('public.sign.in' , {close : true} , null , function(response){
				console.log(response);
				$scope.addMember(site_id);
			});
		}
		else if( $localStorage.user && !member)
		{
            $scope.addMember(site_id);
		}else if($localStorage.user && member){
			$scope.redirectToSite(member);	
		}
		// if logged in and not a member, join the site
		// if logged in and a member, go to the site

		// TODO: this needs to work by passing the site_id
		//Restangular.all( 'site/addMember' ).customPOST().then( function()
		//{
		//toastr.success( "You have become a member of this site" );
		//$scope.is_member = true;
		//} );
	}

	$scope.redirectToSite = function(site){
		if( !site.domain && site.subdomain)
		{
			window.location.href = "http://" + site.subdomain + '.' + $rootScope.app.domain;
		}
		else if(site.domain){
			window.location.href = site.domain;
		}
	}

	$scope.addMember = function(site_id){
        Restangular.all( 'site/addMember' ).customPOST({site_id : site_id},'').then( function(response)
		{
			toastr.success( "You have become a member of this site" );
			$scope.is_member = true;
			$rootScope.sites.push(response);
		});
	}

} );