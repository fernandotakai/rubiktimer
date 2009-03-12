var timerId = null;
var time = 0;
var oldTime = -1;
var timerStarted = false;
var stopped = true;

var divTimer = $("#timer", document)

var initialDate;

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
	oldTime = new Date() - initialDate
	divTimer.html("Your time was: " + ( oldTime / 1000).toFixed(2) + " seconds")
	time = 0;
	submitTime();
	getTimes();
}

function start(event){
	if(event.keyCode == 32){
		event.preventDefault();
		if(stopped && oldTime == -1){
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
	if(oldTime != -1){
		$.ajax({
			url : "/post",
			type: "POST",
			data: { 'time' : oldTime },
			success: function(){
				divTimer.append("<br /> Time Submitted!")
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
	    	divTimes.prepend("<li id='" + d.attr("key") + "'> From You: " + d.attr("time") + "s @ " + d.attr("date") + " <a id='delete' href='' onclick=\"deleteTime('" + key + "')\">[x]</a></li>")
	    });
	    
      },
	
      error: function(err) {
	     alert("Erro!");
	  },
	});
	
}

function reset(){
	oldTime = -1;
	document.getElementById("timer").innerHTML = "";
}


function deleteTime(key){
	$.ajax({
	  url: "/delete",
	  type: "POST",
	  data: { key: key},
      success: function(msg) {
	  	$("#" + key).delete()
		alert("Aasd");
	  }, 
	});
	
}