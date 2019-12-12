
const year = '2019';
let movieID = '';
const container = document.querySelector('.container');
const movieYear = document.querySelector('.movie_year');

function init(year) {
  getMovies(year)
    .then(movies => buildContent(movies))
    .catch(err => console.log(err));
}

async function getMovies(year) {
  const movies = [];
  
  for (let i = 1; i < 4; i++) {
    let fetchUrl

    if (window.location.host === '127.0.0.1:5500') {
      fetchUrl = `http://localhost:9000/getMovies?page=${i}&primary_release_year=${year}`;
    } else {
      fetchUrl = `/.netlify/functions/getMovies?page=${i}&primary_release_year=${year}`;
    }
    console.log(window.location.host);
    console.log(fetchUrl);
  const response = await axios.get(fetchUrl);
  const { results } = response.data;
  results.forEach(item => {
    movies.push(item);
  });
}
  
  movies.splice(50, 10);
  return movies;
}

function buildContent(movies) {
  const image_baseurl = 'https://image.tmdb.org/t/p/';
  const poster_size = 'w154';
  const html = movies
    .map(movie => {
      const date = moment(movie.release_date, 'YYYY/MM/DD').format('LL');
      const htmlString = `
				<div class="card">
					<div class="movie__info">
						<img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="${movie.original_title}">
						<ul id='info'>
							<li>${date}</li>
							<li id='moreInfo' data-movie-id="${movie.id}"><a href="./movie_details.html?movieID=${movie.id}">More Info</a></li>
						</ul>
					</div>
					<div class="movie__description">
						<h5>${movie.title}</h5>
						<p>${movie.overview}</p>
					</div>
				</div>`;
      return htmlString;
    })
    .join('');
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', init(year));

// document.addEventListener('click', e => {
//   if (e.target && e.target.id === 'moreInfo') {
//     movieID = e.target.getAttribute('data-movie-id');
//     localStorage.setItem('id', movieID);
//     window.location.href = './movie_details.html';
//   }
// });

movieYear.addEventListener('click', e => {
  const { target } = e;
  if (target.tagName === 'LI') {
    const activeElement = movieYear.querySelector('.active');
    if (activeElement) {
      activeElement.classList.remove('active');
    }
    if (activeElement !== target) {
      target.classList.add('active');
      targetYear = target.innerHTML;
      init(targetYear);
    }
  }
});
