var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.integrations.paypal",{
			url: "/paypal",
			template: '<ui-view></ui-view>'
		})
        .state("admin.app.integrations.paypal.configure",{
            url: "/configure/:id?",
            templateUrl: "/templates/components/admin/app/integrations/paypal/paypal.html",
            controller: "AdminAppIntegrationsConfigureController",
            resolve: {
                template_data: function() {
                    return {
                        type: 'paypal',
                        list_route: 'admin.app.integrations.paypal.list'
                    };
                }
            }
        })
        .state("admin.app.integrations.paypal.list",{
            url: "/list",
            templateUrl: "/templates/components/admin/app/integrations/list.html",
            controller: "AdminAppIntegrationsListController",
            resolve: {
                template_data: function() {
                    return {
                        type: 'paypal',
                        title: 'Paypal',
                        edit_route: 'admin.app.integrations.paypal.configure',
                        integration_label: 'Paypal account'
                    };
                }
            }
        })
});