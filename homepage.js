$( document ).ready(function() {
    let movieId = getUrlParameter("movieId");
    let actorId = getUrlParameter("actorId");

    if(movieId !== ""){
        GetData(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=240e4a336a98f4efe1e90ba698f529cd`, "movieDetails", 'movie-details');
    }

    if(actorId !== ""){
        GetData(`https://api.themoviedb.org/3/person/${actorId}?language=en-US&api_key=240e4a336a98f4efe1e90ba698f529cd`, "actorDetails", 'actor-details');
    }


    if(movieId === "" || movieId === undefined && actorId === "" || actorId === undefined ){
        GetData("https://api.themoviedb.org/3/movie/upcoming?page=1&language=en-US&api_key=240e4a336a98f4efe1e90ba698f529cd", "homepage", "upcoming");
        GetData("https://api.themoviedb.org/3/movie/top_rated?page=1&language=en-US&api_key=240e4a336a98f4efe1e90ba698f529cd", "homepage", "top-rated");
    }

});


function GetData ( url, page, sectionName ){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {},
        "data": "{}"
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);

        switch(page){
            case "homepage":
                createSection(response, sectionName);
            
            break;
            case "movieDetails" :
                displayMovieDetails(response, sectionName);
            
            break;
            case "actorDetails" :
                displayActorDetails(response, sectionName);

            break;
            default: 
                createSection(response, sectionName);
            break;
        }
    });
}// Done

function getActorsInMovie(movieId, sectionName){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=a6179a8970a83ddb7877c97b48c5ec4c`,
        "method": "GET",
        "headers": {},
        "data": "{}"
    }
    
    $.ajax(settings).done(function (response) {
        displayActors(response, sectionName)
    });
}// Done

function displayActors(data, sectionName){
    let container = $(`#${sectionName}`);
    let actors = data.cast;
    
    container.innerHTML = "";
    for(let i = 0; i < 1; i++){
        let actorImg = document.createElement('a');
        actorImg.setAttribute('href', `actor-details.html?actorId=${actors[i].id}`);
        actorImg.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${actors[i].profile_path}"/>`;

    
        container.append(actorImg);
    }
}

function createSection(data, sectionName){
    
    switch(sectionName){
        case "upcoming":
            createCarousel(data);
        break;

        case "top-rated" :
            createTopRated(data);
        break;
    }

} // Done

function displayMovieDetails(data, sectionName){
    let container = $('#movie-details-container');
    
    let movieDetailsHeader = document.createElement('div');
    movieDetailsHeader.setAttribute('style', `height:550px; background-image: url("https://image.tmdb.org/t/p/w500/${data.backdrop_path}");`)
    movieDetailsHeader.innerHTML = `<h1>${data.original_title}</h1>`;

    let movieData = document.createElement('div');
    movieData.setAttribute('style', 'padding:50px;')
    movieData.innerHTML = `<p><strong>Tagline: </strong>${data.tagline}</p><p><strong>Overview: </strong>${data.overview}</p><p><strong>Language:</strong> ${data.original_language}</p> <p><strong>Adult Film:</strong> ${data.adult}</p><p><strong>Budget:</strong> ${data.budget}</p> <p><strong>Vote Average:</strong> ${data.vote_average}</p>`


    container.append(movieDetailsHeader, movieData)
}

function displayActorDetails(data, sectionName){
    let container = $('#actor-details-container');
    
    let actorDetailsHeader = document.createElement('div');
    actorDetailsHeader.setAttribute('style', `height:550px; background-image: url("https://image.tmdb.org/t/p/w500/${data.profile_path}");`)
    actorDetailsHeader.innerHTML = `<h1>${data.name}</h1>`;

    let actorData = document.createElement('div');
    actorData.setAttribute('style', 'padding:50px;')
    actorData.innerHTML = `<p><strong>Name: </strong>${data.name}</p><p><strong>Biography: </strong>${data.biography}</p><p><strong>Birthday:</strong> ${data.birthday}</p> <p><strong>POB:</strong> ${data.place_of_birth}</p>`


    container.append(actorDetailsHeader, actorData)
}

function createCarousel(data){
    let counter = 1;
    let carouselContainer = $(".carousel-inner");
    
    let movies = data.results;
    
    for(let i = 0; i < movies.length; i++){
        let carouselItem = document.createElement("div");

        getActorsInMovie(movies[i].id, 'actors-list');

        if(counter === 1){
            carouselItem.setAttribute('class', 'carousel-item active');
        } else {
            carouselItem.setAttribute('class', 'carousel-item');

        }

        if(movies[i].backdrop_path !== null){
            // <img class="d-block w-100" src="" alt="slide"/>
            carouselItem.innerHTML = `<div class="d-block w-100 carousel_Item" style="height: 600px; background-image: url('https://image.tmdb.org/t/p/w500/${movies[i].backdrop_path}'); background-size: cover; "><div class="carousel_text"><h3>${movies[i].title}</h3> <p>${movies[i].overview}</p> <a href="movie-details.html?movieId=${movies[i].id}">View Details</a></div></div>`;
            
        } else {
            carouselItem.innerHTML = `<img class="d-block w-100" src="https://image.tmdb.org/t/p/w500/${movies[i].poster_path}" alt="slide"/>`;

        }


        
        carouselContainer.append(carouselItem);
        counter++;
    }
} // Done

function createTopRated(data){
    let movies = data.results;
    let counter = 0;
    
    for(let i = 0; i < movies.length; i++){
        if(counter < 10){
            let poster = document.createElement("div");
            let topRatedContainer = $("#top-rated");

            poster.innerHTML = `<div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${movies[i].title}</h5>
                    <p class="card-text">${movies[i].overview}</p>
                    <a href="file:///Users/trinitysiemer/Documents/Academy%20-%20tx-aus-190128/Amy's%20Code/movie-db/movie-details.html?movieId=${movies[i].id}" class="card-link">More Info</a>
                </div>
            </div> `;


            topRatedContainer.append(poster);
        } else {
            console.log("Over 10..")
        }

        counter++;
    }
} // Done

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};