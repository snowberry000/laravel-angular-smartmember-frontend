<?php

function extractKeyValue($str, $separator)
{
    $parts = explode($separator, $str);
    $default = '';
    $key = '';

    if (count($parts) > 0)
        $key = trim($parts[0]);

    if (count($parts) > 1)
        $default = rtrim(ltrim(trim($parts[1]), '\''), '\'');

    return array('key' => $key, 'default' => $default);
}

function applyParamSpots($swapspots, $params)
{
    $prefix = 'bridgepage.swapspot.';

    $new_swapspots = [];

    foreach ($swapspots as $swapspot) {
        preg_match_all('/{{(.*?)}}/', $swapspot->value, $matches);
        if (count($matches > 1) && count($matches[0] > 0)) {
            $i = 0;
            $replace = [];

            foreach ($matches[1] as $match) {
                if (strpos($match, '||') !== FALSE) {

                    $result = extractKeyValue($match, '||');
                    if (array_key_exists($result['key'], $params)) {
                        $replace[$matches[0][$i]] = $params[$result['key']];
                    } else {
                        $replace[$matches[0][$i]] = $result['default'];
                    }
                } else if (strpos($match, '=') !== FALSE) {
                    $result = extractKeyValue($match, '=');
                    if (array_key_exists($result['key'], $params)) {
                        $replace[$matches[0][$i]] = $params[$result['key']];
                    } else {
                        $replace[$matches[0][$i]] = $result['default'];
                    }
                } else {
                    $value = '';
                    $key = trim($match);

                    if (array_key_exists($key, $params)) {
                        $value = $params[$key];
                    }

                    $replace[$matches[0][$i]] = $value;
                }

                $i++;
            }

            $new_swapspots[$prefix . $swapspot->name] =
                str_replace(array_keys($replace), array_values($replace), $swapspot->value);
        } else {
            $new_swapspots[$prefix . $swapspot->name] = $swapspot->value;
        }
    }

    foreach ($swapspots as $swapspot) {
        if (array_key_exists($swapspot->name, $params)) {
            $new_swapspots[$prefix . $swapspot->name] = $params[$swapspot->name];
        }
    }

    return $new_swapspots;
}

function applySwapSpots($html, $swapspots)
{
    preg_match_all('/{{(.*?)}}/', $html, $matches);
    $swaps = [];

    if (count($matches) < 1) return $html;

    $i = 0;
    foreach ($matches[1] as $match) {
        $parts = explode('||', $match);
        $default = '';
        $key = '';

        if (count($parts) > 0)
            $key = trim($parts[0]);

        if (count($parts) > 1)
            $default = rtrim(ltrim(trim($parts[1]), '\''), '\'');

        if (array_key_exists($key, $swapspots)) {
            $swaps[$matches[0][$i]] = $swapspots[$key];

			if( $key == 'bridgepage.swapspot.option_hidden_fields' )
			{
				$data_to_capture = [
					'aid'
				];

				foreach( $_GET as $key2 =>$val2 )
				{
					if( in_array( $key2, $data_to_capture ) )
					{
						$swaps[$matches[0][$i]] .= '<input type="hidden" name="' . $key2 . '" value="' . $val2 . '" />';
					}
					elseif( strpos( $key2, 'meta_' ) === 0 )
					{
						$key2 = substr( $key2, 5 );
						$swaps[$matches[0][$i]] .= '<input type="hidden" name="' . $key2 . '" value="' . $val2 . '" />';
					}
					elseif( strpos( $key2, 'utm_' ) === 0 )
					{
						$swaps[$matches[0][$i]] .= '<input type="hidden" name="' . $key2 . '" value="' . $val2 . '" />';
					}
				}
			}

        } else {
            $swaps[$matches[0][$i]] = $default;
        }

        $i++;

    }
    // remove some angular reference from the template
    $swaps['ng-src'] = 'src';
    $swaps['ng-href'] = 'href';

    $html = str_replace(array_keys($swaps), array_values($swaps), $html);

    return $html;
}

function fetchBpageHTML($data, $params)
{
    if (!$data) return;

    if (isset($data->template) && isset($data->template->preview_url)) {
        $html = file_get_contents('bpage/' . $data->template->preview_url);
    } else
        return false;

    $swapspots = [];
    if (isset($data->swapspots)) {
        $swapspots = applyParamSpots($data->swapspots, $params);
    }

    $html = applySwapSpots($html, $swapspots);

    return $html;
}

$title = '';
if( !$html )
{
    $html = fetchBpageHTML($data, $paramSwaps);
    //remove dynamic video
    $html = preg_replace('/\<div class\=\"videoWrapper\" dynamic=\"(.*)<\/div>/i', "", $html);
    $title = $data->title;
    $client->set($redisKeys['html'], $html);
}

?>
<html>
<head>
    <title><?= $title ?></title>
    <meta name="description" content="">
    <script src="bpage/js/jquery-1.10.2.min.js"></script>
    <script src="bpage/js/bpopup.js"></script>
    <script src="bpage/js/flexslider.js"></script>
    <style>
        body {
            margin: 0;
        }
    </style>
</head>
<body class="live_bridge_page">
<script type="text/javascript">
    $(document).ready(function () {
        var tracking_code_url = "http<?php echo in_array($tld,array('dev','in')) ? '':'s';?>://api.<?php echo $rootDomain; ?>/siteMetaData/getTrackingCode?subdomain=<?php echo $subdomain; ?>&permalink=<?php echo ltrim($_SERVER['REQUEST_URI'], '/'); ?>";
        var current_domain = '<?php echo $domain; ?>';

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga( 'create', 'UA-48872715-8', 'auto' );
		ga('send', 'pageview');

        $.getJSON(tracking_code_url, function (data) {

            (function (w, d, t, r, u) {
                var f, n, i;
                w[u] = w[u] || [], f = function () {
                    var o = {ti: data.bing_id};
                    o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad")
                }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () {
                    var s = this.readyState;
                    s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
                }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
            })(window, document, "script", "//bat.bing.com/bat.js", "uetq");

            if (typeof data.google_analytics_id != 'undefined' && data.google_analytics_id != '') {
				ga('create', data.google_analytics_id, current_domain, {'name': 'newTracker', 'cookieName': '_ga_user'});
				ga('newTracker.send', 'pageview');
            }
            <!-- Facebook Pixel Code -->

            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','//connect.facebook.net/en_US/fbevents.js');

            fbq('init', data.facebook_conversion_pixel);
            fbq('track', "PageView");
        });

		$('.videoWrapper').each(function(){
			if( $(this).html().trim() == '' ) {
				$(this).closest('.embed_container').hide();
			}
		});
    });
</script>
<div class="alt_style_container" style="height: 100%;">
    <div class="bp_content content" id="wrapper">
        <?= $html ?>
    </div>
</div>
</body>
</html>
