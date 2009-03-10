var timerId = null;
var time = 0;
var oldTime = -1;
var timerStarted = false;
var stopped = true;

function startTimer(){
	time += 10;
	var divTimer = document.getElementById("timer")
	divTimer.innerHTML = time;
	timerId = self.setTimeout("startTimer()", 10);
}

function stopTimer(){
	self.clearTimeout(timerId);
	var divTimer = document.getElementById("timer")
	divTimer.innerHTML = "Your time was: " + (time / 1000).toFixed(2) + " seconds"
	oldTime = time;
	time = 0;
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
				var divTimer = document.getElementById("timer");
				divTimer.innerHTML = "Done! - You can press space again to start another timer!"
				oldTime = -1;
			},
			error: function(error){
				var divTimer = document.getElementById("timer")
				divTimer = "Error!"
			}
		})
	}
}

function reset(){
	oldTime = -1;
	document.getElementById("timer").innerHTML = "";
}