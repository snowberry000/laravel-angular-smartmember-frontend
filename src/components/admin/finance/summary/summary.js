var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.finance.summary",{
			url: "/summary",
			templateUrl: "/templates/components/admin/finance/summary/summary.html",
			controller: "SummaryController",
			resolve: {
				$summary: function( Restangular, $site )
				{
					return Restangular.all( 'transaction' ).customGET( 'summary' );
				}
			}
		})
}); 

app.controller("SummaryController", function ($scope,$summary, $localStorage,$site, Restangular) {
		$scope.summary = $summary;
		$scope.summary.sales_ratio = 0.0;
		$scope.summary.refunds_ratio = 0.0;
		$scope.summary.sales_percentage = 0.0;
		$scope.summary.refunds_percentage = 0.0;

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

	    $scope.charts = [];

		$scope.init = function() {
			if ($scope.summary) {

				if ($scope.summary.number_of_sales != 0 && $scope.summary.number_of_refunds != 0) {
					$scope.summary.sales_ratio = $scope.summary.number_of_sales / $scope.summary.number_of_refunds * 100.0;
					$scope.summary.refunds_ratio = $scope.summary.number_of_refunds / $scope.summary.number_of_sales * 100.0;
					$scope.summary.sales_percentage = $scope.summary.number_of_sales / ($scope.summary.number_of_sales + $scope.summary.number_of_refunds) * 100;
					$scope.summary.refund_percentage = $scope.summary.number_of_refunds / ($scope.summary.number_of_sales + $scope.summary.number_of_refunds) * 100;

				}

				$scope.charts[0] = {"data" : [[]], "labels" : []};

				$.each($summary.sales_data, function (key, data) {
	                $scope.charts[0].data[0].push(data.sales);
	                $scope.charts[0].labels.push(data.month + "/" + data.day);
	            });
	        }
		}	
});