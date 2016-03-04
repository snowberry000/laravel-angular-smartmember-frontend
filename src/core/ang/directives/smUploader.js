app.directive( 'smUploader', function( $localStorage, $parse, notify, Restangular, ModalService, $window, smModal, $timeout , $location , $anchorScroll )
{
	return {
		restrict: 'A',
		require: 'ngModel',

		link: function( scope, elem, attr, ctrl )
		{
			elem.on( 'click', function()
			{
				var key = attr.smUploader;
				var closeOnModalCompletion = attr.closeModal;
				var post = attr.restangular;
				var model = attr.ngModel;
				var awskey = attr.ngAwskey;
				var media_item_id = attr.mediaItemId;
                
				var allow_multiple = attr.allowmultiple ? attr.allowmultiple : true;
				scope.privacy = attr.privacy ? attr.privacy : false;
				var hideLink = attr.hidelink ? attr.hidelink : false;
				scope.testLink = 'https://testtest.com';
				var hide_media = attr.ngAwskey ? true : false;
				if( post )
				{
					var rest = Restangular.all( post );
				}

				console.log( 'allow_multiple', allow_multiple, attr );

				ModalService.showModal(
					{ templateUrl: 'templates/modals/newMediaItem.html', controller: 'modalMediaController', inputs: {
					$stateParams: {"closeOnModalCompletion": closeOnModalCompletion , "hide_media" : hide_media}
				} }
				).then( function( modal ){
						modal.element
						.modal({
							allowMultiple: true,
                            onShow: function(){
                                $(this).css('z-index', '1000000');
                                $(this).closest('.ui.dimmer').css('z-index', '1000000');
                            },
							onApprove: function(){
								scope.deleteResource(attributes.smDelete);
								return true;
							}
						})
						.modal('show');

						modal.close.then( function( item )
						{
							modal.element.remove();
							if( key )
							{
								var li = {};
								console.log( item )
								li[ key ] = item.file;
								//alert(item.file);

								if( model )
								{
									var parsed_model = $parse( model );

									parsed_model.assign( scope, item.file );
									ctrl.$setViewValue( item.file );
								}
                                if( media_item_id )
								{
									var parsed_media_item_id = $parse( media_item_id );
                                    parsed_media_item_id.assign( scope, item.media_item_id );
									ctrl.$setViewValue( item.media_item_id );
								}
								if( awskey && item.aws_key !== undefined )
								{

									var parsed_awskey = $parse( awskey );
									parsed_awskey.assign( scope, item.aws_key );
									ctrl.$setViewValue( item.aws_key );
								}
							}

							if( rest )
							{
								rest.customPOST( li, "save" ).then( function()
								{
									console.log( "Image is uploaded" );
								} );
							}
						} );
				})

			} )

		}
	};
} );

app.controller( 'modalMediaController', function( $scope,toastr, $rootScope, $localStorage, $stateParams, Upload,smModal, close, Restangular )
{

	
	$scope.mediaTab={status:'true'};

	$scope.hideMediaitems = $rootScope.site.capabilities.indexOf('manage_content') < 0 ? true : false;

	console.log( $rootScope.subdomain == 'my');
	$scope.hide_media = $stateParams.hide_media;
	$scope.media_files = [];
	$scope.youzign_files = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
	$scope.pagination_file = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );
	$scope.$watch( 'pagination_file.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate_file();
		}
	} );

	$scope.paginate = function(search)
	{
		if (search)
		{
			$scope.pagination.current_page = 1;
		}

		if( true )
		{
			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page };

			Restangular.all( '' ).customGET( 'media' + '?p=' + $params.p + '&type=youzign' ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.youzign_files = data.items;
			} );
		}
	}

	$scope.paginate_file = function(search)
	{
		if (search)
		{
			$scope.pagination_file.current_page = 1;
		}

		if( true )
		{
			$scope.loading = true;

			var $params = { p: $scope.pagination_file.current_page };

			Restangular.all( '' ).customGET( 'media' + '?p=' + $params.p + '&type=image' ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination_file.total_count = data.total_count;
				$scope.media_files = data.items;
			} );
		}
	}

	if($localStorage.user && $localStorage.user.access_token && $rootScope.subdomain != 'my')
	{
		$scope.paginate();
		$scope.paginate_file();
	}
	
	$scope.isImage =function($url) {
		$str = $url.split('.');
		if($str.length >=1){
			var ext = $str[$str.length-1];
			var imageExts = ['jpg','jpeg','png','gif','JPG','JPEG','PNG','GIF'];
			var result = imageExts.indexOf(ext);
			if(result == -1){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}		
	}

	$scope.getFileName =function($url) {
		$url = decodeURI($url);
		$str = $url.split('/');
		if($str.length >=1)
			return $str[$str.length-1];
		else
			return " ";
	}

	$scope.loading = false;
	$scope.cancel = function()
	{
		$modalInstance.dismiss();
	};
	$scope.ok = function()
	{
		$modalInstance.close();
	};
	$scope.insert = function()
	{
		$modalInstance.close();
	}

	$scope.$watch( 'files', function()
	{
		$scope.upload( $scope.files );
	} );

	$scope.select = function(media){
		close({file: media.source});
		$( '.ui.modal.upload' ).modal( 'hide' );
	}

	$scope.upload = function( files )
	{
		//console.log('we are trying to upload a file', files.length, files );
		if( files )
		{
			console.log( files.name );
			if(files.name.indexOf('.exe')>=0)
			{
				toastr.error("file cant be uploaded");
				$( '.ui.modal.upload' ).modal( 'hide' );

				return;
				
			}

			$scope.loading = true;
			//for (var i = 0; i < files.length; i++) {
			var file = files;
			//console.log('file');
			//console.log(file);
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload' +  ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					var returnObject = {};
					$rootScope.downloadLink = data.file_name;
					// alert($rootScope.downloadLink);
					returnObject.file = data.file_name;

					if( data.aws_key !== undefined )
					{
						returnObject.aws_key = data.aws_key;
					}
                    if( data.media_item_id !== undefined )
                    {
                        returnObject.media_item_id = data.media_item_id;
                    }
					console.log(returnObject);
					close( returnObject );
					console.log($stateParams);

					if($stateParams.closeOnModalCompletion == 'true')
						smModal.Close();
					// $('.ui.modal.small.upload').modal('hide');
					$( '.ui.modal.upload' ).modal( 'hide' );


				} ).error( function( data, status, headers, config )
			{
				console.log( 'error status: ' + data );
			} );

			//allow only 1 file to be uploaded
			//break;
			//}
		}
	};

} );
app.controller( 'inlineMediaController', function( $scope, Upload )
{
	$scope.loading = false;

	$scope.$watch( 'files', function()
	{
		$scope.upload( $scope.files );
	} );

	$scope.upload = function( files )
	{
		//console.log('we are trying to upload a file', files.length, files );
		if( files )
		{
			console.log( files.name );
			$scope.loading = true;
			//for (var i = 0; i < files.length; i++) {
			var file = files;

			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload' + ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					$scope.loading = false;

					var returnObject = {};

					returnObject.file = data.file_name;

					if( data.aws_key !== undefined )
					{
						returnObject.aws_key = data.aws_key;
					}

					$scope.$parent.meta_data[ $scope.data_to_update ] = returnObject.file;
				} ).error( function( data, status, headers, config )
			{

			} );

			//allow only 1 file to be uploaded
			//break;
			//}
		}
	};

} );