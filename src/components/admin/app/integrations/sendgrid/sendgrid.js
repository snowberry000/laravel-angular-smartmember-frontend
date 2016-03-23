var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.sendgrid",{
			url: "/sendgrid",
			templateUrl: "/templates/components/admin/app/integrations/sendgrid/sendgrid.html",
			controller: "SendgridController"
		})
}); 

app.controller("SendgridController", function ($scope , $rootScope , toastr , RestangularV3) {

	$scope.save = function() {
	    if( $rootScope.current_company && $rootScope.current_company.sendgrid && $rootScope.current_company.sendgrid._id)
	    {
	        RestangularV3.all('integration').customPUT($rootScope.current_company.sendgrid , $rootScope.current_company.sendgrid._id).then(function(response){
	        	console.log(response);
	        	$rootScope.current_company.sendgrid = response;
	        	toastr.success("Sendgrid credentials saved");
	        })
	    }
	    else
	    {
	    	var sendgrid = $rootScope.current_company.sendgrid;
	    	sendgrid.company_id = $rootScope.current_company._id;
	    	sendgrid.type = 'sendgrid';
	        RestangularV3.all('integration').post( sendgrid).then( function( response ) {
	        	$rootScope.current_company.sendgrid = response;
	            toastr.success("Sendgrid credentials saved");
	        } );
	    }
	}

});