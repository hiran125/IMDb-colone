//  API key

const API_KEY = '506cd01f'; 

function showHomePage() {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '<h2>Popular Movies</h2>';
  
  // API request to fetch popular movies:
  
  fetch(`https://www.omdbapi.com/?s=popular&type=movie&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search;
        const movieList = document.createElement('ul');
        
        movies.forEach(movie => {
          const li = createMovieListItem(movie);
          movieList.appendChild(li);
        });
        
        contentDiv.appendChild(movieList);
      } else {
        contentDiv.innerHTML = '<p>No popular movies found.</p>';
      }
    })
    .catch(error => {
      console.log('Error:', error);
      contentDiv.innerHTML = '<p>An error occurred while fetching popular movies.</p>';
    });
}

function searchMovies() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();
  
  if (query === '') {
    alert('Please enter a movie name to search.');
    return;
  }
  
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = `<h2>Search Results for "${query}"</h2>`;
  
  // API request to search movies:

  fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search;
        const movieList = document.createElement('ul');
        
        movies.forEach(movie => {
          const li = createMovieListItem(movie);
          movieList.appendChild(li);
        });
        
        contentDiv.appendChild(movieList);
      } else {
        contentDiv.innerHTML = `<p>No movies found for "${query}".</p>`;
      }
    })
    .catch(error => {
      console.log('Error:', error);
      contentDiv.innerHTML = '<p>An error occurred while searching movies.</p>';
    });
}

function showFavorites() {
  const contentDiv = document.getElementById('content');
  
  // Retrieve favorite movies from local storage:
  
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (favorites.length > 0) {
    contentDiv.innerHTML = '<h2>My Favorite Movies</h2>';
    const movieList = document.createElement('ul');
    
    favorites.forEach(movie => {
      const li = createMovieListItem(movie);
      const removeBtn = createRemoveButton(movie.imdbID);
      li.appendChild(removeBtn);
      movieList.appendChild(li);
    });
    
    contentDiv.appendChild(movieList);
  } else {
    contentDiv.innerHTML = '<p>No favorite movies found.</p>';
  }
}

function createMovieListItem(movie) {
  const li = document.createElement('li');
  li.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title} Poster">
    <h3>${movie.Title}</h3>
    <p>${movie.Year}</p>
  `;
  
  const favoriteBtn = createFavoriteButton(movie.imdbID);
  li.appendChild(favoriteBtn);
  
  return li;
}

function createFavoriteButton(imdbID) {
  const btn = document.createElement('button');
  btn.innerText = 'Add to Favorites';
  
  // Check if the movie is already favorited:

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFavorited = favorites.some(movie => movie.imdbID === imdbID);
  
  if (isFavorited) {
    btn.classList.add('active');
    btn.innerText = 'Favorited';
    btn.disabled = true;
  }
  
  btn.addEventListener('click', () => {

    // Retrieve favorite movies from local storage

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Find the selected movie in the favorites list

    const selectedMovie = favorites.find(movie => movie.imdbID === imdbID);
    
    if (selectedMovie) {
      alert('This movie is already in your favorites.');
      return;
    }
    
    // API request to fetch the movie details:

    fetch(`https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.Response === 'True') {

          // Add the movie to favorites

          favorites.push(data);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          
          btn.classList.add('active');
          btn.innerText = 'Favorited';
          btn.disabled = true;
        } else {
          alert('Failed to add the movie to favorites. Please try again.');
        }
      })
      .catch(error => {
        console.log('Error:', error);
        alert('An error occurred while fetching movie details.');
      });
  });
  
  return btn;
}

function createRemoveButton(imdbID) {
  const btn = document.createElement('button');
  btn.innerText = 'Remove from Favorites';
  
  btn.addEventListener('click', () => {

    // Retrieve favorite movies from local storage

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Remove the movie from favorites
    
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    showFavorites();
  });
  
  return btn;
}

showHomePage();
