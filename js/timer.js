var timerId = null;
var time = 0;
var timeToSubmit = -1;
var timerStarted = false;
var stopped = true;
var divTimer = $("#timer", document)
var initialDate;

var deleteLink = "<li id='KEY'> From You: TIMEs @ DATE <a id='delete' href=\"javascript:deleteTime('KEY')\" \">[x]</a></li>"

function incrementTimer(){
	time += 125;
	divTimer.html((time / 1000).toFixed(2));
	timerId = self.setTimeout("incrementTimer()", 125);
}

function startTimer(){
	initialDate = new Date();
	timerId = self.setTimeout("incrementTimer()", 125);
}

function stopTimer(){
	self.clearTimeout(timerId);
	timeToSubmit = new Date() - initialDate
	divTimer.html("Your time was: " + ( timeToSubmit / 1000).toFixed(2) + " seconds")
	time = 0;
	submitTime();
	
	
	//sometimes gae returns wrong values - maybe it's because of the database... don't know.
	self.setTimeout("getTimes()", 300)
}

function start(event){
	if(event.keyCode == 32){
		event.preventDefault();
		if(stopped && timeToSubmit == -1){
			startTimer();
			stopped = false;
		}
	}
}

function stop(event){
	if(event.keyCode == 32){
		event.preventDefault();
		if(!stopped){
			stopTimer();
			stopped = true;
		}
	}
}

function submitTime(){
	if(timeToSubmit != -1){
		$.ajax({
			url : "/post",
			type: "POST",
			data: { 'time' : timeToSubmit },
			success: function(){
				divTimer.append("<br /> Time Submitted!")
				self.setTimeout("reset()", 100)
			},
			error: function(error){
				var divTimer = document.getElementById("timer")
				divTimer = "Error!"
			}
		})
	}
}

function getTimes(){
	$.ajax({
	  url: "/times",
	  dataType: "xml",
	
  	  success: function(data) {
		var divTimes = $("#times", document).find("ul")

	    $(data).find("data").each(function(index) {
		    var d = $(this)
			var key = d.attr("key")

	    	divTimes.prepend(deleteLink.replace("KEY", key, "g").replace("TIME", d.attr("time"), "g").replace("DATE", d.attr("date"), "g"))
	    });
	    
      },
	
      error: function(err) {
	     alert("Erro!");
	  },
	});	
}

function reset(){
	timeToSubmit = -1;
}


function deleteTime(key){
	$.ajax({
		url : "/delete",
		type: "POST",
		data: { 'key' : key },
		success: function(){
			$("#" + key).fadeOut("fast")
		},
		error: function(error){
		}
	})
}


function clearTimes(){
	$.ajax({
		url : "/clear",
		type: "POST",
		success: function(){
			$("#times").find("ul").fadeOut('fast');
		},
		error: function(error){
		}
	})
}

$(function() {
	var status = $("#status")
    $(document).ajaxSend(function() {
		status.show()
    });
    $(document).ajaxStop(function() {
		status.hide()
    });
});
