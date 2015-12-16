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

if( $tld != 'com' && $tld != 'dev' && $tld != 'in' && $tld != 'soy' )
{
	$tld = 'com';
}

$is_bridgepage = false;

$requestParts = explode( '/', $_SERVER[ 'REQUEST_URI' ] );
if( $subdomain != 'my' && count( $requestParts ) > 1 && count( $requestParts ) < 3 )
{

	$permalink = $requestParts[ 1 ];
	$pos = strpos( $permalink, '?' );
	if( $pos !== false )
	{
		$permalink = substr( $permalink, 0, $pos );
	}

	try
	{
		require_once 'bpage/php/redis/Autoloader.php';
		Predis\Autoloader::register();
		$client = new Predis\Client();

		$key = $subdomain.':'.$permalink.':type';
		$type = $client->get( $key );

		if( !$type )
		{
			$key = $domain.':'.$permalink.':type';
			$type = $client->get( $key );

			if( $type && $type == 'bridge_bpages' )
			{
				$subdomain = $client->get( $domain.':'.$permalink.':subdomain' );
			}

			if( empty($subdomain) )
			{
				$type = null;
			}
		}

		if( $type && $type == 'bridge_bpages' )
		{
			$is_bridgepage = true;
		} else
		{
			$url = 'http'.($tld == 'com' ? 's' : '').'://api.smartmember.'.$tld.'/permalink/'.$permalink;
			$curl = curl_init( $url );
			curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'subdomain:'.$subdomain, 'origin:http://'.$domain, 'referer:http://'.$domain, 'content-type:application/json' ) );
			$resp = curl_exec( $curl );
			if( $resp )
			{
				$resp = json_decode( $resp );

				if( is_object( $resp ) && isset($resp->type) )
				{
					$is_bridgepage = ($resp->type === 'bridge_bpages' ? true : false);

					if( $is_bridgepage )
					{
						$subdomain = $resp->subdomain;
						$key = $domain.':'.$permalink.':subdomain';
						$client->set( $key, $subdomain );
						$key2 = $subdomain.':'.$permalink.':type';
						$client->set($key2, 'bridge_bpages');
						$key2 = $domain.':'.$permalink.':type';
						$client->set($key2, 'bridge_bpages');
					}
				}
			}
			curl_close( $curl );
		}

		function checkBridgepage( $tld, $subdomain, $domain )
		{
			try
			{
				$url = 'http'.($tld == 'com' ? 's' : '').'://api.smartmember.'.$tld.'/checkHomepageBP/' . $domain;
				$curl = curl_init( $url );
				curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
				curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'subdomain:'.$subdomain, 'origin:http://'.$domain, 'referer:http://'.$domain, 'content-type:application/json' ) );
				$data = curl_exec( $curl );
				$respCode = curl_getinfo( $curl );
				curl_close( $curl );
				$data = json_decode( $data );
			}
			catch( Exception $e )
			{
				$data = false;
			}

			if( isset($data->type) && $data->type == 'bridge_bpages' )
			{
				return array( 'permalink' => $data->homepage_url, 'subdomain' => $data->subdomain );
			} else {
				return false;
			}
			return false;
		}

		if( !$is_bridgepage && $_SERVER[ 'REQUEST_URI' ] == '/' )
		{

			$key = $subdomain.':homepage:type';
			$type = $client->get( $key );
			$key = $subdomain.':homepage:permalink';
			$permalink = $client->get($key);

			if( !$type )
			{
				$key = $domain.':homepage:type';
				$type = $client->get( $key );

				if( $type && $type == 'bridge_bpages' )
				{
					$subdomain = $client->get( $domain.':homepage:subdomain' );
					$permalink = $client->get($domain.':homepage:permalink');
				}

				if( empty($subdomain) )
				{
					$type = null;
				}
			}

			if( $type && $type == 'bridge_bpages' )
			{
				$is_bridgepage = true;
			} else {
				$response_data = checkBridgepage( $tld, $subdomain, $domain );
				if( $response_data )
				{
					$is_bridgepage = true;
					$permalink = $response_data[ 'permalink' ];
					$subdomain = $response_data[ 'subdomain' ];
				}
			}
		}

		if( $is_bridgepage )
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

<script src="bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js"></script>
<script src="bower/slimScroll/jquery.slimscroll.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.6/semantic.js"></script>
<!--script src="js/library.min.js"></script-->
<!-- <script type="text/javascript" src="bower/Flot/jquery.flot.resize.js"></script> -->
<!-- <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.flot/0.8.3/jquery.flot.min.js"></script> -->
<!--<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.14.3/ui-bootstrap.min.js'></script>-->
	<!--script type="text/javascript" src="https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.3.min.js"></script-->

</body>
</html>