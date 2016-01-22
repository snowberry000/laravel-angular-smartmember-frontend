var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.jv.stats", {
			url: "/stats",
			templateUrl: "/templates/components/public/administrate/team/jv/stats/stats.html",
			controller: "AffiliateStatsController",
			// resolve: {
			// 	loadPlugin: function( $ocLazyLoad )
			// 	{
			// 		return $ocLazyLoad.load( [
			// 			{
			// 				name: 'chart.js'
			// 			}
			// 		] );
			// 	}
			// }
		} )
} );

app.controller( "AffiliateStatsController", function( $scope, $rootScope, $state, Restangular , smModal)
{
	$user = $rootScope.user;
	$summary = Restangular.all( 'affiliate' ).customGET( 'summary' ).then(function(response){$scope.summary = response ; $summary = response; $scope.init()});
	$scope.series = [ 'Affiliates' ];

	$scope.hasAccess = function( role )
	{
		if( typeof role == 'undefined' )
		{
			role = $user.role;
		}

		for( var i = role.length - 1; i >= 0; i-- )
		{
			var Manager = _.findWhere( role[ i ].type, { role_type: 3 } );
			if( !Manager )
			{
				Manager = _.findWhere( role[ i ].type, { role_type: "3" } );
			}
			var Owner = _.findWhere( role[ i ].type, { role_type: 2 } );
			if( !Owner )
			{
				Owner = _.findWhere( role[ i ].type, { role_type: "2" } );
			}
			var PrimaryAdmin = _.findWhere( role[ i ].type, { role_type: 1 } );
			if( !PrimaryAdmin )
			{
				PrimaryAdmin = _.findWhere( role[ i ].type, { role_type: "1" } );
			}
			if( Manager || Owner || PrimaryAdmin )
			{
				return true;
			}
		}
		return false;
	}

	var access = $scope.hasAccess( $user.role );
	console.log( "My access is" + access )
	if( $state.current.name.split( '.' )[ 1 ] == 'smartmail' )
	{
		console.log( access )
		if( !access )
		{
			smModal.Show( 'public.administrate.account.memberships' );
		}
	}

	$scope.charts = [];

	$scope.init = function()
	{
		$scope.charts[ 0 ] = { "data": [ [] ], "labels": [] };

		if( $summary && $summary.success != false )
		{
			$.each( $summary.affiliates_overtime, function( key, data )
			{
				$scope.charts[ 0 ].data[ 0 ].push( data.affiliates );
				$scope.charts[ 0 ].labels.push( data.month );
			} );

		}
		$scope.charts[ 1 ] = { "data": [ [] ], "labels": [] }
		$scope.charts[ 1 ].data[ 0 ] = [ $summary.affiliates_today, $summary.affiliates_yesterday ];
		$scope.charts[ 1 ].labels = [ "Today", "Yesterday" ];

		$scope.charts[ 2 ] = { "data": [ [] ], "labels": [] }
		$scope.charts[ 2 ].data[ 0 ] = [ $summary.affiliates_this_week, $summary.affiliates_last_week ];
		$scope.charts[ 2 ].labels = [ "Current", "Last" ];

		$scope.charts[ 3 ] = { "data": [ [] ], "labels": [] }
		$scope.charts[ 3 ].data[ 0 ] = [ $summary.affiliates_this_month, $summary.affiliates_last_month ];
		$scope.charts[ 3 ].labels = [ "Current", "Last" ];
	};

	$scope.colours = [ {
		"fillColor": "rgba(0, 102, 0, 1)",
		"strokeColor": "rgba(207,100,103,1)",
		"pointColor": "rgba(220,220,220,1)",
		"pointStrokeColor": "#fff",
		"pointHighlightFill": "#fff",
		"pointHighlightStroke": "rgba(151,187,205,0.8)"
	} ];

	$scope.chart_options = {
		"pointDot": false
	};
} );