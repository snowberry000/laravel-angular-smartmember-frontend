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

							// $timeout( function()
							// {
							// 	smModal.Refresh();
							// }, 1000 );

							if( rest )
							{
								rest.customPOST( li, "save" ).then( function()
								{
									console.log( "Image is uploaded" );
								} );
							}
						} );
				})

				

				// smModal.Show( null, { modal_options: { allowMultiple: true } , "closeOnModalCompletion": closeOnModalCompletion },
				// 	{ templateUrl: 'templates/modals/newMediaItem.html', controller: 'modalMediaController' },
				// 	function( item )
				// 	{
				// 		if( key )
				// 		{
				// 			var li = {};
				// 			console.log( item )
				// 			li[ key ] = item.file;
				// 			if( model )
				// 			{
				// 				var parsed_model = $parse( model );
				// 				parsed_model.assign( scope, item.file );
				// 				ctrl.$setViewValue( item.file );
				// 			}
				// 			if( awskey && item.aws_key !== undefined )
				// 			{

				// 				var parsed_awskey = $parse( awskey );
				// 				parsed_awskey.assign( scope, item.aws_key );
				// 				ctrl.$setViewValue( item.aws_key );
				// 			}
				// 		}

				// 		$timeout( function()
				// 		{
				// 			smModal.Refresh();
				// 		}, 1000 );


				// 		if( rest )
				// 		{
				// 			rest.customPOST( li, "save" ).then( function()
				// 			{
				// 				console.log( "Image is uploaded" );
				// 			} );
				// 		}
				// 	}
				// )

				// $location.hash('site-logo-uploader');
				    
				// $anchorScroll();

				// $timeout(function(){
				// 	$window.history.back();
				// } , 1000)
				//$location.url = '';
				/*$(".upload.modal")
				 .modal('setting',{
				 onApprove: function(){
				 alert(attributes.smDelete);
				 scope.deleteResource(attributes.smDelete)
				 }
				 })elem
				 .modal('show');*/

			} )

		}
	};
} );

app.controller( 'modalMediaController', function( $scope, $rootScope, $localStorage, $stateParams, Upload,smModal, close, Restangular )
{
	console.log( $rootScope.subdomain == 'my');
	$scope.hide_media = $stateParams.hide_media;
	$scope.media_files = [];
	$scope.youzign_files = [];
	if($localStorage.user && $localStorage.user.access_token && $rootScope.subdomain != 'my')
		Restangular.service('media')
			.getList()
			.then(function(response){
				angular.forEach(response, function(item){
					if (item.type == 'image')
					{
						$scope.media_files.push(item);
					} else if (item.type == 'youzign')
					{
						$scope.youzign_files.push(item);
					}
				})

			});
	
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
			$scope.loading = true;
			//for (var i = 0; i < files.length; i++) {
			var file = files;
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload' +  ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					var returnObject = {};

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