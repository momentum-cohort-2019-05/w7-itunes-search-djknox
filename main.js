// https://itunes.apple.com/search?term=jack+johnson
// TODO:
// (?) add event delegation rather than adding event listeners to each result's div
// (?) return api results into an object and create the html elements outside of fetch()

const searchBar = document.querySelector('#searchBar');
const searchButton = document.querySelector('#searchButton');
const resultsDescription = document.querySelector('#resultsDescription');
const resultsDisplay = document.querySelector('#resultsDisplay');
const resultPreview = document.querySelector('#resultPreview');
const resultPreviewImg = document.querySelector('#resultPreviewImg');
const resultPreviewAudio = document.querySelector('#resultPreviewAudio');
const resultPreviewDescription = document.querySelector('#resultPreviewDescription');
let resultAttribute = document.querySelector('#searchAttributeSelection');
let resultLimit = document.querySelector('#searchLimitSelection');
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
        })
        .catch(function(error) {
            console.log('Request failed', error);
        });
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

        // create p for artist name and track title
        let resultDescription = document.createElement('p');
        resultDescription.innerText += result.artistName;
        resultDescription.innerText += ' - ';
        resultDescription.innerText += result.trackName;
        resultDiv.appendChild(resultDescription);

        // create p for album title
        let resultAlbum = document.createElement('p');
        resultAlbum.innerText += result.collectionName;
        resultDiv.appendChild(resultAlbum);

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