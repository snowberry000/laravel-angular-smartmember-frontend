app.controller('SiteContentSummaryController', function ($scope, $state, Restangular, summary) {
    $scope.summary = summary;
    console.log($scope.summary);

    $scope.series = ['Count',];
  
    $scope.charts = [];
	$scope.stats = {};


    var options = {
        series: {
            lines: {
                show: true,
                fill: true
            },
            /*splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },*/
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2,
            grow: {stepMode:"linear",stepDirection:"up",steps:80}
        },
        grow: {stepMode:"linear",stepDirection:"up",steps:80},
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#d5d5d5'
        },
        colors: ["#1ab394"],
        xaxis: {
        },
        yaxis: {
            ticks: 4
        },
        tooltip: false
    };

     $scope.init = function () {
        $scope.charts[0] = {"data" : [[]], "options" : options};

         if (summary && summary.lessons_views_perday)
         {
            var views_per_day = summary.lessons_views_perday.split(',');

            $.each(views_per_day, function (key, data) {
                $scope.charts[0].data[0].push( [key, parseInt(data)] );

	            $scope.stats.lesson_views_today = parseInt(data);
            });

        }

        $scope.charts[1] = {"data" : [[]], "options" : options};

         if (summary && summary.downloads_perday) {
            var views_per_day = summary.downloads_perday.split(',');

            $.each(views_per_day, function (key, data) {
                $scope.charts[1].data[0].push( [key, parseInt(data)] );

	            $scope.stats.downloads_today = parseInt(data);
            });
        }
    };


});

