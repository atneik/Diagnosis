var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET search listing. */
router.get('/', function(req, res, next) {
  
  // Checks if it's one of the below special chars. Returns true if it is, or else false. 
  function isSpecialChar (ch) {
  	var spChar = "`~'!@#$%^&*()_-=+{[}]|\\;:<,>.?/" + '"';
  	return spChar.indexOf(ch) > -1;
  }

  // Returns a formatted string without special chars.
  function getFormattedLine (line) {
  	if(typeof line !== "string"){
  		return '';
  	}
  	return line.split('').filter(function(ch) {
  		   	return isSpecialChar(ch) === false ;
  			}).join('');
  }

  // Returns a score for query word for the string, using (Position of matching substring from the end) * (Ratio of matching query)
  function getScore (str, qWord) {
  	var strWords = str.split(' ');
  	var score = 0;
  	strWords.forEach(function(word) {
  		if(word.indexOf(qWord) > -1)
  			score += (word.length - word.indexOf(qWord)) * (qWord.length / word.length);
  		else
  			score --;
  	});
  	return score;
  }

  // Factory function generating closure of query word and current filtered list.
  // Result list is filtered if the diagnosis string doesn't sub-contain every query word from the query string.
  function filterList (qWord, list) {
  	return function () {
  		var filteredList = list.filter(function (line){
       			qWord = getFormattedLine(qWord).toLowerCase();
       			var str = getFormattedLine(line.str).toLowerCase();
       			line.score += getScore(str, qWord);
    			return str.indexOf(qWord) > -1;
       		});
  		return filteredList;
  	}
  }

  // Read the given diagnosis list and filter using each query words.
  fs.readFile( __dirname + "/../data/" + "list.txt", 'utf8', function (err, data) {
       	var list = data.split(/\r?\n/).map(function(elem){
       		return {str: elem, score: 0};
       	});
       	var queryWords = req.query.q.trim().split(' ');
       	
       	// Filter using the generator filterList()
       	queryWords.forEach(function (qWord){
       		list = filterList(qWord, list)();
       	});

       	// Sort using the Score
       	list = list.sort(function(a, b){
       		return b.score - a.score;
       	});

       	res.send(list);
   });

});

module.exports = router;
