const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTT';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



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


function playOne(note, type, context)
{
  var gainNode = context.createGain();
  gainNode.gain.value = 0.4;
  var osc = context.createOscillator();
  osc.type = type;
  osc.frequency.value = notetoFreq(note);
  osc.start(0);

}

function playNotes(notearray, oscillators, wave, context)
{

  var gainNode = context.createGain();
  gainNode.gain.value = 0.2;
  for (i = 0; i < notearray.length; i++)
  {

    oscillators[i] = context.createOscillator();
    oscillators[i].type = wave;
    oscillators[i].frequency.value = notetoFreq(notearray[i]);
    oscillators[i].connect(gainNode);

    gainNode.connect(context.destination);
    var startingtime = context.currentTime;
        oscillators[i].start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, startingtime + 2.3)
    oscillators[i].stop(startingtime + 2.3);

  }
}

function stopNotes(notearray,oscillators, context)
{
    for (i = 0; i < notearray.length; i++)
    {
      oscillators[i].stop();
    }
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
function init_engaged(context,size)
{
  engaged = [];
  for (var i = 0; i < size; i++) {
    engaged[i] = 0;
  }
  return engaged;
}

//Start of program code.....................................

var context = new AudioContext()
var oscillator = context.createOscillator();
var volume = context.createGain();
var PianoOscilators;
var EngagedArray;
var slot = 0;

var chordnotes;
var chordkey = "C";
var selectedscale = MajorScale;
var constructinterval = 3;
var numberofnotes = 4;
var waveform = "sine";



const circleofFifths = ["C","G","D","A","E","B","F#","C#","G#","A#","F"]


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


        // Connect our process to the mixer of the audioContext.



PianoOscilators = init_osc(context,10);
EngagedArray = init_engaged(context,10);

console.log(PianoOscilators);

function firstNotEngaged(earray)
{
  for (var i = 0; i < earray.length; i++) {
    if (earray[i] == 0){
      return i;
    }
  }
  return -1;
}

function allEngaged(earray)
{
  outarray = []
  for (var i = 0; i < earray.length; i++) {
    if (earray[i] == 1){
      outarray.push(i);
    }
  }
  return outarray;
}


function play(Note){
  var notename ="";

  switch (Note) {
    case 0 :
      notename = "C4";
      break;
    case 1 :
      notename = "D4";
      break;
    case 2 :
      notename = "E4";
      break;
    case 3 :
      notename = "F4";
      break;
    case 4 :
      notename = "G4";
      break;
    case 5 :
      notename = "A4";
      break;
    case 6 :
      notename ="B4";
      break;
    case 7 :
      notename ="C5";
      break;
    case 8 :
      notename = "D5";
      break;
    case 9 :
      notename = "E5";
      break;
    case 10 :
      notename = "F5";
      break;
    case 11 :
      notename = "G5";
      break;
    case 12 :
      notename = "A5";
      break;
    case 13 :
      notename = "B5";
      break;
    case 14 :
      notename = "C#4";
      break;
    case 15 :
      notename = "D#4";
      break;
    case 16 :
      notename = "F#4";
      break;
    case 17 :
      notename = "G#4";
      break;
    case 18 :
      notename = "A#4";
      break;
    case 19 :
      notename = "C#5";
      break;
    case 20 :
      notename = "D#5";
      break;
    case 21 :
      notename = "F#5";
      break;
    case 22 :
      notename = "G#5";
      break;
    case 23 :
      notename = "A#5";
      break;



    default:
      notename = "F#4";

  }



  console.log(selectedscale);
  chordscale = getScale(chordkey,selectedscale);

  notedegree = chordscale.indexOf(notename.slice(0,-1)) +1;
  chordnotes = dia_chordConstructor(chordkey,notedegree,constructinterval,numberofnotes,selectedscale);

  chordnotes = scatter(chordnotes,1);
  console.log(chordnotes);

  playNotes(chordnotes, PianoOscilators,waveform,context);

}


var pedalOsc;
var gainNode;
var playing = 0;

function pedal(Note){
  var notename ="";

  switch (Note) {
    case 0 :
      notename = "C3";
      break;
    case 1 :
      notename = "D3";
      break;
    case 2 :
      notename = "E3";
      break;
    case 3 :
      notename = "F3";
      break;
    case 4 :
      notename = "G3";
      break;
    case 5 :
      notename = "A3";
      break;
    case 6 :
      notename ="B3";
      break;
    case 7 :
      notename ="C4";
      break;
    case 8 :
      notename = "D4";
      break;
    case 9 :
      notename = "E4";
      break;
    case 10 :
      notename = "F4";
      break;
    case 11 :
      notename = "G4";
      break;
    case 12 :
      notename = "A4";
      break;
    case 13 :
      notename = "B4";
      break;
    case 14 :
      notename = "C#3";
      break;
    case 15 :
      notename = "D#3";
      break;
    case 16 :
      notename = "F#3";
      break;
    case 17 :
      notename = "G#3";
      break;
    case 18 :
      notename = "A#3";
      break;
    case 19 :
      notename = "C#4";
      break;
    case 20 :
      notename = "D#4";
      break;
    case 21 :
      notename = "F#4";
      break;
    case 22 :
      notename = "G#4";
      break;
    case 23 :
      notename = "A#4";
      break;



    default:
      notename = "F#4";

  }

  if (playing){
    pedalOsc.stop(context.currentTime);
  }


  pedalOsc = context.createOscillator();
  gainNode = context.createGain();
  pedalOsc.type = "sine";
  pedalOsc.frequency.value = notetoFreq(notename);
  gainNode.gain.value = 0.25;
  pedalOsc.connect(gainNode);
  gainNode.connect(context.destination);
  pedalOsc.start();
  gainNode.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.3)
  gainNode.gain.linearRampToValueAtTime(0.04, context.currentTime + 2.0)
  playing = 1;
}


var song1 = "2266";

function playSong(songkey,songkey,tempo)
{
  scale = MajorScale;
  constructinterval = 3;
  chordscale = getScale(songkey,selectedscale);


  for (var i = 0; i < song1.length; i++) {
    notedegree = Number(song1.charAt(i));
    numberofnotes = getRndInteger(4,6);
    chordnotes = dia_chordConstructor(songkey,notedegree,constructinterval,numberofnotes,selectedscale);
    chordnotes = scatter(chordnotes,1);
    // pedalnote = scaleNote(notedegree, songkey, scale);

    // console.log(pedalnote);

    //playOne(pedalnote + "3","sine",context);
    playNotes(chordnotes, PianoOscilators,"triangle",context);
    console.log(chordnotes);
    sleep(750);
  }

}




//testNotes = ['D4','B5'];
//playNotes(testNotes,oscs,context);
// stopNotes(testNotes,oscs,context);


// playOne('A4','sine',context);
// playOne('C4','sine',context);
// playOne('E5','triangle',context);
