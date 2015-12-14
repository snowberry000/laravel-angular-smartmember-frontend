
app.controller('adminTransactionController', function ($scope, $localStorage,$site, Restangular,toastr) {
    $scope.template_data = {
        title: 'TRANSACTIONS',
        description: 'Transactions are each sale / refund processed through this site by customers',
        singular: 'transaction',
        edit_route: '',
        api_object: 'transaction'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }

    $scope.delete = function (id) {

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return id
                }
            }

        });
        modalInstance.result.then(function () {
            var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
                return next_item.id === id;
            });

            itemWithId.remove().then(function () {
                $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
            });
        })
    };
});


app.controller('adminPaymentGatewaysController', function ($scope, $localStorage,$site, Restangular,toastr) {
	if (_.findWhere($scope.site.integration,{type: 'stripe'})){
		$scope.stripe_integrated = true;
	}

	$scope.copied = function()
	{
        toastr.success("Link copied!");
	}
});

app.controller('adminRevenueSummaryController', function ($scope,$summary, $localStorage,$site, Restangular) {
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

app.controller('adminWallboardController', function ($scope, $localStorage, $site , $state ,Restangular) {
    if(!$site.is_admin){
        $state.go('admin.account.memberships');
        return;
    }

    $scope.wallboard = {};
    $scope.loading = true;

    $scope.refreshData = function(){
        Restangular.all( 'transaction' ).customGET( 'summary').then(function(response){
            $scope.wallboard = response;
            $scope.loading = false;
        });
    }

    $scope.refreshData();

    var data_fetch = setInterval(function(){
        $scope.refreshData();
    }, 30000);
});


