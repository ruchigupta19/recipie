var message, nextvalue = 0;

function voiceDev() {

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

  var contentRecog = document.getElementById("contentRecog");
  if (document.getElementById('resultsDiv')) {
    document.getElementById('resultsDiv').remove();
  }

  var results = document.createElement('div');
  results.setAttribute('id', 'resultsDiv');

  var status = document.createElement('div');
  status.innerHTML = 'Not Listening.';
  results.appendChild(status);

  var speechResult = document.createElement("div");
  speechResult.innerHTML = '';
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
    recognition.start();

    document.getElementById("disable").onclick = function() {
      document.getElementById('allowChat').src = 'chat.png';
      recognition.stop();
      status.innerHTML = 'No Longer Listening.';
    }

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

        //  var recipes = result[0].transcript;
        //recipes = recipes.toLowerCase().trim();
        // var commandArray = recipes.split(' ');
        // var length = commandArray.length;


        $.ajax({
            method: "GET",
            url: "http://recipio.herokuapp.com/recipes",
            data: {
              recipe: "pizza"
            }
          })
          .done(function(msg) {
            message = msg.steps;
            console.log(result[0].transcript);
            var utterance = new SpeechSynthesisUtterance(message[nextvalue]);
            utterance.rate = 0.7;
            window.speechSynthesis.speak(utterance);

            utterance.onend = function(event) {
              console.log("first end");
              recognition.start();
            };

          });
      } else if (result[0].transcript.includes('next') || result[0].transcript.includes('Next')) {
        console.log(result[0].transcript);
        nextvalue++;
        var utteranceNext = new SpeechSynthesisUtterance(message[nextvalue]);
        utteranceNext.rate = 0.7;
        window.speechSynthesis.speak(utteranceNext);

        utteranceNext.onend = function(event) {
          recognition.start();
        };

      } else if (result[0].transcript === 'previous' || result[0].transcript === 'Previous') {
        nextvalue--;
        console.log(result[0].transcript);
        var utterancePrevious = new SpeechSynthesisUtterance(message[nextvalue]);
        utterancePrevious.rate = 0.7;
        window.speechSynthesis.speak(utterancePrevious);

        utterancePrevious.onend = function(event) {
          recognition.start();
        };

      } else if (result[0].transcript.includes('repeat') || result[0].transcript.includes('Repeat')) {
        console.log(result[0].transcript);
        var utteranceRepeat = new SpeechSynthesisUtterance(message[nextvalue]);
        utteranceRepeat.rate = 0.7;
        window.speechSynthesis.speak(utteranceRepeat);

        utteranceRepeat.onend = function(event) {
          recognition.start();
        };

      } else if (!result[0].transcript.includes('repeat') || !result[0].transcript.includes('Repeat') ||
        !result[0].transcript.inculdes('previous') || !result[0].transcript.includes('Previous') ||
        !result[0].transcript.includes('next') || !result[0].transcript.includes('Next') ||
        !result[0].transcript.includes('yes') || !result[0].transcript.includes('yes')
      ) {
        console.log(result[0].transcript);
        recognition.stop();
        console.log('Did not Recognize! Speak Again');
        recognition.start();

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
    };


  }
}
