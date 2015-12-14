var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.wizard",{
			url: "/wizard/:id",
			templateUrl: "/templates/components/admin/team/wizard/wizard.html",
			controller: "TeamWizardController",
			resolve: {
			    $nodes : function(Nodes){
			        return Nodes.GetAll();
			    },
			    $wizard: function( TeamWizards , $stateParams){
			        return TeamWizards.GetCurrent($stateParams.id);
			    },
			    $company : function(Restangular , $stateParams){
			        return Restangular.one('company/getUsersCompanies').get();
			    },
			    $wizard_server : function( Restangular , $stateParams , $company){
			        return Restangular.all('wizard').customGET('',{slug :$stateParams.id , company_id : $company.id})
			    }
			}
		})
}); 

app.controller("TeamWizardController", function ($scope, $rootScope, $location,$stateParams, $filter, $state, $company, $http, $user, $localStorage, $modal, Restangular, $wizard, $nodes , $wizard_server ,toastr ) {
	$scope.static_wizard = $wizard;
    $rootScope.wizard = [];
    if($scope.static_wizard && $scope.static_wizard.nodes){
        angular.forEach($nodes , function(value , key){
            if($scope.static_wizard.nodes.indexOf(value.slug) >= 0)
                $rootScope.wizard.push(value);
        })
    }
    $rootScope.wizard_server = $wizard_server && $wizard_server.length ? $wizard_server[0] : {completed_nodes : []} ;
	$rootScope.parent_wizard = $scope;
	$rootScope.$user = $user;
	$rootScope.current_company_changed = -1;
	$scope.wizard_completed = false;
	$scope.id = 0;
	if( $rootScope.wizard_server )
	{
		$rootScope.company = _.find( $company.companies, { selected: 1 } );

		if( $rootScope.wizard_server.is_completed )
		{
            if( $rootScope.wizard_server.completed_nodes ) {
            	if(typeof $rootScope.wizard_server.completed_nodes == "string")
                	$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split(',');
                angular.forEach($rootScope.wizard_server.completed_nodes, function (value, key) {
                    var step = _.findWhere($rootScope.wizard, {slug: value});
                    if( step )
                        step.completed = true;
                });

                $scope.wizard_completed = true;
            }
            else
            {
                $rootScope.wizard_server.completed_nodes = [];
            }
		}
		else
		{
            if( $rootScope.wizard_server.completed_nodes ) {
            	if(typeof $rootScope.wizard_server.completed_nodes == "string")
                	$rootScope.wizard_server.completed_nodes = $rootScope.wizard_server.completed_nodes.split(',');
                angular.forEach( $rootScope.wizard_server.completed_nodes, function( value, key ){
                    var step = _.findWhere( $rootScope.wizard, {slug: value} );

                    step.completed = true;
                } );
            }
            else
            {
                $rootScope.wizard_server.completed_nodes = [];
            }

            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

			if( first_incomplete_step )
			{
				$scope.wizard_completed = false;
				$rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
			}
		}

	}

	$scope.cancel = function(node){
        if(node){
            node.HideBox(node);
        }
    }

    $scope.back = function(){
        $state.go('admin.team.wizards');
        return;
    }

	$scope.next = function( current, node, redirect_url )
	{
		current = parseInt( current );

		if( node )
		{
			console.log(node)
			node.HideBox( node );
		}
		$rootScope.wizard[ current ].completed = true;
		var next = $rootScope.wizard[ current ];
		var params = {slug : $stateParams.id , company_id : $rootScope.company.id};

        if( !$rootScope.wizard_server.completed_nodes || typeof $rootScope.wizard_server.completed_nodes != 'object' )
            $rootScope.wizard_server.completed_nodes = [];

        if( $rootScope.wizard_server.completed_nodes.indexOf( $rootScope.wizard[ current ].slug ) == -1 ){
            $rootScope.wizard_server.completed_nodes.push( $rootScope.wizard[ current ].slug );
        }

        var completed_nodes = $rootScope.wizard_server.completed_nodes.join(',');

        params.completed_nodes = completed_nodes;

        var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

		if( !first_incomplete_step )
		{
			$scope.wizard_completed = true;
			params.is_completed = 1;
		}
		else
		{
			params.is_completed = 0;
		}

		if($rootScope.wizard_server.id){
            Restangular.all("wizard").customPUT( params , $rootScope.wizard_server.id).then( function( response ){
            if(!params.is_completed){
                $rootScope.current_changed = current + 1;
            }else{
                $scope.wizard_server.is_completed = true;
            }
            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

            if( first_incomplete_step )
            {
                $rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
            }
				if (redirect_url != undefined)
					window.location.href = redirect_url;
            })
        }else{
            Restangular.all("wizard").post( params).then( function( response ) {
            if(!params.is_completed){
                $rootScope.current_changed = current + 1;
            }else{
                $scope.wizard_server.is_completed = true;
            }
            var first_incomplete_step = _.findWhere( $rootScope.wizard, {completed: false} );

            if( first_incomplete_step )
            {
                $rootScope.current_changed = $rootScope.wizard.indexOf( first_incomplete_step );
            }
				if (redirect_url != undefined)
					window.location.href = redirect_url;
        });
        }
	}
});