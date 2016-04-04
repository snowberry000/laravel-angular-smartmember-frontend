var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.jv.contest", {
			url: "/contest/:id?",
			templateUrl: "/templates/components/public/app/admin/jv/contest/contest.html",
			controller: "ContestController"
		} )
} );

app.controller( "ContestController", function( $scope, $filter, Upload, $localStorage, $rootScope, Restangular, toastr, $state, $stateParams, smModal )
{
	$site = $rootScope.site;
	var contest = null;


	$scope.Init = function()
	{
		if (!Modernizr.inputtypes.date) {
          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
          $('input[type="date"]').datepicker();
          $('input[type="date"]' ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
        }


		if( !$scope.contest.type )
		{
			$scope.contest.type = "sales";
		}

		$scope.contest.id ? $scope.page_title = 'Edit contest' : $scope.page_title = 'Create contest';
		$scope.dateOptions = {
			changeYear: true,
			formatYear: 'yy',
			startingDay: 1
		}

		$scope.format = 'MM/dd/yy';
		$scope.minDate = new Date();
		$scope.contest.start_date = new Date( moment.utc( $scope.contest.start_date ) );
		$scope.contest.end_date = new Date( moment.utc( $scope.contest.end_date ) );
		$scope.status = {
			opened: [ false, false ]
		};
	}

	if( $stateParams.id )
	{
		$content = Restangular.one( 'affiliateContest', $stateParams.id ).get().then( function( response )
		{
			$scope.contest = response;
			contest = response;
			$scope.Init();
		} )
	}
	else
	{
		$scope.contest = { company_id: $site.company_id };
		$scope.Init();
	}


	$scope.selectAll = function()
	{

		if( $scope.isChecked )
		{
			contest.sites = $sites.admin.sites;
		}
		else
		{
			contest.sites = [];
		}
	}

	$scope.isAlreadythere = function( $subdomain )
	{

		if( $scope.isChecked )
		{
			return true;
		}

		for( var i = 0; i < contest.sites.length; i++ )
		{
			if( contest.sites[ i ].subdomain == $subdomain )
			{
				return true;
			}
		}
		return false;
	}
	$scope.open = function( event, id )
	{
		$scope.status.opened[ id ] = true;
	}

	Restangular.all( 'site' ).customGET( 'members' ).then( function( response )
	{
		$sites = response;
		$scope.sites = response.admin;
	} );

	$scope.save = function()
	{

		if( $scope.contest.sites )
		{
			for( var i = 0; i < $scope.contest.sites.length; i++ )
			{
				if( $scope.contest.sites[ i ].id )
				{
					$scope.contest.sites[ i ] = $scope.contest.sites[ i ].id.toString();
				}
			}
		}
		if( $scope.contest.id )
		{

			$scope.update();
			return;
		}
		$scope.create();
	}


	$scope.update = function()
	{
		$scope.contest.put().then( function( response )
		{
			toastr.success( "Changes saved!" );
			$state.go('public.app.admin.jv.contests');
		} );
	}

	$scope.setPermalink = function( $title )
	{
		if( !$scope.contest.permalink && $title )
		{
			$scope.contest.permalink = "leaderboard-" + $filter( 'urlify' )( $title ).toLowerCase();
		}

	}


	$scope.create = function()
	{
		Restangular.service( "affiliateContest" ).post( $scope.contest ).then( function( response )
		{
			toastr.success( "Changes saved!" );
			$state.go('public.app.admin.jv.contests');
		} );
	}
} );