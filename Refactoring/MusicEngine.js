var mutatenumber=3;
var automutate_switch=1;
var lastnotedegree = 1;
var barcount=0;
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
context = new (window.AudioContext || window.webkitAudioContext);
var renderstart = context.currentTime;
const OstOsc = init_osc(context,'sine',20);
const Gains = init_gain(context,20);
const EQArray = init_eqs(context,20);

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


var ff = new PolyUnit("ioix",[],90,"sine")
var ee = new PolyUnit("ixxi",[],90,"triangle")
var dd = new PolyUnit("xxixIo",[],90,"triangle")
var cc = new PolyUnit("ixIoixixIoix",[],90,"triangle")
var aa = new PolyUnit("xxixxxix",[],90,"sine")


const PolyUnits = [ff,ee,dd,cc,aa];
 // PolyUnits.push(ff);
 // PolyUnits.push(ee);
 // PolyUnits.push(dd);
 // PolyUnits.push(cc);
 // PolyUnits.push(aa);

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
function dia_chordConstructor(key,currentdegree,interval,number,scale)
{
  chordtones = [];
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
    numofnotes = inputnotes.length;
    if (numofnotes == 1)
    {
      return [inputnotes[0] + (getRndInteger(3,4).toString())]
    }
    else if (numofnotes==2)
    {
      outputnotes.push(inputnotes[0] + (getRndInteger(3,4).toString()));
        for (var i = 1; i < inputnotes.length; i++) {
        outputnotes.push(inputnotes[i] + (getRndInteger(4,6).toString()));
      }
    }
    else
    {
        outputnotes.push(inputnotes[0] + (getRndInteger(3,4).toString()));
        for (var i = 1; i < inputnotes.length-1; i++) {
        outputnotes.push(inputnotes[i] + (getRndInteger(4,6).toString()));
        }
        outputnotes.push(inputnotes[numofnotes-1] + (getRndInteger(5,7).toString()))
    }
  }

  else
  {
     for (var i = 0; i < inputnotes.length; i++) {
      outputnotes.push(inputnotes[i] + "4");
    }
  }

console.log(outputnotes);
  return outputnotes;
}

function randompolyrhythm(div)
{
    re = "";
    for (var i = 0; i < div; i++) {
      c = getRndInteger(1,8);
      switch (c) {
        case 1: re += "Io"; break;
        case 2: re += "io"; break;
        case 4: re += "Io"; break;
        case 5: re += "ix"; break;
        case 6: re += "ix"; break;
        case 7: re += "xx"; break;
        case 3: re += "xi"; break;
        case 4: re += "xI"; break;
      }
    }

  return re;
}


function chordchanger(currentchord)
{
  var selectedchord;
  switch(currentchord)
  {
    case 1:{
      selectedchord = [1,1,4,5].randomElement();
      break;
    }

    case 2:{
      selectedchord = [5,3,5,4].randomElement();
      break;
    }

    case 3:{
      selectedchord = [3,1,6,6,4,4].randomElement();
      break;
    }

    case 4:{
      selectedchord = [1,1,4,5,2].randomElement();
      break;
    }

    case 5:{
      selectedchord = [1,1,4,6].randomElement();
      break;
    }

    case 6:{
      selectedchord = [1,1,4,2,2].randomElement();
      break;
    }

    case 7:{
      selectedchord = [3,5,3,1,1].randomElement();
      break;
    }
  }

  return selectedchord
}


//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____---
//eachvoice should have their own oscillator array.

function playNotes(notearray, oscillators,gains,eqs,time,eighthNoteTime,duration,accent, type,context)
{

    gains[lastOscUsed] = context.createGain();
    oscillators[lastOscUsed] = context.createOscillator();
    eqs[lastOscUsed] = context.createBiquadFilter();
    oscillators[lastOscUsed].type = type;
    oscillators[lastOscUsed].frequency.value = notetoFreq(notearray[0]);
    oscillators[lastOscUsed].connect(eqs[lastOscUsed]);
    eqs[lastOscUsed].type = "highshelf";
    eqs[lastOscUsed].frequency.setValueAtTime(notetoFreq("F4"), context.currentTime);
    eqs[lastOscUsed].gain.setValueAtTime(-20, context.currentTime);
    eqs[lastOscUsed].q = 1.4;

    eqs[lastOscUsed].connect(gains[lastOscUsed]);



    gains[lastOscUsed].connect(context.destination);
    gains[lastOscUsed].gain.setValueAtTime(0.3, time);
    gains[lastOscUsed].gain.exponentialRampToValueAtTime(0.0001,time + (eighthNoteTime*(duration+3)));
    oscillators[lastOscUsed].start(time);
    oscillators[lastOscUsed].stop(time + eighthNoteTime*(duration+1));
    lastOscUsed+=1;
    lastOscUsed = lastOscUsed%20;
}

function notetoFreq(note){//[Note][Octave0-9]
  var octave;
  var noteNumber;

  if (note.length === 3){
    octave = note.charAt(2);
  }
  else{
    octave = note.charAt(1);
  }
  noteNumber = GlobalNotes.indexOf(note.slice(0,-1));

  if (noteNumber <3){ // If below C
    noteNumber = noteNumber + 13 + (12 * (octave -1)) //adjusting by the octave
  }
  else{
    noteNumber = noteNumber + 1 + (12 * (octave -1))
  }
  return 440 * Math.pow(2,(noteNumber-49)/12)
}

function init_eqs(context,size)
{
  oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createBiquadFilter();
  }
  return oscarray;
}


function init_osc(context,type,size)
{
  oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createOscillator();
    oscarray[i].type = type;
  }
  return oscarray;
}

function init_gain(context,size)
{
  oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createGain();
  }
  return oscarray;
}

//----POLYUNIT BOILERPLATE CODE____-----____---____--___-_____----

function shufflePoly(start,end)
{
  cr = PolyUnits[0].rhythm.length/8;
  for (var i = start; i < end; i++) {
    PolyUnits[i].rhythm = randompolyrhythm(getRndInteger(2,7));
    PolyUnits[i].cr = cr;
  }
}
function shuffleonePoly()
{
  return randompolyrhythm(getRndInteger(2,7));
}


function PolyTrigger(PolyArray,time)
{
  //timediff = (expectedtime-time);
//
  for (var i = 0; i < PolyArray.length; i++) {
    PolyArray[i].play(time);
  }
}



function EventLoop(key,startTime)
{

  var basetempo = PolyUnits[0].basetempo;
  if (isPlaying == 1) {


    var updateChords = function()
    {
      
      
      if (lastnotedegree == 5 || lastnotedegree ==  4)
      {
        if (Math.Random() < 0.5) //percent chance of keychange on 4 or 5
        {
          let keypol = Math.random() <0.5? 1:-1;
          document.getElementById('key').value = 
          key_transpose(document.getElementById('key').value,keypol*7);
          console.log("Key changed")
          notedegree = [1,1,1,6].randomElement();
        }
        else
        {
          notedegree = chordchanger(lastnotedegree);
        }

      }

      else
      {
        notedegree = chordchanger(lastnotedegree);
        
      }
      chordtones = dia_chordConstructor(key,notedegree,intervalstack,PolyUnits.length,globalscale);
      chordtones = scatter(chordtones,1);
      for (var i = 0; i < PolyUnits.length; i++)
      {
          PolyUnits[i].notes = [chordtones[i]];
      }
      console.log(lastnotedegree + "=>" + notedegree )
      astnotedegree=notedegree;


      
      
    

    }

    //var minorcheck = 0;
    //while (eval_minor_nine(chordtones) == 0) //checks minor ninths
    //{
      // chordtones = dia_chordConstructor(key,notedegree,intervalstack,PolyUnits.length,globalscale);
      // chordtones = scatter(chordtones,1);
      // minorcheck+=1;
    //}
    //console.log("Minor Ninth Check Count:" + minorcheck);

    
    setTimeout(() => {updateChords();PolyTrigger(PolyUnits,context.currentTime)},startTime-context.currentTime);
    
      nextkey = updateKey();
      globalscale= updateScale();
      changeTempo(document.getElementById('tempochange').value,PolyUnits);
      updateGraphicsSettings()


     if ((document.getElementById('automutate').checked))
     {
      if ((barcount%2==0))
      {

      mutatenumber = autoMutate(mutatenumber);
      }
     }
      barcount+=1;
      if (barcount<-1)
      {
        isPlaying=0;


        setTimeout(function(){
          isPlaying = 1;
          barcount = 0;
          console.log("frame update");
          EventLoop(nextkey,(startTime+(240/basetempo)),globalscale)

        },(240000/basetempo));

      }
      else
      {
        setTimeout(function(){EventLoop(nextkey,(startTime+(240/basetempo)),globalscale)},(240000/basetempo));   
      }
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
    for (let i = 0; i < rhythm.length; i++) {
      let lookahead = 1;
      let durationadded = 0;

      if ((rhythm[i] == "i" || rhythm[i] == "I") && rhythm[i+1] == "o"){
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

        playNotes(notearray,OstOsc,Gains,EQArray,time + i*eighthNoteTime,eighthNoteTime,(durationadded),1,type,context);

        break;
        case "i":

         setTimeout(emitTriangle,1000*((time + i*eighthNoteTime)-context.currentTime));
        playNotes(notearray,OstOsc,Gains,EQArray,time + i * eighthNoteTime,eighthNoteTime,(durationadded),0,type,context);
        break;

        case "x":
        break;

        case "o":
        break;
      }
      

    }
    // time = startTime + bar * rhythm.length * eighthNoteTime;
  
}

