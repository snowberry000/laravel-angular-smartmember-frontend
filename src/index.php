<?php
header( 'Access-Control-Allow-Origin: *' );

include_once( 'php/functions.php' );

$data = DetectAndPerformBridgePageThings();
?>
<!DOCTYPE html>

<html ng-app='app' class="no-js {{$state.current.name.split('.').join(' ')}}"  ng-controller="IndexAppController" ng-init="home_init()">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
	<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'bing_webmaster_tag' ); ?>
	<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'google_webmaster_tag' ); ?>
	<base href="/"></base>

	<!-- <title>{{page_title ? page_title : 'Loading'}} </title> -->
	<title ng-bind="page_title">Loading</title>
	<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'fb_share_description' ); ?>

	<!-- <link rel="stylesheet" href="bower/font-awesome/css/font-awesome.min.css"> -->
	<!-- <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"> -->
	<link rel="stylesheet" href="css/vendor.min.css">
	<link rel="stylesheet" href="bower/footable/css/footable.core.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/jquery.ui.timepicker.addon/1.4.5/jquery-ui-timepicker-addon.min.css">
	<link rel="stylesheet" href="css/main.min.css">
	<link rel="shortcut icon" href="{{options.favicon}}" type="image/x-icon">
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga( 'create', 'UA-48872715-8', 'auto' );
		<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'google_analytic_id' ); ?>
		ga('send', 'pageview');
	</script>
	<!-- Facebook Pixel Code -->
	<script>
		!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
				n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
			n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
			t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
				document,'script','//connect.facebook.net/en_US/fbevents.js');
		<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'fb_pixel' ); ?>

	</script>
	<!-- End Facebook Pixel Code -->
	<script type="text/javascript">
		var trackcmp_email = '';
		var trackcmp = document.createElement("script");
		trackcmp.async = true;
		trackcmp.type = 'text/javascript';
		<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'active_campaign_id' ); ?>
		var trackcmp_s = document.getElementsByTagName("script");
		if (trackcmp_s.length) {
			trackcmp_s[0].parentNode.appendChild(trackcmp);
		} else {
			var trackcmp_h = document.getElementsByTagName("head");
			trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
		}
	</script>
	<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){<?php if( !empty( $data ) ) PrintUserTrackingScript( $data, 'bing_tracking' ); ?>o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script><noscript><img src="//bat.bing.com/action/0?ti=5104308&Ver=2" height="0" width="0" style="display:none; visibility: hidden;" /></noscript>
	<script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/pntame3f';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()</script>

</head>
<body sm-jvzoo-trigger resize class="fixed-nav {{$root.admin_nav_open ? 'nav_open' : 'nope'}} {{viewport}} {{options.theme || 'default'}} {{$state.current.data.specialClass}} {{IsWidescreen() ? 'widescreen' : ''}}" landing-scrollspy id="page-top">
<div class="ui top sidebar top_sidebar_contents" ><ng-include src="top_sidebar_contents"></ng-include></div>
<div class="ui sidebar left left_sidebar_contents" ><ng-include src="left_sidebar_contents"></ng-include></div>
<div id="wrapper" class="pusher {{$state.includes('public.app.admin.bridge-page') ? 'extend_scroll' : ''}}" ui-view></div>

<!--<script src="js/vendor.min.js"></script>-->

<script src="/js/jquery.js"></script>
<script src="/js/jquery-ui.js"></script>

<script src="/js/angular.js"></script>
<script src="/js/lodash.js"></script>

<script src="/js/froala_editor.min.js"></script>

<script src="/js/SweetAlert.js"></script>
<script src="/js/align.min.js"></script>
<script src="/js/angular-animate.js"></script>
<script src="/js/angular-busy.js"></script>
<script src="/js/angular-cookie.js"></script>
<script src="/js/angular-cookies.js"></script>
<script src="/js/angular-dragdrop.js"></script>
<script src="/js/angular-facebook.js"></script>
<script src="/js/angular-flot.js"></script>
<script src="/js/angular-footable.js"></script>
<script src="/js/angular-froala.js"></script>
<script src="/js/angular-modal-service.js"></script>
<script src="/js/angular-notify.js"></script>
<script src="/js/angular-resource.js"></script>
<script src="/js/angular-sanitize.js"></script>
<script src="/js/angular-socialshare.min.js"></script>
<script src="/js/angular-spectrum-colorpicker.min.js"></script>
<script src="/js/angular-spinkit.js"></script>
<script src="/js/angular-timer.js"></script>
<script src="/js/angular-toastr.tpls.js"></script>
<script src="/js/angular-touch.js"></script>
<script src="/js/angular-translate.js"></script>
<script src="/js/angular-ui-router.js"></script>
<script src="/js/angular-ui-tree.js"></script>
<script src="/js/char_counter.min.js"></script>
<script src="/js/clipboard.js"></script>
<script src="/js/code_beautifier.min.js"></script>
<script src="/js/code_view.min.js"></script>
<script src="/js/codemirror.js"></script>
<script src="/js/colors.min.js"></script>
<script src="/js/ct-ui-router-extras.js"></script>
<script src="/js/detect-zoom.js"></script>
<script src="/js/dirPagination.js"></script>
<script src="/js/emoticons.min.js"></script>
<script src="/js/entities.min.js"></script>
<script src="/js/file.min.js"></script>
<script src="/js/font_family.min.js"></script>
<script src="/js/font_size.min.js"></script>
<script src="/js/footable.js"></script>
<script src="/js/fullscreen.min.js"></script>
<script src="/js/humanize-duration.js"></script>
<script src="/js/icheck.min.js"></script>
<script src="/js/image.min.js"></script>
<script src="/js/image_manager.min.js"></script>
<script src="/js/inline_style.min.js"></script>
<script src="/js/jquery.flot.js"></script>
<script src="/js/line_breaker.min.js"></script>
<script src="/js/link.min.js"></script>
<script src="/js/lists.min.js"></script>
<script src="/js/loading-bar.js"></script>
<script src="/js/main.min.js"></script>
<script src="/js/moment.js"></script>
<script src="/js/ng-file-upload.js"></script>
<script src="/js/ng-infinite-scroll.js"></script>
<script src="/js/ng-sortable.js"></script>
<script src="/js/ngStorage.js"></script>
<script src="/js/ocLazyLoad.js"></script>
<script src="/js/pace.js"></script>
<script src="/js/paragraph_format.min.js"></script>
<script src="/js/paragraph_style.min.js"></script>
<script src="/js/popover-toggle.js"></script>
<script src="/js/quote.min.js"></script>
<script src="/js/restangular.js"></script>
<script src="/js/save.min.js"></script>
<script src="/js/select.js"></script>
<script src="/js/select2.js"></script>
<script src="/js/select3.js"></script>
<script src="/js/semantic.js"></script>
<script src="/js/sortable.js"></script>
<script src="/js/spectrum.js"></script>
<script src="/js/sweetalert.min.js"></script>
<script src="/js/table.min.js"></script>
<script src="/js/ui-bootstrap-tpls.js"></script>
<script src="/js/ui-codemirror.js"></script>
<script src="/js/url.min.js"></script>
<script src="/js/v-accordion.js"></script>
<script src="/js/video.min.js"></script>
<script src="/js/xeditable.js"></script>


<!-- <script src="bower/slimScroll/jquery.slimscroll.min.js"></script> -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.6/semantic.js"></script>
<!--script src="js/library.min.js"></script-->
<!-- <script type="text/javascript" src="bower/Flot/jquery.flot.resize.js"></script> -->
<!-- <script type="text/javascript" src="//cdn.jsdelivr.net/jquery.flot/0.8.3/jquery.flot.min.js"></script> -->
<!--<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.14.3/ui-bootstrap.min.js'></script>-->
<script type="text/javascript" src="https://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.14.3.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/jquery.ui.timepicker.addon/1.4.5/jquery-ui-timepicker-addon.min.js"></script>
<script src="js/main.min.js"></script>
</body>
</html>