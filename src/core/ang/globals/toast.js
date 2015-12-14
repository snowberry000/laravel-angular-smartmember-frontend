var app = angular.module('app');

app.config( function( toastrConfig )
{
	angular.extend(toastrConfig, {
	    positionClass: 'toast-top-right',
	    preventOpenDuplicates: true,
	    closeButton: true,
	    progressBar: true,
	    onclick: null,
	    timeOut: '4000',
	    showDuration: '400',
	    hideDuration: '1000',
	    extendedTimeOut: '1000',
	    iconClasses: {
	          error: 'toast-error',
	          info: 'toast-info',
	          success: 'toast-success',
	          warning: 'toast-warning'
	        },  
	    showEasing: 'swing',
	    hideEasing: 'linear',
	    showMethod: 'fadeIn',
	    hideMethod: 'fadeOut'
	  });
} );
