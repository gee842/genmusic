const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTT';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';
const circleofFifths = ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"];

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function findDistance(note1,note2)
{
  if (note1.length === 3){
    octave1 = note1.charAt(2);
  }
  else{
    octave1 = note1.charAt(1);
  }
  note1Number = GlobalNotes.indexOf(note1.slice(0,-1));

  if (note2.length === 3){
    octave2 = note2.charAt(2);
  }
  else{
    octave2 = note2.charAt(1);
  }
  note2Number = GlobalNotes.indexOf(note2.slice(0,-1));

  note1Number += 12*parseInt(octave1);
  note2Number += 12*parseInt(octave2);

  return note2Number - note1Number;

}

function single_transpose(note,setting)
{
    original = note

    if (original.length === 3){
      octave = original.charAt(2);
    }
    else{
      octave = original.charAt(1);
    }
    originalnum = GlobalNotes.indexOf(original.slice(0,-1))

    transposednum = (originalnum+setting)
    if (transposednum >= 12)
    {
      return (GlobalNotes[(transposednum-12)] + "" + (parseInt(octave)+1))
    }

    else if (transposednum < 0)
    {
      return (GlobalNotes[(transposednum+12)] + "" + (parseInt(octave)-1))
    }
    else
    {
      return (GlobalNotes[transposednum] + "" + octave)
    }

}

function key_transpose(note,setting)
{

    originalnum = GlobalNotes.indexOf(note)

    transposednum = (originalnum+setting)
    if (transposednum >= 12)
    {
      return (GlobalNotes[(transposednum-12)])
    }

    else if (transposednum < 0)
    {
      return (GlobalNotes[(transposednum+12)])
    }
    else
    {
      return (GlobalNotes[transposednum])
    }

}


function transposer(notes,setting)
{
  var re = [];
  for (i = 0; i<notes.length;i++)
  {
    original = notes[i];

    if (original.length === 3){
      octave = original.charAt(2);
    }
    else{
      octave = original.charAt(1);
    }
    originalnum = GlobalNotes.indexOf(original.slice(0,-1))

    transposednum = (originalnum+setting)
    if (transposednum >= 12)
    {
      re.push(GlobalNotes[(transposednum-12)] + "" + (parseInt(octave)+1))
    }

    else if (transposednum < 0)
    {
      re.push(GlobalNotes[(transposednum+12)] + "" + (parseInt(octave)-1))
    }
    else
    {
      re.push(GlobalNotes[transposednum] + "" + octave)
    }

  }
  return re
}


//scaleNote(3, C3, MajorScale) = E3
function scaleNote(degree, key, scale)
{

  Movements = scale.slice(0,degree-1);
  totalmovements = 0;
  for (var i = 0; i < Movements.length; i++) {
    distanceLetter = Movements.charAt(i);
    if (distanceLetter == "T"){
      totalmovements += 2;
    }
    else if (distanceLetter == "S"){
      totalmovements+=1
    }
    return single_transpose(key,totalmovements);

  }

}

function getScale(key, scale) //returns set of notes
{
  ScaleSet = [];
  ScaleSet.push(key);
  totalmovements = 0;
  for (var i = 0; i < scale.length; i++) {
    distanceLetter = scale.charAt(i);
    if (distanceLetter == "T"){
      totalmovements+=2
      ScaleSet.push(key_transpose(key,totalmovements));
    }
    else if (distanceLetter == "S"){
      totalmovements+=1
      ScaleSet.push(key_transpose(key,totalmovements));
    }

  }
  ScaleSet.pop();
  return ScaleSet;
}

//findDegree(E, C, Major) = 3 << (1,2,3,4,5,6,7)
function findDegree(note, key, scale)
{
  ScaleSet = [];
  Movements = scale.slice(0,degree-1);
  for (var i = 0; i < Movements.length; i++) {
    distanceLetter = Movements.charAt(i);
    if (distanceLetter == "T"){
      totalmovements+=2
      ScaleSet.push(single_transpose(key,totalmovements));
    }
    else if (distanceLetter == "S"){
      totalmovements+=1
      ScaleSet.push(single_transpose(key,totalmovements));
    }

  }

}

//dia_chordConstructor(C,3,3(rds), 4, yes): E4 G3 A3 D5
function dia_chordConstructor(key,degree,interval,number,scale)
{
  chordtones = [];
  currentdegree = degree;
  notes = getScale(key,scale);

  for (var i = 0; i < number; i++) {
      if (currentdegree == 0)
      {
        currentdegree+=7;
      }
      chordtones.push(notes[currentdegree-1]);
      currentdegree = (currentdegree+(interval-1))%notes.length
  }
  return chordtones;

}

function scatter(inputnotes,scat)
{


  outputnotes = [];
  if (scat)
  {
    for (var i = 0; i < inputnotes.length-1; i++) {
      outputnotes.push(inputnotes[i] + (getRndInteger(3,6).toString()));
    }
    outputnotes.push(inputnotes[inputnotes.length-1] + (getRndInteger(4,7).toString()));
  }
  else {
    for (var i = 0; i < inputnotes.length; i++) {
      outputnotes.push(inputnotes[i] + "3");
    }
  }
  return outputnotes;
}

function createRandomChord(interval,selectedscale)
{
  times = getRndInteger(1,4);
  re = scatter(dia_chordConstructor(GlobalNotes[getRndInteger(0,11)],times,interval,getRndInteger(3,5),selectedscale),1);
  console.log(re);
  return re;
}

function fillpolyrhythm(number)
{
  ra = [];
  for (var j=0; j<number; j++)
  {
    div = getRndInteger(2,7);
    re = "";
    for (var i = 0; i < div; i++) {
      re += "Io";
    }
    ra.push(re);
  }
  return ra;
}

//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____---
//eachvoice should have their own oscillator array.
function playNotes(notearray, oscillators,time,eighthNoteTime,duration,accent, type,context)
{
  for (i = 0; i < notearray.length; i++)
  {
    var gainNode = context.createGain();
      if (accent) {
          gainNode.gain.value = 0.6;

      }
      else {
        gainNode.gain.value = 0.4;
      }

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

// if (!context.createGain)
//   context.createGain = context.createGainNode;
// if (!context.createDelay)
//   context.createDelay = context.createDelayNode;
// if (!context.createScriptProcessor)
//   context.createScriptProcessor = context.createJavaScriptNode;

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






//[Chordnotes],[Polyrhythms],BaseTempo,Times
function PRChord(chordnotes,polyrhythms,basetempo,startTime,type,times)
{
  if (chordnotes.length != polyrhythms.length)
  {
    console.log("Length Mismatch");
    return
  }
  for (var i = 0; i < chordnotes.length; i++) {
    cr = (polyrhythms[i].length)/8;
    // console.log(chordnotes[i])
    ostinato(polyrhythms[i],[chordnotes[i]],basetempo*cr,startTime,type,times);
  }
}




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

      switch (state) {
        case "I":
        //play
        playNotes(notearray,OstOsc,time + i*eighthNoteTime,eighthNoteTime,(durationadded+0.75),1,type,context);

        break;
        case "i":
        playNotes(notearray,OstOsc,time + i * eighthNoteTime,eighthNoteTime,(durationadded+0.75),0,type,context);
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
