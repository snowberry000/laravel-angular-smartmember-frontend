app.controller('resetController', function ($rootScope, $scope, $localStorage,$stateParams, $location, Restangular, $state, $http,toastr) {
    var auth = Restangular.all('auth');
    $rootScope.is_admin = true;
    $rootScope.page_title = "Smartmember - Password Reset";

    if ($location.search().error_message)
    {
        if ($location.search().error_message == "inprocess registration")
        {
            $scope.inprocess_register = true;
        }
    }
    $scope.reset = function(password){
        auth.customPOST({reset_token : $scope.hash , password : password} , 'reset').then(function(data){
            if (data.message  && data.message == "no such email found") {
                toastr.error("The email you specified does not exist");
            } else {
                $scope.message = data.message;
               $state.go('public.sign.in');
            }
             
        });
    }

    $scope.forgot = function(reset_email){
        auth.customPOST({email :reset_email} , 'forgot').then(function(data){
           if (data.message  && data.message == "no such email found") {
            toastr.error("The email you specified does not exist");
            } else {
                window.location.href= "/sign/in/?reset=1";
                $scope.message = data.message;
            }
        });
    }

    $scope.init = function(){
        $scope.hash = $stateParams.hash;
    }

});