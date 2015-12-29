app.controller('IntegrationsController', function ($scope,$q,smModal, $localStorage, $location,$rootScope , $stateParams, $state, Restangular, $http, toastr ) {
    if($rootScope.is_not_allowed){
        smModal.Show("public.admin.team.dashboard");
        return false;
    }

    $site=$rootScope.site;

    console.log('stateParams');
    console.log($stateParams);
    var $sites, $company, $connected_accounts, $configured_integrations, $current_integration;
    $scope.loading=true;
    $scope.groupIntegrations = function() {
        $scope.grouped_integrations = [
            {type: 'facebook_group',integrations: []},
            {type: 'stripe',integrations: []},
            {type: 'sendgrid',integrations: []},
            {type: 'vimeo',integrations: []},
            {type: 'paypal',integrations: []},
            {type: 'clickbank',integrations: []},
        ];

        angular.forEach( $scope.configured_integrations, function( value, key){
            _.findWhere( $scope.grouped_integrations, { type: value.type }).integrations.push( value );
        });
    }

    $scope.initIntegrations=function(){
        $scope.sites = $sites.sites;
        $scope.company = $company;
        $scope.connected_accounts = $connected_accounts;
        $scope.configured_integrations = $configured_integrations;
        $scope.current_integration = $current_integration;
        //prepare copy url
        if( $scope.company && $scope.company.hash )
            $scope.url = $scope.app.apiUrl + '/jvzoo/' + $scope.company.hash;
        //automatic selection
        $url=$location.host();
        $subdomain=$url.split('.')[0];
        if($subdomain=='my') {
            $scope.chosen_entity='team';
        }
        else {
            $chosenSite=_.find($scope.sites, function(tempSite){ return tempSite.subdomain == $subdomain; });
            if($chosenSite)
                $scope.chosen_entity=$chosenSite.id;
            else
                $scope.chosen_entity=0;
        }

        $scope.groupIntegrations();
        //////////////////////////////
        $scope.SetIntegrationViewbox( $scope.availableIntegrations[0 ].id );
        $scope.integration = null;
        console.log("integration: ");
        console.log($stateParams.integration);
        if( typeof $stateParams.integration != 'undefined' && $stateParams.integration != null )
            $scope.integration = _.findWhere( $scope.availableIntegrations, {id: $stateParams.integration } );
        if( typeof $stateParams.site_id != 'undefined' && $stateParams.site_id != null )
            $scope.site_id = $stateParams.site_id;
        //////////////////////////////

        if( ( typeof $stateParams.site_id != 'undefined' && $stateParams.site_id ) || $scope.current_integration && typeof $scope.current_integration.site_id != 'undefined' && $scope.current_integration.site_id ) {

            if( typeof $stateParams.site_id != 'undefined' && $stateParams.site_id )
                $scope.current_integration.site_id = $stateParams.site_id;

            $scope.current_site = _.findWhere( $scope.sites, {id: parseInt( $scope.current_integration.site_id ) } ) || _.findWhere( $scope.sites, {id: $scope.current_integration.site_id + '' } );
        }
        if( typeof $stateParams.team != 'undefined' && $stateParams.team ) {
            $scope.current_integration.company_id = $scope.company.id;
        }
        if( $scope.current_integration )
        {
            if( typeof $scope.current_integration.id != 'undefined' && $scope.current_integration.id ) {
                $scope.integration_id = $scope.current_integration.id;
                $scope.show_configured_link = true;
                $scope.current_integration.default = parseInt( $scope.current_integration.default );
                $scope.current_integration.disabled = parseInt( $scope.current_integration.disabled );
            }

            if( typeof $scope.current_integration.disabled != 'undefined' && parseInt( $scope.current_integration.disabled ) )
                $scope.show_disabled = true;

            if( typeof $scope.current_integration.default != 'undefined' && parseInt( $scope.current_integration.default ) )
                $scope.is_default = true;

            if( !$scope.current_integration.id && $scope.integration.instructions_only )
            {
                smModal.Show("public.admin.team.integration.choose",{integration: $stateParams.integration } );
            }


            $scope.account_choices = [];

            angular.forEach( $scope.connected_accounts, function( value, key){
                var addAccount = false;
                switch( $scope.current_integration.type ) {
                    case 'facebook_group':
                        if( value.type == 'facebook_app' )
                            addAccount = true;
                        break;
                    default:
                        if( value.type == $scope.current_integration.type )
                            addAccount = true;
                }

                if( addAccount )
                    $scope.account_choices.push(value);
            });

            if( ( typeof $scope.current_integration.connected_account_id == 'undefined' || parseInt( $scope.current_integration.connected_account_id ) == 0 ) && $scope.account_choices.length > 0 )
                $scope.current_integration.connected_account_id = $scope.account_choices[0].id;
            else if( $scope.current_integration.connected_account_id ) {
                $scope.current_integration.connected_account_id = parseInt($scope.current_integration.connected_account_id);
            }
        }
        ///////////////////////////////
    }

    $scope.resolveDependency = function(){

        $current_integrationCall=null;

        $sitesCall = Restangular.one('supportTicket').customGET('sites').then(function(response){ $sites=response; $scope.sites=$sites; });
        $companyCall = Restangular.one('company/getCurrentCompany').get().then(function(response){ $company=response; });
        $connected_accountsCall = Restangular.all('connectedAccount').getList().then(function(response) { $connected_accounts=response; $scope.connected_accounts=$connected_accounts;});
        $configured_integrationsCall = Restangular.all('integration').getList().then(function(response) { $configured_integrations=response; $scope.configured_integrations=$configured_integrations;});
        if ( $stateParams.id ) {
            $current_integrationCall = Restangular.one('integration', $stateParams.id).get().then(function(response){ $current_integration=response; $scope.current_integration=$current_integration;});
        }
        else
        {
            $current_integration={ type: $stateParams.integration };
            $scope.current_integration=$current_integration;
        }
            

        if($current_integrationCall)
            $q.all([$sitesCall,$companyCall,$connected_accountsCall,$configured_integrationsCall,$current_integrationCall]).then(function(res){console.log("All returned: "); console.log(res); $scope.loading=false; $scope.initIntegrations();});
        else
            $q.all([$sitesCall,$companyCall,$connected_accountsCall,$configured_integrationsCall]).then(function(res){console.log("All returned: "); console.log(res);$scope.loading=false;  $scope.initIntegrations();});
    }
    

    $scope.init = function(){
        var clipboard = new Clipboard('.copy-button');
    }

    $scope.SetIntegrationViewbox = function( integration_id ) {

        $scope.active_integration = integration_id;
    }

    $scope.availableIntegrations = [
        {
            id: 'facebook_group',
            name: 'Facebook: Groups',
            short_name: 'FB Groups',
            description: 'Automate adding and removing your members from a Facebook group.',
            logo: '/images/integrations/fb.png',
            long_description: '<p><a href="https://www.facebook.com/help/162866443847527/" target="_blank">Facebook Group</a> Integrations let you automatically create groups and grant access to those groups based on products your users purchase.</p><p>For help in creating a Facebook App, please <a href="http://help.smartmember.com/lesson/Facebook-Group-Integration" target="_blank">click here</a> to view our tutorial</p>'
        },
        {
            id: 'jvtool',
            name: 'JVZoo: Affiliate Grabber',
            short_name: 'JVZoo',
            description: 'Add Affiliates through our JVZoo Chrome Extension',
            logo: '/images/integrations/jvzoo.jpeg',
            long_description: '<p class="font-bold text-success">Automatically add your JVZoo affiliates in this section</p> <p class=""> Install the JVzoo Extension following the instructions provided, and every time you visit JVzoo the extension will automatically add your affiliates in this management area. You can add affiliates from these JVzoo locations.</p> <p style="text-align:center;"> <a target="_blank" href="https://www.jvzoo.com/sellers/youraffiliates?f_aff=&f_prod=&f_stat=&r=25000" data-bypass="true">Your Affiliates</a> | <a target="_blank" href="https://www.jvzoo.com/sellers/affiliaterequests?f_aff=&r=250000" data-bypass="true">Affiliate Requests</a> </p>'
        },
        {
            id: 'jvzoo',
            name: 'JVZoo: Payment Gateway',
            short_name: 'JVZoo Payment',
            sites_only: true,
            description: 'Allow your customers to buy your Products with JVZoo',
            logo: '/images/integrations/jvzoo.jpeg',
            long_description: '<p><a href="http://www.jvzoo.com/register/446025" target="_blank">JVZoo</a> allows you to accept payments from the JVZoo affiliate platform.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'clickbank',
            name: 'ClickBank: Payment Gateway',
            short_name: 'ClickBank Payment',
            sites_only: true,
            description: 'Allow your customers to buy your Products with ClickBank',
            logo: 'http://rosalindgardner.com/blog/wp-content/uploads/Clickbank-logo.gif',
            long_description: '<p><a href="http://www.clickbank.com" target="_blank">ClickBank</a> allows you to accept payments from the ClickBank affiliate platform.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'wso',
            name: 'WarriorPlus: Payment Gateway',
            short_name: 'Warrior+ Payment',
            sites_only: true,
            description: 'Allow your customers to buy your Products with WarriorPlus',
            logo: '/images/integrations/wso.png',
            long_description: '<p><a href="http://www.warriorplus.com" target="_blank">WarriorPlus</a> allows you to accept payments from the WarriorPlus affiliate platform.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'zaxaa',
            name: 'Zaxaa: Payment Gateway',
            short_name: 'Zaxaa Payment',
            sites_only: true,
            description: 'Allow your customers to buy your Products with Zaxaa',
            logo: '/images/integrations/zaxaa.png',
            long_description: '<p><a href="http://www.zaxaa.com" target="_blank">Zaxaa</a> allows you to accept payments from the Zaxaa affiliate platform.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'paypal',
            name: 'Paypal',
            description: 'Allow your customers to buy your Products with Paypal.',
            logo: '/images/integrations/paypal.png',
            long_description: '<p><a href="http://paypal.com" target="_blank">Paypal</a> allows you to accept most forms of payment from customers.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'sendgrid',
            name: 'Sendgrid',
            description: 'E-mail your customers using Sendgrid.',
            logo: '/images/integrations/sendgrid.png',
            long_description: ''
        },
        {
            id: 'stripe',
            name: 'Stripe',
            description: 'Allow customers to buy your Products with Stripe.',
            logo: '/images/integrations/stripe.png',
            long_description: '<p><a href="http://stripe.com" target="_blank">Stripe</a> allows you to accept credit card payments directly on your site.</p><p>Once configured, this payment method will become an available option to enable on your Products.</p>'
        },
        {
            id: 'vimeo',
            name: 'Vimeo',
            description: 'Rapidly create content by importing directly from Vimeo.',
            logo: '/images/integrations/vimeo.png',
            long_description: '<p><a href="http://vimeo.com" target="_blank">Vimeo</a> is a premier video hosting platform. Once connected, you\'ll be able to quickly import videos and turn them into content on your site(s).</p>'
        },
    ];

    $scope.saveAccount = function(account){
        var data = {name: account.name };

        if( account.type == 'paypal' )
            data.remote_id = account.remote_id;

        if( account.type == 'facebook_app' || account.type == 'sendgrid' ) {
            data.username = account.username;
            data.password = account.password;
        }

        if( account.id ) {
            Restangular.all('connectedAccount').customPUT(data, account.id).then(function (response) {
                toastr.success("Account settings updated!");
            });
        } else {
            Restangular.service('connectedAccount').post(data).then(function (response) {
                toastr.success("Account added!");
                $scope.new_account = {type: account.type};
                $scope.add_new_account = false;

                $scope.connected_accounts.push( response );

                if( typeof $scope.current_integration != 'undefined' && typeof $scope.account_choices != 'undefined' ) {
                    $scope.account_choices.push( response );
                    $scope.current_integration.connected_account = response.id;
                }
            });
        }
    }

    $scope.promptRemoveAccount = function(account){
        if( account.integrations && account.integrations.length > 0 )
        {
            swal({
                title: "Are you sure?",
                text: "Removing this account will disable " + account.integrations.length + " integration" + ( account.integrations.length > 1 ? 's' : '' ) + '!',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, remove it!",
                closeOnConfirm: true
            }, function () {
                $scope.removeAccount( account, true );
            });
        }
        else
        {
            $scope.removeAccount( account );
        }
    }

    $scope.removeAccount = function(account, integration_count){
        Restangular.one('connectedAccount' , account.id).remove().then(function () {
            $scope.connected_accounts = _.without($scope.connected_accounts, account);

            if( typeof integration_count != 'undefined' && integration_count == true ){
                toastr.success('Account has been removed and ' + account.integrations.length + " integration" + ( account.integrations.length > 1 ? 's have' : ' has' ) + ' been disabled.');
            }
            else{
                toastr.success('Account has been removed');
            }
        });
    }

    $scope.copyToClipBoard = function()
    {
        return "copied";
    }

    $scope.addIntegration = function(entity_id) {
        var params = {};
        console.log("entityID");
        console.log(entity_id);

        switch( entity_id ) {
            case 'team':
                params.team = true;
                break;
            default:
                params.site_id = entity_id;
                break;
        }
        smModal.Show("", params , {controller : 'IntegrationsController' , templateUrl : 'templates/components/public/admin/team/integration/configure/' + $stateParams.integration + '.html'});
    }

    

    $scope.addGroup = function(){
        if( $scope.current_integration.name && $scope.current_integration.remote_id )
        {
            swal({
                title: "Are you sure?",
                text: "Creating a new group will make remove the old group from all existing access levels that use this integration and replace it with the new group, this cannot be undone.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, change group!",
                closeOnConfirm: true
            }, function () {
                $scope.showDialog();
            });
        }
        else
            $scope.showDialog();
    }

    $scope.showDialog = function(app_id){
        FB.init({
            appId      : $scope.current_integration.username,
            xfbml      : true,
            version    : 'v2.4'
        });

        FB.login(function(){
            FB.ui({
                    method: 'game_group_create',
                    name: 'My New Group',
                    description: 'A description for the new group',
                    privacy: 'CLOSED',
                },
                function(response) {
                    if (response && response.id) {
                        FB.api('/' +  response.id, function(group){
                            $scope.current_integration.remote_id = group.id;
                            $scope.current_integration.name = group.name;
                            $scope.$apply();
                        });

                    } else {

                    }
                }
            );
        }, {scope: ''});
    }

    $scope.connectStripeAccount = function() {
        if( !$scope.current_integration.id )
        {
            var data = {
                site_id: typeof $scope.current_integration.site_id != 'undefined' ? $scope.current_integration.site_id : null,
                company_id: typeof $scope.current_integration.company_id != 'undefined' ? $scope.current_integration.company_id : null,
                connected_account_id: typeof $scope.current_integration.connected_account_id != 'undefined' ? $scope.current_integration.connected_account_id : 0,
                type: 'stripe',
                disabled: typeof $scope.current_integration.disabled != 'undefined' ? $scope.current_integration.disabled : 0,
            };

            Restangular.service('integration').post(data).then(function (response) {
                location.href = $scope.app.apiUrl + '/stripe/auth/' + response.id + '?state=' + $localStorage.user.access_token;
            });
        }
        else
            location.href = $scope.app.apiUrl + '/stripe/auth/' + ($scope.current_integration.id ? $scope.current_integration.id : '') + '?state=' + $localStorage.user.access_token;
    }

    $scope.connectVimeoAccount = function() {
        if(!$scope.current_integration.id )
        {
            var data = {
                site_id: typeof $scope.current_integration.site_id != 'undefined' ? $scope.current_integration.site_id : null,
                company_id: typeof $scope.current_integration.company_id != 'undefined' ? $scope.current_integration.company_id : null,
                connected_account_id: typeof $scope.current_integration.connected_account_id != 'undefined' ? $scope.current_integration.connected_account_id : 0,
                type: 'vimeo',
                disabled: typeof $scope.current_integration.disabled != 'undefined' ? $scope.current_integration.disabled : 0,
            };

            Restangular.service('integration').post(data).then(function (response) {
                location.href = $scope.app.apiUrl + '/vimeo/auth/' + response.id + '?state=' + $localStorage.user.access_token;
            });
        }
        else
            location.href = $scope.app.apiUrl + '/vimeo/auth/' + ($scope.current_integration.id ? $scope.current_integration.id : '') + '?state=' + $localStorage.user.access_token;
    }

    $scope.saveIntegration = function() {
        var data = {
            name: typeof $scope.current_integration.name != 'undefined' ? $scope.current_integration.name : null,
            site_id: typeof $scope.current_integration.site_id != 'undefined' ? $scope.current_integration.site_id : null,
            company_id: typeof $scope.current_integration.company_id != 'undefined' ? $scope.current_integration.company_id : null,
            connected_account_id: typeof $scope.current_integration.connected_account_id != 'undefined' ? $scope.current_integration.connected_account_id : 0,
            type: typeof $scope.current_integration.type != 'undefined' ? $scope.current_integration.type : '',
            username: typeof $scope.current_integration.username != 'undefined' ? $scope.current_integration.username : null,
            password: typeof $scope.current_integration.password != 'undefined' ? $scope.current_integration.password : null,
            access_token: typeof $scope.current_integration.access_token != 'undefined' ? $scope.current_integration.access_token : null,
            remote_id: typeof $scope.current_integration.remote_id != 'undefined' ? $scope.current_integration.remote_id : null,
            disabled: typeof $scope.current_integration.disabled != 'undefined' && $scope.current_integration.disabled != null ? $scope.current_integration.disabled : 0,
            default: typeof $scope.current_integration.default != 'undefined' && $scope.current_integration.default != null ? $scope.current_integration.default : 0
        };

        if( $scope.current_integration.id ) {
            Restangular.all('integration').customPUT(data, $scope.current_integration.id).then(function (response) {
                toastr.success("Integration updated!");
                $scope.handleSaved(response);
            });
        }
        else {
            Restangular.service('integration').post(data).then(function (response) {
                toastr.success("Integration added!");
                $scope.current_integration.id = response.id;
                $scope.handleSaved(response);
            });
        }
    }

    $scope.handleSaved = function(response){
        if( response.status )
        {
            switch( response.status )
            {
                case 'bad_credentials':
                    if( $scope.current_integration.type == 'sendgrid' ){
                        toastr.error("Sendgrid username and/or password is incorrect!");
                    }
                    break;
                default:
                    smModal.Show("public.admin.team.integrations.list");
            }
        }else if($stateParams.integration == 'vimeo' && $rootScope.vimeo_redirect_url){
            delete $rootScope.vimeo_redirect_url;
            smModal.Show("public.admin.site.content.import", {}, { reload: true });
        }
        else
        {
            smModal.Show("public.admin.team.integrations.list");
        }
    }

    $scope.enableIntegration = function(integration_id){
        Restangular.all('integration').customPUT({disabled: 0}, integration_id).then(function (response) {
            toastr.success("Integration was enabled!");
            $scope.show_disabled = false;
        });
    }

    $scope.disableIntegration = function(integration_id){
        var description = '';

        switch( $scope.integration.id ){
            case 'stripe':
                description = 'Disabling this integration will disable it as a payment method everywhere it was used. If there are no other payment methods available you may be preventing users from purchasing your products.';
                break;
            case 'vimeo':
                description = 'Disabling this integration will disable your ability to import content directly from the attached Vimeo account for any sites or teams this integration is tied to.';
                break;
            case 'paypal':
                description = 'Disabling this integration will disable it as a payment method everywhere it was used. If there are no other payment methods available you may be preventing users from purchasing your products.';
                break;
            case 'facebook_group':
                description = 'Disabling this integration will disable your users\' ability to connect to this Facebook Group from your site.  New users will not be able to join the group.';
                break;
            case 'sendgrid':
                description = 'Disabling this integration will disable sending e-mail using the Sendgrid settings configured in this integration.  If no other Sendgrid integrations are available you will be disabling your ability to use the E-mail center to e-mail your members and subscribers.';
                break;
        }

        swal({
            title: "Are you sure?",
            text: description,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, disable integration!",
            closeOnConfirm: true
        }, function () {
            Restangular.all('integration').customPUT({disabled: 1, default: 0}, integration_id).then(function (response) {
                toastr.success("Integration was disabled!");
                $scope.show_disabled = true;
            });
        });
    }

    $scope.removeIntegration = function(integration_id){
        var description = '';

        switch( $scope.integration.id ){
            case 'stripe':
                description = 'Removing this integration will remove it as a payment method everywhere it was used. If there are no other payment methods available you may be preventing users from purchasing your products.';
                break;
            case 'vimeo':
                description = 'Removing this integration will remove your ability to import content directly from the attached Vimeo account for any sites or teams this integration is tied to.';
                break;
            case 'paypal':
                description = 'Removing this integration will remove it as a payment method everywhere it was used. If there are no other payment methods available you may be preventing users from purchasing your products.';
                break;
            case 'facebook_group':
                description = 'Removing this integration will remove your users\' ability to connect to this Facebook Group from your site.  New users will not be able to join the group.';
                break;
            case 'sendgrid':
                description = 'Removing this integration will disable sending e-mail using the Sendgrid settings configured in this integration.  If no other Sendgrid integrations are available you will be removing your ability to use the E-mail center to e-mail your members and subscribers.';
                break;
        }

        swal({
            title: "Are you sure? This cannot be undone.",
            text: description,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove integration!",
            closeOnConfirm: true
        }, function () {
            Restangular.one('integration' , integration_id).remove().then(function () {
                toastr.success("Integration was removed");
                smModal.Show("public.admin.team.integrations.list");
            });
        });
    }

    $scope.promptDefault = function( integration_id ) {
        var current_integration = _.findWhere( $scope.configured_integrations, {id: integration_id} );

        var other_default = false;
        var like_integrations = _.findWhere( $scope.grouped_integrations, {type: current_integration.type} );

        if( like_integrations && like_integrations.integrations )
        {
            if( current_integration.site_id )
                other_default = _.findWhere( like_integrations.integrations, { site_id: parseInt( current_integration.site_id ), default: 1 } ) || _.findWhere( like_integrations.integrations, { site_id: current_integration.site_id + "", default: "1" } )
            else
                other_default = _.findWhere( like_integrations.integrations, { company_id: parseInt( current_integration.company_id ), default: 1 } ) || _.findWhere( like_integrations.integrations, { company_id: current_integration.company_id + "", default: "1" } )
        }

        if( other_default ) {

            var description = "Setting this integration as default will unset the current default integration for " + (current_integration.site_id ? ' the site "' + current_integration.site.name + '"' : 'the team "' + current_integration.company.name + '"' ) + ' and set this as the default.';

            swal({
                title: "Are you sure?",
                text: description,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, set as default!",
                closeOnConfirm: true
            }, function () {
                $scope.setDefault(current_integration);
            });
        }
        else
            $scope.setDefault(current_integration);
    }

    $scope.setDefault = function(current_integration) {
        Restangular.all('integration').customPUT({default: 1}, current_integration.id).then(function (response) {
            toastr.success("Integration set as default!");
            current_integration.default = 1;
            $scope.is_default = true;
        });
    }

    $scope.removeDefault = function(integration_id) {
        Restangular.all('integration').customPUT({default: 0}, integration_id).then(function (response) {
            toastr.success("Integration no longer default!");
            var current_integration = _.findWhere( $scope.configured_integrations, {id: integration_id} );
            current_integration.default = 0;
            $scope.is_default = false;
        });
    }

    $scope.copied = function()
    {
        toastr.success("Link copied!");
    }

    $scope.resolveDependency();
});