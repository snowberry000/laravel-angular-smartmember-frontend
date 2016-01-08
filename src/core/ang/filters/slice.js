app.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
});

app.filter('assingeeFilter', function() {
  return function(items, assignee) {
  	var filtered=[];
  	for(var i=0;i<items.length;i++)
  	{
  		//console.log(assignee.agent_id);
  		if(items[i].agent_id==assignee.agent_id || !assignee.agent_id || assignee.agent_id==0)
  		{
  			filtered.push(items[i]);
  		}
  	}
  	return filtered;

  };
});


app.filter('datesFilter', function() {
  return function(items, assignee) {

  	var filtered=[];
  	
  	$startDate=null;
  	$endDate=null;


  	if(assignee.Date && assignee.Date=='today')
  	{
  		$startDate=moment().startOf("day");
  		$endDate=moment().endOf("day");
  	}
  	else if(assignee.Date && assignee.Date=='yesterday')
  	{
  		$startDate=moment().startOf("day").subtract(1, 'days');
  		$endDate=moment().endOf("day");
  	}
  	else if(assignee.Date && assignee.Date=='7 days')
  	{
  		$startDate=moment().startOf("day").subtract(7, 'days');
  		$endDate=moment().endOf("day");
  	}
  	else if(assignee.Date && assignee.Date=='30 days')
  	{
  		$startDate=moment().startOf("day").subtract(30, 'days');
  		$endDate=moment().endOf("day");
  	}
  	else if(assignee.Date && assignee.Date=="custome dates")
  	{
  		$startDate=moment(assignee.startDate).startOf("day");
  		$endDate=moment(assignee.endDate).endOf("day");
  	}
  	else
  		return items;

  	//console.log($startDate);
  	//console.log($endDate);


  	for(var i=0;i<items.length;i++)
  	{
  		if(moment.utc(items[i].created_at) >= $startDate && moment.utc(items[i].created_at) <= $endDate)
  		{
  			filtered.push(items[i]);
  		}
  	}
  	return filtered;

  };
});

app.filter('assignmentFilter', function() {
  return function(items, search) {
  	var filtered=[];

  	for(var i=0;i<items.length;i++)
  	{
  		if(search.assigned=='unassigned')
  		{
  		    if(items[i].agent_id==0)
  		    {
  		        filtered.push(items[i]);
  		    }
  		}
  		else if(search.assigned=='assigned')
  		{
  		    if(items[i].agent_id!=0)
  		    {
  		        filtered.push(items[i]);
  		    }
  		    
  		}
  		else
  		{
  		    filtered.push(items[i]);
  		}
  	}
  	return filtered;

  };
});