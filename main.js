// parse url query parameters
var urlParams;
(window.onpopstate = function() {
    var match,
        pl = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);
    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();

// update UI
for (var param in urlParams) {
    $(`[value="${urlParams[param]}"]`).attr('selected', true);
}

var GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    10769: "Foreign",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

var IMAGE_URL = 'http://image.tmdb.org/t/p/w500';
var API_URL = 'https://api.themoviedb.org/3'
var API_KEY = 'e7daa04756450d99beb62cb1339a0566'
var url = window.location.href;
var queryString = url.substring(url.indexOf('?') + 1);
var monthAgo = moment().subtract(1, 'months').format("YYYY-MM-DD");
var today = moment().format("YYYY-MM-DD");
var apiUrl = `${API_URL}/discover/movie?${queryString}&vote_count.gte=10&api_key=${API_KEY}`;

$.ajax({
    url: apiUrl,
    dataType: 'json'
}).then(function(res) {
    res.results.forEach(function(result) {
        var genreListing = "";
        result.genre_ids.forEach(function(id) {
            genreListing += genreListing ? ', ' : '';
            genreListing += GENRES[id] ? GENRES[id] : '';
        });
        $("#movies").append(`
            <div class="card horizontal">
                <div class="card-image">
                    <img src="${IMAGE_URL + result.poster_path}" style="height: 250px">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <h5>${result.title}</h5>
                        <p class="detail-group">
                            <span class="detail">${moment(result.release_date).format('LL')}</span> 
                        </p>
                        <p class="detail-group">
                            <i>${genreListing}</i> 
                        </p>
                        <p class="detail-group">
                            <span class="detail">
                                <i class="material-icons tooltipped star" data-position="top" data-delay="50" data-tooltip="Vote average">star</i> ${result.vote_average}
                            </span>
                            <span class="detail">Votes: ${result.vote_count}</span>
                            <span class="detail">
                                <i class="material-icons tooltipped" data-position="top" data-delay="50" data-tooltip="Popularity">trending_up</i> ${result.popularity.toFixed(2)}
                            </span> 
                        </p>
                        <p>${result.overview}</p>
                    </div>
                </div>
            </div>`);
    });
    $('.tooltipped').tooltip({
        delay: 50
    });
});