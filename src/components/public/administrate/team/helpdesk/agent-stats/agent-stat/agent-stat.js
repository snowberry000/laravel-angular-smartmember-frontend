var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.helpdesk.agent-stats.agent-stat",{
			url: "/:id?",
			templateUrl: "/templates/components/public/administrate/team/helpdesk/agent-stats/agent-stat/agent-stat.html",
			controller: "AgentStatController",
			resolve: {
                $agent_id : function($stateParams) {
                    return $stateParams.id;
                }
            }
		})
}); 

app.controller("AgentStatController", function ($scope, $localStorage,$rootScope,$agents, $agent_id,$state, $user,  Restangular, notify,$site,$support_tickets) {
	$scope.agent= _.find($agents, function(agent){ return agent.id == $agent_id; });
    $scope.jobtitle="";
    for(var i=0;i<$scope.agent.type.length;i++)
    {
        if($scope.agent.type[i].role_type==1)
        {
            $scope.jobtitle="Owner";
            break;
        }
        else if($scope.agent.type[i].role_type==2)
        {
            $scope.jobtitle="Admin";
        }
        else if($scope.agent.type[i].role_type==4)
        {
            if($scope.jobtitle!="Admin")
                $scope.jobtitle="Agent";
        }
    }

    $scope.solvedCount=0;
    for(var i=0;i<$support_tickets.length;i++)
    {
        if($support_tickets[i].status.toLowerCase()=="solved")
        {
            $scope.solvedCount++;
        }
    }
});