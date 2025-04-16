let containerWidth = 0;
const URL =  `https://my-json-server.typicode.com/NastyaGolovina/CrosswordDB/crosswords`;
const crosswordContainer = document.getElementById('crosswordContainer');
const wrapper = document.querySelector('.wrapper');

 function createDataEl(el,num) {
     el.dataset.id = `${num}`;
     el.dataset.type = 'clicked';
 }

function createCrosswordContainer(URL, text, num) {
    const divEl = document.createElement('div');
    const divElImg = document.createElement('div');
    const divElInfo = document.createElement('div');
    const h2El = document.createElement('h2');
    createDataEl(divElImg,num);
    createDataEl(divElInfo,num);
    createDataEl(h2El,num);
    divElImg.innerHTML = `  <img data-id="${num}" data-type="clicked" src="${URL}" alt="${text}-icon" width="400">`;
    h2El.innerText = text;
    divEl.className = 'divEl';
    divElInfo.className = 'divElInfo';
    divElImg.className = 'divElImg';

    divElInfo.append(h2El);
    divEl.append(divElImg);
    divEl.append(divElInfo);
    crosswordContainer.append(divEl);
}
const request = fetch(URL);
request
    .then((response) => {
        return response.json();

    })
    .then((result) => {
        console.log(result);
        for (let i = 0; i < result.length ; i++) {
            createCrosswordContainer(result[i].image, result[i].name, i);
            containerWidth = containerWidth + 400;
        }
        wrapper.style.gridTemplateRows = ` 200 ${containerWidth}`;
    });


document.addEventListener('click' , event => {

    if (event.target.dataset.type === 'clicked') {
        let id = event.target.dataset.id;
        // console.log(g)
        localStorage.setItem('keyToTheCrossword', id);
        window.location.href = 'crossword.html';

    }

})
