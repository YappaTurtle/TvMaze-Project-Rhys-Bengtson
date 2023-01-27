// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload

//Variable Declarations
let lightBoxOn = false;

// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<div>";
   for (g in genres) {
      output += "<p>" + genres[g] + "</p>"; 
   } // for       
   output += "</div>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
      elemDiv.classList.add("showDiv");
    var elemImage = document.createElement("img");
      elemImage.classList.add("showImage");
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
      elemGenre.classList.add("showGenre");
    var elemRating = document.createElement("div");
      elemRating.classList.add("showRating");
    var elemSummary = document.createElement("div");
      elemSummary.classList.add("showSummary");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    elemSummary.innerHTML = tvshowJSON.show.summary;
  
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);
    elemDiv.appendChild(elemImage);
    elemDiv.appendChild(elemRating);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemSummary);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
      elemEpisodes.classList.add("showEpisodes");
    var output = "<div id=episodeList>";
    for (episode in data) {
        output += "<p><button onclick='fetchEpisodeInfo(" + data[episode].id + ")' class='episodes'>" + data[episode].season + "." + data[episode].number + " " + data[episode].name + "</button>" + "</p>";
    }
    output += "</div>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes
function fetchEpisodeInfo(episodeId){
  lightBoxOn = true;

  fetch('http://api.tvmaze.com/episodes/' + episodeId)  
 .then(response => response.json())
 .then(data => showLightBox(data));
}

// open lightbox and fetch episode info
function showLightBox(data){
    document.getElementById("lightbox").style.display = "block";
     if(lightBoxOn = true && data.image != null){
      document.getElementById("message").innerHTML = "<img src=" + data.image.medium + ">" + "<br>" + data.name + "<br>" + "Season " + data.season + "<br>" + "Episode " + data.number + "<br>" + data.runtime + "m" + "<br>" + data.summary;
    }
    else{
      document.getElementById("message").innerHTML = data.image + "<br>" + data.name + "<br>" + "Season " + data.season + "<br>" + "Episode " + data.number + "<br>" + data.runtime + "m" + "<br>" + data.summary;
    }
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
     lightBoxOn = false;
 } // closeLightBox 

 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}





