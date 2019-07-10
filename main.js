// https://itunes.apple.com/search?term=jack+johnson

const searchBar = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');
const resultsDisplay = document.querySelector('#resultsDisplay');

searchButton.addEventListener('click', function () {
    let fullUrl = createFullUrl();
    fetch(fullUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            for (let result of response.results) {
                addResultToResultsDisplay(result);
            }
        })
        .catch(function(error) {
            console.log('Request failed', error)
        });
});

function replaceSpacesWithPlusSigns(string) {
    return string.replace(/ /g, '+');
}

function createFullUrl() {
    let searchQuery = replaceSpacesWithPlusSigns(searchBar.value);
    return `https://itunes-api-proxy.glitch.me/search?term=${searchQuery}`;
}

function addResultToResultsDisplay(result) {
    let resultDiv = document.createElement("div");
    resultDiv.innerText = result.trackName;
    resultsDisplay.appendChild(resultDiv);
}