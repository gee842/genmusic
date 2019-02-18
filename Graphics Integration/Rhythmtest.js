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

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}



function changeTempo(targetTempo,Cells)
{
  for (var i = Cells.length - 1; i >= 0; i--) {
    Cells[i].basetempo = parseFloat(targetTempo);
  }
}

function changeType(targetType,Cells,targetcell)
{
    Cells[targetcell].type = targetType;
  
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

 function eval_minor_nine(chord)
{
   return 1;
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

  return   note2Number- note1Number;

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

function createRandomChord(interval,selectedscale,key)
{

  times = getRndInteger(3,5);
  re = scatter(dia_chordConstructor(key,times,interval,getRndInteger(4,8),selectedscale),1);
  if (re.length > 4)
  {

    omitnum = getRndInteger(0,4);
    for (var i = 0; i < omitnum; i++) {
      re.splice(getRndInteger(1,re.length),1)
    }
  }
  console.log(re);
  return re;
}

function fillpolyrhythm(number)
{
  ra = [];
  for (var j=0; j<number; j++)
  {
    div = getRndInteger(3,7);
    re = "";
    for (var i = 0; i < div; i++) {
      re += "Io";
    }
    ra.push(re);
  }
  return ra;
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
  //for (i = 0; i < notearray.length; i++)
  //{
    gains[lastOscUsed] = context.createGain();

    //gains[lastOscUsed].gain.value = 0.3;


    oscillators[lastOscUsed] = context.createOscillator();
    oscillators[lastOscUsed].type = type;
    oscillators[lastOscUsed].frequency.value = notetoFreq(notearray[0]);
    oscillators[lastOscUsed].connect(gains[lastOscUsed]);
    gains[lastOscUsed].connect(context.destination);
    gains[lastOscUsed].gain.setValueAtTime(0.3, time);
    gains[lastOscUsed].gain.exponentialRampToValueAtTime(0.0001,time + (eighthNoteTime*(duration+3)));
    //gains[lastOscUsed].gain.setTargetAtTime(0, time + (eighthNoteTime*(duration+0.25)), 0.015);
    //gains[lastOscUsed].gain.setTargetAtTime(0, time + eighthNoteTime,0.015);

    oscillators[lastOscUsed].start(time);


    //console.log(time-context.currentTime);


    oscillators[lastOscUsed].stop(time + eighthNoteTime*(duration+1));

    

    lastOscUsed+=1;
    lastOscUsed = lastOscUsed%20;


 // }
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


//----RHYTHM BOILERPLATE CODE____-----____---____--___-_____----






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

function shufflePoly()
{
  for (var i = 0; i < PolyUnits.length; i++) {
    PolyUnits[i] = new PolyUnit(randompolyrhythm(3,getRndInteger(2,7))[0],[],PolyUnits[i].basetempo,PolyUnits[i].type);
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
 
    
    //console.log("Expected:"+ expectedtime);


     // basstones = chordtones.slice(0,3);
     // for (var i = 0; i < 3; i++) {
     //   basstones[i] = basstones[i].slice(0,-1) + getRndInteger(2,4);
     // }
     // basstones.shuffle();
     // dr = ("xxxxxxxx".length)/8; //adjust for length
       //ostinato("Ioooxxxx",[basstones[0]],basetempo*dr,startTime,"triangle",1);
       //ostinato("xxxxIooo",[basstones[2]],basetempo*dr,startTime,"triangle",1);


      nextkey = updateKey();
      globalscale= updateScale();
      changeTempo(document.getElementById('tempochange').value,PolyUnits);
      updateGraphicsSettings()


     if (document.getElementById('automutate').checked)
     {
      mutatenumber = autoMutate(mutatenumber);
     }

      //setTimeout(EventLoop(nextkey,type,(startTime+240/basetempo),scale),240000/basetempo);
      // setTimeout(EventLoop(nextkey,type,(startTime+240/basetempo)),240000/basetempo)
           //expectedtime = expectedtime + ( 240/basetempo);

        setTimeout(function(){EventLoop(nextkey,type,(startTime+(240/basetempo)),globalscale);},240000/basetempo)
  //       sleep(240000/basetempo).then(() => {

  //         EventLoop(nextkey,type,(startTime+(240/basetempo)),globalscale)
  // //       // startTime = context.currentTime;
  // //       // OstOsc = init_osc(context,type,10);
  //      });
  	}
  else {
    console.log("done");
    barcount = 0;
  }
}

//[Chordnotes],[Polyrhythms],BaseTempo,Times
// function PRChord(chordnotes,polyrhythms,basetempo,startTime,type,times)
// {
//   if (chordnotes.length != polyrhythms.length)
//   {
//     console.log("Length Mismatch");
//     return
//   }
//   console.log(polyrhythms)
//   for (var i = 0; i < chordnotes.length; i++) {
//     cr = (polyrhythms[i].length)/8;
//     // console.log(chordnotes[i])
//     ostinato(polyrhythms[i],[chordnotes[i]],basetempo*cr,startTime,type,times);
//   }
// }




//"ixxiixxi" "IxXiiXxi" caps = accent,

// function metronome(tempo,startTime,duration)
// {
//
//   eighthNoteTime = (60/tempo) /2;
//
//   var metrosc = init_osc(context,"square",1);
//   var time = startTime;
//     for (var bar = 0; bar < duration; bar++) {
//
//       playNotes(["A4"],metrosc,time+0 *eighthNoteTime,eighthNoteTime,0.25,1,"sine",context);
//       playNotes(["E4"],metrosc,time+2 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
//       playNotes(["E4"],metrosc,time+4 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
//       playNotes(["E4"],metrosc,time+6 *eighthNoteTime,eighthNoteTime,0.25,0,"sine",context);
//       time = startTime + bar * 8 * eighthNoteTime;
//
//   }
//
// }


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
