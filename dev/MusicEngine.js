"use strict";
var mutatenumber = 3;
var lastnotedegree = 1;
var notesbuffer = [];
var barcount = 0;
var chordcache = [];
var global_previous_chords = [];
var expectedtime = 0.0;
var timediff = 0.0;
var lastOscUsed = 0;
var intervalstack = 3;
var firstbar = 1;
var globalscale = 'TSTTSTS';
var e_l_notedegree;
var e_l_basetempo;
var e_l_updateChords;
var e_l_oldchords;
var set_timeout;
var gainMultiplier =1.0;


const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const MajorScale = 'TTSTTTS';
const MinorScale = 'TSTTSTS';
const WholeTone = 'TTTTTTT';
const Octatonic1 = 'TSTSTSTS';
const Octatonic2 = 'STSTSTST';
const MajorFlat6 = 'TTSTSSTS';
const circleofFifths = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
var isPlaying = 0;
var context = new(window.AudioContext || window.webkitAudioContext);
var renderstart = context.currentTime;
const OstOsc = init_osc(context, 'sine', 20);
const Gains = init_gain(context, 20);
const EQArray = init_eqs(context, 20);
const PolyUnits = [];


const commoncolors = [[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1]]
function pastelColor(colormix) {
  let red = Math.random() * 0.8;
  let blue = Math.random()* 0.8;
  let green = Math.random()* 0.8;
  if (colormix != null) {
    red = (red + colormix[0]) / 2;
    green = (green + colormix[1]) / 2;
    blue = (blue + colormix[2]) / 2;
  }
  return ([red, green, blue]);

}

function PolyUnit(rhythm, notes, basetempo, type) {
  this.rhythm = rhythm;
  this.notes = notes;
  this.basetempo = basetempo;
  this.type = type;
  this.voicenumber = PolyUnits.length;
  this.cr = (rhythm.length / 8);
  // let bgcolor = pastelColor([1, 1, 1]);
  let bgcolor = commoncolors[Math.floor(Math.random()*commoncolors.length)]
  this.colorred = bgcolor[0];
  this.colorblue = bgcolor[1];
  this.colorgreen = bgcolor[2];
}
PolyUnit.prototype.play = function (startTime) {
  ostinato(this.rhythm, this.notes[0], this.basetempo * this.cr, startTime, this.type, this.voicenumber);
}

PolyUnits.push(new PolyUnit("ioix", [], 110, "sine"));
PolyUnits.push(new PolyUnit("ixxi", [], 110, "triangle"));
// PolyUnits.push(new PolyUnit("xxixIo",[],110,"triangle"));
// PolyUnits.push(new PolyUnit("ixIoixixIoix",[],110,"triangle"));
PolyUnits.push(new PolyUnit("xxixxxix", [], 110, "sine"));

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
}

function changeTempo(targetTempo, Cells) {
  for (var i = Cells.length - 1; i >= 0; i--) {
    Cells[i].basetempo = parseFloat(targetTempo);
  }
}

function isEqual(arr1, arr2) {
  if (arr1.length == arr2.length) {
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return 0;
      }

    }
    return 1;
  } else {
    return 0;
  }
}

function findDistance(note1, note2) {
  let octave2 = "";
  let note1Number = "";
  let note2Number = "";
  let octave1 = "";

  if (note1.length === 3) {
    octave1 = note1.charAt(2);
  } else {
    octave1 = note1.charAt(1);
  }
  note1Number = GlobalNotes.indexOf(note1.slice(0, -1));

  if (note2.length === 3) {
    octave2 = note2.charAt(2);
  } else {
    octave2 = note2.charAt(1);
  }
  note2Number = GlobalNotes.indexOf(note2.slice(0, -1));

  note1Number += 12 * parseInt(octave1);
  note2Number += 12 * parseInt(octave2);

  return Math.abs(note2Number - note1Number);

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function key_transpose(note, setting) {
  let originalnum = 0;
  let transposednum = 0;

  originalnum = GlobalNotes.indexOf(note)

  transposednum = (originalnum + setting)
  if (transposednum >= 12) {
    return (GlobalNotes[(transposednum - 12)])
  } else if (transposednum < 0) {
    return (GlobalNotes[(transposednum + 12)])
  } else {
    return (GlobalNotes[transposednum])
  }

}

function getScale(key, scale) //returns set of notes
{
  let scaleset = [];
  let totalmovements = 0;
  let distanceLetter = 0;
  scaleset.push(key);
  for (var i = 0; i < scale.length; i++) {
    distanceLetter = scale.charAt(i);
    if (distanceLetter == "T") {
      totalmovements += 2
      scaleset.push(key_transpose(key, totalmovements));
    } else if (distanceLetter == "S") {
      totalmovements += 1
      scaleset.push(key_transpose(key, totalmovements));
    }

  }
  scaleset.pop();
  return scaleset;
}

function dia_chordConstructor(key, currentdegree, interval, number, scale) {
  let chordtones = [];
  let notes = getScale(key, scale);
  let currdegree = currentdegree;

  for (var i = 0; i < number; i++) {
    if (currdegree == 0) {
      currdegree += 7;
    }
    chordtones.push(notes[currdegree - 1]);
    currdegree = (currdegree + (interval - 1)) % notes.length
  }
  return chordtones;

}

function scatter(inputnotes, scat) {

  let outputnotes = [];
  let numofnotes = 0;

  if (scat) {
    numofnotes = inputnotes.length;
    if (numofnotes == 1) {
      return [inputnotes[0] + (getRndInteger(3, 4).toString())]
    } else if (numofnotes == 2) {
      outputnotes.push(inputnotes[0] + (getRndInteger(3, 4).toString()));
      for (var i = 1; i < inputnotes.length; i++) {
        outputnotes.push(inputnotes[i] + (getRndInteger(4, 6).toString()));
      }
    } else {
      outputnotes.push(inputnotes[0] + (getRndInteger(3, 4).toString()));
      for (var i = 1; i < inputnotes.length - 1; i++) {
        outputnotes.push(inputnotes[i] + (getRndInteger(4, 6).toString()));
      }
      outputnotes.push(inputnotes[numofnotes - 1] + (getRndInteger(5, 7).toString()))
    }
  } else {
    for (var i = 0; i < inputnotes.length; i++) {
      outputnotes.push(inputnotes[i] + "4");
    }
  }
  return outputnotes;
}

function randompolyrhythm(div) {
  let re = "";
  let c = 0;
  for (var i = 0; i < div; i++) {
    c = getRndInteger(1, 15);
    switch (c) {
      case 1:
        re += "Io";
        break;
      case 2:
        re += "io";
        break;
      case 4:
        re += "ii";
        break;
      case 5:
        re += "xi";
        break;
      case 6:
        re += "ix";
        break;
      case 7:
        re += "xx";
        break;
      case 3:
        re += "xi";
        break;
      case 8:
        re += "xI";
        break;
      case 9:
        re += "Ii";
        break;
      case 10:
        if (i < div - 1) {
          re += "Iooo";
          i += 1;
          console.log("ooo")
        } else {
          re += "ii";
        }
        break;
      case 11:
        re += "iI";
        break;
      case 12:
        re += "xx";
        break;
      case 13:
        re+= "xx";
        break;
      case 14:
        re+= "ix";
        break;
    }
  }

  return re;
}


function chordchanger(currentchord) {
  let selectedchord = 0;
  switch (currentchord) {
    case 1:
      {
        selectedchord = [1, 1, 4, 5, 6, 3].randomElement();
        break;
      }

    case 2:
      {
        selectedchord = [5, 3, 5, 4, 6].randomElement();
        break;
      }

    case 3:
      {
        selectedchord = [3, 1, 6, 6, 4, 4].randomElement();
        break;
      }

    case 4:
      {
        selectedchord = [1, 1, 4, 5, 2].randomElement();
        break;
      }

    case 5:
      {
        selectedchord = [1, 1, 4, 6].randomElement();
        break;
      }

    case 6:
      {
        selectedchord = [1, 1, 4, 2, 2].randomElement();
        break;
      }

    case 7:
      {
        selectedchord = [3, 5, 3, 1, 1].randomElement();
        break;
      }
  }

  return selectedchord;
}

//Input: Previous Notes, Target Chord | Output: Next notes
function voice_seperation(key, currentdegree, interval, number, scale) {
  let upperb = 7;
  let lowerb = 2;
  let notes = getScale(key, scale);
  let chordtones = null;
  chordcache = null;
  let octave = 0;
  let leftdist = 0;
  let rightdist = 0;
  let samedist = 0;
  chordtones = [];
  chordcache = [];
  for (var i = 0; i < number; i++) {
    if (currentdegree == 0) {
      currentdegree += 7;
    }
    chordtones.push(notes[currentdegree - 1]);
    chordcache.push(notes[currentdegree - 1]);
    currentdegree = (currentdegree + (interval - 1)) % notes.length
  }

  if (global_previous_chords.length == chordtones.length) {
    for (var i = 0; i < number; i++) {
      if (global_previous_chords[i].length === 3) {
        octave = parseInt(global_previous_chords[i].charAt(2));

      } else {
        octave = parseInt(global_previous_chords[i].charAt(1));
      }

      leftdist = findDistance((chordtones[i] + ((octave) - 1)), global_previous_chords[i]);
      rightdist = findDistance((chordtones[i] + ((octave) + 1)), global_previous_chords[i]);
      samedist = findDistance((chordtones[i] + (octave)), global_previous_chords[i]);

      if ((leftdist <= rightdist) && (leftdist <= samedist)) {
        if (octave > lowerb) {
          chordtones[i] = chordtones[i] + (octave - 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }

      } else if ((rightdist <= leftdist) && (rightdist <= samedist)) {
        if (octave < upperb) {
          chordtones[i] = chordtones[i] + (octave + 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }

      } else if ((samedist <= leftdist) && (samedist <= rightdist)) {
        chordtones[i] = chordtones[i] + (octave);

      } else {
        chordtones[i] = chordtones[i] + (octave);
        console.log("unexpected:" + leftdist + " " + rightdist + " " + samedist + " ");
      }
    }

  } else if (global_previous_chords.length > chordtones.length) //polys removed
  {


    for (var i = 0; i < chordtones.length; i++) {
      if (global_previous_chords[i].length === 3) {
        octave = parseInt(global_previous_chords[i].charAt(2));

      } else {
        octave = parseInt(global_previous_chords[i].charAt(1));
      }

      leftdist = findDistance((chordtones[i] + ((octave) - 1)), global_previous_chords[i]);
      rightdist = findDistance((chordtones[i] + ((octave) + 1)), global_previous_chords[i]);
      samedist = findDistance((chordtones[i] + (octave)), global_previous_chords[i]);
      if ((leftdist <= rightdist) && (leftdist <= samedist)) {
        if (octave > lowerb) {
          chordtones[i] = chordtones[i] + (octave - 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }
      } else if ((rightdist <= leftdist) && (rightdist <= samedist)) {
        if (octave < upperb) {
          chordtones[i] = chordtones[i] + (octave + 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }

      } else if ((samedist <= leftdist) && (samedist <= rightdist)) {
        chordtones[i] = chordtones[i] + (octave);

      } else {
        chordtones[i] = chordtones[i] + (octave);
        console.log("unexpected:" + leftdist + " " + rightdist + " " + samedist + " ");
      }
    }
  } else if (global_previous_chords.length < chordtones.length) //polys added
  {

    for (var i = 0; i < global_previous_chords.length; i++) {
      if (global_previous_chords[i].length === 3) {
        octave = parseInt(global_previous_chords[i].charAt(2));

      } else {
        octave = parseInt(global_previous_chords[i].charAt(1));
      }

      leftdist = findDistance((chordtones[i] + ((octave) - 1)), global_previous_chords[i]);
      rightdist = findDistance((chordtones[i] + ((octave) + 1)), global_previous_chords[i]);
      samedist = findDistance((chordtones[i] + (octave)), global_previous_chords[i]);

      if ((leftdist <= rightdist) && (leftdist <= samedist)) {
        if (octave > lowerb) {
          chordtones[i] = chordtones[i] + (octave - 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }
      } else if ((rightdist <= leftdist) && (rightdist <= samedist)) {
        if (octave < upperb) {
          chordtones[i] = chordtones[i] + (octave + 1);
        } else {
          chordtones[i] = chordtones[i] + (octave);
        }

      } else if ((samedist <= leftdist) && (samedist <= rightdist)) {
        chordtones[i] = chordtones[i] + (octave);

      } else {
        chordtones[i] = chordtones[i] + (octave);
        console.log("unexpected:" + leftdist + " " + rightdist + " " + samedist + " ");
      }
    }
    for (var i = global_previous_chords.length; i < chordtones.length; i++) {
      chordtones[i] = chordtones[i] + getRndInteger(4, 6);
    }
  }

  if (isEqual(global_previous_chords, chordtones)) {
    chordtones = scatter(chordcache, 1);
  }
  return chordtones;
}
//----Melody Harmony BOILERPLATE CODE____-----____---____--___-_____---
//eachvoice should have their own oscillator array.

function playNotes(notearray, oscillators, gains, eqs, time, eighthNoteTime, duration, accent, type, context) {
  gains[lastOscUsed] = null;
  oscillators[lastOscUsed] = null;
  eqs[lastOscUsed] = null;
  gains[lastOscUsed] = context.createGain();
  oscillators[lastOscUsed] = context.createOscillator();
  eqs[lastOscUsed] = context.createBiquadFilter();
  oscillators[lastOscUsed].type = type;
  oscillators[lastOscUsed].frequency.value = notetoFreq(notearray);
  oscillators[lastOscUsed].connect(eqs[lastOscUsed]);
  eqs[lastOscUsed].type = "highshelf";
  eqs[lastOscUsed].frequency.setValueAtTime(notetoFreq("F4"), context.currentTime);
  eqs[lastOscUsed].gain.setValueAtTime(-20, context.currentTime);
  eqs[lastOscUsed].q = 1.4;
  eqs[lastOscUsed].connect(gains[lastOscUsed]);
  gains[lastOscUsed].connect(context.destination);

  gainMultiplier = document.getElementById('playerGain').value/10;
  if (accent) {
    gains[lastOscUsed].gain.setValueAtTime(0.5*gainMultiplier, time);
  } else {
    gains[lastOscUsed].gain.setValueAtTime(0.13 * gainMultiplier, time);
  }

  gains[lastOscUsed].gain.exponentialRampToValueAtTime(0.0001, (time + eighthNoteTime * (duration + 1)) + (eighthNoteTime * (duration + 4)));
  oscillators[lastOscUsed].start(time);
  oscillators[lastOscUsed].stop(time + eighthNoteTime * (duration + 1));
  lastOscUsed += 1;
  lastOscUsed = lastOscUsed % 20;
}

function notetoFreq(note) { //[Note][Octave0-9]
  var octave;
  var noteNumber;
  if (note.length === 3) {
    octave = note.charAt(2);
  } else {
    octave = note.charAt(1);
  }
  noteNumber = GlobalNotes.indexOf(note.slice(0, -1));
  if (noteNumber < 3) { // If below C
    noteNumber = noteNumber + 13 + (12 * (octave - 1)) //adjusting by the octave
  } else {
    noteNumber = noteNumber + 1 + (12 * (octave - 1))
  }
  return 440 * Math.pow(2, (noteNumber - 49) / 12)
}

function init_eqs(context, size) {
  let oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createBiquadFilter();
  }
  return oscarray;
}

function init_osc(context, type, size) {
  let oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createOscillator();
    oscarray[i].type = type;
  }
  return oscarray;
}

function init_gain(context, size) {
  let oscarray = [];
  for (let i = 0; i < size; i++) {
    oscarray[i] = context.createGain();
  }
  return oscarray;
}

//----POLYUNIT BOILERPLATE CODE____-----____---____--___-_____----
function shufflePoly(start, end) {
  var chosencolor;
  let cr = PolyUnits[0].rhythm.length / 8;
  for (var i = start; i < end; i++) {
    chosencolor = pastelColor([1, 1, 1]); 
    PolyUnits[i].rhythm = null
    PolyUnits[i].rhythm = randompolyrhythm(getRndInteger(2, 7));
    PolyUnits[i].colorred = chosencolor[0];
    PolyUnits[i].colorgreen = chosencolor[1];
    PolyUnits[i].colorblue = chosencolor[2];
    PolyUnits[i].cr = cr;
  }
}

function shuffleonePoly() {
  return randompolyrhythm(getRndInteger(2, 7));
}

function PolyTrigger(PolyArray, time) {
  document.getElementById('polydisplay').value = ""
  for (var i = 0; i < PolyArray.length; i++) {
    document.getElementById('polydisplay').value += PolyArray[i].rhythm + "--";
    document.getElementById('polydisplay').value += PolyArray[i].notes + "\n";
    PolyArray[i].play(time, i);
  }
}

e_l_updateChords = function () {
  e_l_notedegree = lastnotedegree;
  e_l_basetempo = PolyUnits[0].basetempo;
  if ((lastnotedegree == 5 || lastnotedegree == 4) && document.getElementById('automutate').checked) {
    if (Math.random() < 0.35) //percent chance of keychange on 4 or 5
    {
      document.getElementById('key').value =
        key_transpose(document.getElementById('key').value, (Math.random() < 0.5 ? 1 : -1) * 7);
      console.log("Key changed")
      e_l_notedegree = [1, 1, 6, 6, 4].randomElement();
    } else {
      e_l_notedegree = chordchanger(lastnotedegree);
    }

  } else {
    e_l_notedegree = chordchanger(lastnotedegree);

  }
}

function EventLoop(key, startTime) {
  if (isPlaying == 1) {
    clearTimeout(set_timeout);
    set_timeout = setTimeout(() => {
      e_l_updateChords();
      if (firstbar) {
        global_previous_chords = dia_chordConstructor(key, e_l_notedegree, intervalstack, PolyUnits.length, globalscale);
        global_previous_chords = scatter(global_previous_chords, 1);
        firstbar = 0;
      } else {
        e_l_oldchords = global_previous_chords;
        global_previous_chords = voice_seperation(key, e_l_notedegree, intervalstack, PolyUnits.length, globalscale);
        if (e_l_oldchords == global_previous_chords) {
          global_previous_chords = scatter(notesbuffer, 1);
          console.log(global_previous_chords);
        }
      }
      //-------------------------------------
      for (var i = 0; i < PolyUnits.length; i++) {
        PolyUnits[i].notes = null;
        PolyUnits[i].notes = [global_previous_chords[i]];
      }
      console.log(lastnotedegree + "=>" + e_l_notedegree)
      lastnotedegree = e_l_notedegree;
      PolyTrigger(PolyUnits, context.currentTime)
    }, startTime - context.currentTime);
    let nextkey = updateKey();
    let globalscale = updateScale();
    changeTempo(document.getElementById('tempochange').value, PolyUnits);
    updateGraphicsSettings()



      if ((barcount % 2 == 0)) {

        mutatenumber = autoMutate(mutatenumber);
      }

    barcount += 1;
    if (barcount < -1) {
      isPlaying = 0;
      setTimeout(function () {
        isPlaying = 1;
        barcount = 0;
        console.log("frame update");
        EventLoop(nextkey, (startTime + (240 / e_l_basetempo)), globalscale)

      }, (240000 / e_l_basetempo));

    } else {
      setTimeout(function () {
        EventLoop(nextkey, (startTime + (240 / e_l_basetempo)), globalscale)
      }, (240000 / e_l_basetempo));
    }
  } else {
    console.log("done");
    barcount = 0;
  }
}

function ostinato(rhythm, notearray, tempo, startTime, type, playingvoice) {
  var time = startTime;
  let state = "";

  let eighthNoteTime = (60 / tempo) / 2;
  for (let i = 0; i < rhythm.length; i++) {
    let lookahead = 1;
    let durationadded = 0;

    if ((rhythm[i] == "i" || rhythm[i] == "I") && rhythm[i + 1] == "o") {
      durationadded += 1;
      lookahead += 1;

      while (rhythm[i + lookahead] == "o") {
        lookahead += 1;
        durationadded += 1;
      }
    }

    state = rhythm[i];

    let locationEmit = function () {
      emitLocation(playingvoice);
    }

    switch (state) {
      case "I":
        //play
        if (drawGraphics){
          setTimeout(locationEmit, 1000 * ((time + i * eighthNoteTime) - context.currentTime));
        }

        playNotes(notearray, OstOsc, Gains, EQArray, time + i * eighthNoteTime, eighthNoteTime, (durationadded), 1, type, context);

        break;
      case "i":
        if (drawGraphics) {
          setTimeout(locationEmit, 1000 * ((time + i * eighthNoteTime) - context.currentTime));
        }
        playNotes(notearray, OstOsc, Gains, EQArray, time + i * eighthNoteTime, eighthNoteTime, (durationadded), 0, type, context);
        break;

      case "x":
        break;

      case "o":
        break;
    }
  }
}