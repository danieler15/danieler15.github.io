function jsonLoaded(json) {
    console.log("json loaded");
    
    questionsArray = json;
	currentPageIndex = -1;
	maxPageIndex =  json.length - 1;
    
    drawLoginSignup();
}
    
function authSucceeded(username) {
    currentPageIndex = 0;
    currentUsername = username;
    responses = new Array(maxPageIndex + 1);
    
    drawQuestionPage();
}
    
function recordUserScore(score) {
    var userData = getUserItem(currentUsername);
    userData.lastScore = score;
    if (score > userData.maxScore) {
        userData.maxScore = score;
    }
    setUserItem(currentUsername, userData);
}
    
function getUsersDictionary() {
    var d = JSON.parse(localStorage.getItem("users"));
    if (d != null) {
        return d;
    } 
    else {
        setUsersDictionary({});
        return {};
    }
}
    
function setUsersDictionary(dict) {
    localStorage.setItem("users", JSON.stringify(dict));
}
    
function setUserItem(username, data) {
    var dict = getUsersDictionary();
    dict[username] = data;
    setUsersDictionary(dict);
}
    
function getUserItem(username) {
    var dict = getUsersDictionary();
    if (dict != null) {
        return dict[username];
    }
    return null;
}

function drawResultsPage() {
    recordUserScore(userScore());
    $("#question-text").empty();
	var newHtml = "<div id='score'><p>" + currentUsername + ", you got a total of " + userScore() + " out of " + (maxPageIndex + 1) + " questions correct.</p></div><canvas width='200' height='200' style='margin:0 auto; background-color:#fff5ee  ;' id='score-canvas'>Canvas not supported in your browser.</canvas> <div id='leaderboard-header'>Current Leaderboard:</div> <div class='center'><table id='leaderboard-table'><tr><th>Username</th><th>High Score</th></tr> ";
    
    var usersDict = getUsersDictionary();
    //usersDict.sort(function(a, b) {return (b.maxScore - a.maxScore);});
    for (var key in usersDict) {
        var user = usersDict[key];
        newHtml += "<tr><td>" + user.username + "</td><td>" + user.maxScore + "</td></tr>";
    }
    newHtml += "</div></table>";
	
	$("#response-form").html(newHtml);
    $("#nav").html("<input type='button' style='margin-right:10px;' class='button-role-try-again' id='nav-button' value='Try Again!' /><input type='button' style='margin-left:10px;' class='button-role-signout' id='nav-button' value='Signout' />");
    drawScoreChart(userScore()/(maxPageIndex+1));
    recordUserScore(userScore());
}
    
function drawScoreChart(percentRight) {
    var canvas = document.getElementById("score-canvas");
    var context = canvas.getContext("2d");
    
    // draw score  circle
    context.fillStyle = "#40e0d0";
    context.moveTo(100, 100);
    context.arc(100, 100, 90, 0, 2*Math.PI*percentRight, false);
    context.lineTo(100, 100);
    context.fill();
}
    
function drawNameEntry() {
    $("#question-text").html("Please enter your name below:");
    $("#response-form").html('<input type="text" id="input" class="name-input" name="name" placeholder="Your Name" /><input type="button" class="button-submit-name" value="Continue" />');
}
    
function drawLoginSignup() {
    $("#question-text").html("Login Or Sign Up Below:");
    $("#response-form").html('<input type="text" id="login-input" class="username-input" name="username" placeholder="Username" /><br /><input type="password" id="login-input" class="password-input" name="password" placeholder="Password" /><br /><input id="login-input" type="button" class="button-submit-login" value="Log In" /><input type="button" id="login-input" class="button-submit-signup" value="Sign Up" />');
}
    
function userScore() {
	var questionsCorrect = 0;
	for (var i = 0; i <= maxPageIndex; i++) {
		var userResponse = responses[i];
		var answer = questionsArray[i]["answer"];
				
		var correct = userResponse == answer;
		//alert(userResponse + "--" + answer + "--" + correct);
		if (correct == true) {
			questionsCorrect++;
		}
	}
	return questionsCorrect;	
}

function drawQuestionPage() {
	loadQuestion(currentPageIndex);
	loadNavButtons(currentPageIndex);
}

function loadQuestion(index) {
	var questionObject = questionsArray[index];
	var questionText = currentUsername + ", " + questionObject["question"] + "   (Question " + (index+1) + "/" + (maxPageIndex+1) + ")";
	$("#question-text").html(questionText);
	
	var questionChoices = questionObject["choices"];
	var choiceHtmlString = "";

	for (var i = 0; i < questionChoices.length; i++) {
		var choiceText = questionChoices[i];
		
		choiceHtmlString += "<input type='radio' id='choice-input' name='question-response' value='" + choiceText + "' ";
        
        if (responses[index] != null && choiceText == responses[index]) {
            choiceHtmlString += "checked";
        }
        
        choiceHtmlString += " />" + choiceText + "<br />";
		
	}
    
    $("#response-form").hide("medium", function() {
        $("#response-form").html(choiceHtmlString);
        $("#response-form").show("medium");
    });
	
}

function loadNavButtons(index) {
	$("#nav").empty();
		
	var leftButton = $("<input type='button' class='button-role-nav nav-left' id='nav-button' value='Previous Question' />");
	var rightButton = $("<input type='button' class='button-role-nav nav-right' id='nav-button' value='Next Question' />");
	
	if (index == 0) {
		$("#nav").append(rightButton);
	}
	else if (index == maxPageIndex) {
		$("#nav").append(leftButton);
		$("#nav").append(rightButton);
		rightButton.attr("value", "Submit Answers!");
		rightButton.attr("class", "button-role-submit");
	}
	else {
		$("#nav").append(leftButton);
		$("#nav").append(rightButton);
	}
}   