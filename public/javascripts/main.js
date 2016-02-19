function makeRequest (method, url, done) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.onload = function () {
		done(null, xhr.response);
	};
	xhr.onerror = function () {
		done(xhr.response);
	};
	xhr.send();
}

function clearNodeElem(nodeElem) {
	while (nodeElem.hasChildNodes()) {
    	nodeElem.removeChild(nodeElem.firstChild);
	}
}

function getDiagnosisResults () {	
	var query = document.getElementById('inputBox').value;
	var outputElem = document.getElementById('output');
	if(query.length > 0) {
		makeRequest('GET', '/search?q=' + query, function (err, data) {
		  if (err) { throw err; }
		  clearNodeElem(outputElem);
		  JSON.parse(data).forEach(function(elem){
		  	outputElem.innerHTML += '<br/><a href="http://en.wikipedia.org/wiki/'+ elem.str +'">' + elem.str + "</a>" + '<span style="color:rgb(200,200,200)"> - ' + elem.score + "</span>";
		  });  
		});
	} else {
		clearNodeElem(outputElem);
	}
}