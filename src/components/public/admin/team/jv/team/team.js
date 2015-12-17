var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.jv.team",{
			url: "/team/:id?",
			templateUrl: "/templates/components/public/admin/team/jv/team/team.html",
			controller: "AffiliateTeamController",
			resolve: {
				affiliates: function(Restangular, $site) {
					return Restangular.all('').customGET('affiliate?bypass_paging=true');
				},
				affiliate_team: function(Restangular,$stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliateTeam',$stateParams.id ).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
}); 

app.controller("AffiliateTeamController", function ($scope, $localStorage, Restangular, toastr, $state, affiliates, affiliate_team) {
	$scope.affiliate_team =  affiliate_team;
	$scope.affiliates = affiliates.items;

	for (var i = 0; i < $scope.affiliates.length; i++) {
	    $scope.affiliates[i]['affiliate_id'] = $scope.affiliates[i].id;
	};

	$scope.page_title = $scope.affiliate_team.id ? 'Edit Team' : 'Create Team';


	$scope.save = function(){
	    if ($scope.affiliate_team.id){
	        $scope.update();
	        return;
	    }
	    $scope.create();
	}

	$scope.ifAlreadyExists = function(affiliate){
	    var member = _.findWhere($scope.affiliate_team.members , {affiliate_id : affiliate.id});
	    if(member){
	        return true;
	    }
	    return false;
	}

	$scope.create = function(){
	    $scope.affiliate_team.site_id=$scope.site.id;
	    $scope.affiliate_team.company_id=$scope.site.company_id;
	    Restangular.service("affiliateTeam").post($scope.affiliate_team).then(function(response){
	        toastr.success("Team created!");
	        
	        $state.go("public.admin.team.jv.teams");
	    });
	}

	$scope.update = function(){
	    $members=[];
	    console.log($scope.affiliate_team.members);
	    if(($scope.affiliate_team.members.length>0)&&($scope.affiliate_team.members[0].id))
	    {
	        $members=$scope.affiliate_team.members.map(function(member){return member.affiliate_id.toString()});
	        $scope.affiliate_team.members=$members;
	    }
	    
	    $scope.affiliate_team.put().then(function(response){
	        toastr.success("Team saved!");
	       
	        $state.go("public.admin.team.jv.teams");
	    });
	}
});