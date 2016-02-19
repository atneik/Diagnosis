Diagnosis
===============

Simple node server to get diagnosis results

Using a portion of the diagnosis name as the query, or with words describing the desired diagnosis. The goal is to take the doctor query and return the best possible subset of diagnoses that match the search.


##API
###Search results

 - URL
 
	**`/search`**

 - Method
 
  	**`GET`**
  
 - URL parameters
	 
	**`q`**: Search query

 - Success response
 
    **Content**: Array of Objects -  `[{ str : "cancer", score : "6" }, ..]`

 - Example Request

  ```javascript
    $.ajax({
      url: "/search?q=head",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
 - Example Response
  
  ```javascript
 [
		{
			"str": "headache",
			"score": 4
		},
		{
			"str": "cluster headache",
			"score": 3
		},
		{
			"str": "tension headache",
			"score": 3
		}
]
```
##Matching

###Filtering
Result list is filtered if the diagnosis string doesn't sub-contain every query word from the query string.

###Ranking
We use the following score heuristic to determine ranking. If it's a substring score is added as per below formula, if not score is subtracted.       

	    Score += (Ratio of matching query) * (Position of matching substring from the end)


##Technologies used

 - Node.js
 - Express
 - Jade 