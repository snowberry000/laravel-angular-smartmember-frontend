var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.member", {
			url: "/member/:id",
			templateUrl: "/templates/components/admin/app/member/member.html",
			controller: "MemberController"
		} )
} );

app.controller( "MemberController", function( $scope,RestangularV3, $state, $stateParams, $rootScope, Restangular )
{
	$scope.loading = false;
	$scope.next_item = {};
	$scope.tickets = [];
	$scope.pagination={current_page:1,total_count:0};
	$scope.emailActivities = [];
	// if( !$stateParams.id )
	// {
	// 	$state.go( 'admin.app.members' );
	// 	return;
	// }

	$scope.member_id = $stateParams.id;

	$scope.LoadUser = function()
	{
		$scope.loading = true;

		RestangularV3.one('member',$scope.member_id).get().then(function(response){
			$scope.next_item = response;
			$rootScope.page_title = ($scope.next_item.first_name != "" && $scope.next_item.first_name != undefined) ? $scope.next_item.first_name +' '+$scope.next_item.last_name : "People";
			$scope.loading = false;
			$scope.site_roles = [];
			if($scope.next_item.sites)
				$.each($scope.next_item.sites,function(key,value){
					$site_item = _.find($scope.next_item.sites_list, function($site_item){ return $site_item._id == key; });
					$scope.site_roles.push({roles: value.roles, site: $site_item});
				});
			// console.log($scope.site_roles);
			$scope.loadEmails();
			$scope.FetchTickets ();
			$scope.LoadUserImage();
		});

	}

	// $scope.LoadUserImage = function(){
	// 	if($scope.next_item.user_id)
	// 	RestangularV3.one('user/'+$scope.next_item.user_id).get().then(function(response){
	// 		$scope.fetchedUser = response;
	// 		//console.log("userid" + $scope.fetchedUser.userid);
	// 	});
	// }

	$scope.loadEmails = function(){
		RestangularV3.all('').customGET('queue_message',{email:$scope.next_item.email}).then(function(response){
			$scope.emailActivities = _.filter(response , function(emailAct){
			 if(emailAct.message)
			 	return true;
			 else
			 	return false;
			});
		});
	}

	$scope.FetchTickets = function()
	{
		//$scope.loading = true;
		var search_parameters = {
			p: $scope.pagination.current_page,
			user_email: $scope.next_item.email
		}

		if( $scope.ticket_query )
		{
			search_parameters.q = $scope.ticket_query;
		}

		if( $scope.sites && $scope.sites.length > 0 )
		{
			search_parameters.sites = $scope.sites.join( ',' );
		}

		RestangularV3.all( '' ).customGET( 'ticket', search_parameters ).then( function( response )
		{
			$scope.tickets[ $scope.pagination.current_page ] = response.items;
			$scope.pagination.total_count = response.count;
			$scope.loading = false;
		} );
	}

	$scope.deleteMember =function(){
		swal({   
				title: "Delete Member",   
				text: ($scope.next_item.first_name+$scope.next_item.last_name) ? "Are you sure, you want to delete "+$scope.next_item.first_name+" "+$scope.next_item.last_name : "Are you sure, you want to delete "+$scope.next_item.email,   
				type: "warning",
				confirmButtonText: "Yes, delete it!", 
				cancelButtonText: "cancel!",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(isConfirm){ 
				if(isConfirm)
				{
					RestangularV3.all( 'member' ).customDELETE( $scope.next_item._id ).then( function()
					{
						$state.go("admin.app.members",{"segment":"all-members"});
					} );
				}
		});

	}

	$scope.subMember = function(){

		swal({   
				title: "subscribe Member",   
				text: ($scope.next_item.first_name+$scope.next_item.last_name) ? "Are you sure, you want to subscribe "+$scope.next_item.first_name+" "+$scope.next_item.last_name : "Are you sure, you want to unsubscribe "+$scope.next_item.email,   
				type: "warning",
				confirmButtonText: "Yes, subscribe it!", 
				cancelButtonText: "cancel!",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(isConfirm){ 
				if(isConfirm)
				{
					$cloned = angular.copy($scope.next_item);
					$cloned.unsubscribe = false;
					RestangularV3.all( "member" ).customPUT( $cloned, $scope.next_item._id ).then(function(response){
						$scope.next_item.unsubscribe = false;
					});
				}
			});
	}

	$scope.unsubMember = function(){

		swal({   
				title: "Unsubscribe Member",   
				text: ($scope.next_item.first_name+$scope.next_item.last_name) ? "Are you sure, you want to unsubscribe "+$scope.next_item.first_name+" "+$scope.next_item.last_name : "Are you sure, you want to unsubscribe "+$scope.next_item.email,   
				type: "warning",
				confirmButtonText: "Yes, unsubscribe it!", 
				cancelButtonText: "cancel!",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(isConfirm){ 
				if(isConfirm)
				{
					$cloned = angular.copy($scope.next_item);
					$cloned.unsubscribe = true;

					RestangularV3.all( "member" ).customPUT( $cloned, $scope.next_item._id ).then(function(response){
						$scope.next_item.unsubscribe = true;
					});
				}
			});
	}
	$scope.LoadUser();
} );