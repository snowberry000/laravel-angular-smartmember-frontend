/*

NOTE: THIS CONTROLLER IS DEPRICATED. DON't MAKE ANY UPDATES HERE

*/


app.controller('loginController', function ($scope, $localStorage, $stateParams, $state, Restangular, FB, $http) {

    var auth = Restangular.all('auth');

    $scope.message = '';
    $scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
    $scope.action = 0;
    $scope.login_type = "facebook";
    $scope.user = {};
    $scope.hash = '';

    if ($stateParams.hash) {
        $localStorage.hash = $stateParams.hash;
    }

    $scope.facebookCheck = function () {
        FB.login()
            .then(function (user) {
                auth.customPOST(user, "facebook-login").then(function (data) {
                        $localStorage.user = data;
                        $state.go('admin.access-levels');
                    }
                );
            }).catch(function (error) {

            });
    };


    $scope.login = function () {
        var user = $scope.user;
        
        if ($localStorage.hash)
            user.product_hash = $localStorage.hash;

        auth.customPOST(user, "login").then(function (response) {
            $localStorage.user = response;

            if ($localStorage.hash) {
                $localStorage.hash = false;
            }

            if (response.is_site){
                $state.go('public.app.lessons');
            }else{
                $state.go('admin.access-levels');
            }            
        });


    };

    $scope.register = function () {        
        var user = $scope.user;
        if ($localStorage.hash)
            user.product_hash = $localStorage.hash;

        delete user.password2;
        auth.customPOST(user, "register").then(function (response) {
            $scope.action = 1;
            
            if ($localStorage.hash) {
                $localStorage.hash = false;
                user.product_hash = false;
            }
            
            if (response.is_site){
                $state.go('public.app.lessons');
            }else{
                $state.go('admin.account.memberships');
            }  
            toastr.success("Registered!");

        });
    };


});

