var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.pricing", {
			url: "/pricing",
			templateUrl: "/templates/components/public/www/pricing/pricing.html",
			controller: "PricingController"
		} )
} );

app.controller( "PricingController", function( $scope, $location, smScroll )
{

	$scope.static_menu = true;
	$scope.show_pricing_nav = true;

	$scope.pricing_options_visibility_data = {};
	$scope.pricing_nav_visibility_data = {};
	$scope.active_pricing_option = 'option_a';

	$scope.$watch( 'pricing_options_visibility_data.topPassed', function( new_value, old_value )
	{
		if( new_value != null )
		{
			if( new_value )
			{
				$scope.SetActivePricingChoice( 'option_b' );
			}
			else
			{
				$scope.SetActivePricingChoice( 'option_a' );
			}
		}

	}, true );

	$scope.$watch( 'pricing_nav_visibility_data.bottomPassed', function( new_value, old_value )
	{
		if( new_value != null )
		{
			if( new_value )
			{
				$scope.show_pricing_nav = false;
			}
			else
			{
				$scope.show_pricing_nav = true;
			}
		}

	}, true );

	$scope.SetActivePricingChoice = function( slug )
	{
		$scope.active_pricing_option = slug;
	};

	$scope.GoToOption = function( slug )
	{
		$scope.SetActivePricingChoice( slug );
		$scope.gotoElement( slug );
	};

	$scope.gotoElement = function( eID )
	{
		//$location.hash('bottom');

		// call $anchorScroll()
		smScroll.scrollTo( eID, -100 );
	}

} );