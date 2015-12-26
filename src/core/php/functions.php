<?php
function DetectAndPerformBridgePageThings()
{
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

	if( !in_array( $tld, [ 'com', 'dev', 'in', 'soy' ] ) )
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

		//we know these are reserved routes, so no need to check if they are bridge pages
		$reserved_permalinks = array( 'lessons', 'info', 'home', 'thank-you', 'thankyou', 'wallboard', 'sign', 'download-center', 'admin', 'domain-not-found', 'blog', 'jvpage', 'refund-page', 'support-ticket', 'support', 'support-tickets' );

		if( !in_array( $permalink, $reserved_permalinks ) )
		{
			require_once 'bpage/php/redis/Autoloader.php';
			Predis\Autoloader::register();
			$client = new Predis\Client();

			try
			{
				$paramSwaps = [ ];
				if( count( $_GET ) > 0 )
				{
					$getParams = array_keys( $_GET );
					sort( $getParams, SORT_NATURAL );

					$getKey = '';

					foreach( $getParams as $param )
					{
						$getKey .= $param.'='.$_GET[ $param ].'&';
						$paramSwaps[ $param ] = $_GET[ $param ];
					}
				}
				else
				{
					$getKey = 'default';
				}
				$redisKeys = [ ];

				$redisKeys[ 'html' ] = $domain.':'.$permalink.':'.$getKey.':html';

				$html = $client->get( $redisKeys[ 'html' ] );

				if( empty($html) )
				{
					$redisKeys[ 'data' ] = $domain.':'.$permalink.':data';
					$bpage_data = $client->get( $redisKeys[ 'data' ] );

					if( empty($bpage_data) )
					{
						$url = 'http://api.smartmember.'.$tld.'/bridgePageDataOrFalse';
						$curl = curl_init( $url );
						curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
						curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'origin:http://'.$domain, 'referer:http://'.$domain.$_SERVER[ 'REQUEST_URI' ], 'content-type:application/json' ) );
						$bpage_data = curl_exec( $curl );
						curl_close( $curl );

						if( empty($bpage_data) )
						{
							$bpage_data = 'notbp';
						}

						$client->set( $redisKeys[ 'data' ], $bpage_data );
					}
				}

				if( !empty($bpage_data) && $bpage_data == 'notbp' )
				{
					$bpage_data = '';
				}

				if( (!empty($html) || !empty($bpage_data)) && $bpage_data != '{"message":"Route not found, please try again.","code":404}' )
				{
					include 'bpage/bpage.php';

					return;
				}
			}
			catch( Exception $e )
			{

			}
		}
	}
}