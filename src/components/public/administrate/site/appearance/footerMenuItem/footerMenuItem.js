var app = angular.module("app");

app.config(function($stateProvider){
    $stateProvider
        .state("public.administrate.site.appearance.footerMenuItem",{
            url: "/footerMenu/:id?",
            templateUrl: "/templates/components/public/administrate/site/appearance/footerMenuItem/footerMenuItem.html",
            controller: "MenuItemModalInstanceCtrl",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }

            }
        })
});