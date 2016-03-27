"use strict";

// boring stuff we have to implement ourselves

String.prototype.shuffle = function () {
	var chars = this.split("");
	for (var i = chars.length - 1; i > 0; i--) {
		var j = randomInt(0, i);
		var tmp = chars[i];
		chars[i] = chars[j];
		chars[j] = tmp;
	}
	return chars.join("");
}

// Returns a random integer between min (included) and max (excluded)
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function usesLetters(candidate, source){
	var candidateCount = charCount(candidate);
	var sourceCount = charCount(source);
	for (var char in candidateCount){
		if (!candidateCount.hasOwnProperty(char)){ continue; }
		if ( !(sourceCount.hasOwnProperty(char) && candidateCount[char] <= sourceCount[char]) ){
			return false
		}
	}
	return true
}

function charCount(word){
	var count = {};
	for (var i = 0; i < word.length; i++){
		var char = word.charAt(i);
		if (!count.hasOwnProperty(char)){
			count[char] = 1;
		} else {
			count[char]++;
		}
	}
	return count;
}

function inSortedArray(target, array){
	// a binary search
	var left = 0;
	var right = array.length - 1;
	while (left <= right){
		var mid = Math.floor( (left + right)/2 );
		var candidate = array[mid];
		if (target === candidate){
			return true;
		} else if (target < candidate){
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}
	return false;
}

// Game data

var conundrum = {
	//state
	word: "",
	words: [],
	submittedWords: [], 
	nineLetterWords: [],
	score: 0,
	points: 0,
	
	//functions
	newGame: null,
	newWord: null,
	shuffle: null,
	addHistory: null,
	clearHistory: null,
	//callbacks
	entry: null,
	submit: null,
	sucess: null,
	//dom
	body: null,
	num_words: null,
	num_points: null,
	tiles: [],
	history: null,
	//config
	maxHistory: 20
};


conundrum.newGame = function () {
	var index = randomInt(0, conundrum.nineLetterWords.length);
	conundrum.word = conundrum.nineLetterWords[index].shuffle();
	conundrum.newWord();
	conundrum.score = 0;
	conundrum.body.classList.remove("loading");
}

conundrum.clearHistory = function () {
	conundrum.submittedWords = [];
	conundrum.history.innerHTML = "";
	for (var i = 0; i < conundrum.maxHistory; i++){
		conundrum.history.appendChild(document.createElement("div"));
	}
}

conundrum.newWord = function () {
	for (var i = 0; i < 9; i++){
		conundrum.tiles[i].textContent = conundrum.word[i];
	}
}

conundrum.shuffle = function () {
	conundrum.word = conundrum.word.shuffle();
	conundrum.newWord();
}

conundrum.entry = function(e){
	switch(e.keyCode){
		case 32: //space
			e.preventDefault();
			break;
		case 13: // enter
			if (this.value !== ""){
				conundrum.submit(this.value.toUpperCase());
				this.value = "";
			}
			break;
		return
	}
}

conundrum.submit = function(word) {
	//Is the word built using the given letters?
	 if ( !usesLetters(word, conundrum.word) ){
		 return
	 }
	
	//Have we already submitted this word?
	if ( inSortedArray(word, conundrum.submittedWords) ){
		return
	}
	
	//If so, is the word actually a word?
	if ( inSortedArray(word, conundrum.words) ){
		conundrum.success(word);
	}
}

conundrum.success = function(word){
	conundrum.addHistory(word);
	conundrum.score += 1;
	conundrum.num_points.textContent = conundrum.points;
	conundrum.num_words.textContent  = conundrum.submittedWords.length;
	if (word.length === 9){
		// todo: congratulate
	}
}

conundrum.addHistory = function (entry) {
	conundrum.submittedWords.push(entry);
	conundrum.submittedWords.sort();
	conundrum.points += entry.length;
	
	var div = document.createElement("div");
	div.textContent = entry;
	conundrum.history.appendChild(div);
	var divs = conundrum.history.getElementsByTagName("div");
	for (var i = 0; i < divs.length - 20; i++){
		conundrum.history.removeChild(divs[i]);
	}
}

// main function

function main() {
	setupDOM();
	getWordList();
}

function setupDOM () {
	conundrum.body = document.getElementsByTagName("body")[0];
	conundrum.tiles = document.getElementsByClassName('letter');
	conundrum.history = document.getElementById('history');
	conundrum.num_points = document.getElementById('num_points');
	conundrum.num_words = document.getElementById('num_words');
	document.getElementById("shuffle").addEventListener("click", conundrum.shuffle)
	document.getElementById("reset").addEventListener("click", conundrum.newGame)
	document.getElementById("entry").addEventListener("keydown", conundrum.entry)
}

function getWordList () {
	var words = localStorage.getItem("words")
	if ( words === null ) {
		var request = new XMLHttpRequest();
		request.open("GET", "words.json");
		request.addEventListener("load", gotWordList);
		request.send();
	} else {
		parseWords(words);
		conundrum.newGame();
	}
	
}

function gotWordList() {
	localStorage.setItem("words", this.responseText);
	parseWords(this.responseText);
	conundrum.newGame();
}

function parseWords(string){
	conundrum.words = JSON.parse(string).words;
	for (var i = 0; i < conundrum.words.length; i++ ){
		if (conundrum.words[i].length === 9) {
			conundrum.nineLetterWords.push(conundrum.words[i])
		}
	}
}

document.addEventListener("DOMContentLoaded", main);