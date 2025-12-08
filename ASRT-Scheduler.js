/* ********** ASRT-Time Scheduler script ********************* */

var mode = local.parameters.mode.get();
var state = false;
var currentTime = {	"year":2022, 
					"monthName":"January",
					"month":11,
					"monthDay":2,
					"weekDayName":"Wednesday",
					"weekDay":3,
					"hour":16,
					"minutes":28,
					"seconds":10,
					"fullDayTime":0,
				 };

///////////////////////////		INIT		/////////////////////////////

function init()
{

	updateTime();
	updateState();
	
}

///////////////////////////		UPDATE		/////////////////////////////

// function update(deltaTime)
// {
	
// 	//script.log("Update : "+util.getTime()+", delta = "+deltaTime); //deltaTime is the time between now and last update() call, util.getTime() will give you a timestamp relative to either the launch time of the software, or the start of the computer.
// }


/*
 This function, if you declare it, will be called when after a user has made a choice from a okCancel box or YesNoCancel box that you launched from this script 
*/
/*
function messageBoxCallback(id, result)
{
	script.log("Message box callback : "+id+" > "+result); //deltaTime is the time between now and last update() call, util.getTime() will give you a timestamp relative to either the launch time of the software, or the start of the computer.
}
*/

///////////////////////////		VALUES AND PARAMETERS		/////////////////////////////

function moduleParameterChanged(param)
{
	if(param.isParameter())
	{
		if(param.is(local.parameters.mode)){
			mode = local.parameters.mode.get();
			script.log("changed mode : "+ mode);
			updateState();
		}

		// script.log("Module parameter changed : "+param.name+" > "+param.get());
	}else 
	{
		script.log("Module parameter triggered : "+param.name);	
		if(param.is(local.parameters.addSchedule)){
			createSchedule();
		}
		else if(param.is(local.parameters.clearAllSchedules)){
			clearSchedules();
		}
		else if(param.is(local.parameters.addPeriod)){
			createPeriod();
		}
		else if(param.is(local.parameters.clearAllPeriods)){
			clearAllPeriods();
		}
		else if (param.name == "clear"){
			
			var parent = param.getParent();
			script.log("Removing schedule " + parent.name);
			local.parameters.scheduleList.removeContainer(parent.name);
			script.refreshEnvironment();
		}
	}
}



function moduleValueChanged(value)
{
	// var props = util.getObjectMethods(local.templates);
	// for (var i=0; i<props.length ; i++){
	// 	script.log(props[i]);
	// } 
	
	// script.log("Module value changed : "+value.name+" > "+value.get());	
	
	if(value.isParameter())
	{
		

		if(value.is(local.values.seconds)){
			updateTime();
			updateState();
			// script.log("seconds");	
		}
		//script.log("Module value changed : "+value.name+" > "+value.get());	
	}else 
	{
		//script.log("Module value triggered : "+value.name);	
	}
}

///////////////////////////		DYNAMIC UI PARAMETERS		/////////////////////////////

function createSchedule(){
	script.log("New schedule" );
	var schedulesList = local.getChild("parameters").getChild("Schedule List").getContainers();
	script.log(schedulesList.length);

	var newSchedule = local.getChild("parameters").getChild("Schedule List").addContainer("Schedule " + (schedulesList.length+1));
	var newScheduleState = newSchedule.addBoolParameter("State", "current state of this schedule", false);
	newScheduleState.setAttribute("readOnly", true);
	newScheduleState.setAttribute("saveValueOnly",false);
	
	newSchedule.addTrigger("Clear", "Delete this schedule").setAttribute("saveValueOnly",false);

	newSchedule.addStringParameter("Start date","", "01/01" ).setAttribute("saveValueOnly",false);
	newSchedule.addStringParameter("Stop date","", "31/12" ).setAttribute("saveValueOnly",false);
	newSchedule.addStringParameter("Start time","", "9:00" ).setAttribute("saveValueOnly",false);
	newSchedule.addStringParameter("Stop time","", "17:00" ).setAttribute("saveValueOnly",false);

	newDays = newSchedule.addContainer("days");
	newDays.addBoolParameter("Monday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Tuesday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Wednesday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Thursday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Friday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Saturday", "", true).setAttribute("saveValueOnly",false);
	newDays.addBoolParameter("Sunday", "", true).setAttribute("saveValueOnly",false);
}

// function createPeriod(){
// 	script.log("New period" );
// 	var period_list = util.getObjectProperties(local.getChild("parameters").getChild("Periods List"), true, false);
	
// 	script.log(period_list.length);
// 	var periodString = "Period " + (period_list.length+1);
// 	var newPeriod = local.getChild("parameters").getChild("Periods List").addContainer(periodString);
// 	newPeriod.addBoolParameter("State", "current state of this period", false);
// 	newPeriod.addEnumParameter("Mode", "over will override shedule value (OFF included), OR will be ON if schedule OR period is on, AND if both are ON ",
// 								"OVER", 0, "OR", 1, "AND", 2).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Start Year", "type year of event or -1 to repeat each year", 2024, -1, 2100).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Start Month", "", 1, -1, 12).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Start Day", "", 1, -1, 31).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Start hour", "", 8, -1, 23).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Start minute", "", 0, -1, 59).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Stop Year", "type year of event or -1 to repeat each year", 2024, -1, 2100).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Stop Month", "", 1, -1, 12).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Stop Day", "", 1, -1, 31).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Stop hour", "", 8, -1, 23).setAttribute("saveValueOnly",false);
// 	newPeriod.addIntParameter("Stop minute", "", 0, -1, 59).setAttribute("saveValueOnly",false);
// }

function clearSchedules(){
	script.log("Clear all schedules");
	local.getChild("parameters").removeContainer("Schedule List");
	script.refreshEnvironment();
	var scheduleList = local.getChild("parameters").addContainer("Schedule List");
	// scheduleList.addTrigger("Add Schedule", "");
	// scheduleList.addTrigger("Clear all Schedules", "");
	script.refreshEnvironment();
}

// function clearAllPeriods(){
// 	script.log("Clear all periods");
// 	local.getChild("parameters").removeContainer("Periods List");
// 	script.refreshEnvironment();
// 	var periodsList = local.getChild("parameters").addContainer("Periods List");
// 	// periodsList.addTrigger("Add Period", "");
// 	// periodsList.addTrigger("Clear all Priods", "");
// 	script.refreshEnvironment();
// }


///////////////////////////		TIME AND STATE		/////////////////////////////

function updateTime(){
	currentTime.year = local.values.year.get();
	currentTime.monthName = local.values.monthName.get();
	currentTime.month = local.values.month.get();
	currentTime.monthDay = local.values.monthDay.get();
	currentTime.weekDayName = local.values.weekDayName.getOptionAt(local.values.weekDayName.getIndex()).key;
	currentTime.weekDay = local.values.weekDay.get();
	currentTime.hour = local.values.hour.get();
	currentTime.minutes = local.values.minutes.get();
	currentTime.seconds = local.values.seconds.get();
	currentTime.fullDayTime = local.values.fullDayTime.get();

	//script.log(currentTime.seconds);
}

function parseStringDate(stringDate, day, month, year){
	var split = stringDate.split("/"); //{day, month, year}
	day = parseInt(split[0]) ;
	month = parseInt(split[1]) ;
	year = parseInt(split[2]) ;
	if(year == 0){year = currentTime.year ;}
	// script.log(day + "  " + month + " " + year);
	
	
}

function updateState(){
	// var props = util.getObjectMethods(local.values.weekDayName);
	// for (var i=0; i<props.length ; i++){
	// 	script.log(props[i]);
	// } 
	state = false ;
	if(mode=="off"){state = false;}
	else if(mode=="on"){state = true;}
	else if(mode=="auto"){
		script.refreshEnvironment();

		//Get the list of schedules and parse them
		var schedulesList = local.getChild("parameters").getChild("Schedule List").getContainers();
		script.log(schedulesList.length);
		if(schedulesList.length){
			for (var i=0; i<schedulesList.length; i++){
				var scheduleState = false ;
				script.log(schedulesList[i].name);

				// //first check if the schedule is active today, else pass
				// script.log(currentTime.weekDayName);				
				// if(schedulesList[i].getChild("days").getChild(currentTime.weekDayName).get()){

				// 	// check if we are in date range
				// 	var startDate = schedulesList[i].startDate.get();
				// 	var split = startDate.split("/"); //{day, month, year}
				// 	var day = parseInt(split[0]) ;
				// 	var month = parseInt(split[1]) ;
				// 	var year = parseInt(split[2]) ;
				// 	if(year == 0){year = currentTime.year ;}
				// 	script.log(day + " " + month + " " + year);

				// 	if( (year < currentTime.year) ||
				// 		((year == currentTime.year) && (month < currentTime.month)) ||
				// 		((year == currentTime.year) && (month == currentTime.month) && (day <= currentTime.monthDay))
				// 		){
				// 			script.log("schedule started ok");
				// 			//startDate is passed, let's test enDate
				// 			startDate = schedulesList[i].stopDate.get();
				// 			split = startDate.split("/"); //{day, month, year}
				// 			day = parseInt(split[0]) ;
				// 			month = parseInt(split[1]) ;
				// 			year = parseInt(split[2]) ;
				// 			if((year == 0) && (month >= currentTime.month)){year = currentTime.year ;}
				// 			else if((year == 0) && (month < currentTime.month)){year = currentTime.year + 1 ;}
				// 			script.log(day + " " + month + " " + year);

				// 			if( (year > currentTime.year) ||
				// 				((year == currentTime.year) && (month > currentTime.month)) ||
				// 				((year == currentTime.year) && (month == currentTime.month) && (day >= currentTime.monthDay)) ){
				// 					script.log("schedule active");


				// 					var time = schedulesList[i].startTime.get();
				// 					split = time.split(":"); //{hour,minutes}
				// 					time = parseInt(split[0]) * 3600 + parseInt(split[1])*60 ;	

				// 					if(time <= currentTime.fullDayTime){
				// 						script.log("started");
				// 						time = schedulesList[i].stopTime.get();
				// 						split = time.split(":"); //{hour,minutes}
				// 						time = parseInt(split[0]) * 3600 + parseInt(split[1])*60 ;	
				// 						if(time >= currentTime.fullDayTime){
				// 							script.log(" and running");
				// 							scheduleState = true ;
				// 							state = true ;
				// 						}

				// 					}
									

									
									

				// 			}
				// 	}
				// }

				// first check if the schedule is active today, else pass
				script.log(currentTime.weekDayName);				
				if(schedulesList[i].getChild("days").getChild(currentTime.weekDayName).get()){
					
					//parse all timing informations
					var split ;
					//startDate
					split = schedulesList[i].startDate.get().split("/"); //{day, month, year}
					var startDay = parseInt(parseFloat(split[0])) ;
					var startMonth = parseInt(parseFloat(split[1])) ;
					var startYear = parseInt(parseFloat(split[2])) ;
					//if month is not specified, add current month
					if(startMonth == 0){startMonth = currentTime.month ;}
					//if year is not specified, add current year
					if(startYear == 0){startYear = currentTime.year ;}
					script.log("Start date : " + startDay + " " + startMonth + " " + startYear);

					if( (startYear < currentTime.year) ||
						((startYear == currentTime.year) && (startMonth < currentTime.month)) ||
						((startYear == currentTime.year) && (startMonth == currentTime.month) && (startDay <= currentTime.monthDay))
						){
							script.log("Start date is passed, testing stop date");
							//startDate is passed, let's test stopDate
							split = schedulesList[i].stopDate.get().split("/"); //{day, month, year}
							var stopDay = parseInt(parseFloat(split[0])) ;
							var stopMonth = parseInt(parseFloat(split[1])) ;
							var stopYear = parseInt(parseFloat(split[2])) ;
							//if month is not specified, add current month, or next month depending on end day vs start day
							if((stopMonth == 0) && (stopDay >= startDay)){stopMonth = currentTime.month ;}
							else if((stopMonth == 0) && (stopDay < startDay)){stopMonth = currentTime.month + 1 ; if(stopMonth==13){stopMonth=1;}} //might give 13
							//if year is not specified, add current year or next year depending on end month vs start month
							if((stopYear == 0) && (stopMonth >= startMonth)){stopYear = currentTime.year ;}
							else if((stopYear == 0) && (stopMonth < startMonth)){stopYear = currentTime.year + 1 ;}
							script.log("Stop date : " + stopDay + " " + stopMonth + " " + stopYear);

							if( (stopYear > currentTime.year) ||
								((stopYear == currentTime.year) && (stopMonth > currentTime.month)) ||
								((stopYear == currentTime.year) && (stopMonth == currentTime.month) && (stopDay >= currentTime.monthDay)) 
								){
									script.log("Stop date is not passed, checking hour range");
									split = schedulesList[i].startTime.get().split(":"); //{hour,minutes}
									// for(var i=0; i<split.length ; i++){script.log(parseFloat(split[i]));}
									var startTime = parseFloat(split[0]) * 3600 + parseFloat(split[1])*60 ;	
									split = schedulesList[i].stopTime.get().split(":"); //{hour,minutes}
									var stopTime = parseFloat(split[0]) * 3600 + parseFloat(split[1])*60 ;	
									script.log(startTime + " - " + stopTime );
									if ((startTime <= stopTime) && (startTime<=currentTime.fullDayTime) && (stopTime>currentTime.fullDayTime)){
										script.log("running between");
										scheduleState = true ;
										state = true ;
									}
									else if ((startTime > stopTime) && ((startTime<=currentTime.fullDayTime) || (stopTime>currentTime.fullDayTime))){
										script.log("running before or after");
										scheduleState = true ;
										state = true ;
									}
							}
							else {script.log("Stop date is passed");}
					}
					else{script.log("start date not passed");}


				// schedulesList[i].state.set(scheduleState);
				}
				else{script.log(script.log(schedulesList[i].name) + "not scheduled today");}
				schedulesList[i].state.set(scheduleState);
			}

		}
	}

	//state = value.get();
	local.getChild("values").getChild("state").set(state);
	state2color();
	//script.log(state);
}

function state2color(){
	if (state == 0){
		local.values.stateColor.set([1,0,0,1]);
	}
	else{
		local.values.stateColor.set([0,1,0,1]);
	}
}



