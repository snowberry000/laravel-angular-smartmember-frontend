var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.email.forms", {
			url: "/forms",
			templateUrl: "/templates/components/public/app/admin/email/forms/forms.html",
			controller: "EmailFormsController"

		} )
} );

app.controller( "EmailFormsController", function( $scope, $rootScope, $localStorage, Restangular, toastr, $state, Upload, $q )
{

	$scope.site_options = {};
	$site = $rootScope.site;
	$scope.emailList = { account_id: $localStorage.user.id };
	$scope.site_options.isOpen = false;
	$scope.site_options.redirect_url = $scope.app.appUrl;
	$scope.site_options.access_levels = [];
	$scope.url = $scope.app.apiUrl + '/optin';
	$scope.myForm = '';
	$scope.show_name_input = 1;
	$scope.editorOptions2 = {
		lineNumbers: true,
		matchBrackets: true,
		styleActiveLine: true,
		mode: 'htmlmixed'
	};

	$scope.loading = true;
	
	$scope.showCreateList = false;

	// $emailList = Restangular.all('emailList').getList().then(function(response){console.log(response);$scope.emailLists = response; $scope.emailListId = response[0];})
	$emailList = Restangular.all( '' ).customGET( 'emailList?bypass_paging=true' ).then( function( data )
	{
		$scope.emailLists = Restangular.restangularizeCollection( null, data.items, 'emailList' );
		$scope.emailListId = data.items[ 0 ];
        $scope.setForm();
	} );

	$q.all( [ $emailList ] ).then( function( res )
	{
		$scope.loading = false;
	} )

	$scope.copied = function()
	{
		toastr.success( "Link copied" );
	}
	$scope.toogleListCreate = function () {
		$scope.showCreateList=!$scope.showCreateList;
	}

	$scope.setForm = function()
	{
		var site_id = $site.id;

		if( $scope.turn_optin && site_id == undefined )
		{
			toastr.warning( "Please choose which site you want to turn optins to members" );
			return;
		}
		//swapping out the redirect url to just be a text box for now since this is at the team level, we don't know what site this is for
		//var redirect_url = $scope.site_options.redirect_url.indexOf( 'http://' ) == -1 && $scope.site_options.redirect_url.indexOf( 'https://' ) == -1 ? 'http://' + ( $scope.app.domain == $scope.app.rootDomain ? $scope.app.subdomain + '.' + $scope.app.domain : $scope.app.domain ) + '/' + $scope.site_options.redirect_url : $scope.site_options.redirect_url;
		$scope.myForm = '<form action="' + $scope.url + '" method="post">' + "\n" +
			"\t" + '<input type="hidden" name="list" value="' + $scope.emailListId.id + '">' + "\n" +
            "\t" + '<input type="hidden" name="account_id" value="' + $scope.emailListId.account_id + '">' + "\n" +
            "\t" + '<input type="hidden" name="redirect_url" value="' + $scope.site_options.redirect_url + '">' + "\n";
		if( $scope.show_name_input )
		{
			$scope.myForm += "\t" + '<input name="name" type="text" placeholder="Your Name">' + "\n";
		}
		if( $scope.turn_optin )
		{
			$scope.myForm += "\t" + '<input type="hidden" name="site_id" value="' + site_id + '">' + "\n";

            if( $scope.site_options.access_levels && $scope.site_options.access_levels.length > 0 )
            {
                var access_levels = [];

                angular.forEach( $scope.site_options.access_levels, function(value){
                    access_levels.push( value.id );
                });

                if( access_levels && access_levels.length > 0 )
                    $scope.myForm += "\t" + '<input type="hidden" name="access_levels" value="' + access_levels.join(',') + '">' + "\n";
            }
		}
		$scope.myForm += "\t" + '<input name="email" type="email" placeholder="Email address">' + "\n" +
			"\t" + '<button type="submit">Subscribe</button>' + "\n" +
            "\t" + '<br>' + "\n" +
			'</form>';
	}

	$scope.createList = function ($list) {
		$scope.emailList.name = $list;
		$scope.emailList.account_id = $localStorage.user.id;
		$scope.emailList.list_type = 'user';
		var list = angular.copy($scope.emailList);
		Restangular.service( 'emailList' ).post(list )
				.then( function( response )
				{
					$scope.emailListId = response;
					$scope.emailLists.push( response );
					$scope.toogleListCreate ();
                    $scope.emailList.name = '';
                    $scope.setForm();
				} );
	}


	// $scope.createNewList = function()
	// {

	// 	var modalInstance = $modal.open( {
	// 		templateUrl: 'templates/modals/emailListCreator.html',
	// 		controller: function( $scope, $uibModalInstance )
	// 		{
	// 			$scope.save = function( list )
	// 			{
	// 				//console.log(list);
	// 				$uibModalInstance.close( $scope.list );
	// 			}
	// 			$scope.cancel = function()
	// 			{
	// 				$uibModalInstance.dismiss( 'cancel' );
	// 			};
	// 		},
	// 		scope: $scope
	// 	} );
	// 	modalInstance.result.then( function( list )
	// 	{
	// 		Restangular.service( 'emailList' ).post( list )
	// 			.then( function( response )
	// 			{
	// 				$scope.emailListId = response;
	// 				$scope.emailLists.push( response );
	// 			} );
	// 	} )
	// }

	$scope.selectUrl = function( item, selected_url, show_next )
	{

		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle', 'bridgePage' ];
		if( !selected_url )
		{
			return;
		}
		if( api_resources.indexOf( selected_url ) < 0 )
		{
			$scope.site_options.redirect_url = selected_url;
			$scope.show_next = show_next;
			$scope.close();
		}
		else if( selected_url == 'download' )
		{
			Restangular.all( '' ).customGET( 'download', { site_id: $site.id } ).then( function( response )
			{
				var downloads = response;
				downloads.forEach( function( entity )
				{
					entity.redirect_url = entity.permalink;
				} )
				$scope.show_next = true;
				$scope.loaded_items = downloads;

			} )
		}
		else
		{
			Restangular.all( selected_url ).getList( { site_id: $site.id } ).then( function( response )
			{
				if( response.route == 'customPage' )
				{
					response.route = 'page';
				}
				if( response.route == 'supportArticle' )
				{
					response.route = 'support-article';
				}
				response.forEach( function( entity )
				{
					entity.redirect_url = entity.permalink;
				} )
				$scope.show_next = true;
				$scope.loaded_items = response.items;

			} )
		}
	}

	$scope.saveEmailList = function( model )
	{

		model.company_id = $sites.company_id;
		Restangular.service( "emailList" ).post( model ).then( function( response )
		{
			toastr.warning( "List created!" );

			if( $scope.emailLists )
			{
				$scope.emailLists.push( response );
			}
			else
			{
				$scope.emailLists = [];
				$scope.emailLists.push( response );
			}
		} );
	}

	$scope.createNewEmaiList = function()
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/emailListCreator.html',
			controller: "modalController",
			scope: $scope
		} );
		modalInstance.result.then( function()
		{
			//modalInstance.close();
			//alert("result called");
		} )
	}

    $scope.init = function()
    {
        var clipboard = new Clipboard( '.copy-button', {
            text: function(trigger) {
                return trigger.getAttribute('data-text');
            }
        } );
    }
} );
