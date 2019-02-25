(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Tonal = require('tonal');

},{"tonal":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-array.svg?style=flat-square)](https://www.npmjs.com/package/tonal-array)
 *
 * Tonal array utilities. Create ranges, sort notes, ...
 *
 * @example
 * import * as Array;
 * Array.sort(["f", "a", "c"]) // => ["C", "F", "A"]
 *
 * @example
 * const Array = require("tonal-array")
 * Array.range(1, 4) // => [1, 2, 3, 4]
 *
 * @module Array
 */

// ascending range
function ascR(b, n) {
  for (var a = []; n--; a[n] = n + b){ }
  return a;
}
// descending range
function descR(b, n) {
  for (var a = []; n--; a[n] = b - n){ }
  return a;
}

/**
 * Create a numeric range
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Array}
 *
 * @example
 * Array.range(-2, 2) // => [-2, -1, 0, 1, 2]
 * Array.range(2, -2) // => [2, 1, 0, -1, -2]
 */
function range(a, b) {
  return a === null || b === null
    ? []
    : a < b
      ? ascR(a, b - a + 1)
      : descR(a, a - b + 1);
}
/**
 *
 * Rotates a list a number of times. It"s completly agnostic about the
 * contents of the list.
 *
 * @param {Integer} times - the number of rotations
 * @param {Array} array
 * @return {Array} the rotated array
 * @example
 * Array.rotate(1, [1, 2, 3]) // => [2, 3, 1]
 */
function rotate(times, arr) {
  var len = arr.length;
  var n = ((times % len) + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}

/**
 * Return a copy of the array with the null values removed
 * @function
 * @param {Array} array
 * @return {Array}
 *
 * @example
 * Array.compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
 */
var compact = function (arr) { return arr.filter(function (n) { return n === 0 || n; }); };

// a function that get note heights (with negative number for pitch classes)
var height = function (name) {
  var m = tonalNote.props(name).midi;
  return m !== null ? m : tonalNote.props(name + "-100").midi;
};

/**
 * Sort an array of notes in ascending order
 *
 * @param {String|Array} notes
 * @return {Array} sorted array of notes
 */
function sort(src) {
  return compact(src.map(tonalNote.name)).sort(function (a, b) { return height(a) > height(b); });
}

/**
 * Get sorted notes with duplicates removed
 *
 * @function
 * @param {Array} notes
 */
function unique(arr) {
  return sort(arr).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
}

/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @private
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * Array.shuffle(["C", "D", "E", "F"])
 */
var shuffle = function (arr, rnd) {
  if ( rnd === void 0 ) rnd = Math.random;

  var i, t;
  var m = arr.length;
  while (m) {
    i = (rnd() * m--) | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

/**
 * Get all permutations of an array
 * http://stackoverflow.com/questions/9960908/permutations-in-javascript
 *
 * @param {Array} array - the array
 * @return {Array<Array>} an array with all the permutations
 */
var permutations = function (arr) {
  if (arr.length === 0) { return [[]]; }
  return permutations(arr.slice(1)).reduce(function(acc, perm) {
    return acc.concat(
      arr.map(function(e, pos) {
        var newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
};

exports.range = range;
exports.rotate = rotate;
exports.compact = compact;
exports.sort = sort;
exports.unique = unique;
exports.shuffle = shuffle;
exports.permutations = permutations;

},{"tonal-note":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalDistance = require('tonal-distance');
var tonalDictionary = require('tonal-dictionary');
var tonalPcset = require('tonal-pcset');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
 * [![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-chord` is a collection of functions to manipulate musical chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Chord from "tonal-chord"
 * // es5
 * const Chord = require("tonal-chord")
 *
 * @example
 * Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
 *
 * @module Chord
 */

/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * Chord.names() // => ["maj7", ...]
 */
var names = tonalDictionary.chord.names;

var NO_CHORD = Object.freeze({
  name: null,
  names: [],
  intervals: [],
  chroma: null,
  setnum: null
});

var properties = function (name) {
  var intervals = tonalDictionary.chord(name);
  if (!intervals) { return NO_CHORD; }
  var s = { intervals: intervals, name: name };
  s.chroma = tonalPcset.chroma(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = tonalDictionary.chord.names(s.chroma);
  return s;
};

var memo = function (fn, cache) {
  if ( cache === void 0 ) cache = {};

  return function (str) { return cache[str] || (cache[str] = fn(str)); };
};

/**
 * Get chord properties. It returns an object with:
 *
 * - name: the chord name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the chord intervals
 * - chroma:  chord croma (see pcset)
 * - setnum: chord chroma number
 *
 * @function
 * @param {String} name - the chord name (without tonic)
 * @return {Object} an object with the properties or a object with all properties
 * set to null if not valid chord name
 */
var props = memo(properties);

/**
 * Get chord intervals. It always returns an array
 *
 * @function
 * @param {String} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */
var intervals = function (name) { return props(tokenize(name)[1]).intervals; };

/**
 * Get the chord notes of a chord. This function accepts either a chord name
 * (for example: "Cmaj7") or a list of notes.
 *
 * It always returns an array, even if the chord is not found.
 *
 * @function
 * @param {String} nameOrTonic - name of the chord or the tonic (if the second parameter is present)
 * @param {String} [name] - (Optional) name if the first parameter is the tonic
 * @return {Array} an array of notes or an empty array
 *
 * @example
 * Chord.notes("Cmaj7") // => ["C", "E", "G", "B"]
 * Chord.notes("C", "maj7") // => ["C", "E", "G", "B"]
 */
function notes(nameOrTonic, name) {
  if (name) { return props(name).intervals.map(tonalDistance.transpose(nameOrTonic)); }
  var ref = tokenize(nameOrTonic);
  var tonic = ref[0];
  var type = ref[1];
  return props(type).intervals.map(tonalDistance.transpose(tonic));
}

/**
 * Check if a given name correspond to a chord in the dictionary
 *
 * @function
 * @param {String} name
 * @return {Boolean}
 * @example
 * Chord.exists("CMaj7") // => true
 * Chord.exists("Maj7") // => true
 * Chord.exists("Ablah") // => false
 */
var exists = function (name) { return tonalDictionary.chord(tokenize(name)[1]) !== undefined; };

/**
 * Get all chords names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of chord names
 */
var supersets = function (name) {
  if (!intervals(name).length) { return []; }
  var isSuperset = tonalPcset.isSupersetOf(intervals(name));
  return tonalDictionary.chord.names().filter(function (name) { return isSuperset(tonalDictionary.chord(name)); });
};

/**
 * Find all chords names that are a subset of the given one
 * (has less notes but all from the given chord)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of chord names
 */
var subsets = function (name) {
  var isSubset = tonalPcset.isSubsetOf(intervals(name));
  return tonalDictionary.chord.names().filter(function (name) { return isSubset(tonalDictionary.chord(name)); });
};

// 6, 64, 7, 9, 11 and 13 are consider part of the chord
// (see https://github.com/danigb/tonal/issues/55)
var NUM_TYPES = /^(6|64|7|9|11|13)$/;
/**
 * Tokenize a chord name. It returns an array with the tonic and chord type
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {String} name - the chord name
 * @return {Array} an array with [type, tonic]
 * @example
 * Chord.tokenize("Cmaj7") // => [ "C", "maj7" ]
 * Chord.tokenize("C7") // => [ "C", "7" ]
 * Chord.tokenize("mMaj7") // => [ "", "mMaj7" ]
 * Chord.tokenize("Cnonsense") // => [ "C", "nonsense" ]
 */
function tokenize(name) {
  var p = tonalNote.tokenize(name);
  if (p[0] === "") { return ["", name]; }
  // aug is augmented (see https://github.com/danigb/tonal/issues/55)
  if (p[0] === "A" && p[3] === "ug") { return ["", "aug"]; }

  if (NUM_TYPES.test(p[2])) {
    return [p[0] + p[1], p[2] + p[3]];
  } else {
    return [p[0] + p[1] + p[2], p[3]];
  }
}

exports.names = names;
exports.props = props;
exports.intervals = intervals;
exports.notes = notes;
exports.exists = exists;
exports.supersets = supersets;
exports.subsets = subsets;
exports.tokenize = tokenize;

},{"tonal-dictionary":4,"tonal-distance":5,"tonal-note":7,"tonal-pcset":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalPcset = require('tonal-pcset');

var chromatic = [
	"1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M"
];
var lydian = [
	"1P 2M 3M 4A 5P 6M 7M"
];
var major = [
	"1P 2M 3M 4P 5P 6M 7M",
	[
		"ionian"
	]
];
var mixolydian = [
	"1P 2M 3M 4P 5P 6M 7m",
	[
		"dominant"
	]
];
var dorian = [
	"1P 2M 3m 4P 5P 6M 7m"
];
var aeolian = [
	"1P 2M 3m 4P 5P 6m 7m",
	[
		"minor"
	]
];
var phrygian = [
	"1P 2m 3m 4P 5P 6m 7m"
];
var locrian = [
	"1P 2m 3m 4P 5d 6m 7m"
];
var altered = [
	"1P 2m 3m 3M 5d 6m 7m",
	[
		"super locrian",
		"diminished whole tone",
		"pomeroy"
	]
];
var diminished = [
	"1P 2M 3m 4P 5d 6m 6M 7M",
	[
		"whole-half diminished"
	]
];
var iwato = [
	"1P 2m 4P 5d 7m"
];
var hirajoshi = [
	"1P 2M 3m 5P 6m"
];
var kumoijoshi = [
	"1P 2m 4P 5P 6m"
];
var pelog = [
	"1P 2m 3m 5P 6m"
];
var prometheus = [
	"1P 2M 3M 4A 6M 7m"
];
var ritusen = [
	"1P 2M 4P 5P 6M"
];
var scriabin = [
	"1P 2m 3M 5P 6M"
];
var piongio = [
	"1P 2M 4P 5P 6M 7m"
];
var augmented = [
	"1P 2A 3M 5P 5A 7M"
];
var neopolitan = [
	"1P 2m 3m 4P 5P 6m 7M"
];
var egyptian = [
	"1P 2M 4P 5P 7m"
];
var oriental = [
	"1P 2m 3M 4P 5d 6M 7m"
];
var flamenco = [
	"1P 2m 3m 3M 4A 5P 7m"
];
var balinese = [
	"1P 2m 3m 4P 5P 6m 7M"
];
var persian = [
	"1P 2m 3M 4P 5d 6m 7M"
];
var bebop = [
	"1P 2M 3M 4P 5P 6M 7m 7M"
];
var enigmatic = [
	"1P 2m 3M 5d 6m 7m 7M"
];
var ichikosucho = [
	"1P 2M 3M 4P 5d 5P 6M 7M"
];
var sdata = {
	chromatic: chromatic,
	lydian: lydian,
	major: major,
	mixolydian: mixolydian,
	dorian: dorian,
	aeolian: aeolian,
	phrygian: phrygian,
	locrian: locrian,
	"melodic minor": [
	"1P 2M 3m 4P 5P 6M 7M"
],
	"melodic minor second mode": [
	"1P 2m 3m 4P 5P 6M 7m"
],
	"lydian augmented": [
	"1P 2M 3M 4A 5A 6M 7M"
],
	"lydian dominant": [
	"1P 2M 3M 4A 5P 6M 7m",
	[
		"lydian b7"
	]
],
	"melodic minor fifth mode": [
	"1P 2M 3M 4P 5P 6m 7m",
	[
		"hindu",
		"mixolydian b6M"
	]
],
	"locrian #2": [
	"1P 2M 3m 4P 5d 6m 7m",
	[
		"half-diminished"
	]
],
	altered: altered,
	"harmonic minor": [
	"1P 2M 3m 4P 5P 6m 7M"
],
	"phrygian dominant": [
	"1P 2m 3M 4P 5P 6m 7m",
	[
		"spanish",
		"phrygian major"
	]
],
	"half-whole diminished": [
	"1P 2m 3m 3M 4A 5P 6M 7m",
	[
		"dominant diminished"
	]
],
	diminished: diminished,
	"major pentatonic": [
	"1P 2M 3M 5P 6M",
	[
		"pentatonic"
	]
],
	"lydian pentatonic": [
	"1P 3M 4A 5P 7M",
	[
		"chinese"
	]
],
	"mixolydian pentatonic": [
	"1P 3M 4P 5P 7m",
	[
		"indian"
	]
],
	"locrian pentatonic": [
	"1P 3m 4P 5d 7m",
	[
		"minor seven flat five pentatonic"
	]
],
	"minor pentatonic": [
	"1P 3m 4P 5P 7m"
],
	"minor six pentatonic": [
	"1P 3m 4P 5P 6M"
],
	"minor hexatonic": [
	"1P 2M 3m 4P 5P 7M"
],
	"flat three pentatonic": [
	"1P 2M 3m 5P 6M",
	[
		"kumoi"
	]
],
	"flat six pentatonic": [
	"1P 2M 3M 5P 6m"
],
	"major flat two pentatonic": [
	"1P 2m 3M 5P 6M"
],
	"whole tone pentatonic": [
	"1P 3M 5d 6m 7m"
],
	"ionian pentatonic": [
	"1P 3M 4P 5P 7M"
],
	"lydian #5P pentatonic": [
	"1P 3M 4A 5A 7M"
],
	"lydian dominant pentatonic": [
	"1P 3M 4A 5P 7m"
],
	"minor #7M pentatonic": [
	"1P 3m 4P 5P 7M"
],
	"super locrian pentatonic": [
	"1P 3m 4d 5d 7m"
],
	"in-sen": [
	"1P 2m 4P 5P 7m"
],
	iwato: iwato,
	hirajoshi: hirajoshi,
	kumoijoshi: kumoijoshi,
	pelog: pelog,
	"vietnamese 1": [
	"1P 3m 4P 5P 6m"
],
	"vietnamese 2": [
	"1P 3m 4P 5P 7m"
],
	prometheus: prometheus,
	"prometheus neopolitan": [
	"1P 2m 3M 4A 6M 7m"
],
	ritusen: ritusen,
	scriabin: scriabin,
	piongio: piongio,
	"major blues": [
	"1P 2M 3m 3M 5P 6M"
],
	"minor blues": [
	"1P 3m 4P 5d 5P 7m",
	[
		"blues"
	]
],
	"composite blues": [
	"1P 2M 3m 3M 4P 5d 5P 6M 7m"
],
	augmented: augmented,
	"augmented heptatonic": [
	"1P 2A 3M 4P 5P 5A 7M"
],
	"dorian #4": [
	"1P 2M 3m 4A 5P 6M 7m"
],
	"lydian diminished": [
	"1P 2M 3m 4A 5P 6M 7M"
],
	"whole tone": [
	"1P 2M 3M 4A 5A 7m"
],
	"leading whole tone": [
	"1P 2M 3M 4A 5A 7m 7M"
],
	"lydian minor": [
	"1P 2M 3M 4A 5P 6m 7m"
],
	"locrian major": [
	"1P 2M 3M 4P 5d 6m 7m",
	[
		"arabian"
	]
],
	neopolitan: neopolitan,
	"neopolitan minor": [
	"1P 2m 3m 4P 5P 6m 7M"
],
	"neopolitan major": [
	"1P 2m 3m 4P 5P 6M 7M",
	[
		"dorian b2"
	]
],
	"neopolitan major pentatonic": [
	"1P 3M 4P 5d 7m"
],
	"romanian minor": [
	"1P 2M 3m 5d 5P 6M 7m"
],
	"double harmonic lydian": [
	"1P 2m 3M 4A 5P 6m 7M"
],
	"harmonic major": [
	"1P 2M 3M 4P 5P 6m 7M"
],
	"double harmonic major": [
	"1P 2m 3M 4P 5P 6m 7M",
	[
		"gypsy"
	]
],
	egyptian: egyptian,
	"hungarian minor": [
	"1P 2M 3m 4A 5P 6m 7M"
],
	"hungarian major": [
	"1P 2A 3M 4A 5P 6M 7m"
],
	oriental: oriental,
	"spanish heptatonic": [
	"1P 2m 3m 3M 4P 5P 6m 7m"
],
	flamenco: flamenco,
	balinese: balinese,
	"todi raga": [
	"1P 2m 3m 4A 5P 6m 7M"
],
	"malkos raga": [
	"1P 3m 4P 6m 7m"
],
	"kafi raga": [
	"1P 3m 3M 4P 5P 6M 7m 7M"
],
	"purvi raga": [
	"1P 2m 3M 4P 4A 5P 6m 7M"
],
	persian: persian,
	bebop: bebop,
	"bebop dominant": [
	"1P 2M 3M 4P 5P 6M 7m 7M"
],
	"bebop minor": [
	"1P 2M 3m 3M 4P 5P 6M 7m"
],
	"bebop major": [
	"1P 2M 3M 4P 5P 5A 6M 7M"
],
	"bebop locrian": [
	"1P 2m 3m 4P 5d 5P 6m 7m"
],
	"minor bebop": [
	"1P 2M 3m 4P 5P 6m 7m 7M"
],
	"mystery #1": [
	"1P 2m 3M 5d 6m 7m"
],
	enigmatic: enigmatic,
	"minor six diminished": [
	"1P 2M 3m 4P 5P 6m 6M 7M"
],
	"ionian augmented": [
	"1P 2M 3M 4P 5A 6M 7M"
],
	"lydian #9": [
	"1P 2m 3M 4A 5P 6M 7M"
],
	ichikosucho: ichikosucho,
	"six tone symmetric": [
	"1P 2m 3M 4P 5A 6M"
]
};

var M = [
	"1P 3M 5P",
	[
		"Major",
		""
	]
];
var M13 = [
	"1P 3M 5P 7M 9M 13M",
	[
		"maj13",
		"Maj13"
	]
];
var M6 = [
	"1P 3M 5P 13M",
	[
		"6"
	]
];
var M69 = [
	"1P 3M 5P 6M 9M",
	[
		"69"
	]
];
var M7add13 = [
	"1P 3M 5P 6M 7M 9M"
];
var M7b5 = [
	"1P 3M 5d 7M"
];
var M7b6 = [
	"1P 3M 6m 7M"
];
var M7b9 = [
	"1P 3M 5P 7M 9m"
];
var M7sus4 = [
	"1P 4P 5P 7M"
];
var M9 = [
	"1P 3M 5P 7M 9M",
	[
		"maj9",
		"Maj9"
	]
];
var M9b5 = [
	"1P 3M 5d 7M 9M"
];
var M9sus4 = [
	"1P 4P 5P 7M 9M"
];
var Madd9 = [
	"1P 3M 5P 9M",
	[
		"2",
		"add9",
		"add2"
	]
];
var Maj7 = [
	"1P 3M 5P 7M",
	[
		"maj7",
		"M7"
	]
];
var Mb5 = [
	"1P 3M 5d"
];
var Mb6 = [
	"1P 3M 13m"
];
var Msus2 = [
	"1P 2M 5P",
	[
		"add9no3",
		"sus2"
	]
];
var Msus4 = [
	"1P 4P 5P",
	[
		"sus",
		"sus4"
	]
];
var Maddb9 = [
	"1P 3M 5P 9m"
];
var m = [
	"1P 3m 5P"
];
var m11 = [
	"1P 3m 5P 7m 9M 11P",
	[
		"_11"
	]
];
var m11b5 = [
	"1P 3m 7m 12d 2M 4P",
	[
		"h11",
		"_11b5"
	]
];
var m13 = [
	"1P 3m 5P 7m 9M 11P 13M",
	[
		"_13"
	]
];
var m6 = [
	"1P 3m 4P 5P 13M",
	[
		"_6"
	]
];
var m69 = [
	"1P 3m 5P 6M 9M",
	[
		"_69"
	]
];
var m7 = [
	"1P 3m 5P 7m",
	[
		"minor7",
		"_",
		"_7"
	]
];
var m7add11 = [
	"1P 3m 5P 7m 11P",
	[
		"m7add4"
	]
];
var m7b5 = [
	"1P 3m 5d 7m",
	[
		"half-diminished",
		"h7",
		"_7b5"
	]
];
var m9 = [
	"1P 3m 5P 7m 9M",
	[
		"_9"
	]
];
var m9b5 = [
	"1P 3m 7m 12d 2M",
	[
		"h9",
		"-9b5"
	]
];
var mMaj7 = [
	"1P 3m 5P 7M",
	[
		"mM7",
		"_M7"
	]
];
var mMaj7b6 = [
	"1P 3m 5P 6m 7M",
	[
		"mM7b6"
	]
];
var mM9 = [
	"1P 3m 5P 7M 9M",
	[
		"mMaj9",
		"-M9"
	]
];
var mM9b6 = [
	"1P 3m 5P 6m 7M 9M",
	[
		"mMaj9b6"
	]
];
var mb6M7 = [
	"1P 3m 6m 7M"
];
var mb6b9 = [
	"1P 3m 6m 9m"
];
var o = [
	"1P 3m 5d",
	[
		"mb5",
		"dim"
	]
];
var o7 = [
	"1P 3m 5d 13M",
	[
		"diminished",
		"m6b5",
		"dim7"
	]
];
var o7M7 = [
	"1P 3m 5d 6M 7M"
];
var oM7 = [
	"1P 3m 5d 7M"
];
var sus24 = [
	"1P 2M 4P 5P",
	[
		"sus4add9"
	]
];
var madd4 = [
	"1P 3m 4P 5P"
];
var madd9 = [
	"1P 3m 5P 9M"
];
var cdata = {
	"4": [
	"1P 4P 7m 10m",
	[
		"quartal"
	]
],
	"5": [
	"1P 5P"
],
	"7": [
	"1P 3M 5P 7m",
	[
		"Dominant",
		"Dom"
	]
],
	"9": [
	"1P 3M 5P 7m 9M",
	[
		"79"
	]
],
	"11": [
	"1P 5P 7m 9M 11P"
],
	"13": [
	"1P 3M 5P 7m 9M 13M",
	[
		"13_"
	]
],
	"64": [
	"5P 8P 10M"
],
	M: M,
	"M#5": [
	"1P 3M 5A",
	[
		"augmented",
		"maj#5",
		"Maj#5",
		"+",
		"aug"
	]
],
	"M#5add9": [
	"1P 3M 5A 9M",
	[
		"+add9"
	]
],
	M13: M13,
	"M13#11": [
	"1P 3M 5P 7M 9M 11A 13M",
	[
		"maj13#11",
		"Maj13#11",
		"M13+4",
		"M13#4"
	]
],
	M6: M6,
	"M6#11": [
	"1P 3M 5P 6M 11A",
	[
		"M6b5",
		"6#11",
		"6b5"
	]
],
	M69: M69,
	"M69#11": [
	"1P 3M 5P 6M 9M 11A"
],
	"M7#11": [
	"1P 3M 5P 7M 11A",
	[
		"maj7#11",
		"Maj7#11",
		"M7+4",
		"M7#4"
	]
],
	"M7#5": [
	"1P 3M 5A 7M",
	[
		"maj7#5",
		"Maj7#5",
		"maj9#5",
		"M7+"
	]
],
	"M7#5sus4": [
	"1P 4P 5A 7M"
],
	"M7#9#11": [
	"1P 3M 5P 7M 9A 11A"
],
	M7add13: M7add13,
	M7b5: M7b5,
	M7b6: M7b6,
	M7b9: M7b9,
	M7sus4: M7sus4,
	M9: M9,
	"M9#11": [
	"1P 3M 5P 7M 9M 11A",
	[
		"maj9#11",
		"Maj9#11",
		"M9+4",
		"M9#4"
	]
],
	"M9#5": [
	"1P 3M 5A 7M 9M",
	[
		"Maj9#5"
	]
],
	"M9#5sus4": [
	"1P 4P 5A 7M 9M"
],
	M9b5: M9b5,
	M9sus4: M9sus4,
	Madd9: Madd9,
	Maj7: Maj7,
	Mb5: Mb5,
	Mb6: Mb6,
	Msus2: Msus2,
	Msus4: Msus4,
	Maddb9: Maddb9,
	"11b9": [
	"1P 5P 7m 9m 11P"
],
	"13#11": [
	"1P 3M 5P 7m 9M 11A 13M",
	[
		"13+4",
		"13#4"
	]
],
	"13#9": [
	"1P 3M 5P 7m 9A 13M",
	[
		"13#9_"
	]
],
	"13#9#11": [
	"1P 3M 5P 7m 9A 11A 13M"
],
	"13b5": [
	"1P 3M 5d 6M 7m 9M"
],
	"13b9": [
	"1P 3M 5P 7m 9m 13M"
],
	"13b9#11": [
	"1P 3M 5P 7m 9m 11A 13M"
],
	"13no5": [
	"1P 3M 7m 9M 13M"
],
	"13sus4": [
	"1P 4P 5P 7m 9M 13M",
	[
		"13sus"
	]
],
	"69#11": [
	"1P 3M 5P 6M 9M 11A"
],
	"7#11": [
	"1P 3M 5P 7m 11A",
	[
		"7+4",
		"7#4",
		"7#11_",
		"7#4_"
	]
],
	"7#11b13": [
	"1P 3M 5P 7m 11A 13m",
	[
		"7b5b13"
	]
],
	"7#5": [
	"1P 3M 5A 7m",
	[
		"+7",
		"7aug",
		"aug7"
	]
],
	"7#5#9": [
	"1P 3M 5A 7m 9A",
	[
		"7alt",
		"7#5#9_",
		"7#9b13_"
	]
],
	"7#5b9": [
	"1P 3M 5A 7m 9m"
],
	"7#5b9#11": [
	"1P 3M 5A 7m 9m 11A"
],
	"7#5sus4": [
	"1P 4P 5A 7m"
],
	"7#9": [
	"1P 3M 5P 7m 9A",
	[
		"7#9_"
	]
],
	"7#9#11": [
	"1P 3M 5P 7m 9A 11A",
	[
		"7b5#9"
	]
],
	"7#9#11b13": [
	"1P 3M 5P 7m 9A 11A 13m"
],
	"7#9b13": [
	"1P 3M 5P 7m 9A 13m"
],
	"7add6": [
	"1P 3M 5P 7m 13M",
	[
		"67",
		"7add13"
	]
],
	"7b13": [
	"1P 3M 7m 13m"
],
	"7b5": [
	"1P 3M 5d 7m"
],
	"7b6": [
	"1P 3M 5P 6m 7m"
],
	"7b9": [
	"1P 3M 5P 7m 9m"
],
	"7b9#11": [
	"1P 3M 5P 7m 9m 11A",
	[
		"7b5b9"
	]
],
	"7b9#9": [
	"1P 3M 5P 7m 9m 9A"
],
	"7b9b13": [
	"1P 3M 5P 7m 9m 13m"
],
	"7b9b13#11": [
	"1P 3M 5P 7m 9m 11A 13m",
	[
		"7b9#11b13",
		"7b5b9b13"
	]
],
	"7no5": [
	"1P 3M 7m"
],
	"7sus4": [
	"1P 4P 5P 7m",
	[
		"7sus"
	]
],
	"7sus4b9": [
	"1P 4P 5P 7m 9m",
	[
		"susb9",
		"7susb9",
		"7b9sus",
		"7b9sus4",
		"phryg"
	]
],
	"7sus4b9b13": [
	"1P 4P 5P 7m 9m 13m",
	[
		"7b9b13sus4"
	]
],
	"9#11": [
	"1P 3M 5P 7m 9M 11A",
	[
		"9+4",
		"9#4",
		"9#11_",
		"9#4_"
	]
],
	"9#11b13": [
	"1P 3M 5P 7m 9M 11A 13m",
	[
		"9b5b13"
	]
],
	"9#5": [
	"1P 3M 5A 7m 9M",
	[
		"9+"
	]
],
	"9#5#11": [
	"1P 3M 5A 7m 9M 11A"
],
	"9b13": [
	"1P 3M 7m 9M 13m"
],
	"9b5": [
	"1P 3M 5d 7m 9M"
],
	"9no5": [
	"1P 3M 7m 9M"
],
	"9sus4": [
	"1P 4P 5P 7m 9M",
	[
		"9sus"
	]
],
	m: m,
	"m#5": [
	"1P 3m 5A",
	[
		"m+",
		"mb6"
	]
],
	m11: m11,
	"m11A 5": [
	"1P 3m 6m 7m 9M 11P"
],
	m11b5: m11b5,
	m13: m13,
	m6: m6,
	m69: m69,
	m7: m7,
	"m7#5": [
	"1P 3m 6m 7m"
],
	m7add11: m7add11,
	m7b5: m7b5,
	m9: m9,
	"m9#5": [
	"1P 3m 6m 7m 9M"
],
	m9b5: m9b5,
	mMaj7: mMaj7,
	mMaj7b6: mMaj7b6,
	mM9: mM9,
	mM9b6: mM9b6,
	mb6M7: mb6M7,
	mb6b9: mb6b9,
	o: o,
	o7: o7,
	o7M7: o7M7,
	oM7: oM7,
	sus24: sus24,
	"+add#9": [
	"1P 3M 5A 9A"
],
	madd4: madd4,
	madd9: madd9
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-dictionary.svg)](https://www.npmjs.com/package/tonal-dictionary)
 *
 * `tonal-dictionary` contains a dictionary of musical scales and chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * // es6
 * import * as Dictionary from "tonal-dictionary"
 * // es5
 * const Dictionary = require("tonal-dictionary")
 *
 * @example
 * Dictionary.chord("Maj7") // => ["1P", "3M", "5P", "7M"]
 *
 * @module Dictionary
 */

var dictionary = function (raw) {
  var keys = Object.keys(raw).sort();
  var data = [];
  var index = [];

  var add = function (name, ivls, chroma) {
    data[name] = ivls;
    index[chroma] = index[chroma] || [];
    index[chroma].push(name);
  };

  keys.forEach(function (key) {
    var ivls = raw[key][0].split(" ");
    var alias = raw[key][1];
    var chr = tonalPcset.chroma(ivls);

    add(key, ivls, chr);
    if (alias) { alias.forEach(function (a) { return add(a, ivls, chr); }); }
  });
  var allKeys = Object.keys(data).sort();

  var dict = function (name) { return data[name]; };
  dict.names = function (p) {
    if (typeof p === "string") { return (index[p] || []).slice(); }
    else { return (p === true ? allKeys : keys).slice(); }
  };
  return dict;
};

var combine = function (a, b) {
  var dict = function (name) { return a(name) || b(name); };
  dict.names = function (p) { return a.names(p).concat(b.names(p)); };
  return dict;
};

/**
 * A dictionary of scales: a function that given a scale name (without tonic)
 * returns an array of intervals
 *
 * @function
 * @param {String} name
 * @return {Array} intervals
 * @example
 * import { scale } from "tonal-dictionary"
 * scale("major") // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */
var scale = dictionary(sdata);

/**
 * A dictionary of chords: a function that given a chord type
 * returns an array of intervals
 *
 * @function
 * @param {String} type
 * @return {Array} intervals
 * @example
 * import { chord } from "tonal-dictionary"
 * chord("Maj7") // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */
var chord = dictionary(cdata);
var pcset = combine(scale, chord);

exports.dictionary = dictionary;
exports.combine = combine;
exports.scale = scale;
exports.chord = chord;
exports.pcset = pcset;

},{"tonal-pcset":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalInterval = require('tonal-interval');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
 * [![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)
 *
 * Transpose notes by intervals and find distances between notes
 *
 * @example
 * // es6
 * import * as Distance from "tonal-distance"
 * Distance.interval("C3", "C4") // => "1P"
 *
 * @example
 * // es6 import selected functions
 * import { interval, semitones, transpose } from "tonal-distance"
 *
 * semitones("C" ,"D") // => 2
 * interval("C4", "G4") // => "5P"
 * transpose("C4", "P5") // => "G4"
 *
 * @example
 * // included in tonal facade
 * const Tonal = require("tonal");
 * Tonal.Distance.transpose("C4", "P5")
 * Tonal.Distance.transposeBy("P5", "C4")
 *
 * @module Distance
 */

// Map from letter step to number of fifths starting from "C":
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];

// Given a number of fifths, return the octaves they span
var fOcts = function (f) { return Math.floor((f * 7) / 12); };

// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts);

var encode = function (ref) {
  var step = ref.step;
  var alt = ref.alt;
  var oct = ref.oct;
  var dir = ref.dir; if ( dir === void 0 ) dir = 1;

  var f = FIFTHS[step] + 7 * alt;
  if (oct === null) { return [dir * f]; }
  var o = oct - FIFTH_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
};

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:
var STEPS = [3, 0, 4, 1, 5, 2, 6];

// Return the number of fifths as if it were unaltered
function unaltered(f) {
  var i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

var decode = function (f, o, dir) {
  var step = STEPS[unaltered(f)];
  var alt = Math.floor((f + 1) / 7);
  if (o === undefined) { return { step: step, alt: alt, dir: dir }; }
  var oct = o + 4 * alt + FIFTH_OCTS[step];
  return { step: step, alt: alt, oct: oct, dir: dir };
};

var memo = function (fn, cache) {
  if ( cache === void 0 ) cache = {};

  return function (str) { return cache[str] || (cache[str] = fn(str)); };
};

var encoder = function (props) { return memo(function (str) {
    var p = props(str);
    return p.name === null ? null : encode(p);
  }); };

var encodeNote = encoder(tonalNote.props);
var encodeIvl = encoder(tonalInterval.props);

/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from "tonal-distance"
 * transpose("d3", "3M") // => "F#3"
 * // it works with pitch classes
 * transpose("D", "3M") // => "F#"
 * // can be partially applied
 * ["C", "D", "E", "F", "G"].map(transpose("M3)) // => ["E", "F#", "G#", "A", "B"]
 */
function transpose(note, interval) {
  if (arguments.length === 1) { return function (i) { return transpose(note, i); }; }
  var n = encodeNote(note);
  var i = encodeIvl(interval);
  if (n === null || i === null) { return null; }
  var tr = n.length === 1 ? [n[0] + i[0]] : [n[0] + i[0], n[1] + i[1]];
  return tonalNote.build(decode(tr[0], tr[1]));
}

/**
 * Transpose a pitch class by a number of perfect fifths.
 *
 * It can be partially applied.
 *
 * @function
 * @param {String} pitchClass - the pitch class
 * @param {Integer} fifhts - the number of fifths
 * @return {String} the transposed pitch class
 *
 * @example
 * import { trFifths } from "tonal-transpose"
 * [0, 1, 2, 3, 4].map(trFifths("C")) // => ["C", "G", "D", "A", "E"]
 * // or using tonal
 * Distance.trFifths("G4", 1) // => "D"
 */

function trFifths(note, fifths) {
  if (arguments.length === 1) { return function (f) { return trFifths(note, f); }; }
  var n = encodeNote(note);
  if (n === null) { return null; }
  return tonalNote.build(decode(n[0] + fifths));
}

/**
 * Get the distance in fifths between pitch classes
 *
 * Can be partially applied.
 *
 * @param {String} to - note or pitch class
 * @param {String} from - note or pitch class
 */
function fifths(from, to) {
  if (arguments.length === 1) { return function (to) { return fifths(from, to); }; }
  var f = encodeNote(from);
  var t = encodeNote(to);
  if (t === null || f === null) { return null; }
  return t[0] - f[0];
}

/**
 * The same as transpose with the arguments inverted.
 *
 * Can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from "tonal-distance"
 * transposeBy("3m", "5P") // => "7m"
 */
function transposeBy(interval, note) {
  if (arguments.length === 1) { return function (n) { return transpose(n, interval); }; }
  return transpose(note, interval);
}

var isDescending = function (e) { return e[0] * 7 + e[1] * 12 < 0; };
var decodeIvl = function (i) { return isDescending(i) ? decode(-i[0], -i[1], -1) : decode(i[0], i[1], 1); };

function addIntervals(ivl1, ivl2, dir) {
  var i1 = encodeIvl(ivl1);
  var i2 = encodeIvl(ivl2);
  if (i1 === null || i2 === null) { return null; }
  var i = [i1[0] + dir * i2[0], i1[1] + dir * i2[1]];
  return tonalInterval.build(decodeIvl(i));
}

/**
 * Add two intervals
 *
 * Can be partially applied.
 *
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from "tonal-distance"
 * add("3m", "5P") // => "7m"
 */
function add(ivl1, ivl2) {
  if (arguments.length === 1) { return function (i2) { return add(ivl1, i2); }; }
  return addIntervals(ivl1, ivl2, 1);
}

/**
 * Subtract two intervals
 *
 * Can be partially applied
 *
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */
function subtract(ivl1, ivl2) {
  if (arguments.length === 1) { return function (i2) { return add(ivl1, i2); }; }
  return addIntervals(ivl1, ivl2, -1);
}

/**
 * Find the interval between two pitches. It works with pitch classes
 * (both must be pitch classes and the interval is always ascending)
 *
 * Can be partially applied
 *
 * @param {String} from - distance from
 * @param {String} to - distance to
 * @return {String} the interval distance
 *
 * @example
 * import { interval } from "tonal-distance"
 * interval("C2", "C3") // => "P8"
 * interval("G", "B") // => "M3"
 *
 * @example
 * import * as Distance from "tonal-distance"
 * Distance.interval("M2", "P5") // => "P4"
 */
function interval(from, to) {
  if (arguments.length === 1) { return function (t) { return interval(from, t); }; }
  var f = encodeNote(from);
  var t = encodeNote(to);
  if (f === null || t === null || f.length !== t.length) { return null; }
  var d =
    f.length === 1
      ? [t[0] - f[0], -Math.floor(((t[0] - f[0]) * 7) / 12)]
      : [t[0] - f[0], t[1] - f[1]];
  return tonalInterval.build(decodeIvl(d));
}

/**
 * Get the distance between two notes in semitones
 *
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from "tonal-distance"
 * semitones("C3", "A2") // => -3
 * // or use tonal
 * Tonal.Distance.semitones("C3", "G3") // => 7
 */
function semitones(from, to) {
  if (arguments.length === 1) { return function (t) { return semitones(from, t); }; }
  var f = tonalNote.props(from);
  var t = tonalNote.props(to);
  return f.midi !== null && t.midi !== null
    ? t.midi - f.midi
    : f.chroma !== null && t.chroma !== null
      ? (t.chroma - f.chroma + 12) % 12
      : null;
}

exports.transpose = transpose;
exports.trFifths = trFifths;
exports.fifths = fifths;
exports.transposeBy = transposeBy;
exports.addIntervals = addIntervals;
exports.add = add;
exports.subtract = subtract;
exports.interval = interval;
exports.semitones = semitones;

},{"tonal-interval":6,"tonal-note":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
var IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
var REGEX = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");
var SIZES = [0, 2, 4, 5, 7, 9, 11];
var TYPES = "PMMPPMM";
var CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
var NAMES = "1P 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P".split(" ");
var names = function (types) {
    return typeof types !== "string"
        ? NAMES.slice()
        : NAMES.filter(function (n) { return types.indexOf(n[1]) !== -1; });
};
var tokenize = function (str) {
    var m = REGEX.exec("" + str);
    if (m === null)
        return null;
    return (m[1] ? [m[1], m[2]] : [m[4], m[3]]);
};
var NO_IVL = Object.freeze({
    name: null,
    num: null,
    q: null,
    step: null,
    alt: null,
    dir: null,
    type: null,
    simple: null,
    semitones: null,
    chroma: null,
    oct: null
});
var fillStr = function (s, n) { return Array(Math.abs(n) + 1).join(s); };
var qToAlt = function (type, q) {
    if (q === "M" && type === "M")
        return 0;
    if (q === "P" && type === "P")
        return 0;
    if (q === "m" && type === "M")
        return -1;
    if (/^A+$/.test(q))
        return q.length;
    if (/^d+$/.test(q))
        return type === "P" ? -q.length : -q.length - 1;
    return null;
};
var altToQ = function (type, alt) {
    if (alt === 0)
        return type === "M" ? "M" : "P";
    else if (alt === -1 && type === "M")
        return "m";
    else if (alt > 0)
        return fillStr("A", alt);
    else if (alt < 0)
        return fillStr("d", type === "P" ? alt : alt + 1);
    else
        return null;
};
var numToStep = function (num) { return (Math.abs(num) - 1) % 7; };
var properties = function (str) {
    var t = tokenize(str);
    if (t === null)
        return NO_IVL;
    var p = {
        num: 0,
        q: "d",
        name: "",
        type: "M",
        step: 0,
        dir: -1,
        simple: 1,
        alt: 0,
        oct: 0,
        semitones: 0,
        chroma: 0,
        ic: 0
    };
    p.num = +t[0];
    p.q = t[1];
    p.step = numToStep(p.num);
    p.type = TYPES[p.step];
    if (p.type === "M" && p.q === "P")
        return NO_IVL;
    p.name = "" + p.num + p.q;
    p.dir = p.num < 0 ? -1 : 1;
    p.simple = (p.num === 8 || p.num === -8
        ? p.num
        : p.dir * (p.step + 1));
    p.alt = qToAlt(p.type, p.q);
    p.oct = Math.floor((Math.abs(p.num) - 1) / 7);
    p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
    p.chroma = ((((p.dir * (SIZES[p.step] + p.alt)) % 12) + 12) %
        12);
    return Object.freeze(p);
};
var cache = {};
function props(str) {
    if (typeof str !== "string")
        return NO_IVL;
    return cache[str] || (cache[str] = properties(str));
}
var num = function (str) { return props(str).num; };
var name = function (str) { return props(str).name; };
var semitones = function (str) { return props(str).semitones; };
var chroma = function (str) { return props(str).chroma; };
var ic = function (ivl) {
    if (typeof ivl === "string")
        ivl = props(ivl).chroma;
    return typeof ivl === "number" ? CLASSES[ivl % 12] : null;
};
var build = function (_a) {
    var _b = _a === void 0 ? {} : _a, num = _b.num, step = _b.step, alt = _b.alt, _c = _b.oct, oct = _c === void 0 ? 1 : _c, dir = _b.dir;
    if (step !== undefined)
        num = step + 1 + 7 * oct;
    if (num === undefined)
        return null;
    if (typeof alt !== "number")
        return null;
    var d = typeof dir !== "number" ? "" : dir < 0 ? "-" : "";
    var type = TYPES[numToStep(num)];
    return (d + num + altToQ(type, alt));
};
var simplify = function (str) {
    var p = props(str);
    if (p === NO_IVL)
        return null;
    var intervalProps = p;
    return intervalProps.simple + intervalProps.q;
};
var invert = function (str) {
    var p = props(str);
    if (p === NO_IVL)
        return null;
    var intervalProps = p;
    var step = (7 - intervalProps.step) % 7;
    var alt = intervalProps.type === "P" ? -intervalProps.alt : -(intervalProps.alt + 1);
    return build({ step: step, alt: alt, oct: intervalProps.oct, dir: intervalProps.dir });
};
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
var IQ = "P m M m M P d P m M m M".split(" ");
var fromSemitones = function (num) {
    var d = num < 0 ? -1 : 1;
    var n = Math.abs(num);
    var c = n % 12;
    var o = Math.floor(n / 12);
    return d * (IN[c] + 7 * o) + IQ[c];
};

exports.names = names;
exports.tokenize = tokenize;
exports.qToAlt = qToAlt;
exports.altToQ = altToQ;
exports.props = props;
exports.num = num;
exports.name = name;
exports.semitones = semitones;
exports.chroma = chroma;
exports.ic = ic;
exports.build = build;
exports.simplify = simplify;
exports.invert = invert;
exports.fromSemitones = fromSemitones;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" ");
var names = function (accTypes) {
    return typeof accTypes !== "string"
        ? NAMES.slice()
        : NAMES.filter(function (n) {
            var acc = n[1] || " ";
            return accTypes.indexOf(acc) !== -1;
        });
};
var SHARPS = names(" #");
var FLATS = names(" b");
var REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function tokenize(str) {
    if (typeof str !== "string")
        str = "";
    var m = REGEX.exec(str);
    return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}
var NO_NOTE = Object.freeze({
    pc: null,
    name: null,
    step: null,
    alt: null,
    oct: null,
    octStr: null,
    chroma: null,
    midi: null,
    freq: null
});
var SEMI = [0, 2, 4, 5, 7, 9, 11];
var properties = function (str) {
    var tokens = tokenize(str);
    if (tokens[0] === "" || tokens[3] !== "")
        return NO_NOTE;
    var letter = tokens[0], acc = tokens[1], octStr = tokens[2];
    var p = {
        letter: letter,
        acc: acc,
        octStr: octStr,
        pc: letter + acc,
        name: letter + acc + octStr,
        step: (letter.charCodeAt(0) + 3) % 7,
        alt: acc[0] === "b" ? -acc.length : acc.length,
        oct: octStr.length ? +octStr : null,
        chroma: 0,
        midi: null,
        freq: null
    };
    p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
    p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
    p.freq = midiToFreq(p.midi);
    return Object.freeze(p);
};
var memo = function (fn, cache) {
    if (cache === void 0) { cache = {}; }
    return function (str) { return cache[str] || (cache[str] = fn(str)); };
};
var props = memo(properties);
var name = function (str) { return props(str).name; };
var pc = function (str) { return props(str).pc; };
var isMidiRange = function (m) { return m >= 0 && m <= 127; };
var midi = function (note) {
    if (typeof note !== "number" && typeof note !== "string") {
        return null;
    }
    var midi = props(note).midi;
    var value = midi || midi === 0 ? midi : +note;
    return isMidiRange(value) ? value : null;
};
var midiToFreq = function (midi, tuning) {
    if (tuning === void 0) { tuning = 440; }
    return typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * tuning : null;
};
var freq = function (note) { return props(note).freq || midiToFreq(note); };
var L2 = Math.log(2);
var L440 = Math.log(440);
var freqToMidi = function (freq) {
    var v = (12 * (Math.log(freq) - L440)) / L2 + 69;
    return Math.round(v * 100) / 100;
};
var chroma = function (str) { return props(str).chroma; };
var oct = function (str) { return props(str).oct; };
var LETTERS = "CDEFGAB";
var stepToLetter = function (step) { return LETTERS[step]; };
var fillStr = function (s, n) { return Array(n + 1).join(s); };
var numToStr = function (num, op) {
    return typeof num !== "number" ? "" : op(num);
};
var altToAcc = function (alt) {
    return numToStr(alt, function (alt) { return (alt < 0 ? fillStr("b", -alt) : fillStr("#", alt)); });
};
var from = function (fromProps, baseNote) {
    if (fromProps === void 0) { fromProps = {}; }
    if (baseNote === void 0) { baseNote = null; }
    var _a = baseNote
        ? Object.assign({}, props(baseNote), fromProps)
        : fromProps, step = _a.step, alt = _a.alt, oct = _a.oct;
    if (typeof step !== "number")
        return null;
    var letter = stepToLetter(step);
    if (!letter)
        return null;
    var pc = letter + altToAcc(alt);
    return oct || oct === 0 ? pc + oct : pc;
};
var build = from;
function fromMidi(num, sharps) {
    if (sharps === void 0) { sharps = false; }
    num = Math.round(num);
    var pcs = sharps === true ? SHARPS : FLATS;
    var pc = pcs[num % 12];
    var o = Math.floor(num / 12) - 1;
    return pc + o;
}
var simplify = function (note, sameAcc) {
    if (sameAcc === void 0) { sameAcc = true; }
    var _a = props(note), alt = _a.alt, chroma = _a.chroma, midi = _a.midi;
    if (chroma === null)
        return null;
    var alteration = alt;
    var useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
    return midi === null
        ? pc(fromMidi(chroma, useSharps))
        : fromMidi(midi, useSharps);
};
var enharmonic = function (note) { return simplify(note, false); };

exports.names = names;
exports.tokenize = tokenize;
exports.props = props;
exports.name = name;
exports.pc = pc;
exports.midi = midi;
exports.midiToFreq = midiToFreq;
exports.freq = freq;
exports.freqToMidi = freqToMidi;
exports.chroma = chroma;
exports.oct = oct;
exports.stepToLetter = stepToLetter;
exports.altToAcc = altToAcc;
exports.from = from;
exports.build = build;
exports.fromMidi = fromMidi;
exports.simplify = simplify;
exports.enharmonic = enharmonic;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalInterval = require('tonal-interval');
var tonalArray = require('tonal-array');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
 * [![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-pcset` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * You can install via npm: `npm i --save tonal-pcset`
 *
 * ```js
 * // es6
 * import PcSet from "tonal-pcset"
 * var PcSet = require("tonal-pcset")
 *
 * PcSet.isEqual("c2 d5 e6", "c6 e3 d1") // => true
 * ```
 *
 * ## API documentation
 *
 * @module PcSet
 */

var chr = function (str) { return tonalNote.chroma(str) || tonalInterval.chroma(str) || 0; };
var pcsetNum = function (set) { return parseInt(chroma(set), 2); };
var clen = function (chroma) { return chroma.replace(/0/g, "").length; };

/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It"s a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch class set
 * @return {String} a binary representation of the pitch class set
 * @example
 * PcSet.chroma(["C", "D", "E"]) // => "1010100000000"
 */
function chroma(set) {
  if (isChroma(set)) { return set; }
  if (!Array.isArray(set)) { return ""; }
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  set.map(chr).forEach(function (i) {
    b[i] = 1;
  });
  return b.join("");
}

var all = null;
/**
 * Get a list of all possible chromas (all possible scales)
 * More information: http://allthescales.org/
 * @return {Array} an array of possible chromas from '10000000000' to '11111111111'
 *
 */
function chromas(n) {
  all = all || tonalArray.range(2048, 4095).map(function (n) { return n.toString(2); });
  return typeof n === "number"
    ? all.filter(function (chroma) { return clen(chroma) === n; })
    : all.slice();
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 * PcSet.modes(["C", "D", "E"]).map(PcSet.intervals)
 */
function modes(set, normalize) {
  normalize = normalize !== false;
  var binary = chroma(set).split("");
  return tonalArray.compact(
    binary.map(function(_, i) {
      var r = tonalArray.rotate(i, binary);
      return normalize && r[0] === "0" ? null : r.join("");
    })
  );
}

var REGEX = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * PcSet.isChroma("101010101010") // => true
 * PcSet.isChroma("101001") // => false
 */
function isChroma(set) {
  return REGEX.test(set);
}

var IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * Given a pcset (notes or chroma) return it"s intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * PcSet.intervals("1010100000000") => ["1P", "2M", "3M"]
 */
function intervals(set) {
  if (!isChroma(set)) { return []; }
  return tonalArray.compact(
    set.split("").map(function(d, i) {
      return d === "1" ? IVLS[i] : null;
    })
  );
}

/**
 * Test if two pitch class sets are identical
 *
 * @param {Array|String} set1 - one of the pitch class sets
 * @param {Array|String} set2 - the other pitch class set
 * @return {Boolean} true if they are equal
 * @example
 * PcSet.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
function isEqual(s1, s2) {
  if (arguments.length === 1) { return function (s) { return isEqual(s1, s); }; }
  return chroma(s1) === chroma(s2);
}

/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function can be partially applied
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a subset of set, false otherwise
 * @example
 * const inCMajor = PcSet.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */
function isSubsetOf(set, notes) {
  if (arguments.length > 1) { return isSubsetOf(set)(notes); }
  set = pcsetNum(set);
  return function(notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes & set) === notes;
  };
}

/**
 * Create a function that test if a collectio of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a superset of set, false otherwise
 * @example
 * const extendsCMajor = PcSet.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
function isSupersetOf(set, notes) {
  if (arguments.length > 1) { return isSupersetOf(set)(notes); }
  set = pcsetNum(set);
  return function(notes) {
    notes = pcsetNum(notes);
    return notes !== set && (notes | set) === notes;
  };
}

/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * PcSet.includes(["C", "D", "E"], "C4") // => true
 * PcSet.includes(["C", "D", "E"], "C#4") // => false
 */
function includes(set, note) {
  if (arguments.length > 1) { return includes(set)(note); }
  set = chroma(set);
  return function(note) {
    return set[chr(note)] === "1";
  };
}

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * PcSet.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * PcSet.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
function filter(set, notes) {
  if (arguments.length === 1) { return function (n) { return filter(set, n); }; }
  return notes.filter(includes(set));
}

exports.chroma = chroma;
exports.chromas = chromas;
exports.modes = modes;
exports.isChroma = isChroma;
exports.intervals = intervals;
exports.isEqual = isEqual;
exports.isSubsetOf = isSubsetOf;
exports.isSupersetOf = isSupersetOf;
exports.includes = includes;
exports.filter = filter;

},{"tonal-array":2,"tonal-interval":6,"tonal-note":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalNote = require('tonal-note');
var tonalPcset = require('tonal-pcset');
var tonalDistance = require('tonal-distance');
var tonalDictionary = require('tonal-dictionary');
var tonalArray = require('tonal-array');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-scale.svg?style=flat-square)](https://www.npmjs.com/package/tonal-scale)
 *
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * // es6
 * import * as Scale from "tonal-scale"
 * // es5
 * const Scale = require("tonal-scale");
 *
 * @example
 * Scale.notes("Ab bebop") // => [ "Ab", "Bb", "C", "Db", "Eb", "F", "Gb", "G" ]
 * Scale.names() => ["major", "minor", ...]
 * @module Scale
 */

var NO_SCALE = Object.freeze({
  name: null,
  intervals: [],
  names: [],
  chroma: null,
  setnum: null
});

var properties = function (name) {
  var intervals = tonalDictionary.scale(name);
  if (!intervals) { return NO_SCALE; }
  var s = { intervals: intervals, name: name };
  s.chroma = tonalPcset.chroma(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = tonalDictionary.scale.names(s.chroma);
  return Object.freeze(s);
};

var memoize = function (fn, cache) { return function (str) { return cache[str] || (cache[str] = fn(str)); }; };

/**
 * Get scale properties. It returns an object with:
 * - name: the scale name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the scale intervals
 * - chroma:  scale croma (see pcset)
 * - setnum: scale chroma number
 *
 * @function
 * @param {String} name - the scale name (without tonic)
 * @return {Object}
 */
var props = memoize(properties, {});

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * Scale.names() // => ["maj7", ...]
 */
var names = tonalDictionary.scale.names;

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @function
 * @param {String} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<String>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * Scale.intervals("major") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M" ]
 */
var intervals = function (name) {
  var p = tokenize(name);
  return props(p[1]).intervals;
};

/**
 * Get the notes (pitch classes) of a scale.
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @function
 * @param {String} tonic
 * @param {String} nameOrTonic - the scale name or tonic (if 2nd param)
 * @param {String} [name] - the scale name without tonic
 * @return {Array} a pitch classes array
 *
 * @example
 * Scale.notes("C", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("C4", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
 * Scale.notes("A4", "no-scale") // => []
 * Scale.notes("blah", "major") // => []
 */
function notes(nameOrTonic, name) {
  var p = tokenize(nameOrTonic);
  name = name || p[1];
  return intervals(name).map(tonalDistance.transpose(p[0]));
}

/**
 * Check if the given name is a known scale from the scales dictionary
 *
 * @function
 * @param {String} name - the scale name
 * @return {Boolean}
 */
function exists(name) {
  var p = tokenize(name);
  return tonalDictionary.scale(p[1]) !== undefined;
}

/**
 * Given a string with a scale name and (optionally) a tonic, split
 * that components.
 *
 * It retuns an array with the form [ name, tonic ] where tonic can be a
 * note name or null and name can be any arbitrary string
 * (this function doesn"t check if that scale name exists)
 *
 * @function
 * @param {String} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * Scale.tokenize("C mixolydean") // => ["C", "mixolydean"]
 * Scale.tokenize("anything is valid") // => ["", "anything is valid"]
 * Scale.tokenize() // => ["", ""]
 */
function tokenize(str) {
  if (typeof str !== "string") { return ["", ""]; }
  var i = str.indexOf(" ");
  var tonic = tonalNote.name(str.substring(0, i)) || tonalNote.name(str) || "";
  var name = tonic !== "" ? str.substring(tonic.length + 1) : str;
  return [tonic, name.length ? name : ""];
}

/**
 * Find mode names of a scale
 *
 * @function
 * @param {String} name - scale name
 */
var modeNames = function (name) {
  var ivls = intervals(name);
  var tonics = notes(name);

  return tonalPcset.modes(ivls)
    .map(function (chroma, i) {
      var name = tonalDictionary.scale.names(chroma)[0];
      if (name) { return [tonics[i] || ivls[i], name]; }
    })
    .filter(function (x) { return x; });
};

/**
 * Get all chords that fits a given scale
 *
 * @function
 * @param {String} name
 */
var chords = function (name) {
  var inScale = tonalPcset.isSubsetOf(intervals(name));
  return tonalDictionary.chord.names().filter(function (name) { return inScale(tonalDictionary.chord(name)); });
};

/**
 * Given an array of notes, return the scale: a pitch class set starting from
 * the first note of the array
 *
 * @function
 * @param {Array} notes
 * @return {Array}
 */
var toScale = function (notes) {
  var pcset = tonalArray.compact(notes.map(tonalNote.pc));
  if (!pcset.length) { return pcset; }
  var tonic = pcset[0];
  var scale = tonalArray.unique(pcset);
  return tonalArray.rotate(scale.indexOf(tonic), scale);
};

/**
 * Get all scales names that are a superset of the given one
 * (has the same notes and at least one more)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of scale names
 */
var supersets = function (name) {
  if (!intervals(name).length) { return []; }
  var isSuperset = tonalPcset.isSupersetOf(intervals(name));
  return tonalDictionary.scale.names().filter(function (name) { return isSuperset(tonalDictionary.scale(name)); });
};

/**
 * Find all scales names that are a subset of the given one
 * (has less notes but all from the given scale)
 *
 * @function
 * @param {String} name
 * @return {Array} a list of scale names
 */
var subsets = function (name) {
  var isSubset = tonalPcset.isSubsetOf(intervals(name));
  return tonalDictionary.scale.names().filter(function (name) { return isSubset(tonalDictionary.scale(name)); });
};

exports.props = props;
exports.names = names;
exports.intervals = intervals;
exports.notes = notes;
exports.exists = exists;
exports.tokenize = tokenize;
exports.modeNames = modeNames;
exports.chords = chords;
exports.toScale = toScale;
exports.supersets = supersets;
exports.subsets = subsets;

},{"tonal-array":2,"tonal-dictionary":4,"tonal-distance":5,"tonal-note":7,"tonal-pcset":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tonalArray = require('tonal-array');
var Note = require('tonal-note');
var tonalInterval = require('tonal-interval');
var Distance = require('tonal-distance');
var Dictionary = require('tonal-dictionary');
var tonalScale = require('tonal-scale');
var tonalChord = require('tonal-chord');
var tonalPcset = require('tonal-pcset');

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 *
 * The `Tonal` module is a facade to the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `Tonal.Note.pc`
 *
 * It exports the following modules:
 * - Note
 * - Interval
 * - Distance
 * - Scale
 * - Chord
 * - PcSet
 *
 * Additionally this facade exports some functions without namespace (see "Methods" below)
 *
 * @example
 * // es6 modules
 * import * as Tonal from "tonal"
 * Tonal.Note.name("cx") // => "C##"
 *
 * @example
 * import { Note } from "tonal"
 * Note.name("bb") // => "Bb"
 *
 * @example
 * // es5 node modules
 * var Tonal = require("tonal");
 * Tonal.Distance.transpose(Tonal.Note.pc("C#2"), "M3") // => "E#"
 * Tonal.Chord.notes("Dmaj7") // => ["D", "F#", "A", "C#"]
 *
 * @module Tonal
 */

/**
 * Transpose a note by an interval
 * @function
 * @param {String} note
 * @param {String} interval
 * @return {String} the transported note
 * @see Distance.transpose
 */
var transpose = Distance.transpose;

/**
 * Get the interval from two notes
 * @function
 * @param {String} from
 * @param {String} to
 * @return {String} the interval in reverse shorthand notation
 * @see Distance.interval
 */
var interval = Distance.interval;

/**
 * Get note properties
 * @function
 * @param {String} note - the note name
 * @return {Object}
 * @see Note.props
 * @example
 * Tonal.note("A4").chroma // => 9
 */
var note = Note.props;

/**
 * Get midi note number
 * @function
 * @param {String} note
 * @return {Number}
 * @see Note.midi
 * @example
 * Tonal.midi("A4") // => 49
 */
var midi = Note.midi;

/**
 * Get note frequency using equal tempered tuning at 440
 * @function
 * @param {String} note
 * @return {Number}
 * @see Note.freq
 * @example
 * Tonal.freq("A4") // => 440
 */
var freq = Note.freq;

/**
 * Get intervals from a chord type
 * @function
 * @param {String} type - the chord type (no tonic)
 * @return {Array} an array of intervals or undefined if the chord type is not known
 * @see Dictionary.chord
 * @example
 * Tonal.chord("m7b5") // => ["1P", "3m", "5d", "7m"]
 */
var chord = Dictionary.chord;

/**
 * Get intervals from scale name
 * @function
 * @param {String} name - the scale name (without tonic)
 * @return {Array} an array of intervals or undefiend if the scale is not kown
 * @example
 * Tonal.scale("major") // => ["1P", "2M", "3M"...]
 */
var scale = Dictionary.scale;

exports.Array = tonalArray;
exports.Note = Note;
exports.Interval = tonalInterval;
exports.Distance = Distance;
exports.Dictionary = Dictionary;
exports.Scale = tonalScale;
exports.Chord = tonalChord;
exports.PcSet = tonalPcset;
exports.transpose = transpose;
exports.interval = interval;
exports.note = note;
exports.midi = midi;
exports.freq = freq;
exports.chord = chord;
exports.scale = scale;

},{"tonal-array":2,"tonal-chord":3,"tonal-dictionary":4,"tonal-distance":5,"tonal-interval":6,"tonal-note":7,"tonal-pcset":8,"tonal-scale":9}]},{},[1]);
