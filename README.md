# genmusic - Hosted here: https://gee842.github.io/genmusic/dev/

## Generative Music Vanilla Javascript Web Application. 

Creates an ever evolving soundscape, gradually mutating components and shifting into different keys.

Works by constructing chords using a simple interval stacking method, then rearranging them to different octaves to create inversions.

Tries to obey voice leading rules, omiting minor ninths, and minimize movements of each voice to maintain smoothness and consistency.

Includes simple webGL particle-system-based graphics that follows the musi, and loosely represents the voices.



### Instructions

Hit Start generation, additional info of permutations in console.

This program works upon the principle of layering independent components 

'Push Random Layer' adds a new one to the stack, and conversely 'Remove Last Layer' pops one off the stack. 

Different Graphics modes can be invoked using the selector next to the 'Reset Particles' button. 

Auto Key Tempo and Auto Poly controls the automatic mutation engine. Disable for finer user control 

Shuffle Polyrhythms brings the piece to a whole different feeling.
