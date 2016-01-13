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
				var allow_multiple = attr.allowmultiple ? attr.allowmultiple : true;
				scope.privacy = attr.privacy ? attr.privacy : false;
				var hideLink = attr.hidelink ? attr.hidelink : false;
				scope.testLink = 'https://testtest.com';

				if( post )
				{
					var rest = Restangular.all( post );
				}

				console.log( 'allow_multiple', allow_multiple, attr );

				ModalService.showModal(
					{ templateUrl: 'templates/modals/newMediaItem.html', controller: 'modalMediaController' }
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
								if( awskey && item.aws_key !== undefined )
								{

									var parsed_awskey = $parse( awskey );
									parsed_awskey.assign( scope, item.aws_key );
									ctrl.$setViewValue( item.aws_key );
								}
							}

							$timeout( function()
							{
								smModal.Refresh();
							}, 1000 );


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

app.controller( 'modalMediaController', function( $scope, $localStorage, $stateParams, Upload,smModal, close, Restangular )
{
	Restangular.service('media')
		.getList()
		.then(function(response){
			$scope.media_files = response;
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
					url: $scope.app.apiUrl + '/utility/upload?access_token=' + $localStorage.user.access_token + ( $scope.privacy ? '&private=' + $scope.privacy : '' ),
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
					console.log(returnObject);

					close( returnObject );
					console.log($stateParams.closeOnModalCompletion);
					if($stateParams.closeOnModalCompletion == 'true')
						smModal.Close();

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