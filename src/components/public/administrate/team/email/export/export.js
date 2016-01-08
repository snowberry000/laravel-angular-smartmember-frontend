var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.export",{
			url: "/export",
			templateUrl: "/templates/components/public/administrate/team/email/export/export.html",
			controller: "EmailSubscriberExportController"
		})
}); 

app.controller("EmailSubscriberExportController", function ($scope,$q,  $localStorage, Restangular, toastr, $state , Upload) {
	    
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.pagination = {currentPage : 1};
    $scope.users = [];
    $scope.queueEmailData = {
        email_id: false,
        siteMembers: [],
        emailLists: [],
        accessLevels: [],
        ownershipTypes: {
            owned: true,
            refunded: false
        },
        segmentQuery: '',
        smUsers: {
            primaryOwners: false,
            owners: false
        }
    };

    $scope.resolve = function(){
        $emailLists = Restangular.all('emailList/sendMailLists').getList().then(function(response){$scope.emailLists = response ; });
        $sites = Restangular.one('supportTicket').customGET('sites').then(function(response){$scope.sites = response.sites})
        $emails = Restangular.all('email').getList().then(function(response){$scope.emails = response;})
        $accessLevels = Restangular.all('accessLevel/sendMailAccessLevels').getList().then(function(response){$scope.accessLevels = response;})
        $superAdmin = Restangular.one('user').customGET('isSuperAdmin').then(function(response){$scope.isSuperAdmin = response.isSuperAdmin;})
        
        $q.all([$emailLists , $sites , $emails , $accessLevels , $superAdmin]).then(function(res){  $scope.listChanged();})
    }

    $scope.resolve();

    $scope.paginateIt = function() {
        var begin = (($scope.pagination.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.users_to_show = $scope.users.slice(begin, end);
    }

    $scope.stopPropagation = function($event){
        $event.stopPropagation();
    }

    $scope.selectAllSites = function() {
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
    }

    $scope.toggleDropdown = function(itemToSkip){
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

    $scope.send = function(){
            

                /*$scope.queueEmailData['action'] = 3; // Send
                $scope.queueEmailData['_method'] = 'PUT';
                var new_hour = moment($scope.queueEmailData['send_time']).hours();
                var new_minute = moment($scope.queueEmailData['send_time']).minutes();
                var official_date = moment($scope.queueEmailData['send_date']).hours(new_hour);
                $scope.queueEmailData['send_date'] = moment(official_date).minutes(new_minute);*/
                Restangular.all('emailSubscriber/getCSV').customPOST({segment_query : $scope.queueEmailData.segmentQuery}).then(function(response){
                    //$state.go("my.smartmail.emailQueue");
                });
        

    }

    $scope.listChanged = function(){
        var lists = [];
        var sites = [];
        $scope.queueEmailData.segmentQuery = '';

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


        //console.log(' Segment Query: ' + $scope.queueEmailData.segmentQuery)

       /* Restangular.one('emailList').customPOST({segment_query: $scope.queueEmailData.segmentQuery}, 'users')
            .then(function (response) {
                $scope.users = response;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                $scope.pagination = {currentPage : 1};
                $scope.paginateIt();
            })*/
    }

  
});