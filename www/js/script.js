var varCaption;
var image_url = "http://image.tmdb.org/t/p/w92";
var poster_path = " ";
var awards = new Object	;
var genres = new Object;
// ----------- testing -------------
var expanded = false;
function showCheckboxes() {
  var div = document.querySelectorAll('input[type=checkbox]:checked')
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
		for (const id of div.values()) {
			console.log(id.value);
			console.log(genres[id.value]);
			id.checked = false;
		};
    checkboxes.style.display = "none";
    expanded = false;  }
}
// ----------- testing ------------
function init() {
	var url = "http://192.168.0.16:8080/www/AcademyAwards.txt"
//	var url = "file:///C:/MLH/Test/HTML/movies/www/js/AcademyAwards.txt"
	//var url = "https://github.com/captaincomputer/hw-sinatra-saas-//hangperson/blob/master/README.md"
	get_tmdb(url,function(a) {
		 awards = a;
	});
	var cb = document.getElementById("checkboxes")
	build_url(['genre'],function(g) {
 		g.genres.forEach(function (genre) {
			genres[genre.name] = genre.id;			
			var label = document.createElement("label");
			var input = document.createElement("input");			
			var f = document.createAttribute("for");
//			var text = document.createTextNode(genre.name);			
			f.value = genre.name;
			label.setAttributeNode(f);
			label.append(genre.name);
			
			input.type = "checkbox";
			input.id = genre.name;
			input.value = genre.name;
//			input.append(text);
			cb.append(label);			
			label.prepend(input);			
		});
	});
};
function select() {
	alert("select");
}
function search() {
	var search = document.getElementById("search").value;
	var form = document.querySelector("form");
	var data = new FormData(form);
	for (const entry of data) {
		var what = entry[1];
	}
//	alert(what);
	if (what=="movie") {
		get_movies(search); }
	else {
		get_person(search); }
	event.preventDefault();
	true;
};
function loadList(category) {  
	console.log(genres);
	cat = category;
	console.log(awards);
	varCaption = "<h3> Best " + cat + "s</h3>";		
	generateTable(awards[cat]);  
/*	var url = "file:///C:/MLH/Education/edX/WebDevelopment/JavaScript/AcademyAwards.txt"
	//var url = "https://github.com/captaincomputer/hw-sinatra-saas-//hangperson/blob/master/README.md"
	get_tmdb(url,function(list) {
		awards = list;
//		console.log(awards);
		generateTable(awards[cat]);  
	});
*/	
};

function generateHeaders(headers) {
	var table = document.createElement("TABLE");
	table.border = "1";
	table.className = "table";
	caption = table.createCaption();
	caption_nodes = caption.childNodes;
	caption.innerHTML = varCaption;	
	var img = document.createElement('img');
//	alert(poster_path);
	if (poster_path != " ") {
		img.src = image_url + poster_path;			
		caption.appendChild(img);		
		poster_path = " ";
//		alert(poster_path.length);
	}
	else if (caption_nodes.length == 2) {
		caption.removeChild(img);
	}
	var row = table.insertRow(-1);
//	alert(document.images[0].src);
//	create headers
//	for (var i = 0; i < headers.length; i++) {
	for (i in headers) {
		if (headers[i] == 'id') { continue ;}
		var headerCell = document.createElement("TH");
		headerCell.id = headers[i];
		headerCell.innerHTML = headers[i];
		row.appendChild(headerCell); }
return table;	
};

function generateTable(list) {
//	console.log(awards);
	var headers = Object.keys(list[0]);
	table = generateHeaders(headers);
	table.id = "mytable"
//	build table	
	var newyear;
//	console.log(headers[0]);
	if (headers[0] == "id") { var start = 1;}
	else { var start = 0; }
	list.forEach(function (record) {    
		var keys = Object.keys(record);			
		var row = table.insertRow();
		for (i = start; i < headers.length; i++) {
//			if (headers[i] == "id") { continue };
			cell = row.insertCell();
			var header = headers[i];
			if  (header == keys[i]) {
				cell.innerHTML = record[headers[i]]; }
			else {
				cell.innerHTML = keys[i] + ": " + record[keys[i]] };
			cell.className = headers[i];	
			if (headers[i] == "year" && newyear !== record[headers[i]]) {
				row.className = "winner"
				newyear = record[headers[i]];	
			};
			cell.addEventListener("click", function(e) { 
				var element = e.path[0].className;
//				alert(element);
//				console.log(e);
//				console.log(element);
				if (headers[0] == "id") {
					varCaption = "<h3>" + record["title"] + "</h3>";
					var results = get_movie(record[headers[0]]) }
				else if (element == "title") { var results = get_movies(record[element]); }
				else if (element == "name") 	{ var results = get_person(record[element]); }
			});
		};
	});
	loadTable(table);
	list = ""
};
function loadTable(table) {
//  load table					 
  var dvTable = document.getElementById("dvTable");
	dvTable.innerHTML = "";
  dvTable.appendChild(table);
}

function sort_array(array) {
	array.sort(function(a,b) {
	var dateA = new Date(a.release_date), dateB = new Date(b.release_date);
	return dateA - dateB;
	});
	return array;
}

function get_movies(title) { 
//	console.log(title);
	var movies =  new Array;
	build_url([1,"movie",title],function(results) {
		results['results'].forEach(function (record) {
			var movie = new Object();
			movie.id = record.id
			movie.release_date = record.release_date;
			movie.title = record.title;
			movie.overview = record.overview;
			movies.push(movie);
		});
		if (movies.length > 1) {
			varCaption = "<h3>" + movies.length + " movies with '" + title + "' in title</h3>";				
			generateTable(sort_array(movies));
		}
		else {
//			console.log(movies);
			varCaption = "<h3> " + title + "</h3>";				
						
			get_movie(movies[0].id,movies[0].title);
		}
	});
};

function get_movie(id,title)	 {
	build_url(["movie",id],function(results) {
		poster_path = results['poster_path'];
		var array = get_credits("movie",results['credits']);
//		console.log(array);
		generateTable(array);
	});	//do_get_movie);
};

function get_person(name) {
	var vid;
	varCaption = "<h3>" + name + "</h3>";		
	build_url([1,"person",name],function(results) {
		vid = results.results[0].id;
		build_url(["person",vid],function(results) {
			var array = get_credits("person",results); 
			build_url(["images",vid],function(profiles) {
				poster_path = profiles.profiles[0]['file_path'];
				generateTable(sort_array(array));
			});
//			console.log(array);

		}); 
	});
};

function get_credits_original(cat,results) {
	if (cat == "movie") {
		keys = {cast: ["character","name"],
						crew: ["job","name"]};			} ;
	if (cat == "person") {
		keys = { cast: ["release_date","title","character"],
						 crew: ["release_date","title","job"]}; };
	var credits = Object.keys(keys);
	credits.forEach(function(credit) {
		results[credit].forEach(function(movie) {
			var items = new Object(credits[credit]);
			keys[credit].forEach(function(key) { 
				items[key] = movie[key]; 
			});
			array.push(items);		//[credit]);
		
		});
	});
};
function get_credits(cat,results) {
//	console.log(results['cast']);
//	var array = new Array;
//	poster_path = results['cast'][0]['poster_path'];
//	alert(poster_path);	
	var array = new Array;
	if (cat == "movie") {
		keys = {cast: ["character","name"],
						crew: ["job","name"]};			} ;
	if (cat == "person") {
		keys = { cast: ["release_date","title","character"],
						 crew: ["release_date","title","job"]}; };
	var credits = Object.keys(keys);
	credits.forEach(function(credit) {
		results[credit].forEach(function(item) {
			var items = new Object(credits[credit]);
			keys[credit].forEach(function(key) { 
				items[key] = item[key]; 
			});
			array.push(items);		//[credit]);
		
		});
	});
	return array;
};

function build_url(parm,callback) {
	var url = "";
	var base_url = "https://api.themoviedb.org/3/";
	var api_key = "?api_key=85f46422f0a81eaf88cddf44c041b5d3";
	switch (parm[0]) {
		case 1 :
			url = base_url + 'search/' + parm[1] + api_key + '&query=' + parm[2];
			break;
		case  "movie":
			url = base_url + "movie" + '/' + parm[1] + api_key + '&append_to_response=credits';
			break;
		case "person" :
			url = base_url + "person" + '/' + parm[1] + '/movie_credits' + api_key;
			break;
		case "images"	:
			url = base_url + "person" + '/' + parm[1] + '/' + parm[0] + api_key;
		case "genre"	:
			url = base_url + "genre" + '/' + 'movie' + '/' + 'list' + api_key;			
			break;
		default:
			console.log("default");		
			url = base_url + parm + api_key;
	}
	url = encodeURI(url);
	get_tmdb(url,callback);
}

function get_tmdb(url,callback) {
//	console.log(url);
	var xhr = new XMLHttpRequest();
//	xhr.withCredentials = true;
	xhr.onreadystatechange = function () {
//		console.log(this.readyState + " " + this.status)
		if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
			var headers = xhr.getAllResponseHeaders();
			console.log(headers)
			callback(JSON.parse(this.responseText));
		}
	};
	xhr.onerror = function(err) {
		console.log("Error: " + err);
	}
	xhr.open("GET", url, true);	
	xhr.send();		
}

function gettmdbx(searchstring) {
	var base_url = "https://api.themoviedb.org/3/";
	var api_key = "?api_key=85f46422f0a81eaf88cddf44c041b5d3";
	var url = base_url + "search/person" + api_key +
			"&query=" + searchstring[1]	;
//	var queryURL = "https://jsonplaceholder.typicode.com/users";
	fetch(encodeURI(url))
		.then(function(response) {
				// response is a json string,
				// convert it to a pure JavaScript object
		return response.json();
		})
	
		.then(function(results) {
				// users is a JavaScript object here
			//displayUsersAsATable(users)
			console.log(results.results[0].id);
//			return results;
		})
		.catch(function(error) {
		console.log('Error during fetch: ' + error.message);
		})
}


