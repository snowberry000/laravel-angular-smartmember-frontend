var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.pages.bridge-page",{
			url: "/bridge-page/:id?",
			templateUrl: "/templates/components/admin/site/pages/bridge-page/bridge-page.html",
			controller: "BridgePageController",
			resolve: {
				$page: function( Restangular, $site, $stateParams )
				{
					if( $stateParams.id )
						return Restangular.one( 'bridgePage', $stateParams.id ).get();
					else
						return { site_id: $site.id, access_level_type: 4 }
				},
				$templates: function( Restangular )
				{
					return Restangular.all( 'bridgeTemplate' ).customGETLIST( 'getlist' );
				},
				$emailLists: function( Restangular, $site )
				{
					return Restangular.all( 'emailList' ).getList();
				}
			}
		})
}); 

app.controller("BridgePageController", function ($scope, $localStorage, $site , $page ,$templates, $state, $stateParams, $modal, $filter, Restangular, toastr, Upload, $rootScope, $window, $emailLists, $sce) {
    if(!$page.id)
    {
        $page.site_id=$rootScope.site.id;
    }

	$scope.bridgepage = $page;
    $scope.templates = $templates;
    $scope.visible = false;

    $scope.current_url = $rootScope.app.domain.indexOf( 'smartmember' ) != -1 ? $rootScope.app.subdomain + '.'+ $rootScope.app.domain : $rootScope.app.domain;
    if ($scope.bridgepage.id == undefined)
    {
        $scope.template = $scope.templates[1];
    } else {
        $scope.template = _.findWhere($scope.templates, {id: $scope.bridgepage.template_id});
    }
    $scope.bridgepage.id ? $scope.page_title = 'Edit page' : $scope.page_title = 'Create page';

    var seo = {};
    if ($page.seo_settings) {
        $.each($page.seo_settings, function (key, data) {
            seo[data.meta_key] = data.meta_value;

        });
    }
    $scope.bridgepage.seo_settings = seo;

    var swapspot = {};
    //initiate default swapspot value
    if ($page.swapspots)
    {
        $.each($page.swapspots, function (key, data) {
           swapspot[data.name] = data.value;
        });
    }
    $scope.bridgepage.swapspot = swapspot;
    $scope.emailLists = $emailLists;

    if ($scope.bridgepage.id == undefined)
    {
        $scope.bridgepage.swapspot.greentime = 0;
        $scope.bridgepage.swapspot.enable_timer = 'block';
        $scope.bridgepage.swapspot.timer_settings = 2;
        $scope.bridgepage.swapspot.duration = 1;
        $scope.bridgepage.swapspot.interval = 'hours';
        $scope.bridgepage.swapspot.show_guarantee_text = 'block';
        $scope.bridgepage.swapspot.time_end_action = 1;
        $scope.bridgepage.swapspot.enable_popup = 0;
        $scope.bridgepage.swapspot.emailListId = $emailLists[0];
    } else {
        $scope.bridgepage.swapspot.optin_action = $sce.trustAsResourceUrl($scope.bridgepage.swapspot.optin_action);
        $scope.bridgepage.swapspot.emailListId = _.findWhere( $scope.emailLists, {id: parseInt( $scope.bridgepage.swapspot.sm_list_id ) }) || _.findWhere( $scope.emailLists, {id: $scope.bridgepage.swapspot.sm_list_id + '' });

        if( $scope.bridgepage.swapspot.access_levels ) {
            var old_level_ids = $scope.bridgepage.swapspot.access_levels.split(',');
            $scope.bridgepage.swapspot.access_levels = [];

            angular.forEach( old_level_ids, function(value){
                var new_level = _.findWhere( $scope.access_levels, {id: parseInt( value )}) || _.findWhere( $scope.access_levels, {id: value + ''});

                if( new_level )
                    $scope.bridgepage.swapspot.access_levels.push( new_level );
            });
        }
    }
    if ($scope.bridgepage.swapspot.enable_popup)
    {
        $scope.bridgepage.swapspot.enable_popup = parseInt($scope.bridgepage.swapspot.enable_popup);
    }

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.imageUpload = function(files){

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
                    editor.insertImage($scope.editable, data.file_name);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
        }
    }

    $scope.toTimeStamp = function($event)
    {
        if ($scope.bridgepage.swapspot.day)
        {
            $scope.bridgepage.swapspot.timestamp = moment($scope.bridgepage.swapspot.day).format('x');
        }
    }

    if ($scope.bridgepage.swapspot.enable_timer)
    {
        $scope.bridgepage.swapspot.timer_column = 'col-sm-8';
    } else {
        $scope.bridgepage.swapspot.timer_column = 'col-sm-12';
    }

    $scope.toTimeStampGreen = function()
    {
        switch($scope.bridgepage.swapspot.interval)
        {
            case 'minutes':
                $scope.bridgepage.swapspot.greentime = $scope.bridgepage.swapspot.duration * 60 * 1000;
                break;
            case 'hours':
                $scope.bridgepage.swapspot.greentime = $scope.bridgepage.swapspot.duration * 3600 * 1000;
                break;
            case 'days':
                $scope.bridgepage.swapspot.greentime = $scope.bridgepage.swapspot.duration * 3600 * 24 * 1000;
                break;
            case 'months':
                $scope.bridgepage.swapspot.greentime = $scope.bridgepage.swapspot.duration * 3600 * 24 * 30 * 1000;
                break;
        }
    }

    $scope.onBlurTitle = function ($event) {
        if (!$scope.bridgepage.permalink)
            $scope.bridgepage.permalink = $filter('urlify')($scope.bridgepage.title);
        $scope.bridgepage.seo_settings.fb_share_title = $scope.bridgepage.title;
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.bridgepage.permalink)
            $scope.bridgepage.permalink = $filter('urlify')($scope.bridgepage.permalink);
    }

    $scope.cloneBridgePage = function () {
        $scope.bridgepage.put().then(function(page){
            toastr.success("Bridge page has been updated!");
            $scope.bridgepage = page;

            var clonedBridgePage = {
                access_level_type: $scope.bridgepage.access_level_type,
                permalink: $scope.bridgepage.permalink,
                seo_settings: $scope.bridgepage.seo_settings || {},
                site_id: $scope.bridgepage.site_id,
                swapspot: $scope.bridgepage.swapspot || {},
                template_id: $scope.bridgepage.template_id,
                title: $scope.bridgepage.title,
            };

            $scope.bridgepage = clonedBridgePage;

            console.log('cloned page: ', $scope.bridgepage );

            $scope.save(true);
        });
    }

    $scope.setColumn = function () {
        if ($scope.bridgepage.swapspot.enable_timer == 'block')
        {
            $scope.bridgepage.swapspot.timer_column = 'col-sm-8';
        } else {
            $scope.bridgepage.swapspot.timer_column = 'col-sm-12';
        }
    }

    $scope.save = function (cloned) {

        if ($scope.bridgepage.permalink == '' || $scope.bridgepage.permalink == undefined) {
            toastr.error("Permalink is required");
            return;
        }

        if ($scope.bridgepage.title == '' || $scope.bridgepage.title == undefined)
        {
            toastr.error("Titlte is required");
            return;
        }

        if ($scope.bridgepage.swapspot.enable_timer)
        {
            $scope.bridgepage.swapspot.timer_column = 'col-sm-8';
        } else {
            $scope.bridgepage.swapspot.timer_column = 'col-sm-12';
        }

        if ($scope.bridgepage.swapspot.day)
        {
            $scope.bridgepage.swapspot.timestamp = moment($scope.bridgepage.swapspot.day).format('x');
        }

        if( $scope.bridgepage.permalink == '' )
            this.onBlurTitle(null);

        if ($scope.bridgepage.swapspot.optin_type == 'sm')
        {
            $scope.bridgepage.swapspot.optin_name_field = 'name';
            $scope.bridgepage.swapspot.optin_email_field = 'email';
            $scope.bridgepage.swapspot.optin_action = 'https://api.smartmember.com/optin';
            $scope.bridgepage.swapspot.option_hidden_fields = '';
            if ( $scope.bridgepage.swapspot.emailListId != undefined)
            {
                $scope.bridgepage.swapspot.option_hidden_fields += '<input type="hidden" name="list" value="' + $scope.bridgepage.swapspot.emailListId.id + '">\n' +
                    '<input type="hidden" name="team" value="' + $scope.bridgepage.swapspot.emailListId.company_id + '">\n';
                $scope.bridgepage.swapspot.sm_list_id = $scope.bridgepage.swapspot.emailListId.id;
            }
            if ( $scope.bridgepage.swapspot.access_levels != undefined)
            {
                var level_ids = [];

                angular.forEach( $scope.bridgepage.swapspot.access_levels, function(value){
                    level_ids.push( value.id );
                });

                level_ids = level_ids.join(',');

                $scope.bridgepage.swapspot.option_hidden_fields += '<input type="hidden" name="access_levels" value="' + level_ids + '">';
                $scope.bridgepage.swapspot.access_levels = level_ids;
            }
            $scope.bridgepage.swapspot.option_hidden_fields += '<input type="hidden" name="redirect_url" value="' + $scope.bridgepage.swapspot.redirect_url + '">\n' ;

        }

        if ($scope.bridgepage.swapspot.turn_optin_to_member == '1' || $scope.bridgepage.swapspot.turn_optin_to_member)
        {
            if ($scope.bridgepage.swapspot.option_hidden_fields != undefined && $scope.bridgepage.swapspot.option_hidden_fields.indexOf('site_id') == -1)
            {
                $scope.bridgepage.swapspot.option_hidden_fields += '<input type="hidden" name="site_id" value="' + $scope.bridgepage.site_id + '">';
            }
        }


        
        $scope.bridgepage.template_id = $scope.template.id;
        $scope.bridgepage.site_id = $site.id;
        if ($scope.bridgepage.id) {
            $scope.bridgepage.put();
            $state.go("admin.site.pages.bridge-pages");
            toastr.success("Bridge page has been updated!");
        }
        else {
            Restangular.all('bridgePage').post($scope.bridgepage).then(function (page) {
                $scope.bridgepage = page;

                if( typeof cloned == 'undefined' || cloned != true) {
                    $state.go("admin.site.pages.bridge-pages");
                    toastr.success("Bridge page has been saved!");
                } else {
                    $state.go("admin.site.pages.bridge-page",{id: page.id});
                    window.scrollTo(0,0);
                    toastr.success("Bridge page has been cloned!");
                }
            });
        }

    }

    $scope.addSiteHiddenField = function()
    {
        if ($scope.bridgepage.swapspot.option_hidden_fields != undefined)
        {
            $scope.bridgepage.swapspot.option_hidden_fields += '<input type="hidden" name="site_id" value="' + $scope.bridgepage.site_id + '">';
        } else {
            $scope.bridgepage.swapspot.option_hidden_fields = '<input type="hidden" name="site_id" value="' + $scope.bridgepage.site_id + '">';
        }
    }

    $scope.setForm = function() {
        $scope.isSetForm = true;
        var optin_html = $scope.bridgepage.swapspot.optin_form;

        var hidden_inputs = '';
        $( optin_html ).find('input[type=hidden]').each(function(){
            hidden_inputs += $(this).wrap('<div>').parent().html() + "\n";
        } );

        if( typeof $( 'input', optin_html)[0].closest('form') != 'undefined' && typeof $( $( 'input', optin_html)[0].closest('form') ).attr('action') != 'undefined' ) {
            var form_action = $($('input', optin_html)[0].closest('form')).attr('action');

            var name_field = '';

            if (typeof $(optin_html).find('input[name=name]') != 'undefined' && $(optin_html).find('input[name=name]').length > 0)
                name_field = 'name';
            else if (typeof $(optin_html).find('input[name=full_name]') != 'undefined' && $(optin_html).find('input[name=full_name]').length > 0)
                name_field = 'full_name';
            else if (typeof $(optin_html).find('input[name=fname]') != 'undefined' && $(optin_html).find('input[name=fname]').length > 0)
                name_field = 'fname';
            else {
                $(optin_html).find('input:not([type=hidden])').each(function () {
                    if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name').indexOf('name') != -1) {
                        name_field = $(this).attr('name');
                        return false;
                    }
                });
            }
            var name_options = [];
            var email_options = [];

            $(optin_html).find('input:not([type=hidden]):not([type=submit]):not([type=image])').each(function () {
                if (typeof $(this).attr('name') != 'undefined') {
                    name_options.push($(this).attr('name'));
                    email_options.push($(this).attr('name'));
                }
            });

            $scope.bridgepage.swapspot.name_options = name_options;
            $scope.bridgepage.swapspot.email_options = email_options;

            var email_field = $(optin_html).find('input[name=email]').attr('name');
            if (typeof $(optin_html).find('input[name=email]') != 'undefined' && $(optin_html).find('input[name=email]').length > 0)
                email_field = 'email';
            else if (typeof $(optin_html).find('input[name=email_address]') != 'undefined' && $(optin_html).find('input[name=email_address]').length > 0)
                email_field = 'email_address';
            else if (typeof $(optin_html).find('input[name=emailaddress]') != 'undefined' && $(optin_html).find('input[name=emailaddress]').length > 0)
                email_field = 'emailaddress';
            else {
                $(optin_html).find('input:not([type=hidden])').each(function () {
                    if (typeof $(this).attr('name') != 'undefined' && $(this).attr('name').indexOf('email') != -1) {
                        email_field = $(this).attr('name');
                        return false;
                    }
                });
            }
            if ( $scope.bridgepage.swapspot.option_hidden_fields != undefined)
            {
                $scope.bridgepage.swapspot.option_hidden_fields += hidden_inputs;
            } else {
                $scope.bridgepage.swapspot.option_hidden_fields = hidden_inputs;
            }

            $scope.bridgepage.swapspot.optin_action = form_action;
            $scope.bridgepage.swapspot.optin_name_field = name_field;
            $scope.bridgepage.swapspot.optin_email_field = email_field;
            toastr.success("Your form has been parsed successfully");
        }
        else
        {
            toastr.error("We could not parse this form. Make sure it has valid form tag");
        }
    }
});