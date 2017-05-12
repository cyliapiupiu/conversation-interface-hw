/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
  var response;
    var find_re1 = /find (?:a|the) restaurants?\s(.+)/i;  // creating a regular expression
    var find_re2 = /find (?:a|the) restaurant\s(.+)\sand\s(.+)/i; 
    var find_re3 = /find a restaurant\s(.+)\sby\s(.+)/i; 
    var find_parse_array1 = user_said.match(find_re1); // parsing the input string with the regular expression
    var find_parse_array2 = user_said.match(find_re2); 
    var find_parse_array3 = user_said.match(find_re3); 
    console.log("find_parse_array1:" + find_parse_array1); // let's print the array content to the console log so we understand 
                                  // what's inside the array.
    console.log("find_parse_arra2:" + find_parse_array2);
    console.log("find_parse_array3:" + find_parse_array3);
if (find_parse_array1 && state === "initial") {
      response = "ok, finding " + find_parse_array1[1];
    } else if (find_parse_array2 && state === "initial") {
      response = "finding restaurant " + find_parse_array2[1] + " and find restaurant " +find_parse_array2[2];
    } else if (find_parse_array3 && state === "initial") {
      response = "ok,finding" + find_parse_array3[1] + " by " + find_parse_array3[2];
      state = "initial"
    } else if (user_said.toLowerCase().includes("bye")){
      response = "good bye to you";
      state = "initial"
    } else {
      response = "I'm a mushroom";
    }
    return response;
  }


/* Load and print voices */
function printVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  
  // Loop through each of the voices.
  voices.forEach(function(voice, i) {
        console.log(voice.name)
  });
}

printVoices();

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  console.log("Voices: ")
  printVoices();

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';
  u.volume = 0.5 //between 0.1
  u.pitch = 2.0 //between 0 and 2
  u.rate = 1.0 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Karen"; })[0]; //pick a voice

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
