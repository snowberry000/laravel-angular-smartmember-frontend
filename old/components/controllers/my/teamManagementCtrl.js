app.controller('TeamManagementParentController', function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, notify) {
    if($rootScope.is_not_allowed){
        $state.go('admin.team.dashboard');
        return false;
    }
});


app.controller('TeamMembersController', function ($scope, $modal , $rootScope, $state, $localStorage, $location, Restangular, notify, $user) {

    $scope.sortOrder = 'created_at:DESC';
    $scope.loading=true;


    $scope.role_types = [
        null,
        'Primary Owner',
        'Owner',
        'Manager',
        'Admin',
        'Agent',
        'Member'
    ];

    $scope.template_data = {
        title: 'TEAM_MEMBERS',
        description: 'Invite employees, partners, and assistants to help manage your team',
        singular: 'team member',
        edit_route: '',
        api_object: 'teamRole'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){
        $scope.loading-false;

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) + ( $scope.sortOrder ? '&order_by=' + $scope.sortOrder : '' ) ).then(function (data) {
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
        var $params = { p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        if ($scope.access_level){
            $params.access_level = $scope.access_level;

            if ($scope.access_level_status) {
                $params.access_level_status = $scope.access_level_status;
            }
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) + ( $scope.sortOrder ? '&order_by=' + $scope.sortOrder : '' ) ).then(function(data){
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

    $scope.highestRoleTypeName = function(member) {
        return $scope.role_types[ member.role ];
    }

    $scope.userPrivilegeLevel = function(){
        var highest = 6;
        angular.forEach($user.role, function(val,key){
            if( typeof val.company_id != 'undefined' && val.company_id != null && parseInt( val.company_id ) != 0 && parseInt( val.type[0].role_type ) < highest )
                {
                    highest = parseInt( val.type[0].role_type );
                }
        } , highest);

        return highest
    };
    

     $scope.isRole = function( member, role ) {
         if( parseInt( member.role ) == parseInt( role ) )
            return true;
         else
            return false;
     }

    $scope.toggleRole = function(member,new_role) {
        $scope.user_info = {password : ''}
        if( typeof new_role == 'undefined' || member.role == new_role )
            new_role = 6;

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/verifyPassword.html',
            controller: "modalController",
            windowClass: 'small-modal',
            scope: $scope,
        });
        modalInstance.result.then(function (entity) {
            Restangular.all("teamRole/verifyPassword").post({password : $scope.user_info.password}).then(function(response){
                Restangular.all('teamRole/updateRole').post({role: new_role, id : member.id}).then(function(response){
                    member.role = new_role;
                }
            )
        })
        });
    }
});

app.controller('InviteMembersController', function ($scope,toastr, $state, $localStorage, $rootScope, $location, Restangular, notify , $user) {
	$scope.team_members = {};
	$scope.save = function() {
	    Restangular.one("teamRole").customPOST($scope.team_members, 'import').then(function(response) {
            // notify({
            //         message:"Import was successful",
            //         classes: 'alert-success',
            //         templateUrl : 'templates/modals/notifyTemplate.html'
            //     });
            toastr.success("Import was successful!");
	        $state.go('admin.team.members');
	    });
	}
	$scope.$watch('current_company' , function(current_company){
		if(current_company){
			$scope.role = $scope.getRole($user.role , current_company.id)
			console.log($scope.role)
		}
	})
	$scope.getRole = function(role , company_id){
	    for (var i = role.length - 1; i >= 0; i--) {
	        if(role[i].company_id == company_id){
	        	return role[i].type[0].role_type;
	        }
	    };
	    return 3;
	}

});





