var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.emails",{
			url: "/emails",
			templateUrl: "/templates/components/public/administrate/team/email/emails/emails.html",
			controller: "EmailsController"
		})
}); 

app.controller("EmailsController", function ($scope,smModal,$rootScope, $localStorage,$state,  Restangular, toastr ) {

	var access =null;
	$site=$rootScope.site;
	$user=$rootScope.user;
	console.log('user: ');
	console.log($user)
	$scope.initialize=function()
	{
		Restangular.all('email').getList().then(function(response){
			emails=response;
			$scope.emails=emails;
			var access = $scope.hasAccess($user.role);
			if($state.current.name.split('.')[1]=='smartmail'){
			    console.log(access)
			    if(!access ){
			    	smModal.Show('public.administrate.account.memberships');
			    }
			}
		});
		$scope.blockCalls=false;
		$scope.processingCall=false;
		
		$scope.query = '';
		$scope.currentPage = 1;
	}


	

	

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

	

	$scope.loadMore =function()
	{
	    if(!$scope.blockCalls&&!$scope.processingCall)
	    {
	        $scope.processingCall=true;
	        $params = {'p':++$scope.currentPage, company_id: $site.company_id};
	        
	        if ($scope.query) {
	            $params.q = $scope.query;
	        }

	        Restangular.all('email').getList($params).then(function($response){
	            $scope.emails=$scope.emails.concat($response);
	            if($response.length==0)
	                $scope.blockCalls=true;
	            $scope.processingCall=false;
	        });
	    }
	    else
	        return;
	}

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

	$scope.initialize();
});