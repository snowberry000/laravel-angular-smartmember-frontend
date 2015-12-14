var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.membership.reporting",{
			url: "/reporting",
			templateUrl: "/templates/components/admin/site/membership/reporting/reporting.html",
			controller: "ReportingController",
			resolve: {
				$summary: function( Restangular, $site )
				{
					return Restangular.all( 'role' ).customGET( 'summary' );
				}
			}
		})
}); 

app.controller("ReportingController", function ($scope, $state, Restangular, $summary) {
	$scope.summary = $summary;
    $scope.series = ['Members'];
  
    $scope.charts = [];

     $scope.init = function () {
        $scope.charts[0] = {"data" : [[]], "labels" : []};

         if ($summary) {
            $.each($summary.members_overtime, function (key, data) {
                $scope.charts[0].data[0].push(data.members);
                $scope.charts[0].labels.push(data.month);
            });

        }
        $scope.charts[1] = {"data" : [[]], "labels" : []}
        $scope.charts[1].data[0] = [$summary.members_today, $summary.members_yesterday];
        $scope.charts[1].labels = ["Today", "Yesterday"];

        $scope.charts[2] = {"data" : [[]], "labels" : []}
        $scope.charts[2].data[0] = [$summary.members_this_week, $summary.members_last_week];
        $scope.charts[2].labels = ["Current", "Last"];

        $scope.charts[3] = {"data" : [[]], "labels" : []}
        $scope.charts[3].data[0] = [$summary.members_this_month, $summary.members_last_month];
        $scope.charts[3].labels = ["Current", "Last"];
    };

    $scope.colours = [{
          "fillColor": "rgba(0, 102, 0, 1)",
          "strokeColor": "rgba(207,100,103,1)",
          "pointColor": "rgba(220,220,220,1)",
          "pointStrokeColor": "#fff",
          "pointHighlightFill": "#fff",
          "pointHighlightStroke": "rgba(151,187,205,0.8)"
    }];

    $scope.chart_options = {
        "pointDot" : false
    };
});