var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations",{
			url: "/integrations",
			redirectTo: "admin.app.integrations.web",
			templateUrl: "/templates/components/admin/app/integrations/integrations.html",
			controller: "AdminAppIntegrationsController"
		})
}); 

app.controller("AdminAppIntegrationsController", function ($scope, RestangularV3, $rootScope) {
    RestangularV3.all('company/getCurrentCompany').customGET().then( function( response ) {
        $scope.current_company = response;
        $rootScope.current_company = response;
        $rootScope.page_title = "Integrations";
    } );
});

app.controller("AdminAppIntegrationsListController", function ($scope, RestangularV3, template_data) {
    $scope.template_data = template_data;
    $scope.loading = true;

    RestangularV3.all('integration').getList({type: template_data.type}).then( function( response ) {
        $scope.integrations = response;
        console.log('integrations: ', response );

        $scope.loading = false;
    } );
} );

app.controller("AdminAppIntegrationsConfigureController", function ($scope, RestangularV3, template_data, $stateParams, $state ) {
    $scope.template_data = template_data;

    if( $stateParams && $stateParams.id )
    {
        RestangularV3.one('integration', $stateParams.id ).get().then(function(response){
            $scope.current_integration = response;
            $scope.current_integration.id = $scope.current_integration._id;
        } );
    }
    else
    {
        $scope.current_integration = {
            type: template_data.type,
            disabled: 0
        }
    }

    $scope.save = function() {
        if( $stateParams && $stateParams.id )
        {
            $scope.current_integration.put().then( function( response ) {
                $scope.afterSave();
            } );
        }
        else
        {
            RestangularV3.all('integration').post( $scope.current_integration).then( function( response ) {
                $scope.afterSave();
            } );
        }
    }

    $scope.afterSave = function() {
        $state.go( $scope.template_data.list_route );
    }
} );