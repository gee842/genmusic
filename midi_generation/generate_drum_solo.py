tokens = {
    'kick' : 36,
    # 'snare' : 38,
    # 'hh' : 89,
    'tom2' : 69,
    'tom1' : 48,
    'tom3' : 45
}

num_beats = 24
#0.125 0.0625 0.25 0.1666 0.66 0.33 1.33
beat_subdivision = 0.125
 
from midiutil.MidiFile import MIDIFile
import random

class NoteGenerator:
    def __init__(self,pitches, beat_subdivision,mean_velocity):
        self.mf = MIDIFile(1)
        self.mf.addTrackName(0, 0, "Generated Drums")
        self.mf.addTempo(0, 0, 120)
        self.pitches = pitches
        self.beat_subdivision = beat_subdivision
        self.mean_velocity = mean_velocity
        self.last_note = 89
        self.last_note2 = 89
        self.track = 0
        self.channel = 0
    
    def get_next_note(self,current_subdivision):
        selected_pitch = random.choice(self.pitches)
        while self.last_note == selected_pitch and self.last_note2 == selected_pitch:
            selected_pitch = random.choice(self.pitches)
        self.last_note2 = self.last_note
        self.last_note = selected_pitch
        velocity_out = self.mean_velocity
        if current_subdivision == 0:
            velocity_out += random.randint(5,25)
        elif current_subdivision == 1:
            velocity_out += random.randint(-20,15)
        elif current_subdivision % 0.25 == 0:
            velocity_out += random.randint(-10,20)
        else:
            velocity_out += random.randint(-30,0)
        
        if velocity_out > 100 and selected_pitch == 38:
            return 39,124
            
        return selected_pitch,velocity_out
    
    def insert_note(self,pitch,current_subdivision,beat_subdivision,volume):
        self.mf.addNote(self.track, self.channel, pitch, current_subdivision, beat_subdivision, volume)
        
    def write(self,filename="./output.mid"):
        with open(filename, 'wb') as outf:
            self.mf.writeFile(outf)

# add some notes
pitches = list(tokens.values())
notegen = NoteGenerator(pitches,beat_subdivision,mean_velocity=100)
for i in range(num_beats):
    current_subdivision = 0
    while current_subdivision < 0.9996:
        pitch,volume = notegen.get_next_note(current_subdivision)
        # pitch = random.choice(pitches)
        notegen.insert_note(pitch,current_subdivision+i,beat_subdivision,volume)
        current_subdivision += beat_subdivision

notegen.write()
print('Midi Written')
        


# write it to disk
