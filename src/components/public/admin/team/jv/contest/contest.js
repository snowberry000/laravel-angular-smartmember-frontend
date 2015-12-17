var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.jv.contest",{
			url: "/contest/:id?",
			templateUrl: "/templates/components/public/admin/team/jv/contest/contest.html",
			controller: "ContestController",
			resolve: {
				contest : function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliateContest', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
}); 

app.controller("ContestController", function ($scope, $filter,Upload, $localStorage, Restangular, toastr, $state, contest) {

	$scope.contest = contest;

	if(!$scope.contest.type)
	    $scope.contest.type="sales";

	console.log(contest);
	$scope.dateOptions = {
	    changeYear: true,
	    formatYear: 'yy',
	    startingDay: 1
	}
	$scope.contest.id ? $scope.page_title = 'Edit contest' : $scope.page_title = 'Create contest';

	$scope.format = 'MM/dd/yy';
	$scope.minDate = new Date();
	$scope.contest.start_date=new Date(moment.utc(contest.start_date));
	$scope.contest.end_date=new Date(moment.utc(contest.end_date));
	$scope.status = {
	    opened: [false, false]
	};

	
	$scope.imageUpload = function(files){

	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: $scope.app.apiUrl + '/utility/upload',
	            file: file
	        })
	            .success(function (data, status, headers, config) {
	                var editor = $.summernote.eventHandler.getModule();
	                file_location = '/uploads/'+data.file_name;
	                editor.insertImage($scope.editable, data.file_name);
	            }).error(function (data, status, headers, config) {
	                console.log('error status: ' + status);
	            });
	    }
	};

	$scope.selectAll = function()
	{

	    if ($scope.isChecked) {
	        contest.sites = $sites.public.admin.sites;
	    }
	    else
	        contest.sites = [];
	}
	
	$scope.isAlreadythere=function($subdomain)
	{

	    if ($scope.isChecked) return true;

	    for(var i=0;i<contest.sites.length;i++)
	    {
	        if(contest.sites[i].subdomain==$subdomain)
	            return true;
	    }
	    return false;
	}
	$scope.open = function(event, id) {
	    $scope.status.opened[id] = true;
	}

	Restangular.all('site').customGET('members').then(function(response) {
	    $sites = response;
	    $scope.sites = response.admin;
	});

	$scope.save = function(){

	    if($scope.contest.sites){
	        for(var i=0;i<$scope.contest.sites.length;i++){
	            if($scope.contest.sites[i].id)
	            {
	                $scope.contest.sites[i]=$scope.contest.sites[i].id.toString();
	            }
	        }
	    }
	    if ($scope.contest.id){
	        
	        $scope.update();
	        return;
	    }
	    $scope.create();
	}

	$scope.imageUpload = function(files){

	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: $scope.app.apiUrl + '/utility/upload',
	            file: file
	        })
	            .success(function (data, status, headers, config) {
	                console.log(data.file_name);
	                console.log("uploaded");
	                var editor = $.summernote.eventHandler.getModule();
	                file_location = '/uploads/'+data.file_name;
	                editor.insertImage($scope.editable, data.file_name);
	            }).error(function (data, status, headers, config) {
	                console.log('error status: ' + status);
	            });
	    }
	}

	$scope.update = function(){
	    $scope.contest.put().then(function(response){
	        toastr.success("Changes saved!");
	        $state.go("public.admin.team.jv.contests");
	    });
	}

	$scope.setPermalink = function ($title) {
	    if (!$scope.contest.permalink)
	    {
	        $scope.contest.permalink ="leaderboard-" + $filter('urlify')($title);
	    }
	    
	}


	$scope.create = function(){
	    Restangular.service("affiliateContest").post($scope.contest).then(function(response){
	        toastr.success("Changes saved!");
	        $state.go("public.admin.team.jv.contests");
	    });
	}
});