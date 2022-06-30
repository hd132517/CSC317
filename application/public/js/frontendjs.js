function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - .05;
            flashMessageElement.style.opacity = currentOpacity;
        },50);
    }, 4000);
}

function addFlashFromFrontEnd(message) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', 'alert alert-info');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

let flashElement = document.getElementById('flash-message');
if (flashElement) setFlashMessageFadeOut(flashElement);

//M4

function createCard(data) {
    return `<div id="post-${data.id}" class="card">
                <img class="card-image" src="${data.thumbnail}">
                <div class="card-body">
                    <h2 class="card-title">${data.title}</h2>
                    <p class="card-text">${data.description}</p>
                    <a href="/post/${data.id}" class="anchor-buttons" style="text-decoration:none; color: #ffffff;">more..</a>
                </div>
            </div>`;
}

function executeSearch() {
    let searchTerm = document.getElementById("search").value;
    if (!searchTerm){
        return;
    }
    let mainContent = document.getElementById('main-content');
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((data) => {
            return data.json();
        })
        .then((data_json) => {
            let newMainContentHTML = '';
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
            if (data_json.message) addFlashFromFrontEnd(data_json.message);
        })
        .catch((err) => console.log(err));
}

window.onload = function () {
    let searchButton = document.getElementById("searchButton"); 
    if (searchButton) searchButton.onclick = executeSearch;
}