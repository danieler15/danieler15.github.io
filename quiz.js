var currentPageIndex = 0;
var maxPageIndex = 2;
var respones;
var userName;
var questionData = json;



$(document).ready(function() {
	// load questions
	currentPageIndex = -1;
	maxPageIndex =  json["questions"].length - 1;
	responses = new Array(maxPageIndex + 1);
    
    alert("abc");
    
    $.getJSON("http://danieler15.github.io/questions.json", function(data) {
        alert("data: ");
        alert(data);
    });
	
	$("#nav").on("click", ".button-role-nav", function(e) {
		var selected = $("input[id=choice-input]:checked", "#response-form").val();
		var displacement = ($(this).hasClass("nav-left")) ? -1 : 1;
		
		if (!selected && displacement > 0) {
			alert("Please answer the question before continuing. You can always navigate backwards to change your answer");
			return;
		}
		else {
			responses[currentPageIndex] = selected;			
			currentPageIndex += displacement;
			drawQuestionPage();
		}
		
		
	});
	$("#content").on("click", ".button-submit-name", function(e) {
        e.preventDefault();
		var val = $("input[class=name-input]").val();
		
		if (val == false) {
			alert("You must enter your name to continue.");
			return;
		}
		else {
			userName = val;
			currentPageIndex++;
			drawQuestionPage();
		}
	});
    $(".name-input").keypress(function(e) {
        if (e.which == '13' && currentPageIndex == -1) {
            e.preventDefault();
            $(".button-submit-name").click();
        } 
    });
	$("#nav").on("click", ".button-role-submit", function(e) {
        var selected = $("input[id=choice-input]:checked", "#response-form").val();
        if (!selected) {
			alert("Please answer the question before continuing. You can always navigate backwards to change your answer");
			return;
		}
        responses[currentPageIndex] = selected;			
        currentPageIndex++;
		drawResultsPage();
	});
    $("#nav").on("click", ".button-role-try-again", function(e) {
        location.reload();
    });
});

function drawResultsPage() {
	$("#quiz-content").empty();
	var newHtml = "<div id='score'><p>" + userName + ", you got a total of " + userScore() + " out of " + (maxPageIndex + 1) + " questions correct.</p></div><canvas width='200' height='200' style='margin:0 auto; background-color:#fff5ee  ;' id='score-canvas'>Canvas not supported in your browser.</canvas>";
	
	$("#quiz-content").html(newHtml);
    $("#nav").html("<input type='button' class='button-role-try-again' id='nav-button' value='Try Again!' />");
    drawScoreChart(userScore()/(maxPageIndex+1));
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
    
function userScore() {
	var questionsCorrect = 0;
	for (var i = 0; i <= maxPageIndex; i++) {
		var userResponse = responses[i];
		var answer = json["questions"][i]["answer"];
				
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
	var questionObject = json["questions"][index];
	var questionText = userName + ", " + questionObject["question"] + "   (Question " + (index+1) + "/" + (maxPageIndex+1) + ")";
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