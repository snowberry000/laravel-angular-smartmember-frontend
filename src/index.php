<?php

header( 'Access-Control-Allow-Origin: *' );

$domain = $_SERVER[ 'HTTP_HOST' ];
$parts = explode( ".", $domain );
$tld = array_pop( $parts );
$rootDomain = array_pop( $parts ).".".$tld;
$subdomain = array_pop( $parts );
if( $subdomain == 'bridgepages' )
{
	if( $tld != 'dev' )
	{
		$tld = 'net';
	}
	header( 'Location: http://my.bridgepages.'.$tld );
}

if( strpos( $domain, "smartmember" ) === false )
{
	$rootDomain = "smartmember.com";
}

if( !in_array( $tld, ['com','dev','in','soy'] ) )
{
	$tld = 'com';
}

$is_bridgepage = false;

$requestParts = explode( '/', $_SERVER[ 'REQUEST_URI' ] );

if( $subdomain != 'my' && count( $requestParts ) > 1 && count( $requestParts ) < 3 )
{
	require_once 'bpage/php/redis/Autoloader.php';
	Predis\Autoloader::register();
	$client = new Predis\Client();

	$permalink = $requestParts[ 1 ];
	$pos = strpos( $permalink, '?' );
	if( $pos !== false )
	{
		$permalink = substr( $permalink, 0, $pos );
	}

	try
	{
		$paramSwaps = [];
		if( count($_GET) > 0 )
		{
			$getParams = array_keys( $_GET );
			sort( $getParams, SORT_NATURAL );

			$getKey = '';

			foreach( $getParams as $param )
			{
				$getKey .= $param . '=' . $_GET[ $param ] . '&';
				$paramSwaps[ $param ] = $_GET[ $param ];
			}
		}
		else
		{
			$getKey = 'default';
		}
		$redisKeys = [];

		$redisKeys['html'] = $domain . ':' . $permalink . ':' . $getKey . ':html';

		$html = $client->get( $redisKeys['html'] );

		$html = '';

		if( empty( $html ) )
		{
			$redisKeys['data'] = $domain . ':' . $permalink . ':data';
			$bpage_data = $client->get( $redisKeys['data'] );

			if( empty( $bpage_data ) )
			{
				$url  = 'http://api.smartmember.' . $tld . '/bridgePageDataOrFalse';
				$curl = curl_init( $url );
				curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'origin:http://' . $domain, 'referer:http://' . $domain . $_SERVER[ 'REQUEST_URI' ], 'content-type:application/json' ) );
				$bpage_data = curl_exec( $curl );
				curl_close( $curl );

				if( empty( $bpage_data ) )
					$bpage_data = 'notbp';

				$client->set($redisKeys['data'], $bpage_data);
			}
		}

		if( $bpage_data == 'notbp' )
			$bpage_data = '';

		if( !empty( $html ) || !empty( $bpage_data ) )
		{
			include 'bpage/bpage.php';
			return;
		}
	}
	catch( Exception $e )
	{
	}
}
?>
<!DOCTYPE html>

<html ng-app='app' style="height:auto;"  class="no-js {{$state.current.name.split('.').join(' ')}}" ng-controller="IndexAppController" ng-init="home_init()">
<head>
	<base href="/"></base>
	<title>Smart Member</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<!-- <link rel="stylesheet" href="bower/ui-iconpicker/dist/styles/ui-iconpicker.min.css"> -->
	<!-- <link rel="stylesheet" href="bower/font-awesome/css/font-awesome.min.css"> -->
	<link rel="stylesheet" href="css/vendor.min.css">
	<link rel="stylesheet" href="bower/footable/css/footable.core.css">
	<link rel="stylesheet" href="css/main.min.css">
	<link rel="shortcut icon" href="{{options.favicon}}" type="image/x-icon">
</head>
<body resize style="height: auto;" class="md-skin fixed-nav {{$root.admin_nav_open ? 'nav_open' : 'nope'}} {{options.theme || 'default'}} {{$state.current.data.specialClass}} {{IsWidescreen() ? 'widescreen' : ''}}" landing-scrollspy id="page-top">

<div id="wrapper" class="sticky-full-height" ui-view></div>


<script src="js/vendor.min.js"></script>
<script src="js/main.min.js"></script>

<!-- <script src="bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js"></script> -->
<!-- <script src="bower/slimScroll/jquery.slimscroll.min.js"></script> -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.6/semantic.js"></script>
<!--script src="js/library.min.js"></script-->
<!-- <script type="text/javascript" src="bower/Flot/jquery.flot.resize.js"></script> -->
<!-- <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.flot/0.8.3/jquery.flot.min.js"></script> -->
<!--<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.14.3/ui-bootstrap.min.js'></script>-->
	<!--script type="text/javascript" src="https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.3.min.js"></script-->

</body>
</html>