var mutatenumber=3;
var automutate_switch=1;
var barcount;
var expectedtime=0.0;
var timediff = 0.0;
var lastOscUsed = 0;
var intervalstack=3;
var globalscale = 'TSTTSTS';
const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTS';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';
const circleofFifths = ["C","G","D","A","E","B","F#","C#","G#","D#","A#","F"];
var isPlaying = 0;
context = new (window.AudioContext || window.webkitAudioContext)();
var renderstart = context.currentTime;
var OstOsc = init_osc(context,'sine',20);
var Gains = init_gain(context,20);


Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}



function changeTempo(targetTempo,Cells)
{
  for (var i = Cells.length - 1; i >= 0; i--) {
    Cells[i].basetempo = parseFloat(targetTempo);
  }
}



// function eval_minor_nine(chord)
// {
  
//   valid = 1;
//   for (var i = 0; i < chord.length; i++) { //note1
//     for (var j = 0; j < chord.length; j++) { //note2

//       if (i == j)
//       {
//         continue;
//       }
//       else if (i<j)
//       {
//         distance = findDistance(chord[i],chord[j])
//         // console.log(chord[i]);
//         // console.log(chord[j]);
//         // console.log(distance);
//         if (distance == 13 || distance == -13)
//         {
//           valid = 0;

//           return 0;
//         }
//       }
//     }
//   }

//   return valid;
// }



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




//scaleNote(3, C3, MajorScale) = E3


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
    outputnotes.push(inputnotes[0] + (getRndInteger(3,4).toString()));
    for (var i = 1; i < inputnotes.length-2; i++) {
      outputnotes.push(inputnotes[i] + (getRndInteger(3,5).toString()));
    }
    outputnotes.push(inputnotes[inputnotes.length-2] + (getRndInteger(4,6).toString()));
    outputnotes.push(inputnotes[inputnotes.length-1] + (getRndInteger(5,7).toString()));
  }
  else {
    for (var i = 0; i < inputnotes.length; i++) {
      outputnotes.push(inputnotes[i] + "4");
    }
  }
  return outputnotes;
}



function randompolyrhythm(number,div)
{
  ra = [];
  for (var j=0; j<number; j++)
  {
    re = "";
    for (var i = 0; i < div; i++) {
      c = getRndInteger(1,8);
      switch (c) {
        case 1: re += "Io"; break;
        case 2: re += "io"; break;
        case 4: re += "Io"; break;
        case 5: re += "io"; break;
        case 6: re += "Io"; break;
        case 7: re += "io"; break;
        case 3: re += "xi"; break;
        case 4: re += "xI"; break;
      }
    }
    ra.push(re);
  }
  return ra;
}





//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____---
//eachvoice should have their own oscillator array.

function playNotes(notearray, oscillators,gains,time,eighthNoteTime,duration,accent, type,context)
{

    gains[lastOscUsed] = context.createGain();
    oscillators[lastOscUsed] = context.createOscillator();
    oscillators[lastOscUsed].type = type;
    oscillators[lastOscUsed].frequency.value = notetoFreq(notearray[0]);
    oscillators[lastOscUsed].connect(gains[lastOscUsed]);
    gains[lastOscUsed].connect(context.destination);
    gains[lastOscUsed].gain.setValueAtTime(0.3, time);
    gains[lastOscUsed].gain.exponentialRampToValueAtTime(0.0001,time + (eighthNoteTime*(duration+3)));
    oscillators[lastOscUsed].start(time);
    oscillators[lastOscUsed].stop(time + eighthNoteTime*(duration+1));
    lastOscUsed+=1;
    lastOscUsed = lastOscUsed%20;
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

function init_gain(context,size)
{
  oscarray = [];
  for (var i = 0; i < size; i++) {
    oscarray[i] = context.createGain();
  }
  return oscarray;
}

//----POLYUNIT BOILERPLATE CODE____-----____---____--___-_____----


function PolyUnit(rhythm,notes,basetempo,type){
  this.rhythm = rhythm;
  this.notes = notes;
  this.basetempo = basetempo;
  this.type = type;
  this.cr = (rhythm.length/8);
}
PolyUnit.prototype.play = function(startTime){
  ostinato(this.rhythm,this.notes,this.basetempo*this.cr,startTime,this.type);
}


var poly1 = "IoIoIoioIo";
var poly2 = "IoioioIo";
var poly3 = "Ioxi";
var poly4 = "xiio";
var poly4 = "xxixxxix";

var ff = new PolyUnit(poly1,[],90,"sine")
var ee = new PolyUnit(poly2,[],90,"triangle")
var dd = new PolyUnit(poly3,[],90,"triangle")
var cc = new PolyUnit(poly4,[],90,"triangle")
var ee = new PolyUnit(poly4,[],90,"sine")


var PolyUnits = [];
 PolyUnits.push(ff);
 PolyUnits.push(ee);
 PolyUnits.push(dd);
 PolyUnits.push(cc);
 PolyUnits.push(ee);

function shufflePoly(start,end)
{
  for (var i = start; i < end; i++) {
    PolyUnits[i].rhythm = randompolyrhythm(3,getRndInteger(2,7))[0];
    PolyUnits[i].cr = (PolyUnits[i].rhythm.length)/8;
  }
}
function shuffleonePoly()
{
  return randompolyrhythm(3,getRndInteger(2,7))[0];
}


function PolyTrigger(PolyArray,time)
{
  //timediff = (expectedtime-time);
//
  for (var i = 0; i < PolyArray.length; i++) {
    PolyArray[i].play(time);
  }
}





function EventLoop(key,type,startTime)
{

  var basetempo = PolyUnits[0].basetempo;
  var offset = 0;


  if (isPlaying == 1) {
    //offset +=   (240/basetempo)




    notedegree = [1,2,3,4,5,6,7].randomElement();
    //console.log(notedegree)
    chordtones = dia_chordConstructor(key,notedegree,intervalstack,PolyUnits.length,globalscale);
    chordtones = scatter(chordtones,1);

    var minorcheck = 0;
    //while (eval_minor_nine(chordtones) == 0) //checks minor ninths
    //{
      chordtones = dia_chordConstructor(key,notedegree,intervalstack,PolyUnits.length,globalscale);
      chordtones = scatter(chordtones,1);
      minorcheck+=1;
    //}
    //console.log("Minor Ninth Check Count:" + minorcheck);
    for (var i = 0; i < PolyUnits.length; i++) {
      PolyUnits[i].notes = [chordtones[i]];

    }
    
    PolyTrigger(PolyUnits,startTime);
 

      nextkey = updateKey();
      globalscale= updateScale();
      changeTempo(document.getElementById('tempochange').value,PolyUnits);
      updateGraphicsSettings()


     if (document.getElementById('automutate').checked)
     {
      mutatenumber = autoMutate(mutatenumber);
     }


        setTimeout(function(){EventLoop(nextkey,type,(startTime+(240/basetempo)),globalscale);},240000/basetempo)
  //     
  	}
  else {
    console.log("done");
    barcount = 0;
  }
}

function ostinato(rhythm,notearray,tempo,startTime,type,duration)
{
  var time = startTime;
  eighthNoteTime = (60/tempo) /2;
  // for (var bar = 0; bar <= duration; bar++) {
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
         setTimeout(emitTriangle,1000*((time + i*eighthNoteTime)-context.currentTime));

        playNotes(notearray,OstOsc,Gains,time + i*eighthNoteTime,eighthNoteTime,(durationadded),1,type,context);

        break;
        case "i":

         setTimeout(emitTriangle,1000*((time + i*eighthNoteTime)-context.currentTime));
        playNotes(notearray,OstOsc,Gains,time + i * eighthNoteTime,eighthNoteTime,(durationadded),0,type,context);
        break;

        case "x":
        break;

        case "o":
        break;
      }
      

    }
    // time = startTime + bar * rhythm.length * eighthNoteTime;
  
}

