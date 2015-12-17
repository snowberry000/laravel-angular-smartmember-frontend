var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.wizards",{
			url: "/wizards",
			templateUrl: "/templates/components/public/admin/team/wizards/wizards.html",
			controller: "TeamWizardsController",
			resolve: {
			    $wizards: function( TeamWizards ){
			        return TeamWizards.GetAll();
			    },
			    $wizards_server : function( Restangular , $company){
			        return Restangular.all('wizard').customGET('',{is_completed : 1 , company_id : $company.id})
			    },
			    $company : function(Restangular , $stateParams){
			        return Restangular.one('company/getUsersCompanies').get();
			    }
			}
		})
}); 

app.controller("TeamWizardsController", function ($scope, $rootScope , $location , $state , $site , $filter , $http ,$user , $localStorage, $modal, Restangular,$wizards, $wizards_server , toastr) {
	$rootScope.wizards = $wizards;
	$rootScope.wizards_server = $wizards_server;
	//$rootScope.parent_wizard = $scope;
	var wizards = _.pluck($wizards_server , 'slug');
	if(wizards && $rootScope.wizards){
	    angular.forEach($rootScope.wizards , function(value , key){
	        if(wizards.indexOf(value.slug) >= 0){
	            value.completed = true;
	        }
	    })
	}
	
	$scope.open = function(wizard){
	    $state.go('public.admin.team.wizard' , {'id' : wizard.slug});
	}
});