/**
 * Created by Mike on 8/17/2015.
 */
app.controller('segmentIntroController', function ($scope, $state, $modal, $uibModalInstance, Restangular, segment) {
    $scope.segment = segment;

    $scope.original_segment = angular.copy( $scope.segment );

    $scope.cancel = function(){
        angular.forEach( $scope.original_segment, function( value, key ){
            $scope.segment[key] = value;
        });

        $uibModalInstance.close();
    }

    $scope.save = function(){
        $uibModalInstance.close();
    }
});

app.controller('SmartMailsController', function ($scope, $localStorage,$state, $modal, Restangular, toastr, $site, emails , $user) {
    $scope.blockCalls = false;
    $scope.processingCall = false;
    $scope.emails = emails;
    $scope.query = '';
    $scope.currentPage = 1;

    $scope.hasAccess=function(role)
    {
        if( typeof role == 'undefined' )
            role = $user.role;

        for (var i = role.length - 1; i >= 0; i--) {
            var Manager = _.findWhere(role[i].type ,{role_type : 3});
            if( !Manager )
                Manager = _.findWhere(role[i].type ,{role_type : "3"});
            var Owner = _.findWhere(role[i].type ,{role_type : 2});
            if( !Owner )
                Owner = _.findWhere(role[i].type ,{role_type : "2"});
            var PrimaryAdmin = _.findWhere(role[i].type ,{role_type : 1});
            if( !PrimaryAdmin )
                PrimaryAdmin = _.findWhere(role[i].type ,{role_type : "1"});
            if(Manager || Owner || PrimaryAdmin){
                return true;
            }
        }
        return false;
    }

    var access = $scope.hasAccess($user.role);
    if($state.current.name.split('.')[1]=='smartmail'){
        console.log(access)
        if(!access ){
            $state.go('admin.account.memberships');
        }
    }

    $scope.loadMore =function()
    {
        if(!$scope.blockCalls&&!$scope.processingCall)
        {
            $scope.processingCall=true;
            $params = {'p':++$scope.currentPage, company_id: $site.company_id};
            
            if ($scope.query) {
                $params.q = $scope.query;
            }

            Restangular.all('email').getList($params).then(function($response){
                $scope.emails=$scope.emails.concat($response);
                if($response.length==0)
                    $scope.blockCalls=true;
                $scope.processingCall=false;
            });
        }
        else
            return;
    }

    $scope.search= function()
    {
        
        $scope.emails = [];
        $scope.currentPage = 0;
        var $params = { company_id: $site.company_id , p : ++$scope.currentPage};

        if ($scope.query){
            $params.q = $scope.query;
        }

        Restangular.all('email').getList($params).then(function(data){
            for (var i = data.length - 1; i >= 0; i--) {
                var match = _.findWhere($scope.emails ,{id : data[i].id});
                if(!match)
                    $scope.emails.push(data[i]);
            };
            if(data.length==0) {
                $scope.emails = [];
                $scope.blockCalls = true;
            } else {
                $scope.blockCalls = false;
            }
            
        } , function(error){
            $scope.emails = [];
        })
    }

    $scope.formatDate = function ($unformattedDate){
        return moment($unformattedDate).format("ll");
    }

    $scope.copyToClipBoard = function ($url) {
        $uri = 'http://' + $scope.$location.host()+'/register/'+$url;
        return $uri;
    }

    $scope.delete = function (email_id) {
        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return email_id;
                }
            }
        });
        modalInstance.result.then(function () {
            var emailWithId = _.find($scope.emails, function (email) {
                return email.id === email_id;
            });

            emailWithId.remove().then(function () {
                $scope.emails = _.without($scope.emails, emailWithId);
            });
        })
    };
});

app.controller('SmartMailController', function ($scope,toastr, $q, $timeout, $modal,$localStorage, Restangular, $state, email, emailSettings, Upload) {
    $scope.canceler = false;
    $scope.email = email;
    $scope.recipients = [];
    $scope.recipient = '';
	$scope.members = [];
    $scope.chosen_segments = [];
    $scope.counts = {};
    $scope.recipient_type = 'single';
    $scope.queueEmailData = {};
    $scope.available_lists_search = '';
    $scope.selected_lists_search = '';

    $scope.chosen_segment_filters = {
        list: false,
        site: false,
        level: false
    }

    $scope.available_segment_filters = {
        list: false,
        site: false,
        level: false
    }

    $scope.showChosenSegment = function(segment){
        var name_match = false;
        var type_match = false;

        if( !$scope.selected_lists_search )
            name_match = true;
        else {
            var name_regex = new RegExp( $scope.selected_lists_search.toLowerCase() );

            if( segment.name.toLowerCase().match(name_regex) )
                name_match = true;
        }

        var any_true = false;

        angular.forEach( $scope.chosen_segment_filters, function(value,key){
            if( value == true )
                any_true = true;

            if( segment.type == key && value == true )
                type_match = true;
        });

        if( !any_true )
            type_match = true;

        return name_match && type_match;
    }

    $scope.showAvailableSegment = function(segment){
        var name_match = false;
        var type_match = false;

        if( !$scope.available_lists_search )
            name_match = true;
        else {
            var name_regex = new RegExp( $scope.available_lists_search.toLowerCase() );

            if( segment.name.toLowerCase().match(name_regex) )
                name_match = true;
        }

        var any_true = false;
        var any_false = false;

        angular.forEach( $scope.available_segment_filters, function(value,key){
            if( value == true )
                any_true = true;
            else
                any_false = true;

            if( segment.type == key && value == true )
                type_match = true;
        });

        if( segment.type == 'catch_all' && ( !any_false || !any_true ) )
            type_match = true;

        if( !any_true )
            type_match = true;

        return name_match && type_match ? true : false;
    }

    $scope.organizeSegments = function(){
        $scope.calculatingSegments = true;
        if ($scope.canceler)
        {
            $scope.canceler.resolve();
        }
        $scope.canceler = $q.defer();

        Restangular.one('email/calculateSubscribers').withHttpConfig({timeout: $scope.canceler.promise}).customPOST( {segments: $scope.chosen_segments} ).then(function(response){
            $scope.calculatingSegments = false;
            $scope.counts = response;
        });
    }

    /*
    $scope.$watch( $scope.chosen_segments, function( newValue, oldValue){

    });
    */

    $scope.selectSegment = function(segment){
        $scope.chosen_segments.push( segment );
        $scope.segments = _.without( $scope.segments, segment );
        $scope.organizeSegments();
    }

    $scope.removeSegment = function(segment){
        $scope.segments.push( segment );
        $scope.chosen_segments = _.without( $scope.chosen_segments, segment );
        $scope.organizeSegments();
    }

    $scope.selectAllSegments = function(){
        angular.forEach( $scope.segments, function(segment){
            $scope.chosen_segments.push( segment );
            $scope.segments = _.without( $scope.segments, segment );
        });

        $scope.organizeSegments();
    }

    $scope.removeAllSegments = function(){
        angular.forEach( $scope.chosen_segments, function(segment){
            $scope.segments.push( segment );
            $scope.chosen_segments = _.without( $scope.chosen_segments, segment );
        });

        $scope.organizeSegments();
    }

    $scope.loadSegments = function(){
        if( !$scope.segments ) {
            $scope.loading_segments = true;

            Restangular.all('email/getSegments').getList().then(function(response){
                $scope.segments = response;

                var catch_all_segment = _.findWhere( $scope.segments, {type: 'catch_all'});

                if( catch_all_segment )
                    $scope.counts.total_available_recipients = catch_all_segment.count;

                //$scope.segments = _.without( $scope.segments, catch_all_segment );//temporarily disabling this segment as it can't currently be queued

                $scope.counts.total_available_segments = $scope.segments.length;

                $scope.loading_segments = false;

                angular.forEach($scope.chosen_segments, function(value){
                    var segment = _.findWhere( $scope.segments, {target_id: value.target_id, type: value.type});

                    $scope.segments = _.without( $scope.segments, segment );
                });
            });
        }
    }

    if( $scope.email.id ) {
        if( $scope.email.recipient_type )
            $scope.recipient_type = $scope.email.recipient_type;

        $scope.loading_segments = true;

        Restangular.all('email/getSegments').getList().then(function (response) {
            $scope.segments = response;
            $scope.loading_segments = false;

            var catch_all_segment = _.findWhere( $scope.segments, {type: 'catch_all'});

            if( catch_all_segment )
                $scope.counts.total_available_recipients = catch_all_segment.count;

            $scope.counts.total_available_segments = $scope.segments.length;

            angular.forEach($scope.email.recipients, function (value) {
                if( value.type == 'segment' ) {
                    if( value.recipient == 'catch_all_catch_all') {
                        var segment = _.findWhere($scope.segments, {
                            type: 'catch_all'
                        });
                        console.log('we do have a segment ', segment);
                        var recipient_bits = ['catch_all','catch_all'];
                    } else {
                        var recipient_bits = value.recipient.split('_');

                        var segment = _.findWhere($scope.segments, {
                                type: recipient_bits[0],
                                target_id: parseInt(recipient_bits[1])
                            }) || _.findWhere($scope.segments, {
                                type: recipient_bits[0],
                                target_id: recipient_bits[1] + ''
                            });
                    }

                    if( segment ) {
                        $scope.segments = _.without($scope.segments, segment);

                        segment.type = recipient_bits[0];
                        segment.target_id = recipient_bits[1];
                        segment.id = value.id;
                        segment.intro = value.intro;
                        segment.subject = value.subject;

                        $scope.chosen_segments.push(segment);
                    }
                }
                else if( value.type == 'members' ) {
                    $scope.recipients.push( value.recipient );
                }
                else if( value.type == 'single' ) {
                    $scope.recipient = value.recipient;
                }
            });

            $scope.organizeSegments();
        });
    }

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

    $scope.segment_classes = {
        site: 'success',
        level: 'warning',
        list: 'danger',
        catch_all: 'primary'
    }

    $scope.editSegment = function(segment){
        var modalInstance = $modal.open({
            size: 'lg',
            templateUrl: 'templates/admin/team/email/segmentIntro.html',
            controller: "segmentIntroController",
            scope: $scope,
            resolve: {
                segment: function () {
                    return segment
                }
            }

        });
    }

    $scope.save = function() {
        if( $scope.queueEmailData.send_date && $scope.queueEmailData.send_time ) {
            var new_hour = moment($scope.queueEmailData['send_time']).hours();
            var new_minute = moment($scope.queueEmailData['send_time']).minutes();
            // Lets avoid using the same name for the input[date] field, it throws exception for illformed date.
            $scope.email.send_at = moment($scope.queueEmailData['send_date']).hours(new_hour).minutes(new_minute);
        }
        if ($scope.email.id)
            $scope.update();
        else
            $scope.create();
    }

    $scope.update = function(){

        switch( $scope.recipient_type ) {
            case 'single':
                $scope.email.recipient = $scope.recipient;
                break;
            case 'members':
                $scope.email.recipients = $scope.recipients;
                break;
            case 'segment':
                $scope.email.intros = $scope.chosen_segments;
                break;
        }

        $scope.email.recipient_type = $scope.recipient_type;

        $scope.email.put().then(function(response){

            angular.forEach($scope.email.recipients, function(value){
                if( value.recipient == 'catch_all_catch_all') {
                    var segment = _.findWhere($scope.chosen_segments, {
                            type: 'catch_all',
                            target_id: 'catch_all'
                        });
                } else {
                    var recipient_bits = value.recipient.split('_');

                    var segment = _.findWhere($scope.chosen_segments, {
                            type: recipient_bits[0],
                            target_id: parseInt(recipient_bits[1])
                        }) || _.findWhere($scope.chosen_segments, {
                            type: recipient_bits[0],
                            target_id: recipient_bits[1] + ''
                        });
                }

                if( segment )
                    segment.id = value.id;
            });

            toastr.success("Your email has been saved");

            if( $scope.email.action && $scope.email.action == 3 )
                toastr.success("Your email has been queued for sending!");
        })
    }

    $scope.create = function(){

        switch( $scope.recipient_type ) {
            case 'single':
                $scope.email.recipient = $scope.recipient;
                break;
            case 'members':
                $scope.email.recipients = $scope.recipients;
                break;
            case 'segment':
                $scope.email.intros = $scope.chosen_segments;
                break;
        }

        $scope.email.recipient_type = $scope.recipient_type;

        Restangular.service("email").post($scope.email).then(function(response){
            $scope.email = response;

            angular.forEach($scope.email.recipients, function(value){
                var recipient_bits = value.recipient.split('_');

                var segment = _.findWhere($scope.chosen_segments, {type: recipient_bits[0], target_id: parseInt( recipient_bits[1] ) });

                if( segment )
                    segment.id = value.id;
            });

            toastr.success("Your email has been saved");

            if( $scope.email.action && $scope.email.action == 3 )
                toastr.success("Your email has been queued for sending!");
        });
    }

    $scope.send = function(){
        $scope.email.action = 3;
        $scope.save();
    }

    $scope.preview = function () {

        var modalInstance = $modal.open({
            templateUrl: '/templates/modals/previewEmail.html',
            controller: "modalController",
            scope: $scope
        });
    };

    $scope.sendPreview = function()
    {
        switch( $scope.recipient_type ) {
            case 'single':
                $scope.email.recipient = $scope.recipient;
                break;
            case 'members':
                $scope.email.recipients = $scope.recipients;
                break;
            case 'segment':
                $scope.email.intros = $scope.chosen_segments;
                break;
        }

        $scope.email.recipient_type = $scope.recipient_type;

        if( $scope.email.admin ) {
            Restangular.service("email/sendTest").post($scope.email).then(function (response) {
                if (response.success == 1) {
                    $scope.success_count = response.count;
                    toastr.success("Test email sent successfully");
                }
                else if (response.success == -1)
                    toastr.error("Test email is not sent because you have not set up your Reply To and Email From yet. Please set it up in Email Settings tab");
                return;
            });
        } else {
            toastr.warning("Please fill in the email you want to send preview to");
            return;
        }
    }

    $scope.SetRecipientType = function( type ) {

        $scope.recipient_type = type;

        switch( type ) {
            case 'single':
                break;
            case 'members':
                break;
            case 'segment':
                $scope.loadSegments();
                break;
        }

    };

    $scope.formatNumber = function(number){
        if( !number )
            number = 0;

        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.selectedSubscribers = function(){
        var total = 0;

        angular.forEach($scope.chosen_segments, function(value){
            total += value.count;
        });

        return $scope.formatNumber( total );
    }

    $scope.selectMember = function($item,$model,$label){
        if( $scope.recipients.indexOf( $item.email ) == -1 )
            $scope.recipients.push( $item.email );

        $scope.asyncSelected = '';
    }

    $scope.removeRecipient = function(recipient){
        if( $scope.recipients.indexOf( recipient ) != -1 )
            $scope.recipients = _.without( $scope.recipients, recipient );
    }

    $scope.searchMembers = function(q){
        return Restangular.all('').customGET( 'emailSubscriber?p=1&q=' + encodeURIComponent( q ) ).then(function(data){
            return data.items;
        });
    }

    $scope.currentSortableOptions = {
        connectWith: '.connectList',
        stop: function(e, ui) {
            $scope.organizeSegments();
        }
    };

	$scope.GetMembers = function()
	{
		$scope.loading = true;
		$scope.members = [];
	};

    $scope.showSettings=function()
    {
        $scope.showSignature.status='true';
    }
    $scope.hideSettings=function()
    {
        $scope.showSignature.status='false';
    }

    $scope.saveSettings = function () {
        Restangular.one('emailSetting').post("settings", $scope.emailSettings).then(function (emailSettings) {
            toastr.success("Your email settings have been saved");
        } );
    }
});

app.controller('SmartMailFormController', function ($scope, $rootScope, $modal,$localStorage, Restangular, toastr, $state, emailLists, $site, Upload, $sites) {
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
                var downloads = response.downloads;
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
                $scope.loaded_items = response;

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

app.controller('SmartMailParentController', function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, toastr) {
    if($rootScope.is_not_allowed){
        //$rootScope.is_not_allowed = true;
        $state.go('my.team-wizard');
        return false;
    }
});