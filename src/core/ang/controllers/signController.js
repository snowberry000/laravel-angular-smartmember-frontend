app.controller( 'signController', function( $rootScope, $scope, smModal, $timeout, toastr, ipCookie, $localStorage, $stateParams, $location, Restangular, FB, $state, $http )
{

    $rootScope.page_title = "Smartmember";
    $rootScope.is_admin = true;
    if( $location.search().message )
    {
        $rootScope.redirectedFromLoginMessage = true;
    }

    $scope.options.theme = '';

    $scope.site_options = {};


    Restangular.one( 'site', 'details' ).get().then( function( response )
    {
        $logoItem = _.find( response.meta_data, function( item )
        {
            return item.key == 'site_logo';
        } );
        if( $logoItem )
        {
            $scope.site_logo = $logoItem.value;
        }
        else
        {
            $scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
        }

        $scope.site = response;
        $rootScope.site = response;

        angular.forEach( response.meta_data, function( value )
        {
            $scope.site_options[ value.key ] = value.value;
        } );
    } );

    //$scope.site_logo = "http://imbmediab.s3.amazonaws.com/wp-content/uploads/2015/06/Smart-Member-Gray-Icon-Text-01.png";
    $scope.action = 0;
    $scope.login_type = "facebook";
    $scope.user = {};
    $scope.hash = '';
    $scope.current_url = $rootScope.app.domain.indexOf( 'smartmember' ) != -1 ? $rootScope.app.subdomain + '.' + $rootScope.app.domain : $rootScope.app.domain;
    if( $stateParams.hash )
    {
        $localStorage.hash = $stateParams.hash;
    }
    if( $location.search().cbreceipt )
    {
        $localStorage.cbreceipt = $location.search().cbreceipt;
    }

    if( $location.search().message )
    {
        toastr.success( $location.search().message );
    }

    if( $location.search().error_message )
    {
        if( $location.search().error_message == "Email address already taken" )
        {
            $scope.account_exist = true;
        }
        if( $location.search().error_message == "exist from registration" )
        {
            $scope.register_exist = true;
        }

    }

    if( $location.search().reset && $location.search().reset == 1 )
    {
        $scope.reset_sent = 1;
    }

    $scope.login = function()
    {
        var user = $scope.user;
        if( $localStorage.hash )
        {
            user.hash = $localStorage.hash;
        }
        if( $localStorage.cbreceipt )
        {
            user.cbreceipt = $localStorage.cbreceipt;
        }

        Restangular.all( 'auth' ).customPOST( user, "login" ).then( function( response )
        {
            $scope.postAuth( response );
            if( $location.search().message )
            {
                $rootScope.redirectedFromLoginMessage = false;
                window.location.href = $localStorage.accessed_url;
            }
        } );
    };

    $scope.postAuth = function( response )
    {
        $scope.$storage.user = response;

        $http.defaults.headers.common[ 'Authorization' ] = "Basic " + response.access_token;
        ipCookie( 'user', JSON.stringify( response ), { 'domain': $scope.app.domain, 'path': '/' } );

        if( $localStorage.hash )
        {
            $localStorage.hash = false;
        }
        if( $localStorage.cbreceipt )
        {
            $localStorage.cbreceipt = false;
        }
        $rootScope.first_login_view = true;
        if( response.is_site )
        {
            Restangular.one( 'user', $localStorage.user.id ).get().then( function( response )
            {
                if( $scope.isAgentOrGreater( response ) )
                {
                    $state.go( 'admin.site.dashboard' );
                    return;
                }
                else
                {
                    if( $state.current.name == 'public.sign.in' || $state.current.name == 'public.sign.in2' ) {
                        $state.go( 'public.app.home', {}, {reload: true} );
                    }
                    else {
                        $rootScope.modal_popup_template = false;
                        $state.go($state.current, $stateParams, {reload: true});
                        $scope.CloseModal('login');
                        return;
                    }
                }
            } )
        }
        else
        {
            Restangular.one( 'company/getUsersCompanies' ).get().then( function( response )
            {
                var selected_team = _.find( response.companies, { selected: 1 } );
                if( !selected_team )
                {
                    $state.go( 'admin.account.memberships' );
                }
                else
                {
                    $state.go( 'admin.team.dashboard' );
                }
            } )
        }
    }

    $scope.isAgentOrGreater = function( $user )
    {
        $role = _.find( $user.role, function( r )
        {
            return r.site_id == $scope.site.id;
        } );

        if( typeof $role == 'undefined' )
        {
            $role = _.find( $user.role, function( r )
            {
                return r.site_id == $site.id;
            } );
        }

        if( typeof $role == 'undefined' )
        {
            return;
        }

        $role_type = Math.min.apply( Math, $role.type.map( function( t )
        {
            return t.role_type;
        } ) );

        if( $role_type <= 5 )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    $scope.$on('$destroy' , function(){
        smModal.hide( '.ui.modal');
    })
} );

app.controller( 'transactionAccountSetupController', function( $rootScope, $scope, $stateParams, Restangular, $state, $localStorage, ipCookie, $http )
{
    $scope.account = {};

    var getUrlVars = function()
    {
        var vars = {};
        var parts = window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value )
        {
            vars[ key ] = decodeURIComponent( value );
        } );
        return vars;
    }

    var $_GET = getUrlVars();

    Restangular.all('').customGET('user/transactionAccount/' + $_GET['cbreceipt']).then(function(response){
        $scope.account = response;
    });

    $scope.account.password = '';
    $scope.account.create_new_account = false;
    $scope.email_taken = false;
    $scope.verification_sent = false;
    $scope.account.verification_code = '';

    $scope.postAuth = function( response )
    {
        $scope.$storage.user = response;

        $http.defaults.headers.common[ 'Authorization' ] = "Basic " + response.access_token;
        ipCookie( 'user', JSON.stringify( response ), { 'domain': $scope.app.domain, 'path': '/' } );

        if( $localStorage.hash )
        {
            $localStorage.hash = false;
        }
        if( $localStorage.cbreceipt )
        {
            $localStorage.cbreceipt = false;
        }
        $rootScope.first_login_view = true;
    }

    $scope.saveAccount = function()
    {
        Restangular.all( 'user/saveTransactionAccount' ).customPOST( $scope.account ).then( function( response )
            {
                $scope.postAuth( response );

                $rootScope.modal_popup_template = false;
                delete $rootScope.$_GET['cbreceipt'];
                $state.go($state.current, $stateParams, {reload: true});
                $scope.CloseModal('transaction-account-setup');
            },
            function( response )
            {
                if( response && response.data && response.data.message && response.data.message == 'User email already exists' )
                {
                    $scope.email_taken = true;
                    $scope.verification_sent = false;
                    $scope.verification_failed = false;
                }
                else if( response && response.data && response.data.message && response.data.message == 'Verification code invalid' )
                {
                    $scope.email_taken = true;
                    $scope.verification_sent = false;
                    $scope.verification_failed = true;
                }
            } );
    }

    $scope.sendVerificationCode = function()
    {
        Restangular.all( 'user/sendVerificationCode' ).customPOST( $scope.account ).then( function( response )
        {
            $scope.verification_sent = true;
            $scope.account.verification_code = '';
        } );
    }

    $scope.associateAccount = function()
    {
        $scope.account.transaction = $_GET[ 'cbreceipt' ];
        Restangular.all( 'user/associateTransactionAccount' ).customPOST( $scope.account ).then( function( response )
        {
            $scope.postAuth( response );

            $rootScope.modal_popup_template = false;
            delete $rootScope.$_GET['cbreceipt'];
            $state.go($state.current, $stateParams, {reload: true});
            $scope.CloseModal('transaction-account-setup');
        } );
    }

    $scope.associateNewAccount = function()
    {
        $scope.account.transaction = $_GET[ 'cbreceipt' ];
        Restangular.all( 'user/registerTransactionAccount' ).customPOST( $scope.account ).then( function( response )
        {
            $scope.postAuth( response );

            $rootScope.modal_popup_template = false;
            delete $rootScope.$_GET['cbreceipt'];
            $state.go($state.current, $stateParams, {reload: true});
            $scope.CloseModal('transaction-account-setup');
        } );
    }
} );