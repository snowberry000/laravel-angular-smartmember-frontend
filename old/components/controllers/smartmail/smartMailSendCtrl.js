app.controller('SmartMailSendMailController', function( $scope, $modal, $q, $localStorage, $stateParams, Restangular, notify, $state, emailLists, sites, emails, accessLevels, superAdmin, Upload) {
    $scope.canceler = false;
    $scope.emailLists = emailLists;
    $scope.accessLevels = accessLevels;
    $scope.isSuperAdmin = superAdmin.isSuperAdmin;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.pagination = {currentPage : 1};
    $scope.exclude_pagination = {currentPage: 1};
    $scope.users = [];
    $scope.exclude_users = [];
    $scope.queueEmailData = {
        email_id: false,
        siteMembers: [],
        emailLists: [],
        accessLevels: [],
        ownershipTypes: {
            owned: false,
            refunded: false
        },
        job_id : false,
        segmentQuery: '',
        smUsers: {
            primaryOwners: false,
            owners: false
        }
    };

    $scope.excludeQueueEmailData = {
        email_id: false,
        siteMembers: [],
        emailLists: [],
        accessLevels: [],
        ownershipTypes: {
            owned: false,
            refunded: false
        },
        job_id : false,
        segmentQuery: '',
        smUsers: {
            primaryOwners: false,
            owners: false
        }
    };


    $scope.sites = sites.sites;
    $scope.emails = emails;
    $scope.emailToSend = false;

    $scope.paginateIt = function() {
        var begin = (($scope.pagination.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.users_to_show = $scope.users.slice(begin, end);
    }

    $scope.excludepaginateIt = function() {
        var begin = (($scope.exclude_pagination.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.exclude_users_to_show = $scope.exclude_users.slice(begin, end);
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
            'sm_user_selector',
            'exclude_email_list_selector',
            'exclude_site_members_selector',
            'exclude_access_levels_selector',
            'exclude_ownership_type_selector',
            'exclude_sm_user_selector',
        ];

        angular.forEach( dropdowns, function( value ){
            if( value != itemToSkip )
                $scope[ value ] = false;
        });
        $scope[ itemToSkip ] = !$scope[ itemToSkip ];
    }

    $scope.send = function(){
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
            // Lets avoid using the same name for the input[date] field, it throws exception for illformed date.
            $scope.queueEmailData['send_at'] = moment($scope.queueEmailData['send_date']).hours(new_hour).minutes(new_minute);

            Restangular.one('email', $scope.queueEmailData.email_id).customPOST($scope.queueEmailData).then(function(response){
                $state.go("admin.team.email.queue");
            });
        }
    }

    $scope.listChangedExclude = function(){
        var lists = [];
        var sites = [];

        if ($scope.canceler)
        {
            $scope.canceler.resolve();
        }
        $scope.canceler = $q.defer();

        $scope.excludeQueueEmailData.segmentQuery = '';

        var subscriber_query = '';
        var member_query = '';
        if( $scope.excludeQueueEmailData.emailLists.indexOf(true) != -1) {
            var listsToCheck = [];
            angular.forEach($scope.excludeQueueEmailData.emailLists, function (value, index) {
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

        if( $scope.excludeQueueEmailData.siteMembers.indexOf(true) != -1) {
            member_query += member_query == '' ? '' : ' AND ';

            var sitesToCheck = [];
            angular.forEach($scope.excludeQueueEmailData.siteMembers, function (value, index) {
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

        if( $scope.excludeQueueEmailData.accessLevels.indexOf(true) != -1) {
            var accessPassesToCheck = [];
            var refundPassesToCheck = [];
            angular.forEach($scope.excludeQueueEmailData.accessLevels, function (value, index) {
                if (value) {
                    var access_level = _.findWhere($scope.accessLevels, {id: parseInt(index)}) || _.findWhere($scope.accessLevels, {id: index + ''});
                    if (typeof access_level != 'undefined') {
                        if ($scope.excludeQueueEmailData.ownershipTypes.owned == true)
                            accessPassesToCheck.push( '"' +  access_level.name + '"' );
                        if ($scope.excludeQueueEmailData.ownershipTypes.refunded == true)
                            refundPassesToCheck.push( '"' +  access_level.name + '"' );
                    }
                }
            });

            if ($scope.excludeQueueEmailData.ownershipTypes.owned == true) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'access_pass IN (' + accessPassesToCheck.join(',') + ')';
            }
            if ($scope.excludeQueueEmailData.ownershipTypes.refunded == true) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'refund_pass IN (' + refundPassesToCheck.join(',') + ')';
            }
        }

        if( $scope.isSuperAdmin ) {

            var smUserRoles = [];

            if( $scope.excludeQueueEmailData.smUsers.owners == true ) {
                smUserRoles.push('"Owner"');
            }
            if( $scope.excludeQueueEmailData.smUsers.primaryOwners == true ) {
                smUserRoles.push('"Primary Owner"');
            }

            if( smUserRoles.length > 0) {
                member_query += member_query == '' ? '' : ' AND ';
                member_query += 'role IN (' + smUserRoles.join(',') + ')';

                if( $scope.excludeQueueEmailData.accessLevels.indexOf(true) == -1 || $scope.excludeQueueEmailData.siteMembers.indexOf(true) == -1 )
                    member_query = 'role IN (' + smUserRoles.join(',') + ')';
            }
        }

        if( $scope.excludeQueueEmailData.accessLevels.indexOf(true) != -1 || $scope.excludeQueueEmailData.siteMembers.indexOf(true) != -1 || $scope.excludeQueueEmailData.emailLists.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
        {
            if( $scope.excludeQueueEmailData.emailLists.indexOf(true) != -1 ) {
                if( $scope.excludeQueueEmailData.accessLevels.indexOf(true) != -1 || $scope.excludeQueueEmailData.siteMembers.indexOf(true) != -1 || ( $scope.isSuperAdmin && smUserRoles.length > 0 ) )
                    $scope.excludeQueueEmailData.segmentQuery = member_query + ' AND ' + subscriber_query ;
                else
                    $scope.excludeQueueEmailData.segmentQuery = subscriber_query;
            } else {
                $scope.excludeQueueEmailData.segmentQuery = member_query;
            }
        }
        else
        {
            $scope.excludeQueueEmailData.segmentQuery = member_query + ' OR ' + subscriber_query;
        }


        console.log(' Segment Query: ' + $scope.excludeQueueEmailData.segmentQuery)

        Restangular.one('emailList').withHttpConfig({timeout: $scope.canceler.promise}).customPOST({segment_query: $scope.excludeQueueEmailData.segmentQuery}, 'users')
            .then(function (response) {
                $scope.exclude_users = response;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                $scope.exclude_pagination = {currentPage : 1};
                $scope.excludepaginateIt();
            })
    }

    $scope.listChanged = function(){
        var lists = [];
        var sites = [];

        if ($scope.canceler)
        {
            $scope.canceler.resolve();
        }
        $scope.canceler = $q.defer();

        $scope.queueEmailData.segmentQuery = '';
        console.log('Segment query is' + $scope.queueEmailData.segmentQuery);

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
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                $scope.pagination = {currentPage : 1};
                $scope.paginateIt();
            })
    }

    $scope.init = function() {
        var emailId = false;

        if( typeof $stateParams.queueEmailData != 'undefined' &&
            $stateParams.queueEmailData != null  ) {
            $scope.queueEmailData = $stateParams.queueEmailData;
        }
        // If a job parameter exists in the state.
        if ($stateParams.job) {
            $scope.job = $stateParams.job;

            $scope.queueEmailData.job_id = $scope.job.id;
            $scope.queueEmailData.email_id = $scope.job.email_id;
            console.log(moment($scope.job.send_at).format('L'));
            $scope.queueEmailData.send_date = new Date(moment($scope.job.send_at).format('l'));
            var hours = moment($scope.job.send_at).hours();
            var mins = moment($scope.job.send_at).minutes();
            $scope.queueEmailData.send_time = new Date(1970, 0, 1, hours, mins, 0);

        }
        else if ($stateParams.id) {
            $scope.queueEmailData.email_id = $stateParams.id;
        }

        if ($scope.queueEmailData.email_id) {
            Restangular.one('email', $scope.queueEmailData.email_id).get().then(function(response) {
                $scope.emailToSend = response;
                $scope.queueEmailData.email_id = response.id;
            });
        }

    }

});
