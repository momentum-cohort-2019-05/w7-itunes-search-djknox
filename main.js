// https://itunes.apple.com/search?term=jack+johnson

const searchBar = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');
const resultsDisplay = document.querySelector('#resultsDisplay');
const resultPreview = document.querySelector('#resultPreview');
const resultPreviewImg = document.querySelector('#resultPreviewImg');
const resultPreviewAudio = document.querySelector('#resultPreviewAudio');
const resultPreviewDescription = document.querySelector('#resultPreviewDescription');
const results = document.querySelectorAll('.result');

searchButton.addEventListener('click', function () {
    let fullUrl = createFullUrl();
    fetch(fullUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            addResultsToDisplay(response.results);
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

function clearResultsDisplay() {
    resultsDisplay.innerHTML = '';
}

function addClickEventListenerToResult(resultDiv) {
    resultDiv.addEventListener('click', function () {
        // add img url for artwork
        resultPreviewImg.src = resultDiv.querySelector('img[class=result-img]').src;
        resultPreviewImg.removeAttribute('hidden');

        // add preview url to audio tag
        resultPreviewAudio.src = resultDiv.querySelector('a[class=result-preview-url]').href;
        resultPreviewAudio.autoplay = true;

        // add description
        resultPreviewDescription.innerText = resultDiv.querySelector('p').innerText;
        resultPreviewDescription.removeAttribute('hidden');

    });
}

function addResultsToDisplay(results) {
    clearResultsDisplay();
    
    for (let result of results) {
        // create div to hold result
        let resultDiv = document.createElement('div');
        resultDiv.classList += 'result';

        // create img for artwork
        let resultImg = document.createElement('img');
        resultImg.classList += 'result-img';
        resultImg.src = result.artworkUrl100;
        resultImg.alt = `${result.artistName} - ${result.trackName}`;
        resultDiv.appendChild(resultImg);

        // create p for description
        let resultDescription = document.createElement('p');
        resultDescription.innerText = `${result.artistName} - ${result.trackName}`;
        resultDiv.appendChild(resultDescription);

        // create hidden anchor for preview url
        let resultPreviewUrl = document.createElement('a');
        resultPreviewUrl.setAttribute('hidden', 'true');
        resultPreviewUrl.classList += 'result-preview-url';
        resultPreviewUrl.innerText = 'Preview Link';
        resultPreviewUrl.href = result.previewUrl;
        resultDiv.appendChild(resultPreviewUrl);

        addClickEventListenerToResult(resultDiv);
        resultsDisplay.appendChild(resultDiv);
    }
}