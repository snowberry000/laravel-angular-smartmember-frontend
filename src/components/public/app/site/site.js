var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.site", {
			views: {
				'site': {
					templateUrl: "/templates/components/public/app/site/site.html",
					controller: "AppSiteController"
				},
				'admin': {
					template: ""
				}
			}
		} )
} );

app.controller( "AppSiteController", function( $scope, $site, $rootScope )
{
	$scope.lights_off = false;
	$rootScope.site = $site;
	$scope.show_comment_reply_box = false;
	
	$scope.ToggleLights = function()
	{
		$scope.lights_off = !$scope.lights_off;
	};

	$scope.SetCommentReplyBoxVisibility = function( next_value )
	{
		$scope.show_comment_reply_box = next_value;
	};

	$scope.ShowCommentReplyBox = function( next_value )
	{
		$scope.SetCommentReplyBoxVisibility( next_value );
	}

	$scope.ToggleCommentReplyBox = function( next_value )
	{
		if( $scope.show_comment_reply_box )
			$scope.show_comment_reply_box = false;
		else
			$scope.show_comment_reply_box = next_value;
	}

} );