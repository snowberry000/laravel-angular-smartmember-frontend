var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.www.product", {
			url: "/pricing/:slug",
			templateUrl: "/templates/components/public/www/pricing/product/product.html",
			controller: "PublicPricingProductController"
		} )
} );

app.controller( "PublicPricingProductController", function( $scope, $stateParams, $rootScope )
{
	$scope.active_plan = 'lite';
	$scope.pricing_steps = [];

	$rootScope.$watch( 'all_products', function( new_value, old_value ) {

		if( new_value )
		{
			if( $stateParams.slug == 'smart-sites' )
			{
				$scope.next_item = new_value.smart_sites;
			}
			else if( $stateParams.slug == 'smart-mail' )
			{
				$scope.next_item = new_value.smart_mail;
			}
			else if( $stateParams.slug == 'smart-jv' )
			{
				$scope.next_item = new_value.smart_jv;
			}
			else if( $stateParams.slug == 'smart-support' )
			{
				$scope.next_item = new_value.smart_support;
			}
			else
			{
				$scope.next_item = {};
			}

			console.log( 'next_item: ', $scope.next_item );
		}
	});

	for( var i = 250; i <= 1000; i += 50 )
	{
		$scope.pricing_steps.push( i );
	}

	for( var i = 1500; i <= 10000; i += 500 )
	{
		$scope.pricing_steps.push( i );
	}

	for( var i = 15000; i <= 50000; i += 5000 )
	{
		$scope.pricing_steps.push( i );
	}


	// In your controller
	$scope.slider = {
		value: 0,
		options: {
			stepsArray: $scope.pricing_steps,
			showSelectionBar: true,
			getSelectionBarColor: function( value )
			{
				if( $scope.next_item )
				{
					if( $scope.next_item.color == 'blue' )
						return '#2185d0';
					else if( $scope.next_item.color == 'green' )
						return '#21ba45';
					else if( $scope.next_item.color == 'purple' )
						return '#a333c8';
				}

				return '#db2828';
			}
		}
	};

	$scope.calculatePrice = function( t, e, i )
	{
		var price_data = {
			250: {
				requiresSales: !1,
				fixedPrices: {
					base: 45,
					variable: .4,
					base_pro: 27.45,
					variable_pro: .2
				},
				marginalPrices: {
					observe: {
						base: -45,
						variable: -.4,
						base_pro: -27.45,
						variable_pro: -.2
					},
					learn: {
						base: 4,
						variable: .3,
						base_pro: 2.45,
						variable_pro: .2
					},
					support: {
						base: 4,
						variable: .5,
						base_pro: 2.45,
						variable_pro: .3
					},
					engage: {
						base: 4,
						variable: .7,
						base_pro: 2.45,
						variable_pro: .4
					},
					acquire: {
						base: 4,
						variable: .6,
						base_pro: -3.66,
						variable_pro: .41
					},
					combination: {
						base: 12,
						variable: 1.5,
						base_pro: 7.35,
						variable_pro: .9
					}
				},
				variableLotSize: 50
			},
			1e3: {
				requiresSales: !1,
				fixedPrices: {
					base: 48,
					variable: 2.8,
					base_pro: 29,
					variable_pro: 1.7
				},
				marginalPrices: {
					observe: {
						base: -48,
						variable: -2.8,
						base_pro: -29,
						variable_pro: -1.7
					},
					learn: {
						base: 11,
						variable: .4,
						base_pro: 6.7,
						variable_pro: .2
					},
					support: {
						base: 13,
						variable: 1,
						base_pro: 7.9,
						variable_pro: .6
					},
					engage: {
						base: 15,
						variable: 2.4,
						base_pro: 9.1,
						variable_pro: 1.5
					},
					acquire: {
						base: 16,
						variable: .2,
						base_pro: 3.94,
						variable_pro: .13
					},
					combination: {
						base: 39,
						variable: 3.8,
						base_pro: 23.7,
						variable_pro: 2.3
					}
				},
				variableLotSize: 500
			},
			1e4: {
				requiresSales: !1,
				fixedPrices: {
					base: 70,
					variable: 34,
					base_pro: 42.7,
					variable_pro: 20.7
				},
				marginalPrices: {
					observe: {
						base: -70,
						variable: -34,
						base_pro: -42.7,
						variable_pro: -20.7
					},
					learn: {
						base: 15,
						variable: 7,
						base_pro: 9.1,
						variable_pro: 4.3
					},
					support: {
						base: 25,
						variable: 17,
						base_pro: 15.3,
						variable_pro: 10.4
					},
					engage: {
						base: 30,
						variable: 27,
						base_pro: 18.3,
						variable_pro: 16.5
					},
					acquire: {
						base: 38,
						variable: 4,
						base_pro: 23.18,
						variable_pro: 2.48
					},
					combination: {
						base: 70,
						variable: 51,
						base_pro: 42.7,
						variable_pro: 31.2
					}
				},
				variableLotSize: 5e3
			},
			5e4: {
				requiresSales: !0
			}
		}

		if( isNaN( parseInt( t, 10 ) ) || !e )
		{
			return s;
		}
		if( "observe" === e )
		{
			return 0;
		}
		var n = $scope.userTierForCount( t ),
			o = price_data[ n ],
			r = false;//this.get( "use_addon_pricing" );
		if( o.requiresSales )
		{
			return "custom";
		}
		var a = o.fixedPrices,
			l = o.marginalPrices[ e ],
			c = l.base,
			d = l.variable;
		r || (c += a.base, d += a.variable), i && (d += l.variable_pro, c += l.base_pro, r || (d += a.variable_pro, c += a.base_pro));
		var u = Math.ceil( (t - n) / o.variableLotSize );
		return 0 > u && (u = 0), Math.ceil(c + d * u)
	};

	$scope.userTierForCount = function( t )
	{
		return 1e3 >= t ? 250 : 1e4 >= t ? 1e3 : 5e4 >= t ? 1e4 : 5e4
	};

	$scope.$watch( 'slider.value', function( new_value, old_value )
	{
		var is_pro = $scope.active_plan == 'standard';

		$scope.price_per_month = $scope.calculatePrice( $scope.pricing_steps[ new_value ], 'acquire', is_pro );

	} );

	$scope.$watch( 'active_plan', function( new_value, old_value )
	{
		var is_pro = $scope.active_plan == 'standard';

		$scope.price_per_month = $scope.calculatePrice( $scope.pricing_steps[ $scope.slider.value ], 'acquire', is_pro );

	} );


} );