
function openMenu () {
  document.body.classList += " menu--open"
}

function closeMenu () {
document.body.classList.remove('menu--open')
}


const searchTerm = "";

   const moviesListEl = document.querySelector(".movies__list")
const searchInput = document.getElementById("search__input")
const searchBtn = document.getElementById("search__btn")
const results = document.getElementById("results")


  const defaultMovies = [
    "Toy Story",
    "Iron Man",
    "Home Alone",
    "Batman",
    "The Notebook",
    "Inception",
    "Mission: Impossible - The Final Reckoning",
    "Oppenheimer",
    "Titanic",
    "Star Wars:A New Hope",
    "The Matrix",
    "Frozen",
  ];

  async function fetchMovies(searchTerm) {
const res = await fetch (`https://omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=80515a25`)
const data = await res.json()
return data
}



function movieHTML(movie) {
  return `<div class="movie" onclick="showMovieDetails('${movie.imdbID}')">
     <div class="movie__poster">
    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}"/>
    </div>
    <div class="movie__info">
        <h3 class="movie__title">${movie.Title}</h3>
        <p class="movie__year">${movie.Year}</p>
    </div>
    </div>`;
}


async function showRandomMovies() {
   
    moviesListEl.innerHTML = `<div class="movies__loading"><i class="fas fa-spinner"></i></div>`

    // pick 3 random titles from defaultMovies//
    const shuffled = [...defaultMovies].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0,5)

    let allMovies = []

    for (const title of selected) {
        const data = await fetchMovies(title)

    if (data.Response === "True" && Array.isArray(data.Search)) {
        allMovies = allMovies.concat(data.Search.slice(0,3))
    }
    }

    // Remove Duplicates

    const uniqueMovies =allMovies.filter(
        (movie, index, self) => index === self.findIndex((m) => m.imdbID === movie.imdbID)
    )

    // Display them with limit of 9 movies

  const limitedMovies = uniqueMovies.slice(0, 9);

  moviesListEl.innerHTML = limitedMovies.length > 0 
  ? limitedMovies.map(movie => movieHTML (movie)).join("") 
  : "<p>Couldn't load random movies.<p>"
}

// Hide movies when user starts typing

async function SearchInput (event) {
    const term = event.target.value.trim()

    if (term === "") {
      return  showRandomMovies()

    }

    moviesListEl.innerHTML = "<p>Searching...</p>"
    
    const data = await fetchMovies(term);
    if (data.Response === "True") {
      moviesListEl.innerHTML = data.Search.map(movie => movieHTML(movie)).join("");
    } else {
      moviesListEl.innerHTML = `<p>No movies found for "${term}"</p>`;
    }
  
}

function showResults(query){
    const moviesResult = defaultMovies.filter(movie =>
        movie.toLowerCase().includes(query.toLowerCase())
    );

    if (moviesResult.length === 0) {
        results.innerHTML = "<p>No Results Found</p>";
    } else {
        results.innerHTML = moviesResult.map(movie => `<p>${movie}</p>`).join("");
    }
}


// OPEN MOVIE MODAL

async function showMovieDetails(imdbID) {


    const modal = document.getElementById("movieModal")
    const modalDetails = document.getElementById("modalDetails")
        const closeModal = document.querySelector (".close__modal")

 
    document.body.classList.add("modal-open")

    modal.classList.add("show")

    modalDetails.innerHTML = `<div class="movies__loader"></div>`

    try{
    const res = await fetch(`https://omdbapi.com/?i=${imdbID}&apikey=80515a25`)
    const movie = await res.json()

    modalDetails.innerHTML =
    `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}"/>
    <div class="modal__info">
    <h2>${movie.Title} (${movie.Year})</h2>
    <p><strong>Rating:</strong> ${movie.Rated}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    </div>
    `

    //   CLOSE MOVIE MODAL



  const close = () => {
    modal.classList.remove("show")
    document.body.classList.remove("modal-open")
  }  
  
   closeModal.onclick = close;

    // close when clicking outside content as well

  modal.onclick = (e) => {
    if (e.target === modal) close();
  }


    }

     catch (e) {
    modalDetails.innerHTML = "<p>Couldn't load details.</p>";
  }

}





document.addEventListener("DOMContentLoaded", showRandomMovies)
searchInput.addEventListener("input", SearchInput)
searchBtn.addEventListener('click', SearchInput)
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        SearchInput(e)}
    })




