<?php
$domain = $_SERVER['HTTP_HOST'];
$parts = explode(".", $domain);
$tld = array_pop($parts);

$rootDomain = array_pop($parts) . "." . $tld;
$subdomain = array_pop($parts);

function isCustomDomain( $domain )
{
	return !preg_match( '/^(?:http(?:s)?\:)?(?:\/\/)?(?:[a-z0-9\-]{1,63})?\.smartmember\.(?:com|in|dev|soy|pro|co)(?:\/(?:.*)?)?$/i', $domain );
}

if( isCustomDomain( $domain ) )
{
    $rootDomain = "smartmember.com";
}

function dd($data){
    echo "<pre>";
    print_r($data);
    echo "</pre>";
    exit;
}

$api = "https://api." . $rootDomain . "/utility/meta?url=" . urlencode($_SERVER['REDIRECT_URL']) . "&subdomain=" . $subdomain . "&domain=" . $domain;

$raw_data = file_get_contents($api);
$data = json_decode($raw_data,true);
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $data["title"]?></title>
        <meta property="og:title" content="<?php echo $data["title"]?>" />
        <?php if(isset($data["description"])): ?>
        <meta property="og:description" content="<?php echo $data["description"]; ?>" />
        <?php endif; ?>


        <?php if(isset($data["image"])): ?>
        <meta property="og:image" content="<?php echo $data["image"]; ?>" />
        <?php endif; ?>
        <!-- etc. -->
    </head>
    <body>
        <h1><?php echo $data["title"]; ?></h1>
    </body>
</html>