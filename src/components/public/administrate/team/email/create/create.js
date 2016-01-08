var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.create",{
			url: "/create/:id?",
			templateUrl: "/templates/components/public/administrate/team/email/create/create.html",
			controller: "smartMailCreateController",
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
        .state("public.administrate.team.email.segmentIntro",{
            url: "/create/:id?",
            templateUrl: "/templates/components/public/administrate/team/email/create/segmentIntro.html",
            controller: "segmentIntroController"
        })
});

app.controller('smartMailCreateController', function ($scope,toastr, $q, $timeout, $localStorage, Restangular, $state, $stateParams, smModal ) {
    $sendgridapp_configurations = Restangular.all('appConfiguration/getSendgridIntegrations').getList().then(function(response){$scope.sendgridapp_configurations = response});
    $scope.canceler = false;
    if ( $stateParams.id ) {
        $email = Restangular.one('email', $stateParams.id).get().then(function(response){$scope.email = response});
    }
    else
        $scope.email = {company_id: $site.company_id};    
    $emailSettings = Restangular.all('emailSetting').customGET('settings').then(function(response){
        $scope.emailSettings = response;
    })
    $dependencies = [$sendgridapp_configurations , $emailSettings];
    if($stateParams.id)
        $dependencies.push($email);
    $q.all($dependencies).then(function(res){
        if ($scope.emailSettings)
        {
            if( !$scope.email.mail_sending_address )
                $scope.email.mail_sending_address = $scope.emailSettings.sending_address;
            if( !$scope.email.mail_reply_address )
                $scope.email.mail_reply_address = $scope.emailSettings.replyto_address;
            if( !$scope.email.mail_signature )
                $scope.email.mail_signature = $scope.emailSettings.email_signature;
            if( !$scope.email.mail_name )
                $scope.email.mail_name = $scope.emailSettings.full_name;
            if( !$scope.email.admin )
                $scope.email.admin = $scope.emailSettings.test_email_address;
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
                        //console.log('we do have a segment ', segment);
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


    })
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

    

    $scope.showSignature={status:'false'};

    $scope.segment_classes = {
        site: 'success',
        level: 'warning',
        list: 'danger',
        catch_all: 'primary'
    }

    $scope.editSegment = function(segment){
        smModal.Show('public.administrate.team.email.segmentIntro',{segment: segment, modal_options: { allowMultiple: true }});
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
        smModal.Show( null, { modal_options: { allowMultiple: true }, email: $scope.email, recipient_type: $scope.recipient_type, chosen_segments: $scope.chosen_segments },
            { templateUrl: 'templates/modals/previewEmail.html', controller: 'previewEmailController' });
    };

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

    $scope.SetRecipientType('segment');

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
        //console.log('are we even kind of running?');
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

app.controller('segmentIntroController', function ($scope, $state,  $stateParams, close) {
    $scope.segment = $stateParams.segment;

    $scope.original_segment = angular.copy( $scope.segment );

    $scope.cancel = function(){
        angular.forEach( $scope.original_segment, function( value, key ){
            $scope.segment[key] = value;
        });

        close( $scope.segment );
    }

    $scope.save = function(){
        close( $scope.segment );
    }
});

app.controller('previewEmailController', function ($scope, $state, Restangular, $stateParams, close) {
    $scope.recipient_type = $stateParams.recipient_type;
    $scope.email = $stateParams.email;
    $scope.chosen_segments = $stateParams.chosen_segments;

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

    $scope.cancel = function(){
        close();
    }
});