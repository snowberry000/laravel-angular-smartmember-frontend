app.controller('siteController', function ($scope,toastr,$state, $localStorage, $location, $clone_sites , Restangular, notify,$site) {
    $scope.site = $site;
    $scope.site.clone_id = $scope.site.id ? $scope.site.clone_id : 0;
    $clone_sites.unshift({id : 0 , name : "Don't clone"})
    $scope.current_clone_site = {};
    $scope.clone_sites = $clone_sites;
    console.log("site: "+$scope.site);

    $scope.save = function(){
        $scope.saving = true;
        if ($scope.site.id){
            $scope.update();
            return;
        }
        $scope.create();
    }
    $scope.changeSite = function(id){
        $scope.current_clone_site = _.find($clone_sites , {id : id});
    }
    $scope.update = function(){
        $scope.site.put().then(function(response){
            toastr.success("Site Edited!");
            $state.go("admin.team.sites");
        }, function(response) {
            $scope.saving = false;
        })
    }
    
    $scope.create = function(){
        Restangular.service("site").post($scope.site).then(function(response){

            toastr.success("Site Created!");

            var domainParts = $location.host().split('.');
            var env = domainParts.pop();//dev
            var domain = domainParts.pop() + "." + env;
            if( domain.indexOf( 'smartmember' ) == -1 )
                domain = 'smartmember.com';

            window.location.href="http://"+response.subdomain+'.'+domain+"/admin/site/dashboard";
        }, function(response){
            $scope.saving = false;
        });
    }
});

