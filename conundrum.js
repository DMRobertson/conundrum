"use strict";
var conundrum = {
	word: "",
	words: [],
	nineLetterWords: [],
	tiles: [],
	history: null,
	
	newGame: null,
	newWord: null,
	shuffle: null
};

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

conundrum.newGame = function () {
	var index = randomInt(0, conundrum.nineLetterWords.length);
	conundrum.word = conundrum.nineLetterWords[index].shuffle();
	conundrum.newWord();
	conundrum.body.classList.remove("loading");
}

conundrum.newWord = function () {
	conundrum.history.innerHTML = "";
	for (var i = 0; i < 9; i++){
		conundrum.tiles[i].textContent = conundrum.word[i];
	}
}

conundrum.shuffle = function () {
	conundrum.word = conundrum.word.shuffle();
	conundrum.newWord();
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
	document.getElementById("shuffle").addEventListener("click", conundrum.shuffle)
	document.getElementById("reset").addEventListener("click", conundrum.newGame)
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