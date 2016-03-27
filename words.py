import json
import sys

def passes_filter(word):
	if len(word) == 1 and word not in 'AZ':
		return False
	#only accept characters A....Z
	return len(word) <= 9 and all(65 <= ord(char) <= 90 for char in word)

def main(words_file):
	with open(words_file, 'rt', encoding='utf-8') as f:
		words = list(f)
	words = [w.strip().upper() for w in words]
	words = [w for w in words if passes_filter(w)]
	words.sort()
	with open('words.json', 'wt', encoding='utf-8') as f:
		json.dump({ "words": words }, f)
	return words

if __name__ == "__main__":
	try:
		words_file = sys.argv[1]
	except IndexError:
		words_file = "/usr/share/dict/words"
	words = main(words_file)