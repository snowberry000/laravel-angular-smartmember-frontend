var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.emails",{
			url: "/emails",
			templateUrl: "/templates/components/public/app/admin/email/emails/emails.html",
			controller: "EmailsController"
		})
}); 

app.controller("EmailsController", function ($scope,smModal,$rootScope, $localStorage,$state,  Restangular, toastr ) {

	var access =null;
	$site=$rootScope.site;
	$user=$rootScope.user;
	$scope.loading=true;
	console.log('user: ');
	console.log($user)
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{

		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );


	// $scope.initialize=function()
	// {
	// 	$params = {'p':$scope.pagination.current_page};
	// 	Restangular.all('email').getList($params).then(function(response){
	// 		emails=response;
	// 		$scope.pagination.total_count = response.total_count;
	// 		$scope.loading=false;
	// 		$scope.emails=emails;
	// 		var access = $scope.hasAccess($user.role);
	// 		if($state.current.name.split('.')[1]=='smartmail'){
	// 		    console.log(access)
	// 		    if(!access ){
	// 		    	smModal.Show('public.administrate.account.memberships');
	// 		    }
	// 		}
	// 	});
	// 	$scope.query = '';
	// }


	

	

	$scope.hasAccess=function(role)
	{
	    if( typeof role == 'undefined' )
	        role = $user.role;

	    for (var i = role.length - 1; i >= 0; i--) {
	        var Manager = _.findWhere(role[i].type ,{role_type : 3});
	        if( !Manager )
	            Manager = _.findWhere(role[i].type ,{role_type : "3"});
	        var Owner = _.findWhere(role[i].type ,{role_type : 2});
	        if( !Owner )
	            Owner = _.findWhere(role[i].type ,{role_type : "2"});
	        var PrimaryAdmin = _.findWhere(role[i].type ,{role_type : 1});
	        if( !PrimaryAdmin )
	            PrimaryAdmin = _.findWhere(role[i].type ,{role_type : "1"});
	        if(Manager || Owner || PrimaryAdmin){
	            return true;
	        }
	    }
	    return false;
	}

	
	$scope.paginate = function()
	{
		console.log($scope.emails);
		console.log(typeof $scope.emails);
		
			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( 'email' + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				var access = $scope.hasAccess($user.role);
				if($state.current.name.split('.')[1]=='smartmail'){
				    console.log(access)
				    if(!access ){
				    	$state.go('public.administrate.account.memberships');
				    }
				}
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.emails = Restangular.restangularizeCollection( null, data.items, 'email');
			} );
		
	}

	// $scope.paginate =function()
	// {
	//     if(!$scope.blockCalls&&!$scope.processingCall)
	//     {
	//         $scope.processingCall=true;
	//         $params = {'p':++$scope.pagination.current_page, company_id: $site.company_id};
	        
	//         if ($scope.query) {
	//             $params.q = $scope.query;
	//         }

	//         Restangular.all('email').getList($params).then(function($response){
	//             $scope.emails=$scope.emails.concat($response);
	//             if($response.length==0)
	//                 $scope.blockCalls=true;
	//             $scope.processingCall=false;
	//         });
	//     }
	//     else
	//         return;
	// }

	$scope.search= function()
	{
	    
	    $scope.emails = [];
	    $scope.currentPage = 0;
	    var $params = { company_id: $site.company_id , p : ++$scope.currentPage};

	    if ($scope.query){
	        $params.q = $scope.query;
	    }

	    Restangular.all('email').getList($params).then(function(data){
	        for (var i = data.length - 1; i >= 0; i--) {
	            var match = _.findWhere($scope.emails ,{id : data[i].id});
	            if(!match)
	                $scope.emails.push(data[i]);
	        };
	        if(data.length==0) {
	            $scope.emails = [];
	            $scope.blockCalls = true;
	        } else {
	            $scope.blockCalls = false;
	        }
	        
	    } , function(error){
	        $scope.emails = [];
	    })
	}

	$scope.formatDate = function ($unformattedDate){
	    return moment($unformattedDate).format("ll");
	}

	$scope.copyToClipBoard = function ($url) {
	    $uri = 'http://' + $scope.$location.host()+'/register/'+$url;
	    return $uri;
	}

	$scope.deleteResource = function (email_id) {
        var emailWithId = _.find($scope.emails, function (email) {
            return email.id === parseInt(email_id);
        });

        emailWithId.remove().then(function () {
            $scope.emails = _.without($scope.emails, emailWithId);
        });
	};

	$scope.paginate();
});