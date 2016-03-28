var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.inbox.ticket", {
			url: "/ticket/:id?",
			views: {
				'ticket_body': {
					templateUrl: "/templates/components/admin/app/inbox/ticket/ticket.html",
					controller: "TicketController"
				},
				'ticket_details': {
					templateUrl: "/templates/components/admin/app/inbox/ticket/details.html",
					controller: "TicketController"
				}
			}
		} )
} );

app.controller( "TicketController", function( $scope, $localStorage, RestangularV3, $state, $rootScope, $stateParams, $filter, $timeout, Restangular, toastr )
{
	$scope.display_replies = [];
	$scope.change_ticket_status = '';

	$user = $rootScope.user;

	if( $stateParams.id )
	{
		$scope.SetCurrentConversation( $stateParams.id );

		$ticket = RestangularV3.one( 'ticket', $stateParams.id ).get().then( function( response )
		{
			$scope.ticket = response.ticket;
			$rootScope.changedStatusDetails = response.ticket.status;
			$scope.change_ticket_status = response.ticket.status;
			$ticket = response.ticket;
			$scope.getSegments();
			$scope.init();
			$scope.getUser();
			//$rootScope.ticket_member_data_email = $scope.ticket.user._id;
		} );
	}
	else
	{
		$scope.ticket = {};
	}

	$scope.current_user_id = $user.id;
	$scope.agents = [];

	$scope.getSegments = function()
	{

		return;

		$email = $scope.ticket.user_email ? $scope.ticket.user_email : $scope.ticket.user.email;
		RestangularV3.all( '' ).customGET( 'member/getSegments?email=' + $email ).then( function( response )
		{
			$scope.user_segments = response.segments_list;
			$rootScope.ticket_member_id = response._id;
			$scope.ticket.user_web_sessions = response.web_sessions;
			$scope.ticket.user_browser_name = response.browser_name;
			$scope.ticket.user_browser_version = response.browser_version;
			$scope.ticket.user_browser_language = (response.browser_language && response.browser_language.length > 0 ) ? response.browser_language[ 0 ] : null;
			$scope.ticket.user_os = response.os;
			$scope.ticket.user_unsubscribe = response.unsubscribe ? true : false;
			$scope.ticket.user_setup_wizard_complete = response.setup_wizard_complete;
			if( $scope.ticket.user_setup_wizard_complete || $scope.ticket.user_setup_wizard_complete == 0 )
			{
				$scope.ticket.user_setup_wizard_complete = $scope.ticket.user_setup_wizard_complete ? true : false;
			}
			setTimeout( function()
			{
				$( 'a' ).popup();
				$( '.tabular.menu .item' ).tab();
			}, 1000 );

		} );
	}

	$scope.getUserValue = function( $attr )
	{
		if( !$scope.ticket || !$scope.ticket.user )
		{
			return;
		}
		if( !_.has( $scope.ticket.user, $attr ) )
		{
			return 'unknown';
		}
		else
		{
			if( $scope.ticket.user[ $attr ] )
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}

	$scope.getTicketValue = function( $attr )
	{
		if( !$scope.ticket )
		{
			return;
		}

		if( !_.has( $scope.ticket, $attr ) )
		{
			return 'unknown';
		}
		else
		{
			if( $scope.ticket[ $attr ] )
			{
				return $scope.ticket[ $attr ];
			}
			else
			{
				return false;
			}
		}
	}


	$scope.getUser = function()
	{
		$email = $scope.ticket.user_email ? $scope.ticket.user_email : $scope.ticket.user.email;
		RestangularV3.all( '' ).customGET( 'user/getUserByEmail?email=' + $email ).then( function( response )
		{
			$scope.ticket.user = response;
		} );
	}


	$scope.init = function()
	{
		// $scope.advanced_info = $ticket.advanced_info;
		// $scope.recent_tickets = $ticket.recent_tickets;
		$scope.statuses = [
			{ value: "Open", id: "open" },
			{ value: "Closed", id: "closed" },
		]


		$scope.reply = { parent_id: $scope.ticket._id, company_id: $scope.ticket.company_id };
		$scope.send_email = false;
		// if ($scope.ticket.status == 'open')
		// {
		// 	$scope.change_ticket_status = 'pending';
		// } else {
		// 	$scope.change_ticket_status = $scope.ticket.status;
		// }


		RestangularV3.all( '' ).customGET( 'company/members' ).then( function( data )
		{
			angular.forEach( data, function( value )
			{
				if( typeof value != 'undefined' && value )
				{
					var user_name = value.first_name + ' ' + value.last_name;
					var name_bits = user_name.split( ' ' );
					var initials = '';
					if( name_bits.length > 1 )
					{
						initials = name_bits[ 0 ].charAt( 0 ).toUpperCase() + name_bits[ 1 ].charAt( 0 ).toUpperCase();
					}
					else
					{
						initials = name_bits[ 0 ].charAt( 0 ).toUpperCase() + name_bits[ 0 ].charAt( 1 ).toUpperCase();
					}

					$scope.agents.push( {
						id: value._id,
						name: user_name,
						email: value.email,
						profile_image: value.profile_image,
						initials: initials
					} );

				}
			} );

			$scope.ticket.agent = _.findWhere( $scope.agents, { id: $scope.ticket.agent_id } );
		} );
	}

	$scope.getFileName = function( $url )
	{
		$url = decodeURI( $url );
		$str = $url.split( '/' );
		if( $str.length >= 1 )
		{
			return $str[ $str.length - 1 ];
		}
		else
		{
			return " ";
		}
	}


	$scope.isImage = function( file )
	{
		return [ 'jpg', 'jpeg', 'png', 'gif', 'bmp' ].indexOf( file.split( '/' ).pop().split( '.' ).pop().toLowerCase() ) != -1;
	}

	$scope.linkify = function( inputText )
	{
		var replacedText, replacePattern1, replacePattern2, replacePattern3;

		//URLs starting with http://, https://, or ftp://
		replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		replacedText = inputText.replace( replacePattern1, '<a href="$1" target="_blank">$1</a>' );

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		replacedText = replacedText.replace( replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>' );

		//Change email addresses to mailto:: links.
		replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		replacedText = replacedText.replace( replacePattern3, '<a href="mailto:$1">$1</a>' );

		return replacedText;
	}

	$scope.userActionMessage = function( action )
	{
		var message = '';
		if( action.user.first_name || action.user.last_name )
		{
			message += action.user.first_name + ' ' + action.user.last_name;
		}
		else
		{
			message += action.user.email;
		}

		switch( action.modified_attribute )
		{
			case 'status':
				message += ' changed ticket status from ' + _.findWhere( $scope.statuses, { id: action.old_value } ).value + ' to <strong>' + _.findWhere( $scope.statuses, { id: action.new_value } ).value + '</strong>';
				break;
			case 'agent_id':
				var agent = _.find( $scope.agents, { 'id': action.new_value } ) || _.find( $scope.agents, { 'id': action.new_value + '' } );
				message += ' assigned ticket to <strong>' + ( agent ? agent.name : action.new_value ) + '</strong>';
				break;
			case 'rating_requested':
				message = '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> was asked to rate the customer service';
				break;
			case '3_day':
				message = 'Auto follow-up sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 3 days without a reply';
				break;
			case '5_day':
				message = 'Notice of ticket being closed sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 5 days without a reply';
				break;
		}

		return message;
	}

	$scope.autoActionMessage = function( action )
	{
		switch( action.modified_attribute )
		{
			case 'status':
				message = 'Ticket status changed from ' + _.findWhere( $scope.statuses, { id: action.old_value } ).value + ' to <strong>' + _.findWhere( $scope.statuses, { id: action.new_value } ).value + '</strong>';
				break;
			case 'agent_id':
				var agent = _.find( $scope.agents, { 'id': action.new_value } ) || _.find( $scope.agents, { 'id': action.new_value + '' } );
				message = 'Ticket assigned to <strong>' + ( agent ? agent.name : action.new_value ) + '</strong>';
				break;
			case 'rating_requested':
				message = '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> was asked to rate the customer service';
				break;
			case '3_day':
				message = 'Auto follow-up sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 3 days without a reply';
				break;
			case '5_day':
				message = 'Notice of ticket being closed sent to ' + '<strong>' + ( $scope.ticket.user.first_name || $scope.ticket.user.last_name ? $scope.ticket.user.first_name + ' ' + $scope.ticket.user.last_name : $scope.ticket.user.email ) + '</strong> after 5 days without a reply';
				break;
		}

		return message;
	}

	$scope.actionMessage = function( action )
	{
		if( action.user )
		{
			return $scope.userActionMessage( action );
		}
		else
		{
			return $scope.autoActionMessage( action );
		}
	}

	$scope.autop = function( stringValue )
	{
		if( typeof stringValue != 'undefined' )
		{
			var string_bits = stringValue.split( '\n' );
			return '<p>' + string_bits.join( '</p><p>' ) + '</p>';
		}
		else
		{
			return stringValue;
		}
	}

	$scope.changeStatus = function( status )
	{
		$scope.ticket.status = status;
		RestangularV3.one( 'ticket', $scope.ticket._id ).put( {
			'status': status
		} ).then( function( response )
		{
			toastr.success( "Ticket status changed to " + status );
		} );
	}

	$scope.formatDate = function( inputDate )
	{
		var input = new Date( inputDate );
		var timeNow = new Date( Date.now() );
		var today = timeNow.getDay();
		var thenDay = input.getDay();

		if( today == thenDay )
		{
			return 'Today';
		}
		else if( today - 1 == thenDay )
		{
			return 'Yesterday';
		}
		else
		{
			return moment( inputDate ).format( 'MMMM Do' );
		}
	};

	$scope.ToggleStatus = function()
	{
		if( $scope.ticket.status == 'closed' )
		{
			$scope.updateStatus( 'open' );
		}
		else
		{
			$scope.updateStatus( 'closed' );
		}
	};

	$scope.updateStatus = function( statusVal )
	{
		console.log( statusVal );
		$rootScope.changedStatusDetails = statusVal;
		RestangularV3.one( 'ticket', $scope.ticket._id ).put( { 'status': statusVal } ).then( function( response )
		{
			toastr.success( "Ticket status updated" );
			$scope.ticket.status = statusVal;
		} );

		if( $scope.change_ticket_status == 'closed' )
		{
			//$scope.$parent.FetchByType( 'closed' );
		}
		else
		{
			//$scope.$parent.FetchByType( 'open' );
		}
	}


	$scope.sendReply = function()
	{

		$scope.call_in_progress = true;

		if( $scope.admin_mode )
		{
			RestangularV3.all( 'ticket/adminNote' ).post( {
				ticket_id: $scope.ticket._id,
				note: $scope.reply.message
			} ).then( function( response )
			{
				$scope.call_in_progress = false;
				toastr.success( "Your note has been saved" );
				response.user = $user;
				if( $scope.ticket.admin_notes )
				{
					$scope.ticket.admin_notes.push( { ticket_id: $scope.ticket._id, note: $scope.reply.message } );
				}
				else
				{
					$scope.ticket.admin_notes = [];
					$scope.ticket.admin_notes.push( response );
				}

				$scope.display_replies.push( response )
				$scope.reply = { parent_id: $scope.ticket._id, company_id: $scope.ticket.company_id };
				$state.reload();
			} );
		}
		else
		{

			if( $scope.ticket.agent_id == 0 )
			{
				$scope.ticket.agent_id = $scope.current_user_id;
				$scope.agentChange();
				$scope.call_in_progress = false;
			}

			if( (typeof $scope.reply.message != 'undefined' && $scope.reply.message != '') || ($scope.reply.attachment != '' && typeof $scope.reply.attachment != 'undefined') )
			{
				$scope.send_email = $scope.change_ticket_status == $scope.ticket.status;
				$scope.reply.send_email = $scope.send_email;
				console.log( $scope.reply );
				RestangularV3.all( 'ticket' ).post( $scope.reply ).then( function( response )
				{
					$scope.call_in_progress = false;
					toastr.success( "A reply has been created." );
					$scope.reply.message = '';
					$scope.ticket.reply.push( response );
					$scope.display_replies.push( response );
					$scope.reply = { parent_id: $scope.ticket._id, company_id: $scope.ticket.company_id };
					$scope.send_email = !$scope.send_email;
					$state.reload();

				} );
			}
		}
	}

	$scope.agentChange = function()
	{
		RestangularV3.one( 'ticket', $scope.ticket._id ).put( { 'agent_id': $scope.ticket.agent_id } ).then( function( response )
		{
			toastr.success( "Agent updated" );
			$scope.ticket.agent = _.findWhere( $scope.agents, { id: response.agent_id } );
			$scope.change_agent = false;
			var action = {
				modified_attribute: 'agent_id',
				user: $user,
				new_value: $scope.ticket.agent_id,
				created_at: response.created_at
			};

			$scope.display_replies.push( action );
		} )
		// setTimeout(function(){location.reload();},1000);
	}

	$scope.setCannedResponse = function( content )
	{
		$scope.reply.message = content;
	}

	$scope.assignToSMTech = function()
	{
		RestangularV3.one( 'ticket', $scope.ticket._id ).put( {
			'escalated_site_id': 2056,
			'agent_id': '0'
		} ).then( function( response )
		{
			$scope.ticket.escalated_site_id = 2056;
			$scope.ticket.agent_id = 0;
			$scope.ticket.agent = null;
			$scope.ticket.sm_tech = true;
			$scope.ticket.sm_marketing = false;
			toastr.success( "Ticket assigned to SM Tech team" );
		} )
	}

	$scope.assignToSMMarketing = function()
	{
		RestangularV3.one( 'ticket', $scope.ticket._id ).put( {
			'escalated_site_id': 6325,
			'agent_id': '0'
		} ).then( function( response )
		{
			$scope.ticket.escalated_site_id = 6325;
			$scope.ticket.agent_id = 0;
			$scope.ticket.agent = null;
			$scope.ticket.sm_marketing = true;
			$scope.ticket.sm_tech = false;
			toastr.success( "Ticket assigned to SM Marketing team" );
		} )
	}

} );