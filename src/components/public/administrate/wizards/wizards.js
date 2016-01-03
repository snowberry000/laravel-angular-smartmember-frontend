var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.wizards", {
			url: "/wizard",
			templateUrl: "/templates/components/public/administrate/wizards/wizards.html",
			controller: "WizardsController",
			resolve: {
				$wizards: function( Wizards )
				{
					return Wizards.GetAll();
				},
				$wizards_server: function( Restangular, $site )
				{
					return Restangular.all( 'wizard' ).customGET( '', { is_completed: 1, site_id: $site.id } )
				},
				$site: function( $rootScope )
				{
					return $rootScope.site;
				}
			}
		} )
} );

app.controller( 'WizardsController', function( $scope, $rootScope, $location, $state, $site, $filter, $http, $user, $localStorage, Restangular, $wizards, $wizards_server, toastr )
{
	$rootScope.wizards = $wizards;
	$rootScope.wizards_server = $wizards_server;
	//$rootScope.parent_wizard = $scope;
	var wizards = _.pluck( $wizards_server, 'slug' );
	if( wizards && $rootScope.wizards )
	{
		angular.forEach( $rootScope.wizards, function( value, key )
		{
			if( wizards.indexOf( value.slug ) >= 0 )
			{
				value.completed = true;
			}
		} )
	}


	$scope.open = function( wizard )
	{
		$state.go( 'public.administrate.wizard', { 'id': wizard.slug } );
	}
} );