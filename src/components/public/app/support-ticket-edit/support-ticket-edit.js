var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.support-ticket-edit",{
			url: "/support-ticket/:id",
			templateUrl: "/templates/components/public/app/support-ticket-edit/support-ticket-edit.html",
			controller: "PublicSupportTicketEditController"
		})
}); 

app.controller('PublicSupportTicketEditController', function ($scope,$site,$localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.loading=true;
    Restangular.one('supportTicket' , $stateParams.id).get().then(function(response){
        $scope.loading=false;
        $ticket=response;
        $scope.ticket = $ticket.ticket;
        $scope.reply = {parent_id : $scope.ticket.id , company_id : $scope.ticket.company_id};
    });

    $scope.statuses = [
        {value : "Open" , id: "open" },
        {value : "Pending" , id: "pending"},
        {value : "Solved" , id: "solved"},
        {value : "Spam" , id: "spam"},
    ]

    $scope.autop = function(stringValue) {
        if( typeof stringValue != 'undefined' ) {
            var string_bits = stringValue.split('\n');
            return '<p>' + string_bits.join('</p><p>') + '</p>';
        }
        else
            return stringValue;
    }

    $scope.sendReply = function(status)
    {
        if( typeof status == 'undefined' || status == null || status == '' )
            status = 'open';

        $scope.ticket.status = status;
        $scope.statusChange();

        Restangular.all('supportTicket').post($scope.reply).then(function(response){
            toastr.success("A reply has been created.");
            $scope.reply.message = '';
            $scope.ticket.reply.push(response);
        })
    }

     $scope.statusChange = function()
    {
        Restangular.one('supportTicket' , $scope.ticket.id).put({'status':$scope.ticket.status}).then(function(response){

        })
    }

    $scope.linkify = function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
    }
});