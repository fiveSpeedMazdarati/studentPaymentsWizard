// global vars

var element;                  // the text element I'm manipulating
var index = 0;                // the index value of the array containing object literals
var previousIndex = 0;        // the previous index value - facilitates "go back" one option
var historyArray = new Array("0");    // an array of the index of previously visited objects (facilitates more than one step backwards)
                              // it is initialized with one value - "0" - since the 0 index is always the first visited page
var linkYes = null;           // the 'yes' link on the page
var linkNo = null;            // the 'no' link on the page
var linkStartOver = null;     // the 'start over' link on the page

// set up the listeners on the page
setUpListeners();

// this is an array of js object literals containing all of the pages and their properties - determines the text for the question/outcome and what to display next based on user input
// could be stored in a database and retrieved on page load, or stored in its own config file instead of living here
var newPages =
            {"pages":[{"ID":"question1","type":"question","content":"Is this payee a UW student?","yesDestination":"question2","noDestination":"question4"},
            {"ID":"question2","type":"question","content":"Is the payment recurring monthly?","yesDestination":"result1","noDestination":"question3"},
            {"ID":"question3","type":"question","content":"Is student enrolled for term of payment?","yesDestination":"question11","noDestination":"question10"},
            {"ID":"question4","type":"question","content":"Is Payee an employee?","yesDestination":"result1","noDestination":"question5"},
            {"ID":"question5","type":"question","content":"Is Payee not affiliated with UW-Madison?","yesDestination":"question6","noDestination":"question1"},
            {"ID":"question6","type":"question","content":"Is payment a scholarship paid to another university?","yesDestination":"result4","noDestination":"question7"},
            {"ID":"question7","type":"question","content":"Is payment for travel?","yesDestination":"result3","noDestination":"question8"},
            {"ID":"question8","type":"question","content":"Is payment for research support?","yesDestination":"question9","noDestination":"result4"},
            {"ID":"question9","type":"question","content":"Is Payee a UW System employee?","yesDestination":"result1","noDestination":"result4"},
            {"ID":"question10","type":"question","content":"Was the student enrolled in the past 90 days?","yesDestination":"question11","noDestination":"result4"},
            {"ID":"question11","type":"question","content":"Is this an educational or living related expense? (not research)","yesDestination":"result2","noDestination":"question12"},
            {"ID":"question12","type":"question","content":"Is this an award or prize?","yesDestination":"question13","noDestination":"question14"},
            {"ID":"question13","type":"question","content":"Is the award or prize open only to UW-Madison students?","yesDestination":"result2","noDestination":"result4"},
            {"ID":"question14","type":"question","content":"Is this payment for services?","yesDestination":"result1","noDestination":"question16"},
            {"ID":"question15","type":"question","content":"Are the funds restricted?","yesDestination":"result3","noDestination":"result2"},
            {"ID":"question16","type":"question","content":"Is this a travel expense?","yesDestination":"question17","noDestination":"question18"},
            {"ID":"question17","type":"question","content":"Is the primary benefit for education enrichment?","yesDestination":"question15","noDestination":"result3"},
            {"ID":"question18","type":"question","content":"Is this for research support? (non-service)","yesDestination":"result2","noDestination":"question11"},
            {"ID":"result1","type":"outcome","content":"Use Payroll Payment Process","yesDestination":null,"noDestination":null},
            {"ID":"result2","type":"outcome","content":"Use CSA/Bursar Process","yesDestination":null,"noDestination":null},
            {"ID":"result3","type":"outcome","content":"Use e-Refund Process","yesDestination":null,"noDestination":null},
            {"ID":"result4","type":"outcome","content":"Use PIR Process","yesDestination":null,"noDestination":null},
            {"ID":"result5","type":"outcome","content":"Use e-Refund Process","yesDestination":null,"noDestination":null},
            {"ID":"result6","type":"outcome","content":"Use Payroll Payment Process","yesDestination":null,"noDestination":null},
            {"ID":"result7","type":"outcome","content":"Use PIR Process","yesDestination":null,"noDestination":null},
            {"ID":null,"content":null,"yesDestination":null,"noDestination":null}]} //end pages array

function addToHistory(addThisValue){
// do something to add a new index value to the last position in the array
  console.log("Adding value: " + addThisValue + " to the history array.");


  historyArray.push(addThisValue);
  //console.log(historyArray[0]); // this should always be "0" since it's the starting point every time
  console.log("The array is now this long: " + historyArray.length);
  //console.log(history.toString());
}

function getPreviousIndex(){
// do something to return the last value in the history array, then delete it from the array
  var previousIndex = historyArray.pop();
  console.log("The previous index value is: " + previousIndex);
  return previousIndex;
}

function clearHistory(){
// do something to remove all of the values from the history array
  historyArray = [];
}


function updateContent(newIndex){
  //debug code to display what's currently on the page
  element = document.getElementById('content');
  //console.log("Original text: " + element.innerHTML);
  //console.log("Updating to this index value: " + newIndex);

  // display the next question text
  element.innerHTML = newPages.pages[newIndex].content;

    if(newPages.pages[newIndex].type == "outcome"){
      // if this object is an outcome, do something if needed. Add style? Remove yes/no text?
      //console.log("This is an outcome");
      element.classList.add("result");
      hideTheButtons();
    }else{
      // if this is a question, do something if needed. Style? Add text?
      //console.log("This is a question");

    }

  //debug code to display what the script grabbed
  //console.log("Updated text: " + newPages.pages[newIndex].content);

}

function navigate(answer){
  if(answer == "yes"){
    //console.log("User clicked 'yes'");

    // find the index of the ID property in the array which has the corresponding value contained in the yesDestination property for the current page
    console.log("navigating to: " + newPages.pages[index].yesDestination);

    var page = newPages.pages[index].yesDestination;

    // find the object in the array whose index value matches the current object's yesDestination property
    //inspect each item in the newPages.pages array
    for(var i = 0; i<newPages.pages.length; i++){
      if(newPages.pages[i]['ID'] == page){
        console.log("The Array's index value of " + newPages.pages[i]['ID'] + " is " + i);
        setIndex(i);
      }
    }

    // update the page content using the content from the newly found index value
    updateContent(getIndex());

  }else if(answer == "no"){
    console.log("User clicked 'no'");

    console.log("navigating to: " + newPages.pages[index].noDestination);

    var page = newPages.pages[index].noDestination;

    // find the object in the array whose index value matches the current object's noDestination property
    for(var i = 0; i<newPages.pages.length; i++){
      if(newPages.pages[i]['ID'] == page){
        console.log("The Array's index value of " + newPages.pages[i]['ID'] + " is " + i);
        setIndex(i);
      }
    }
    // update the page content using the content from the newly found index value
    updateContent(getIndex());

  }else if(answer == "goBack"){
      // do some stuff to get the last value in the history array and navigate to that index value
      setIndex(getPreviousIndex());
      updateContent(getIndex());
  }else{
    //must be the "start over" option - go back to the beginning
    console.log("Start over");

    //index value of 0 is the starting question
      setIndex(0);
      updateContent(getIndex());
      element.classList.remove("result");
      showTheButtons();
      clearHistory();

  }
  // add the index to the history array
  addToHistory(getIndex());
} // end of navigate function

function setUpListeners(){

  linkYes = document.getElementById('answerYes');
  linkNo = document.getElementById('answerNo');
  linkStartOver = document.getElementById('startOver');


  linkYes.addEventListener("click", function(){navigate("yes")}, false);
  linkNo.addEventListener("click", function(){navigate("no")}, false);
  linkStartOver.addEventListener("click", function(){navigate("startOver")}, false);
} // end of setUpListeners function

// manage the index value
function getIndex(){
  return index;
}

function setIndex(newValue){
  index = newValue;
}

// control the visibility of the Yes/No choices
function hideTheButtons(){
  document.getElementById("choice").style.visibility = "hidden";
}

function showTheButtons(){
  document.getElementById("choice").style.visibility = "visible";
}
