var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.appearance.stats",{
			url: "/stats",
			templateUrl: "/templates/components/public/admin/site/appearance/stats/stats.html",
			controller: "StatsController",
			resolve: {
				$ad: function( Restangular, $site )
				{
					return Restangular.all( 'siteAds' ).getList( { site_id: $site.id } );
				},
				loadPlugin: function ($ocLazyLoad) {
				    return $ocLazyLoad.load([
				        {
				            name: 'angular-flot'
				        }
				    ]);
				}
			}
		})
}); 

app.controller("StatsController", function ($scope, $ad) {
	$scope.ad = $ad[0];
	$scope.ads = $ad;

    angular.forEach( $scope.ads, function(value){
        value.views = parseInt( value.views );
        value.clicks = parseInt( value.clicks );
    });

	$scope.views = 0;
	$scope.clicks = 0;

	/*var options = {
	    segmentShowStroke : true,
	    segmentStrokeColor : "#fff",
	    segmentStrokeWidth : 2,
	    percentageInnerCutout : 45, // This is 0 for Pie charts
	    animationSteps : 100,
	    animationEasing : "easeOutBounce",
	    animateRotate : true,
	    animateScale : false
	};*/

	var options = {
	    series: {
	        pie: {
	            show: true,
	            radius : 100
	        }
	    }
	}

	if ($ad)
	{
	    $.each($scope.ads, function(key, value)
	    {
	        //$scope.charts.data[0].push( [value.views, value.clicks] );
	        $scope.views += value.views;
	        $scope.clicks += value.clicks;
	    });
	}
	if ($ad[0]) {
	    $scope.charts = {"data" : [{label :"views" , data : $scope.views} , {label :"clicks" , data : $scope.clicks}], "options" : options};
        console.log( 'chart data: ', $scope.charts );
	    $scope.labels = ["View", "Clicks"];
	    $scope.ad.views = $scope.views;
	    $scope.ad.clicks = $scope.clicks;
	} else {
	    $scope.ad = {};
	    $scope.ad.views = 0;
	    $scope.ad.clicks = 0;
	}
});