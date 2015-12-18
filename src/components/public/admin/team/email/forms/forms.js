var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.email.forms",{
			url: "/forms",
			templateUrl: "/templates/components/public/admin/team/email/forms/forms.html",
			controller: "EmailFormsController",
			resolve: {
				emailLists : function(Restangular, $site) {
					return Restangular.all('emailList').getList();
				},
				$sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				loadPlugin: function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'ui.codemirror'
						}
					]);
				}

			}
		})
}); 

app.controller("EmailFormsController", function ($scope, $rootScope, $localStorage, Restangular, toastr, $state, emailLists, $site, Upload, $sites) {

    $scope.site_options = {};
    $scope.emailLists = emailLists;
    $scope.emailListId = emailLists[0];
    $scope.site_options.isOpen = false;
    $scope.site_options.redirect_url = '';
    $scope.url = $scope.app.apiUrl + '/optin';
    $scope.myForm = '';
    $scope.sites = $sites.sites;
    $scope.show_name_input = true;
    $scope.editorOptions2 = {
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
	    mode: 'htmlmixed'
    };



    $scope.copied = function()
    {
        toastr.success("Link copied");
    }

    $scope.setForm = function()
    {
        var site_id = $scope.site_id ? $scope.site_id.id : undefined;
        if ($scope.turn_optin && site_id == undefined)
        {
            toastr.warning("Please choose which site you want to turn optins to members");
            return;
        }
        //swapping out the redirect url to just be a text box for now since this is at the team level, we don't know what site this is for
        //var redirect_url = $scope.site_options.redirect_url.indexOf( 'http://' ) == -1 && $scope.site_options.redirect_url.indexOf( 'https://' ) == -1 ? 'http://' + ( $scope.app.domain == $scope.app.rootDomain ? $scope.app.subdomain + '.' + $scope.app.domain : $scope.app.domain ) + '/' + $scope.site_options.redirect_url : $scope.site_options.redirect_url;
        $scope.myForm = '<form action="' + $scope.url + '" method="get">' +
            '<input type="hidden" name="list" value="' + $scope.emailListId.id + '">' +
            '<input type="hidden" name="team" value="' + $scope.emailListId.company_id + '">' +
            '<input type="hidden" name="redirect_url" value="' + $scope.site_options.redirect_url + '">';
        if ($scope.show_name_input)
            $scope.myForm += '<input name="name" type="text" placeholder="Your Name">';
        if ($scope.turn_optin)
            $scope.myForm += '<input type="hidden" name="site_id" value="' + site_id + '">';
        $scope.myForm += '<input name="email" type="email" placeholder="Email address">' +
            '<button type="submit">Subscribe</button><br>' +
            '</form>';
    }

    $scope.createNewList = function(){

        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/emailListCreator.html',
            controller: function($scope,$uibModalInstance){
                $scope.save = function(list){
                    console.log(list);
                    $uibModalInstance.close($scope.list);
                }
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            scope: $scope
        });
        modalInstance.result.then(function (list) {
            Restangular.service('emailList').post(list)
                .then(function(response){
                    $scope.emailListId = response;
                    $scope.emailLists.push(response);
                });
        })
    }

    $scope.selectUrl = function(item , selected_url , show_next){

        var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle', 'bridgePage'];
        if(!selected_url)
            return;
        if(api_resources.indexOf(selected_url)<0)
        {
            $scope.site_options.redirect_url = selected_url;
            $scope.show_next = show_next;
            $scope.site_options.isOpen = false;
        }
        else if(selected_url == 'download'){
            Restangular.all('').customGET('download',{site_id: $site.id}).then(function(response){
                var downloads = response;
                downloads.forEach(function(entity){
                    entity.redirect_url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = downloads;

            })
        }
        else
        {
            Restangular.all(selected_url).getList({site_id: $site.id}).then(function(response){
                if(response.route == 'customPage')
                    response.route = 'page';
                if(response.route == 'supportArticle')
                    response.route = 'support-article';
                response.forEach(function(entity){
                    entity.redirect_url = entity.permalink;
                })
                $scope.show_next = true;
                $scope.loaded_items = response.items;

            })
        }
    }

    $scope.saveEmailList = function(model){

        model.company_id = $sites.company_id;
        Restangular.service("emailList").post(model).then(function(response){
            toastr.warning("List created!");

            if( $scope.emailLists)
                $scope.emailLists.push(response);
            else
            {
                $scope.emailLists=[];
                $scope.emailLists.push(response);
            }
        });
    }

    $scope.createNewEmaiList = function ()
    {
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/emailListCreator.html',
            controller: "modalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
            //modalInstance.close();
            //alert("result called");
        })
    }
});