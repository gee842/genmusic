const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTT';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';
const circleofFifths = ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"];


//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____---
//eachvoice should have their own oscillator array.
function playNotes(notearray, oscillators,time,eighthNoteTime,duration,accent, type,context)
{

  var gainNode = context.createGain();


  if (accent) {
      gainNode.gain.value = 0.4;

  }
  else {
    gainNode.gain.value = 0.2;
  }


  for (i = 0; i < notearray.length; i++)
  {

    oscillators[i] = context.createOscillator();
    oscillators[i].type = type;
    oscillators[i].frequency.value = notetoFreq(notearray[i]);
    oscillators[i].connect(gainNode);
    gainNode.connect(context.destination);
    oscillators[i].start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + eighthNoteTime*3)
    oscillators[i].stop(time + eighthNoteTime*duration);

  }
}

function notetoFreq(note){//[Note][Octave0-9]
  var notes = GlobalNotes;
  var octave;
  var noteNumber;

  if (note.length === 3){
    octave = note.charAt(2);
  }
  else{
    octave = note.charAt(1);
  }
  noteNumber = notes.indexOf(note.slice(0,-1));

  if (noteNumber <3){ // If below C
    noteNumber = noteNumber + 13 + (12 * (octave -1)) //adjusting by the octave
  }
  else{
    noteNumber = noteNumber + 1 + (12 * (octave -1))
  }
  return 440 * Math.pow(2,(noteNumber-49)/12)
}


function init_osc(context,type,size)
{
  oscarray = [];
  for (var i = 0; i < size; i++) {
    oscarray[i] = context.createOscillator();
    oscarray[i].type = type;
  }
  return oscarray;
}



//----RHYTHM BOILERPLATE CODE____-----____---____--___-_____----

context = new (window.AudioContext || window.webkitAudioContext)();

if (!context.createGain)
  context.createGain = context.createGainNode;
if (!context.createDelay)
  context.createDelay = context.createDelayNode;
if (!context.createScriptProcessor)
  context.createScriptProcessor = context.createJavaScriptNode;

// shim layer with setTimeout fallback



function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source[source.start ? 'start' : 'noteOn'](time);
}

function loadSounds(obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
}








function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};


var RhythmSample = function() {
  loadSounds(this, {
    kick: './kick.wav',
    snare: './snare.wav',
    perc1: './perc1.wav',
    hihat: './hihat.wav',
    hatopen: './openhat.wav'
  });
};


var RhythmSample2 = function() {
  loadSounds(this, {
    kick: './kick.wav',
    snare: './snare.wav',
    perc1: './perc1.wav',
    hihat: './hihat.wav',
    hatopen: './openhat.wav'
  });
};



RhythmSample.prototype.play = function(startTime) {
  // We'll start playing the rhythm 100 milliseconds from "now"
  var tempo = 100; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;

  // Play 2 bars of the following:
  for (var bar = 0; bar < 4; bar++) {

    var time = startTime + bar * 8 * eighthNoteTime;

    playSound(this.kick, time + 0 * eighthNoteTime);
    //1




    playSound(this.snare, time + 4 * eighthNoteTime);



  }
};

RhythmSample2.prototype.play = function(startTime) {
  // We'll start playing the rhythm 100 milliseconds from "now"
  var tempo = 100; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;

  // Play 2 bars of the following:
  for (var bar = 0; bar < 4; bar++) {

    var time = startTime + bar * 7 * eighthNoteTime;
    playSound(this.kick, time + 0 * eighthNoteTime);
    playSound(this.snare, time+6 * eighthNoteTime);

  for (var i = 0; i < 7; i++) {
    {
      playSound(this.hihat, time + i * eighthNoteTime)

    }
  }
  }
};

//"ixxiixxi" "IxXiiXxi" caps = accent,

function metronome(tempo,startTime,duration)
{

  eighthNoteTime = (60/tempo) /2;

  var metrosc = init_osc(context,"square",1);
  var time = startTime;
    for (var bar = 0; bar < duration; bar++) {

      playNotes(["A4"],metrosc,time+0 *eighthNoteTime,eighthNoteTime,0.25,1,"sine",context);
      playNotes(["E4"],metrosc,time+2 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
      playNotes(["E4"],metrosc,time+4 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
      playNotes(["E4"],metrosc,time+6 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
      time = startTime + bar * 8 * eighthNoteTime;

  }

}
function ostinato(rhythm,notearray,tempo,startTime,type,duration)
{
  var time = startTime;
  var OstOsc = init_osc(context,type,notearray.length);
  console.log(OstOsc);
  eighthNoteTime = (60/tempo) /2;
  for (var bar = 0; bar <= duration; bar++) {
    for (var i = 0; i < rhythm.length; i++) {
      var lookahead = 1;
      var durationadded = 0;

      if (rhythm[i] != "o" && rhythm[i+1] == "o"){
        durationadded+=1;
        lookahead += 1;

        while (rhythm[i+lookahead] == "o")
        {
          lookahead+=1;
          durationadded+=1;
        }
      }

      state = rhythm[i];
      console.log(state);
      switch (state) {
        case "I":
        //play
        playNotes(notearray,OstOsc,time + i*eighthNoteTime,eighthNoteTime,(durationadded+0.75),1,"square",context);

        break;
        case "i":
        playNotes(notearray,OstOsc,time + i * eighthNoteTime,eighthNoteTime,(durationadded+0.75),0,"sine",context);
        break;

        case "x":
        break;

        case "o":
        break;
      }

    }
    time = startTime + bar * rhythm.length * eighthNoteTime;
  }
}





function startloops(rhythmsamples, context)
{
  begintime = context.currentTime;
  for (var i = 0; i < rhythmsamples.length; i++) {
    rhythmsamples[i].play(begintime);
  }
}



  // for (var i = 0; i < song1.length; i++) {
  //   notedegree = Number(song1.charAt(i));
  //   numberofnotes = getRndInteger(4,6);
  //   chordnotes = dia_chordConstructor(songkey,notedegree,constructinterval,numberofnotes,selectedscale);
  //   chordnotes = scatter(chordnotes,1);
  //
  // }
    // if (bar == 1){
    //   playSound(this.snare, time + 6 * eighthNoteTime);
    //   playSound(this.hihat, time + 6.5 * eighthNoteTime);
    //   playSound(this.kick, time + 7.0 * eighthNoteTime);
    //   playSound(this.perc1, time + 7.5 * eighthNoteTime);
    // }
    // else if (bar == 3){
    //   playSound(this.snare, time + 6 * eighthNoteTime);
    //   playSound(this.snare, time + 6.5 * eighthNoteTime);
    //   playSound(this.perc1, time + 7 * eighthNoteTime);
    //   playSound(this.kick, time + 7.5 * eighthNoteTime);
    // }
    // else {
    //   {
    // Play the snare drum on beats 3, 7

    // for (var i = 0; i < 8; i+=1) {
    //   playSound(this.hihat, time + i * eighthNoteTime);
    // }
