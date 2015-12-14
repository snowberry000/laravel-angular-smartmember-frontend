var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.email.create",{
			url: "/create/:id?",
			templateUrl: "/templates/components/admin/team/email/create/create.html",
			controller: "smartMailCreateController",
			resolve: {
				email: function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('email', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				emailSettings: function(Restangular, $site) {
					return Restangular.all('emailSetting').customGET('settings');
				},
				/*emailLists: function(Restangular , $site){
					return Restangular.all('emailList/sendMailLists').getList();
				}
				/*
				sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				accessLevels: function(Restangular , $site){
					return Restangular.all('accessLevel/sendMailAccessLevels').getList();
				},
				superAdmin: function( Restangular ) {
					return Restangular.one('user').customGET('isSuperAdmin');
				},
				sendgridIntegrations: function(Restangular , $site){
					return Restangular.all('integration/getSendgridIntegrations').getList();
				},*/
			}
		})
}); 

app.controller("smartMailCreateController", function ($scope,toastr, $q, $modal,$localStorage, Restangular, $state, email, emailSettings, Upload) {

	$scope.canceler = false;
	$scope.email = email;

	$scope.showSignature={status:'false'};
	

	if (emailSettings)
	{
	    if( !$scope.email.mail_sending_address )
	        $scope.email.mail_sending_address=emailSettings.sending_address;
	    if( !$scope.email.mail_reply_address )
	        $scope.email.mail_reply_address=emailSettings.replyto_address;
	    if( !$scope.email.mail_signature )
	        $scope.email.mail_signature=emailSettings.email_signature;
	    if( !$scope.email.mail_name )
	        $scope.email.mail_name=emailSettings.full_name;
	    if( !$scope.email.admin )
	        $scope.email.admin=emailSettings.test_email_address;
	}
	    

	/*$scope.selectAllSites = function() {
	    angular.forEach( $scope.sites, function(value, key){
	        $scope.queueEmailData.siteMembers[value.id] = true;
	    })
	}

	$scope.selectAllEmailLists = function() {
	    angular.forEach( $scope.emailLists, function(value, key){
	        $scope.queueEmailData.emailLists[value.id] = true;
	    })
	}

	$scope.selectAllAccessLevels = function() {
	    angular.forEach( $scope.accessLevels, function(value, key){
	        $scope.queueEmailData.accessLevels[value.id] = true;
	    })
	}*/

	/*$scope.toggleDropdown = function(itemToSkip){
	    var dropdowns = [
	        'email_list_selector',
	        'site_members_selector',
	        'access_levels_selector',
	        'ownership_type_selector',
	        'sm_user_selector'
	    ];

	    angular.forEach( dropdowns, function( value ){
	        if( value != itemToSkip )
	            $scope[ value ] = false;
	    });
	    $scope[ itemToSkip ] = !$scope[ itemToSkip ];
	}

	$scope.queuEmails = function() {
	    if ($scope.queueEmailData.email_id)
	    {
	        var lists = [];
	        var sites = [];
	        angular.forEach( $scope.queueEmailData.emailLists, function( value , index ){
	            if(value){
	                lists.push(index);
	            }
	        });
	        angular.forEach( $scope.queueEmailData.siteMembers, function( value , index ){
	            if(value){
	                sites.push(index);
	            }
	        });

	        $scope.queueEmailData['action'] = 3; // Send
	        $scope.queueEmailData['_method'] = 'PUT';
	        var new_hour = moment($scope.queueEmailData['send_time']).hours();
	        var new_minute = moment($scope.queueEmailData['send_time']).minutes();
	        var official_date = moment($scope.queueEmailData['send_date']).hours(new_hour);
	        $scope.queueEmailData['send_date'] = moment(official_date).minutes(new_minute);
	        Restangular.one('email', $scope.queueEmailData.email_id).customPOST($scope.queueEmailData).then(function(response){
	            $state.go("admin.team.email.emailQueue");
	        });
	    }
	}

	$scope.send = function(){
	    if ($scope.email.id)
	        $scope.update();
	    else {
	        $scope.create();
	    }
	}

	$scope.listChanged = function(){
	    var lists = [];
	    var sites = [];
	    $scope.queueEmailData.segmentQuery = '';
	    if ($scope.canceler)
	    {
	        $scope.canceler.resolve();
	    }
	    $scope.canceler = $q.defer();

	    var subscriber_query = '';
	    var member_query = '';
	    if( $scope.queueEmailData.emailLists.indexOf(true) != -1) {
	        var listsToCheck = [];
	        angular.forEach($scope.queueEmailData.emailLists, function (value, index) {
	            if (value) {
	                listsToCheck.push(index);
	            }
	        });
	        subscriber_query += 'email_list_id IN (' + listsToCheck.join(',') + ')';
	    } else {
	        var listsToCheck = [];
	        angular.forEach($scope.emailLists, function( value, index ) {
	            listsToCheck.push(value.id);
	        });
	        subscriber_query += 'email_list_id IN (' + listsToCheck.join(',') + ')';
	    }

	    if( $scope.queueEmailData.siteMembers.indexOf(true) != -1) {
	        member_query += member_query == '' ? '' : ' AND ';

	        var sitesToCheck = [];
	        angular.forEach($scope.queueEmailData.siteMembers, function (value, index) {
	            if (value) {
	                var site = _.findWhere($scope.sites, {id: parseInt(index)}) || _.findWhere($scope.sites, {id: index + ''});
	                if (typeof site != 'undefined') {
	                    sitesToCheck.push('"' + site.subdomain + '"');
	                }
	            }
	        });
	        member_query += 'site IN (' + sitesToCheck.join(',') + ')';
	    } else {
	        member_query += member_query == '' ? '' : ' AND ';
	        var sitesToCheck = [];
	        angular.forEach($scope.sites, function( value, index ) {
	            sitesToCheck.push('"' + value.subdomain + '"');
	        });
	        member_query += 'site IN (' + sitesToCheck.join(',') + ')';
	    }

	    if( $scope.queueEmailData.accessLevels.indexOf(true) != -1) {
	        var accessPassesToCheck = [];
	        var refundPassesToCheck = [];
	        angular.forEach($scope.queueEmailData.accessLevels, function (value, index) {
	            if (value) {
	                var access_level = _.findWhere($scope.accessLevels, {id: parseInt(index)}) || _.findWhere($scope.accessLevels, {id: index + ''});
	                if (typeof access_level != 'undefined') {
	                    if ($scope.queueEmailData.ownershipTypes.owned == true)
	                        accessPassesToCheck.push( '"' +  access_level.name + '"' );
	                    if ($scope.queueEmailData.ownershipTypes.refunded == true)
	                        refundPassesToCheck.push( '"' +  access_level.name + '"' );
	                }
	            }
	        });

	        if ($scope.queueEmailData.ownershipTypes.owned == true) {
	            member_query += member_query == '' ? '' : ' AND ';
	            member_query += 'access_pass IN (' + accessPassesToCheck.join(',') + ')';
	        }
	        if ($scope.queueEmailData.ownershipTypes.refunded == true) {
	            member_query += member_query == '' ? '' : ' AND ';
	            member_query += 'refund_pass IN (' + refundPassesToCheck.join(',') + ')';
	        }
	    }

	    if( $scope.isSuperAdmin ) {

	        var smUserRoles = [];

	        if( $scope.queueEmailData.smUsers.owners == true ) {
	            smUserRoles.push('"Owner"');
	        }
	        if( $scope.queueEmailData.smUsers.primaryOwners == true ) {
	            smUserRoles.push('"Primary Owner"');
	        }

	        if( smUserRoles.length > 0) {
	            member_query += member_query == '' ? '' : ' AND ';
	            member_query += 'role IN (' + smUserRoles.join(',') + ')';

	            if( $scope.queueEmailData.accessLevels.indexOf(true) == -1 || $scope.queueEmailData.siteMembers.indexOf(true) == -1 )
	                member_query = 'role IN (' + smUserRoles.join(',') + ')';
	        }
	    }

	    if( $scope.queueEmailData.accessLevels.indexOf(true) != -1 || $scope.queueEmailData.siteMembers.indexOf(true) != -1 || $scope.queueEmailData.emailLists.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
	    {
	        if( $scope.queueEmailData.emailLists.indexOf(true) != -1 ) {
	            if( $scope.queueEmailData.accessLevels.indexOf(true) != -1 || $scope.queueEmailData.siteMembers.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
	                $scope.queueEmailData.segmentQuery = member_query + ' AND ' + subscriber_query ;
	            else
	                $scope.queueEmailData.segmentQuery = subscriber_query;
	        } else {
	            $scope.queueEmailData.segmentQuery = member_query;
	        }
	    }
	    else
	    {
	        $scope.queueEmailData.segmentQuery = member_query + ' OR ' + subscriber_query;
	    }


	    console.log(' Segment Query: ' + $scope.queueEmailData.segmentQuery)

	    Restangular.one('emailList').withHttpConfig({timeout: $scope.canceler.promise}).customPOST({segment_query: $scope.queueEmailData.segmentQuery}, 'users')
	        .then(function (response) {
	            $scope.users = response;
	        })
	}

	$scope.listChanged();*/

	$scope.previewEmail = function () {

	    var modalInstance = $modal.open({
	        templateUrl: '/templates/modals/previewEmail.html',
	        controller: "modalController",
	        scope: $scope

	    });
	};

	$scope.showSettings=function()
	{
	    $scope.showSignature.status='true';
	}
	$scope.hideSettings=function()
	{
	    $scope.showSignature.status='false';
	}

	// $scope.save = function(action){
	//     console.log("scope email");
	//     console.log($scope.email);
	//     var new_hour = moment($scope.queueEmailData['send_time']).hours();
	//     var new_minute = moment($scope.queueEmailData['send_time']).minutes();
	//     var official_date = moment($scope.queueEmailData['send_date']).hours(new_hour);
	//     $scope.queueEmailData['send_date'] = moment(official_date).minutes(new_minute);
	    
	//         $scope.email.action = 1;
	//         $scope.action = action;
	//         if ($scope.email.subject == '' || $scope.email.content == '')
	//         {
	//             notify({message: 'Subject and email body can not be empty', classes: 'alert-danger'});
	//         }
	//         else {
	//             if ($scope.email.id){
	//                 $scope.update();
	//                 return;
	//             }
	//             $scope.create();
	//         }
	// }

	$scope.saveAndGoNextStep = function() {
	    if ($scope.email.id)
	    {
	        $scope.email.put().then(function (response) {
	            $state.go("admin.team.email.sendmail", {
	                id: response.id
	            });
	        });
	    }
	    else
	    {
	        Restangular.service("email").post($scope.email).then(function (response) {
	            $state.go("admin.team.email.sendmail", {
	                id: response.id
	            });
	        });
	    }
	}

	$scope.sendPreview = function()
	{
	    if( $scope.email.admin ) {
	        Restangular.service("email/sendTest").post($scope.email).then(function (response) {
	            if (response.success == 1)
	                toastr.success("Test email sent successfully");
	            else if (response.success == -1)
	                toastr.error("Test email is not sent because you have not set up your Reply To and Email From yet. Please set it up in Email Settings tab");
	            return;
	        });
	    } else {
	        toastr.warning("Please fill in the email you want to send preview to");
	        return;
	    }
	}

	$scope.saveEmail = function() {
	    if ($scope.email.id)
	        $scope.update();
	    else
	        $scope.create();
	    $state.go("admin.team.email.emails");
	}

	$scope.update = function(){
	    $scope.email.put().then(function(response){
	        $scope.email.action = 1;
	        $scope.email.id = response.id;
	        //$scope.queueEmailData.email_id = $scope.email.id;
	        //$scope.queuEmails();
	        toastr.success("Your email has been saved");
	    })
	}

	$scope.create = function(){
	    Restangular.service("email").post($scope.email).then(function(response){
	        $scope.email.action = 1;
	        $scope.email.id = response.id;
	        //$scope.queueEmailData.email_id = $scope.email.id;
	        //$scope.queuEmails();
	        toastr.success("Your email has been saved");
	    });
	}

	$scope.saveSettings = function () {
	    Restangular.one('emailSetting').post("settings", $scope.emailSettings).then(function (emailSettings) {
	        toastr.success("Your email settings have been saved");
	    } );
	}

	$scope.imageUpload = function(files,type){

	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: $scope.app.apiUrl + '/utility/upload',
	            file: file
	        })
	            .success(function (data, status, headers, config) {
	                console.log(data.file_name);
	                var editor = $.summernote.eventHandler.getModule();
	                file_location = '/uploads/'+data.file_name;
	                if(type=='signature')
	                    editor.insertImage($scope.editable2, data.file_name);
	                else
	                    editor.insertImage($scope.editable, data.file_name);
	                // editor.insertImage($scope.editable, data.file_name);
	            })
	            .error(function (data, status, headers, config) {
	                console.log('error status: ' + status);
	            });
	    }
	}
});