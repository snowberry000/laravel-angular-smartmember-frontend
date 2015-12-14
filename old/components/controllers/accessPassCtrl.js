app.controller('AccessPassesController', function ($scope, $localStorage, $site, $modal, Restangular, toastr) {
    $scope.template_data = {
        title: 'PASSES',
        description: 'Grant members access to your site\'s protected content.',
        singular: 'pass',
        edit_route: 'admin.site.membership.pass',
        api_object: 'pass'
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

app.controller('AccessPassController', function ($scope, $localStorage, Restangular, $access_pass, roles, toastr, $state) {
	$scope.access_pass = $access_pass;

    $scope.select2 = function() {
        $('[name=user_id]').select2();
    }

	$scope.page_title = $scope.access_pass.id ? 'Edit Pass' : 'Grant New Pass';
	if($scope.access_pass.id)
		$scope.access_pass.expired_at = moment($scope.access_pass.expired_at).toDate();
	$scope.roles = roles.items;
	$scope.dateOptions = {
        changeYear: true,
        formatYear: 'yy',
        startingDay: 1
    }

    $scope.format = 'yyyy-MM-dd';
    $scope.minDate = new Date();

    $scope.status = {
        opened: false
    };

     $scope.open = function(event) {
        $scope.status.opened = true;
    }

	$scope.save = function(){
		if ($scope.access_pass.id){
			$scope.update();
			$state.go("admin.site.membership.passes");

		}else{
            $scope.create();
        }
	}

	$scope.update = function(){
		$scope.access_pass.put().then(function(response){
            toastr.success("Changes saved!");
		})
	}

	$scope.create = function(){
		Restangular.service("pass").post($scope.access_pass).then(function(response){
            toastr.success("Access pass created!");
			$state.go("admin.site.membership.passes");
		});
	}
});

