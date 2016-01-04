app.directive( 'smUploader', function( $localStorage, $parse, notify, Restangular, smModal, $timeout )
{
	return {
		restrict: 'A',
		require: 'ngModel',

		link: function( scope, elem, attr, ctrl )
		{
			elem.on( 'click', function()
			{
				var key = attr.smUploader;
				var post = attr.restangular;
				var model = attr.ngModel;
				var awskey = attr.ngAwskey;
				var allow_multiple = attr.allowmultiple ? attr.allowmultiple : true;
				scope.privacy = attr.privacy ? attr.privacy : false;
				var hideLink = attr.hidelink ? attr.hidelink : false;

				if( post )
				{
					var rest = Restangular.all( post );
				}

				console.log( 'allow_multiple', allow_multiple, attr );

				smModal.Show( null, { modal_options: { allowMultiple: allow_multiple } },
					{ templateUrl: 'templates/modals/newMediaItem.html', controller: 'modalMediaController' },
					function( item )
					{
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
					}
				)

				/*$(".upload.modal")
				 .modal('setting',{
				 onApprove: function(){
				 alert(attributes.smDelete);
				 scope.deleteResource(attributes.smDelete)
				 }
				 })
				 .modal('show');*/

			} )

		}
	};
} );
app.controller( 'modalMediaController', function( $scope, Upload, close )
{
	console.log( 'we started up' );
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
					var returnObject = {};

					returnObject.file = data.file_name;

					if( data.aws_key !== undefined )
					{
						returnObject.aws_key = data.aws_key;
					}

					close( returnObject );

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