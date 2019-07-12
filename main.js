// https://itunes.apple.com/search?term=jack+johnson
// TODO:
// (?) return api results into an object and create the html elements outside of fetch()
// add 'Enter' key functionality:
//      can put searchBar + searchButton inside a form and preventDefault form submission

const searchBar = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');
const resultsDescription = document.querySelector('#resultsDescription');
const resultsDisplay = document.querySelector('#resultsDisplay');
const resultPreview = document.querySelector('#resultPreview');
const resultPreviewImg = document.querySelector('#resultPreviewImg');
const resultPreviewAudio = document.querySelector('#resultPreviewAudio');
const resultPreviewDescription = document.querySelector('#resultPreviewDescription');
const resultAttribute = document.querySelector('#searchAttributeSelection');
const resultLimit = document.querySelector('#searchLimitSelection');
const results = document.querySelectorAll('.result');

searchButton.addEventListener('click', function () {
    let fullUrl = createFullUrl();
    fetch(fullUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            resultsDescription.innerText = `Found ${response.resultCount} results.`;
            resultsDescription.removeAttribute('hidden');

            addResultsToDisplay(response.results);
            resultsDescription.scrollIntoView();
        })
        .catch(function(error) {
            console.log('Request failed', error);
        });
});

resultsDisplay.addEventListener('click', function (event) {
    // if event.target is a child of div class="result", set targetResultDiv to the parent div
    // else, set targetResultDiv to event.target
    let targetResultDiv;
    if (event.target.matches('div.result')) {
        targetResultDiv = event.target;
    }
    else if (event.target.closest('div.result')) {
        targetResultDiv = event.target.parentElement;
    }

    // if event.target is div class="result" or if event.target is a child of div class="result"
    // then add things to resultPreview elements
    if (event.target.matches('div.result') || event.target.closest('div.result')) {
        // add img url for artwork
        resultPreviewImg.src = targetResultDiv.querySelector('img[class=result-img]').src;
        resultPreviewImg.removeAttribute('hidden');

        // add preview url to audio tag
        resultPreviewAudio.src = targetResultDiv.dataset.previewUrl;
        resultPreviewAudio.autoplay = true;

        // add description
        resultPreviewDescription.innerText = targetResultDiv.querySelector('div[class=result-description]').innerText;
        resultPreviewDescription.removeAttribute('hidden');
    }

});

function createFullUrl() {
    let term = `term=${encodeURIComponent(searchBar.value)}`;
    let media = 'media=music';
    let entity = 'entity=song';
    let attribute = `attribute=${getCheckedAttributeRadioButtonValue()}`;
    let limit = `limit=${getSelectedLimitValue()}`;
    return `https://itunes-api-proxy.glitch.me/search?${term}&${media}&${entity}&${attribute}&${limit}`;
}

function getCheckedAttributeRadioButtonValue() {
    let attributeRadioButtons = resultAttribute.querySelectorAll('input[type=radio]');
    for (let radioButton of attributeRadioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
}

function getSelectedLimitValue() {
    return resultLimit.options[resultLimit.selectedIndex].value;
}

function clearResultsDisplay() {
    resultsDisplay.innerHTML = '';
}

// addClickEventListener() is not being used anymore.
// instead, event delegation is being used with a single click listener on #resultsDisplay
/*
function addClickEventListenerToResult(resultDiv) {
    resultDiv.addEventListener('click', function () {
        // add img url for artwork
        resultPreviewImg.src = resultDiv.querySelector('img[class=result-img]').src;
        resultPreviewImg.removeAttribute('hidden');

        // add preview url to audio tag
        resultPreviewAudio.src = resultDiv.dataset.previewUrl;
        resultPreviewAudio.autoplay = true;

        // add description
        resultPreviewDescription.innerText = resultDiv.querySelector('p').innerText;
        resultPreviewDescription.removeAttribute('hidden');

    });
}
*/

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

        //create div for result description
        let resultDescription = document.createElement('div');
        resultDescription.classList += 'result-description';

        // create p for artist name and track title
        let resultArtistAndTrack = document.createElement('p');
        resultArtistAndTrack.innerText += result.artistName;
        resultArtistAndTrack.innerText += ' - ';
        resultArtistAndTrack.innerText += result.trackName;
        resultDescription.appendChild(resultArtistAndTrack);

        // create p for album title
        let resultAlbum = document.createElement('p');
        resultAlbum.innerText += result.collectionName;
        resultDescription.appendChild(resultAlbum);
        resultDiv.appendChild(resultDescription);

        // create data attribute for preview url
        resultDiv.setAttribute('data-preview-url', result.previewUrl);

        // addClickEventListener() replaced by #resultsDisplay event delegation
        // addClickEventListenerToResult(resultDiv);
        resultsDisplay.appendChild(resultDiv);
    }
}