var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.site.appearance.widgets", {
			url: "/widgets",
			templateUrl: "/templates/components/public/admin/site/appearance/widgets/widgets.html",
			controller: "WidgetsController"
		} )
} );

app.controller( "WidgetsController", function( $scope, $rootScope, $state, $http, Restangular, toastr, $ocLazyLoad, $timeout )
{

	$site = $rootScope.site;
	$ads = null;
    $scope.sidebar_id = 1;

	$scope.init = function()
	{
		Restangular.all( 'widget' ).getList( { site_id: $site.id, sidebar_id: $scope.sidebar_id } ).then( function( response )
		{
            angular.forEach( response, function(value, key) {
                value.meta = {};

                angular.forEach( value.meta_data, function(value2, key2 ) {
                    value.meta[ value2.key ] = value2.value;
                });
            });

			$scope.widgets = response;
		} );
	}

    $scope.save = function(widget){
        if( widget.id ) {
            widget.put().then(function(response){

            });
        } else {
            Restangular.all('widget').customPOST(widget).then(function(response){
                widget.id = response.id;
            })
        }
    };

    $scope.delete = function(widget){
        if( widget.id ) {
            widget.remove().then(function(){
                $scope.widgets = _.without( $scope.widgets, widget );
            })
        } else {
            $scope.widgets = _.without( $scope.widgets, widget );
        }
    };

	$scope.dropCallback = function(widget, index){
        console.log('we do have some things...', $scope.widgets );

        var new_order = {};
        var count = 1;

        angular.forEach( $scope.widgets, function(value){
            if( value.id ) {
                new_order[value.id] = count;
                count++;
            }
        });

        Restangular.all('widget').customPOST({order: new_order}, 'updateOrder').then(function(){
            console.log( 'new order saved');
        });
    }

	$scope.init();
} );