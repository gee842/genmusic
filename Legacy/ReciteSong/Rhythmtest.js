const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTT';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';
const circleofFifths = ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"];


//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____----

function upCircle()
{
  currkey = circleofFifths.indexOf(chordkey);
  chordkey = circleofFifths[(currkey+1)%circleofFifths.length]
  console.log(chordkey);
}

function downCircle()
{
  currkey = circleofFifths.indexOf(chordkey);
  if (currkey == 0){
    currkey += 11;
  }
  chordkey = circleofFifths[(currkey-1)%circleofFifths.length]
  console.log(chordkey);
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
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


function init_osc(context,size)
{
  oscarray = [];
  for (var i = 0; i < size; i++) {
    oscarray[i] = context.createOscillator();
    oscarray[i].type = "sine";
  }
  return oscarray;
}

function playNotes(notearray, oscillators, time,stoptime, context)
{

  var gainNode = context.createGain();

  gainNode.gain.value = 0.4;
  for (i = 0; i < notearray.length; i++)
  {

    oscillators[i] = context.createOscillator();
    oscillators[i].type = "triangle";
    oscillators[i].frequency.value = notetoFreq(notearray[i]);
    oscillators[i].connect(gainNode);
    gainNode.connect(context.destination);
    oscillators[i].start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.1, stoptime)
    oscillators[i].stop(stoptime);

  }
}
function playRandomChord(key,time,stoptime,context)
{
  notedegree = getRndInteger(1,8);
  console.log(notedegree);
  chordnotes = dia_chordConstructor(chordkey,notedegree,constructinterval,numberofnotes,selectedscale);
  chordnotes = scatter(chordnotes,1);
  console.log(chordnotes);
  playNotes(chordnotes, PianoOscilators, time,stoptime,context)
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

var chordnotes;
var chordkey = "C";
var selectedscale = MajorScale;
var constructinterval = 3;
var numberofnotes = 3;
var waveform = "triangle";
var song1 = "25147366";
PianoOscilators = init_osc(context,10);
BassOscilators = init_osc(context,5);




RhythmSample.prototype.play = function() {
  // We'll start playing the rhythm 100 milliseconds from "now"
  var startTime = context.currentTime + 0.100;
  var tempo = 180; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;
  chordscale = getScale(chordkey,selectedscale);



  // Play 2 bars of the following:
  for (var bar = 0; bar < song1.length; bar++) {

    notedegree = Number(song1.charAt(bar));
    numberofnotes = getRndInteger(3,6);
    chordnotes = dia_chordConstructor(chordkey,notedegree,constructinterval,numberofnotes,selectedscale);
    scatchordnotes = scatter(chordnotes,1);

    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5

    //bass
    basstone = (chordscale[notedegree-1] + "2");
    fifth = transposer([basstone],7)[0];

    console.log(basstone);
    playNotes([basstone],BassOscilators,time+0 *eighthNoteTime,time + 2.5 *eighthNoteTime,context);
    playNotes([fifth],BassOscilators,time+3 *eighthNoteTime,time + 3.5 *eighthNoteTime,context);
    playNotes([fifth],BassOscilators,time+4 *eighthNoteTime,time + 7 *eighthNoteTime,context);

     playNotes(scatchordnotes,PianoOscilators,time+0*(eighthNoteTime),(time + 1.5 *eighthNoteTime),context);

    if (getRndInteger(0,2))
    {
      scatchordnotes = scatter(chordnotes,1);
    }
    playNotes(scatchordnotes,PianoOscilators,time+3*(eighthNoteTime),(time + 7.7 *eighthNoteTime),context);


    playSound(this.kick, time + 0 * eighthNoteTime);
    //1
    playSound(this.hihat, time + 2.0 * eighthNoteTime);
    playSound(this.kick, time + 3 * eighthNoteTime);


    playSound(this.kick, time + 4 * eighthNoteTime);
    playSound(this.hihat, time + 5 * eighthNoteTime);

    playSound(this.kick, time + 7 * eighthNoteTime);



  }

};


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
