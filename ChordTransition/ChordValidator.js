const GlobalNotes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
var Violations = [];
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

function isBigger(note1,note2)
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

  return (note2Number < note1Number);

}


//Bassvoice should have larger spacing.

// Spacing Between Voices   SINGLE CHORD
const VOICES = 4;
function Rule1(chord){
  for (var i=0; i<VOICES-1;i++)
  {
    var note1 = chord[i];
    var note2 = chord[i+1];
    if (findDistance(note1,note2) > 12){ //too much space
      console.log("Excessive Spacing between voices" + i + "and" i+1);
      Violations.push(1);
    }

  }
}
// Parallel Fifths and Octaves     TWO CHORDS
function Rule2(chord1,chord2){
  for (var i=0; i<VOICES-1;i++)
  {
    var notes1 = chord1[i];
    var notes2 = chord2[i];



    if (findDistance(note1,note2) > 12){ //too much space
      console.log("Excessive Spacing between voices" + i + "and" i+1);
      Violations.push(1);
    }

  }
}


// Voice Crossing
function Rule3(chord){
  for (var i=0; i<VOICES-1;i++)
  {
    var note1 = chord[i];
    var note2 = chord[i+1];
    if (isBigger(note1,note2)){ //too much space
      console.log("Voices Crossed" + i + "and" i+1);
      Violations.push(3);
    }

  }
}
// Consecutive Fifths and Octaves by Contrary Motion
function Rule4(chord){
  for (var i=0; i<VOICES-1;i++)
  {
    var note1 = chord[i];
    var note2 = chord[i+1];
    if (findDistance(note1,note2) > 12){ //too much space
      console.log("Excessive Spacing between voices" + i + "and" i+1);
      Violations.push(1);
    }

  }
}
// Hidden Direct Fifths and Octaves
function Rule1(chord){
  for (var i=0; i<VOICES-1;i++)
  {
    var note1 = chord[i];
    var note2 = chord[i+1];
    if (findDistance(note1,note2) > 12){ //too much space
      console.log("Excessive Spacing between voices" + i + "and" i+1);
      Violations.push(1);
    }

  }
}
