var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.email.queue", {
			url: "/queue",
			templateUrl: "/templates/components/public/administrate/team/email/queue/queue.html",
			controller: "EmailQueueController"
		} )
} );

app.controller( "EmailQueueController", function( $scope,smModal,$rootScope, $localStorage, $location, $state, Restangular, toastr )
{
	$site = $rootScope.site;

	$scope.template_data = {
		title: 'EMAIL REPORTING',
		description: 'Queued emails are sent out as quick as every 60 seconds, 4000 at a time.',
		singular: 'email job',
		edit_route: '',
		api_object: 'emailJob'
	}

	$scope.data = [];
	$scope.pagination = {
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

	$scope.paginate = function()
	{

		if( typeof $scope.data[ $scope.pagination.current_page ] != 'object' )
		{

			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
			} );
		}
	}

	$scope.paginate();

	$scope.search = function()
	{
		$scope.loading = true;
		$scope.data = [];
		$scope.pagination = { current_page: 1 };
		var $params = { p: $scope.pagination.current_page };

		if( $scope.query )
		{
			$params.q = encodeURIComponent( $scope.query );
		}

		Restangular.all( '' ).customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
		{
			$scope.pagination.total_count = data.total_count;

			$scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

			$scope.loading = false;
		}, function( error )
		{
			$scope.data = [];
		} )
	}

	$scope.sendTest = function( email )
	{
		Restangular.one( 'email', email ).get().then( function( response )
		{
			if( typeof $scope.emailSettings == 'undefined' )
			{
				Restangular.all( 'emailSetting' ).customGET( 'settings' ).then( function( emailSettings )
				{
					$scope.emailSettings = emailSettings;

					$scope.promptSendTestEmail( response );
				} );
			}
			else
			{
				$scope.promptSendTestEmail( response );
			}
		} );
	}

	$scope.promptSendTestEmail = function( response )
	{
		swal( {
			title: "Send Test E-mail",
			text: "Choose where to send test e-mail:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "e-mail address",
			inputValue: typeof $scope.emailSettings.test_email_address != 'undefined' ? $scope.emailSettings.test_email_address : ''
		}, function( inputValue )
		{
			if( inputValue === false )
			{
				return false;
			}
			if( inputValue === "" )
			{
				swal.showInputError( "You need to enter an e-mail address!" );
				return false
			}
			response.admin = inputValue;

			Restangular.service( "email/sendTest" ).post( response ).then( function( response )
			{
				toastr.success( "Test e-mail sent!" );
				swal.close();
			} );
		} );
	}

	$scope.deleteJob = function( job )
	{
		Restangular.service( "emailJob/deleteJob" ).post( { id: job } ).then( function( response )
		{
			toastr.success( "Job canceled." );

			angular.forEach( $scope.data[ $scope.pagination.current_page ], function( value, key )
			{
				if( value.id == job )
				{
					$scope.data[ $scope.pagination.current_page ] = _.without( $scope.data[ $scope.pagination.current_page ], value );
				}
			} );

		} );
	}

	$scope.sendNow = function( job )
	{
		Restangular.service( "emailJob/sendNow" ).post( { id: job } ).then( function( response )
		{
			toastr.success( "Job scheduled to send immediately!" );
			var job_item = _.findWhere( emailJob, { id: job } ) || _.findWhere( $scope.data[ $scope.pagination.current_page ], { id: job + '' } );
			job_item.admin_tools = false;
			job_item.status = 'Refresh to see progress';
		} );
	}

	$scope.editJob = function( job )
	{
		smModal.Show('public.administrate.team.email.sendmail', { 'job': job });
	}
} );