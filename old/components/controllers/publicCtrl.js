app.controller('PublicController', function ($scope, $rootScope, smModal, $timeout, $localStorage,$location, Restangular, $stateParams, $state, $site, $http, toastr, $window, Upload) {
    if( location.href.indexOf( '?theme_options' ) > -1 )
        $rootScope.app.show_engine = true;

    $rootScope.meta_data = {};

    $rootScope.meta_data = {
        site_background_color: '#FFFFFF',
	    navigation_background_color: '#FFFFFF',
	    navigation_text_color: '#1b1c1d',
	    section_background_color: '#FFFFFF',
	    headline_text_color: '#1b1c1d',
	    module_label_text_color: '#FFFFFF',
	    module_label_background_color: '#2185d0',
	    main_button_text_color: '#FFFFFF',
	    main_button_background_color: '#2185d0',
	    site_top_background_color: '',
	    site_middle_background_color: '',
	    site_bottom_background_color: '',
        footer_text_color: '#1b1c1d',
        logo_position: 'left',
        show_nav_icons: true,
	    icon_position: 'top',
	    navigation_style: '',
	    navigation_location: '',
	    logo_size: 'medium',
	    logo_border: '',
        page_background_style: 'fluid',
	    sidebar_position: 'right',
	    module_label_style: 'ribbon',
	    module_label_position: 'left',
	    icon_size: 'fa-2x'
    };

    $scope.menuItemLabel=function(){
        $('.ui-iconpicker').toggleClass('open');
    }


	$scope.PopModal = function( the_modal )
	{
		$timeout( function()
		{
			if( !the_modal )
				the_modal = 'login';

			console.log($state.current.name)

			//smModal.hide( '.ui.modal.' + option);

			smModal.toggle( '.ui.modal.' + the_modal +':first', {
				closable: $state.includes('public.sign') ? false : true,
				allowMultiple: false,
				blurring: false,
				dimmerSettings: {
					opacity: 0.3
				}
			} );
		}, $state.includes('public.sign') ? 1000 : 100 );
	};

    $scope.CloseModal = function( the_modal )
    {
        if( !the_modal )
	        smModal.hide( '.ui.modal' );
	    else
            smModal.hide( '.ui.modal.' + the_modal +':first' );
    }

    $scope.loginModal = function(){
        $rootScope.modal_popup_template = 'templates/public/themes/default/sign/login.html';
    }

    $scope.registerModal = function(){
        $rootScope.modal_popup_template = 'templates/public/themes/default/sign/register.html';
    }

    var getUrlVars = function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = decodeURIComponent(value);
        });
        return vars;
    }

    $rootScope.$_GET = getUrlVars();

    if( $rootScope.$_GET['cbreceipt'] ) {
        if (!$localStorage.user) {
            $rootScope.modal_popup_template = 'templates/public/themes/default/sign/transactionAccountSetup.html';
        } else {
            $http.defaults.headers.common['Authorization'] = "Basic " + $localStorage.user.access_token;
            Restangular.all('').customGET('user/transactionAccess/' + $rootScope.$_GET['cbreceipt'] ).then(function(response){
                location.href = location.href.substr(0, location.href.indexOf('?') );
            });
        }
    }

    $scope.setMetaData = function(){
        $rootScope.current_theme = 'default';

        if( $site && $site.meta_data ) {
            $.each($site.meta_data, function (key, data) {
                $rootScope.meta_data[data.key] = data.value;
                if (data.key == 'theme') {
                    $rootScope.current_theme = data.value;
                }
            });
        }

        $scope.current_theme_options = [];
        console.log( 'current theme: ', $rootScope.current_theme);

        angular.forEach( $rootScope.current_theme.theme_options, function(value){
            var theme_option = false;
            if( typeof value == 'string' ) {
                theme_option = _.findWhere(global_theme_options, {slug: value});
                if( theme_option )
                    $scope.current_theme_options.push( theme_option );
            } else if( typeof value == 'object' ) {
                if( typeof value.slug != 'undefined' )
                    theme_option = _.findWhere(global_theme_options, {slug: value});

                theme_option = theme_option || {};

                angular.forEach( value, function(val,key){
                    theme_option[key] = val;
              });

                if( theme_option )
                    $scope.current_theme_options.push( theme_option );
          }
        });
       //Set Current Theme Settings
        //if($rootScope.current_theme == "semanc"){
            $scope.sidebar_template = "templates/public/common/theme-engine.html";
        //}else{
        //    $scope.sidbar_template = "templates/public/common/right_sidebar.html";
        //}
    }
        

    $scope.themeSelected = function() {
        $localStorage.theme = $scope.options.theme;

        //$scope.RefreshScreen();
    }

    $scope.openThemeSelection = function() {
        $scope.options.theme_selection = true;
    }

    $scope.cancelThemeSelection = function() {
        var picker = $scope.options.theme;
        $scope.options.theme = $scope.options.original_theme;
        $scope.options.theme_changed = false;
        $scope.options.theme_selection = false;
        $localStorage.theme = undefined;
        if ($scope.options.theme != picker)
        {
            $scope.RefreshScreen();
        }
    }

    $scope.saveTheme = function() {
        var meta_data = {'theme' : $scope.options.theme};
        Restangular.all('siteMetaData').customPOST(meta_data, "save").then(function () {
            toastr.success("Theme was set!");
        });
        $scope.options.theme_changed = false;
        $scope.options.original_theme = $scope.options.theme;
        $scope.options.theme_selection = false;
        $localStorage.theme = undefined;
    }

    $scope.RefreshScreen = function()  {

        $state.go($state.current, $stateParams, {reload: 'public.app'});
    }

    $scope.$watch('files', function () {
        console.log('anything running here?');
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        console.log('how about here?', files);
        if (files) {
            $scope.loading = true;

            var file = files;

            Upload.upload({
                url: $scope.app.apiUrl + '/utility/upload' + ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
                file: file
            })
                .success(function (data, status, headers, config) {
                    var returnObject = {};

                    returnObject.file = data.file_name;

                    if( data.aws_key !== undefined )
                        returnObject.aws_key = data.aws_key;

                    $modalInstance.close( returnObject );
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + data);
                });
        }
    };
    
    $scope.setMetaData();
});