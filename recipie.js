var message, nextvalue = 0;
var starting = document.getElementById('start');

function voiceDev() {

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

  var contentRecog = document.getElementById("contentRecog");
  if (document.getElementById('resultsDiv')) {
    document.getElementById('resultsDiv').remove();
  }

  var results = document.createElement('div');
  results.setAttribute('id', 'resultsDiv');

  var status = document.createElement('div');
  status.setAttribute('id', 'stat');
  status.style.marginLeft = "50px";
  status.innerHTML = 'Not Listening.';
  results.appendChild(status);

  var speechResult = document.createElement("div");
  speechResult.innerHTML = '';
  speechResult.style.marginLeft = "50px";
  speechResult.className = "speech";
  results.appendChild(speechResult);

  contentRecog.appendChild(results);

  var alternativesDebug = document.createElement("div");
  alternativesDebug.innerHTML = '';
  alternativesDebug.className = "alternatives";
  document.body.appendChild(alternativesDebug);



  if (!SpeechRecognition) {
    status.innerHTML = "No Speech Capabilities Found";
  } else {
    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    var start = new SpeechSynthesisUtterance("Are you ready");
    start.rate = 1.3;
    window.speechSynthesis.speak(start);
    start.onend = function(event) {
      recognition.start();
    };


    document.getElementById("disable").onclick = function() {
      document.getElementById('allowChat').src = 'chat.png';
      recognition.stop();
      status.innerHTML = 'No Longer Listening.';
      var stop = "Thank you! Have a Great Day";
      var stop1 = new SpeechSynthesisUtterance(stop);
      window.speechSynthesis.speak(stop1);
    };

    recognition.onnomatch = function(event) {
      console.log("Did not recognize");
    };

    recognition.onstart = function() {
      status.className = "status";
      status.innerHTML = "Listening....";
    };

    recognition.onresult = function(event) {
      recognition.stop();
      //for (var i = event.resultIndex; i < event.results.length; ++i) {
      var result = event.results[0];
      if (result[0].transcript == 'yes') {


        $.ajax({
            method: "GET",
            url: "http://recipio.herokuapp.com/recipes",
            data: {
              recipe: "omelette"
            }
          })
          .done(function(msg) {
            message = msg.steps;
            console.log(result[0].transcript);
            var utterance = new SpeechSynthesisUtterance(message[nextvalue]);
            utterance.rate = 1.3;
            starting.innerHTML = message[nextvalue];
            window.speechSynthesis.speak(utterance);

            utterance.onend = function(event) {
              console.log("first end");
              recognition.start();
            };

          });
      } else if (result[0].transcript.includes('next') || result[0].transcript.includes('Next')) {

        if (nextvalue !== (message.length - 1)) {
          console.log(result[0].transcript);
          nextvalue++;
          var utteranceNext = new SpeechSynthesisUtterance(message[nextvalue]);
          utteranceNext.rate = 1.3;
          starting.innerHTML = message[nextvalue];
          window.speechSynthesis.speak(utteranceNext);

          utteranceNext.onend = function(event) {
            recognition.start();
          };
        } else {
          var lastStep = new SpeechSynthesisUtterance("That was the last step");
          lastStep.rate = 1.3;
          starting.innerHTML = "That was the last step";
          window.speechSynthesis.speak(lastStep);

          lastStep.onend = function(event) {
            recognition.start();
          };
        }


      } else if (result[0].transcript.includes('previous') || result[0].transcript.includes('Previous')) {
        if (nextvalue !== 0) {
          nextvalue--;
          console.log(result[0].transcript);
          var utterancePrevious = new SpeechSynthesisUtterance(message[nextvalue]);
          utterancePrevious.rate = 1.3;
          starting.innerHTML = message[nextvalue];
          window.speechSynthesis.speak(utterancePrevious);

          utterancePrevious.onend = function(event) {
            recognition.start();
          };
        } else {
          var firstStep = new SpeechSynthesisUtterance("That was the first step");
          firstStep.rate = 1.3;
          starting.innerHTML = "That was the first step";
          window.speechSynthesis.speak(firstStep);

          firstStep.onend = function(event) {
            recognition.start();
          };
        }


      } else if (result[0].transcript.includes('repeat') || result[0].transcript.includes('Repeat')) {
        console.log(result[0].transcript);
        var utteranceRepeat = new SpeechSynthesisUtterance(message[nextvalue]);
        utteranceRepeat.rate = 1.3;
        starting.innerHTML = message[nextvalue];
        window.speechSynthesis.speak(utteranceRepeat);

        utteranceRepeat.onend = function(event) {
          recognition.start();
        };

      } else if (result[0].transcript.includes('stop') || result[0].transcript.includes('Stop') || result[0].transcript.includes('Bye') || result[0].transcript.includes('bye')) {
        console.log(result[0].transcript);
        var stop = "Thank you! Have a Great Day";
        var stop1 = new SpeechSynthesisUtterance(stop);
        stop1.rate = 1.3;
        starting.innerHTML = stop;
        window.speechSynthesis.speak(stop1);

        stop1.onend = function(event) {
          $('#myModal').hide();
          $('.modal-backdrop').hide();
          recognition.stop();
        };

      } else if (!result[0].transcript.includes('repeat') || !result[0].transcript.includes('Repeat') ||
        !result[0].transcript.inculdes('previous') || !result[0].transcript.includes('Previous') ||
        !result[0].transcript.includes('next') || !result[0].transcript.includes('Next') ||
        !result[0].transcript.includes('yes') || !result[0].transcript.includes('yes')
      ) {
        console.log(result[0].transcript);
        recognition.stop();
        var sorry = new SpeechSynthesisUtterance("Sorry Can you repeat that again");
        sorry.rate = 1.3;
        starting.innerHTML = "Sorry Can you repeat that again";
        window.speechSynthesis.speak(sorry);
        sorry.onend = function(event) {
          recognition.start();
        };


      }

      if (result.isFinal) {
        speechResult.innerHTML = "Speech Result (final): " + result[0].transcript;
      } else {
        speechResult.innerHTML = "Speech Result (in progress): " + result[0].transcript;
      }

      // var alternatives = [];
      // for (var j = 1; j < result.length; ++j) {
      //     alternatives.push(result[j].transcript);
      // }
      // alternativesDebug.innerHTML = alternatives.join('<br>');
      //}
    };

    recognition.onerror = function(event) {
      status.innerHTML = 'Error.';
    };
    recognition.onend = function() {
      status.innerHTML = 'No Longer Listening.';
      //recognition.start();
    };


  }
}
