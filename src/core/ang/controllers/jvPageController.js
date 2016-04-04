app.controller( 'adminJVPageController', function( $scope, smModal, Restangular, $localStorage, $location, toastr, $state, $rootScope, Upload )
{
	$scope.jv = {}
	$scope.isChecked = false;
	$scope.urlPopover = { isOpen: false };
	$scope.loading = true;
	$site = $rootScope.site;
	$scope.init = function()
	{
		console.log( 'are we running?' );
		Restangular.all( 'emailList/sendMailLists' ).getList().then( function( response )
		{
			$scope.emailLists = response;
			Restangular.all( 'affiliateJVPage' ).getList().then( function( jv )
			{
				$scope.loading = false;
				if( jv.length > 0 )
				{
					$scope.jv = jv[ 0 ];
				}
				else
				{
					$scope.jv.company_id = $site.company_id;
					$scope.jv.title = "";
				}

				$scope.jv.subscribe_button_text = $scope.jv.subscribe_button_text ?
					$scope.jv.subscribe_button_text : '';
			} );
		} )

	}

	$scope.init();

	$scope.save = function()
	{
		delete $scope.jv.email_list;

		if( $scope.jv.id )
		{
			$scope.jv.put().then( function( response )
			{
				toastr.success( "JV Page has been saved!" );
				smModal.Show( 'public.administrate.site.pages.core.list' );
			} )
		}
		else
		{
			Restangular.all( 'affiliateJVPage' ).post( $scope.jv ).then( function( jv )
			{
				$scope.jv = jv;
				toastr.success( "JV Page has been saved!" );
				smModal.Show( 'public.administrate.site.pages.core.list' );
			} );
		}
	}



	$scope.setUrl = function()
	{
		if( $scope.isChecked )
		{
			$scope.jv.show_thankyou_note = 1;
		}
		else
		{
			$scope.jv.show_thankyou_note = 0;
		}
	}

	$scope.selectUrl = function( item, selected_url, show_next )
	{
		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle', 'bridgePage' ];

        if( !selected_url )
        {
            return;
        }

        if( api_resources.indexOf( selected_url ) < 0 )
		{
			$scope.jv.redirect_url = selected_url;
			item.url = selected_url;
			$scope.close();
			$scope.urlPopover.isOpen = false;
		}
		else if(selected_url == 'post'){
		  Restangular.all(selected_url).customGET('',{site_id: $site.id,view: 'admin'}).then(function(response){
		      var posts = response.items;
		      response.items.forEach(function(entity){
		          entity.url =  entity.permalink;
		      })
		      $scope.show_next = true;
		      $scope.loaded_items = {items : posts };
		        
		  })
		}
		else
		{
			$params = {site_id: $site.id, bypass_paging: true};
			        if(selected_url == 'lesson')
			        {
			            $params.drafted = false;
			        }

			        Restangular.all(selected_url).customGET('',$params).then(function(response){
			            if(response.route == 'customPage')
			                response.route = 'page';
			            if(response.route == 'supportArticle')
			                response.route = 'support-article';
			            if(response && response.items)
			                $.each(response.items,function(key,value){
			                    value.url =  value.permalink;
			                });
			            else if(response)
			                $.each(response,function(key,value){
			                   value.url =  value.permalinwk;
			                });
			            $scope.show_next = true;
			            $scope.loaded_items = response;
			              
			        })
		}
	}

	$scope.subscribe = function()
	{
		if( $scope.jv.email )
		{
			var params = { 'subdomain': $site.subdomain, 'list': $scope.jv.email_list.name, 'email': $scope.jv.email };
			Restangular.one( 'emailSubscriber/subscribe' ).customPOST( params ).then( function( response )
			{
				if( !$scope.jv.show_thankyou_note )
				{
					$location.path( $scope.jv.redirect_url );
				}
				else
				{
					$location.path( '/jvthankyou' );
				}
			} )
		}
	}
} );