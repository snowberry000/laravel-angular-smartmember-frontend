<?php
function DetectAndPerformBridgePageThings()
{
	$domain = $_SERVER[ 'HTTP_HOST' ];
	$parts = explode( ".", $domain );
	$tld = array_pop( $parts );
	$rootDomain = array_pop( $parts ) . "." . $tld;
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

	if( $subdomain != 'my' && count( $requestParts ) > 1 && count( $requestParts ) <= 3 )
	{
		$permalink = $requestParts[ 1 ];
		$pos = strpos( $permalink, '?' );
		if( $pos !== false )
		{
			$permalink = substr( $permalink, 0, $pos );
		}

		//we know these are reserved routes, so no need to check if they are bridge pages
		$reserved_permalinks = array( 'lessons', 'info', 'home', 'thank-you', 'thankyou', 'wallboard', 'sign', 'download-center', 'admin', 'domain-not-found', 'blog', 'jvpage', 'refund-page', 'support-ticket', 'support', 'support-tickets','forum-category','forum-topic' );

		if( !in_array( $permalink, $reserved_permalinks ) )
		{
			require_once 'bpage/php/redis/Autoloader.php';
			Predis\Autoloader::register();

			if ($tld == 'com'){
				$client = new Predis\Client(['host'=>'52.34.174.209']);
			}else{
				$client = new Predis\Client();
			}

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
						$url = 'http://api.smartmember.'.$tld.'/initialLoadingData';
						$curl = curl_init( $url );
						curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
						curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'origin:http://'.$domain, 'referer:http://'.$domain.$_SERVER[ 'REQUEST_URI' ], 'content-type:application/json' ) );
						$bpage_data = curl_exec( $curl );
						curl_close( $curl );

						if( empty($bpage_data) )
						{
							$bpage_data = 'notbp';
						}
						else
						{
							$data = json_decode( $bpage_data );

							if( property_exists( $data, 'type' ) && $data->type == 'smart_link' )
							{
								header( 'Location: ' . $data->redirect_url );
								exit;
							}
						}

						if( !empty( $data ) && property_exists( $data, 'type' ) && $data->type == 'sm_data' )
						{
							$bpage_data = '';
						}
						else
							$client->set( $redisKeys[ 'data' ], $bpage_data );
					}
				}

				if( !empty($bpage_data) && $bpage_data == 'notbp' )
				{
					$bpage_data = '';
				}
				elseif( !empty( $bpage_data ) )
				{
					$data = json_decode( $bpage_data );
					if( !empty( $data ) && is_object( $data ) && property_exists( $data,  'type' ) && $data->type == 'sm_data' )
					{
						$bpage_data = '';
					}
				}

				if( !empty($html) || ( !empty($bpage_data) 
					&& $bpage_data != '{"message":"Route not found, please try again.","code":404}' 
					&& $bpage_data != '{"type":"sm_data","data":[]}{"message":"Oops, something went wrong! Please try again soon","code":500}') 
				){
					include 'bpage/bpage.php';

					exit;
				}
			}
			catch( Exception $e )
			{

			}
		}
		else
		{
			$url = 'http://api.smartmember.'.$tld.'/initialLoadingData';
			$curl = curl_init( $url );
			curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $curl, CURLOPT_HTTPHEADER, array( 'origin:http://'.$domain, 'referer:http://'.$domain.$_SERVER[ 'REQUEST_URI' ], 'content-type:application/json' ) );
			$remote_data = curl_exec( $curl );
			curl_close( $curl );
			if( !empty( $remote_data ) && $remote_data != 'notbp' )
				$data = json_decode( $remote_data );

		}
	}

	return !empty( $data ) ? $data : [];
}

function PrintUserTrackingScript( $data, $type = 'google_analytic_id' )
{
	switch ($type)
	{
		case 'google_analytic_id':
			if( is_object( $data ) && property_exists( $data, 'data' ) && is_object( $data->data ) && property_exists( $data->data, 'google_analytics_id' ) )
				$user_ga_code = $data->data->google_analytics_id;
			if( !empty( $user_ga_code ) ) :
				?>
				ga('create', '<?php echo $user_ga_code; ?>', 'auto', {'name': 'newTracker', 'cookieName': '_ga_user'});
				ga('newTracker.send', 'pageview');
			<?php endif;
			break;
		case 'fb_pixel':
			if( is_object( $data ) && property_exists( $data, 'data' ) && is_object( $data->data ) && property_exists( $data->data, 'facebook_conversion_pixel' ) )
				$fb_code = $data->data->facebook_conversion_pixel;
			if( !empty( $fb_code ) ) :
				?>
				fbq('init', '<?php echo $fb_code; ?>');
				fbq('track', "PageView");
			<?php endif;
			break;
		case 'bing_webmaster_tag':
			if( is_object( $data ) && property_exists( $data, 'data' ) && is_object( $data->data ) && property_exists( $data->data, 'bing_webmaster_tag' ) )
				$code = $data->data->bing_webmaster_tag;
			if( !empty( $code ) ) :
				?>
				<meta name="msvalidate.01" content="<?php echo $code; ?>" />
			<?php endif;
			break;
		case 'bing_tracking':
			if( is_object( $data ) && property_exists( $data, 'data' ) && is_object( $data->data ) && property_exists( $data->data, 'bing_id' ) )
				$code = $data->data->bing_id;
			else $code = '';
				?>
				var o={ti:"<?php echo $code; ?>"};
			<?php
			break;
		case 'google_webmaster_tag':
			if( is_object( $data ) && property_exists( $data, 'data' ) && is_object( $data->data ) && property_exists( $data->data, 'google_webmaster_tag' ) )
				$code = $data->data->google_webmaster_tag;
			if( !empty( $code ) ) :
				?>
				<meta name="google-site-verification" content="<?php echo $code; ?>">
			<?php endif;
			break;
		default:
			break;
	}
}