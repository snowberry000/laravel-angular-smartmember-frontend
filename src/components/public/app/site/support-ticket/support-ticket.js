var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.support-ticket",{
			url: "/support-ticket",
			templateUrl: "/templates/components/public/app/site/support-ticket/support-ticket.html",
			controller: "PublicSupportTicketController"
		})
}); 

app.controller('PublicSupportTicketController', function ($scope,$site,Upload,$rootScope, $localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.ticket = {};
    $rootScope.page_title=$rootScope.site.name+' - Leave a Support Ticket';
    $scope.init = function(){
        $scope.ticket.type = $stateParams.type || 'normal';
        $scope.ticket.company_id = $site.company_id;
    }
    // $scope.imageUpload = function(files){

    //     for (var i = 0; i < files.length; i++) {
    //         var file = files[i];
    //         Upload.upload({
    //             url: $scope.app.apiUrl + '/utility/upload',
    //             file: file
    //         })
    //             .success(function (data, status, headers, config) {
    //                 console.log(data.file_name);
    //                 alert("uploaded");
    //                 var editor = $.summernote.eventHandler.getModule();
    //                 file_location = '/uploads/'+data.file_name;
    //                 editor.insertImage($scope.editable, data.file_name);
    //             }).error(function (data, status, headers, config) {
    //                 console.log('error status: ' + status);
    //             });
    //     }
    // }

    $scope.validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    $scope.save = function(){

        var message_verified = true;
        if (!$scope.isLoggedIn())
        {
            if (!$scope.validateEmail($scope.ticket.user_email))
            {
                toastr.error("Email is not valid. Please check email again");
                message_verified = false;
            }
        }
        if( typeof $scope.ticket.message == 'undefined' || $scope.ticket.message == '' ) {
            toastr.error("You must add a message to submit a ticket!");
            message_verified = false;
        }

        if( typeof $scope.ticket.subject == 'undefined' || $scope.ticket.subject == '' ) {
            toastr.error("You must add a subject to submit a ticket");
            message_verified = false;
        }

        if( message_verified == true ) {
            Restangular.all('supportTicket').post($scope.ticket).then(function (response) {
                toastr.success("Your ticket has been created.");
                $scope.ticket_submitted = true;
            })
        }
    }
});