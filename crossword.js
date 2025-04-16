const crosswordContainer = document.getElementById('crossword-container');
const horizontally = document.getElementById('horizontally');
const vertically = document.getElementById('vertically');
const buttonCheck = document.getElementById('buttonCheck');
const buttonClear = document.getElementById('buttonClear');

let clickCell;
let scrollCoordinates;

let wordCoordinates = {};
let answers = [];
let questionNumber;
let enteredWord ;

let squareY = 0 ;
let squareX = 0;
// let num = 1;

const URL =  `https://my-json-server.typicode.com/NastyaGolovina/CrosswordDB/crosswords`;

let crosswordKey =  localStorage.getItem('keyToTheCrossword');

function math() {
    if (squareX === 40) {
        squareX = 0;
        squareY = squareY + 1;
    }

}
for (let i = 0 ; i < 1240 ; i++) {
    const square = document.createElement('div');
    // square.innerHTML = num ;
    square.className = 'square';
    crosswordContainer.append(square);
    // num = num + 1;
    math()
    square.id =`x${squareX}y${squareY}`;
    squareX = squareX + 1;
}

function createQuestion(num ,id , q , orientation)  {
    let direction;
    if(orientation === 'H') {
        direction = horizontally;
    } else {
        direction = vertically;
    }
    const pEl = document.createElement('p')
    pEl.innerHTML = `${num}. ${q}`;
    pEl.id = id;
    pEl.dataset.questionNumber = id;
    pEl.dataset.cellType = 'clicked';
    pEl.className = 'question';
    direction.append(pEl);
}

function createCell(id , qNum) {
    const divEl = document.getElementById(`${id}`);
    const inputEl = `<input type="text" maxlength="1" class="cell" data-cell-type="clicked" data-question-number="${qNum}">`;
    if(divEl.hasChildNodes() === false) {
        divEl.innerHTML = inputEl;
    }
}
function cellFilling(orientation, x ,y ,word, key) {
    let xPos = x;
    let yPos = y;
    let arrCoordinates = [];
    // let key = `${qNum}`;
    for (let j = 0; j < word.length; j++) {
        let divId = `x${xPos}y${yPos}`;
        createCell(divId , key);
        let newArr = [divId,word[j],word[j].toUpperCase()];
        answers.push(newArr);
        arrCoordinates.push(divId);
        if(orientation === 'H') {
            xPos = xPos + 1;
        } else {
            yPos = yPos + 1;
        }
    }
    wordCoordinates[`${key}`] = arrCoordinates;
}
function creatingMiniQuestionNumber(xPos,yPos,num) {
    const divEL = document.getElementById(  `x${xPos}y${yPos}`);
    const pEl = document.createElement('p');
    pEl.innerText = `${num}`;
    pEl.className = 'mini-number';
    divEL.append(pEl);
}

if (crosswordKey !== null) {
    const request = fetch(URL);
    request
        .then((response) => {
            return response.json();

        })
        .then((result) => {
            console.log(result);
            for (let i = 0 ; i < result[crosswordKey].content.length; i++) {
                let questionInfo = result[crosswordKey].content[i];
                let questionNum = `question-${result[crosswordKey].content[i].id}`;
                createQuestion(questionInfo.id ,questionNum , questionInfo.question ,questionInfo.orientation);
                cellFilling(questionInfo.orientation, questionInfo.X , questionInfo.Y,questionInfo.word, questionNum);
                creatingMiniQuestionNumber(questionInfo.X , questionInfo.Y,questionInfo.id);
                document.getElementById('title').innerText = result[crosswordKey].name;
            }
        });
}


console.log(wordCoordinates);
console.log(answers);

function check() {
    answers.forEach((a) => {
       let divEl = document.getElementById(`${a[0]}`);
       let childDivEl = divEl.firstChild;
       let childDivElValue = childDivEl.value;
       if (childDivElValue === a[1] || childDivElValue === a[2]) {
           childDivEl.className = 'right';
       } else {
           childDivEl.className = 'wrong';
       }
    }
    )
    buttonClear.className = '';
}

function clear() {
    answers.forEach((a) => {
        let divEl = document.getElementById(`${a[0]}`);
        let childDivEl = divEl.firstChild;
        childDivEl.className = 'cell';
    })
    buttonClear.className = 'hidden';
}

function cellStyle(qNum,styleP, styleInput) {
    document.getElementById(qNum).className =styleP;
    const arr = wordCoordinates[`${qNum}`];
    arr.forEach((e) => {
        let divEl = document.getElementById(`${e}`)
        let childDivEl = divEl.firstChild;
        childDivEl.className = styleInput;
    })
}

function cursorMovement(k,n) {
    let x;
    let y;
    if (clickCell !== undefined && questionNumber !== undefined) {
        switch (clickCell.length)
        {
            case 4 :
                x = clickCell[1];
                y = clickCell[3];
                break;
            case 6 :
                x = `${clickCell[1]}${clickCell[2]}`;
                y = `${clickCell[4]}${clickCell[5]}`;
                break;
            case 5 :
                if ( clickCell[2] === 'y') {
                    x = clickCell[1];
                    y = `${clickCell[3]}${clickCell[4]}`;
                } else {
                    x = `${clickCell[1]}${clickCell[2]}`;
                    y = clickCell[4];
                }
                break;
        }

        let newX = +x + k;
        let newY = +y + n;
        let id = `x${newX}y${newY}`;

        let divEl = document.getElementById(`${id}`);
        if (divEl !== null) {
            if (divEl.hasChildNodes() === true) {
                let childDivEl = divEl.firstChild;
                childDivEl.focus()
            }
        }
        enteredWord = questionNumber;
    }
}

function activeCell(type) {
    if (type === 'clicked') {
        if(questionNumber !== undefined) {
            cellStyle(questionNumber,'question', 'cell');
            scrollCoordinates = 0;

        }
        questionNumber = event.target.dataset.questionNumber;
        let num;
        cellStyle(questionNumber,'question-active', 'cell-active');
        for (let i = 0; i < document.getElementById(questionNumber).parentNode.childNodes.length; i++) {
            if (document.getElementById(questionNumber).parentNode.childNodes[i] === document.getElementById(questionNumber)) {
                 num = i;

            }
        }
        let part =Math.floor(num/6) ;

        scrollCoordinates = 260 * part;
        document.getElementById(questionNumber).parentNode.scrollTo(0,`${scrollCoordinates}` );
    }
}
function cursorMovementWord(a,b, length) {
    if (clickCell !== undefined && questionNumber !== undefined) {
        console.log(enteredWord);
        const arr = wordCoordinates[`${enteredWord}`];
        let index = arr.indexOf(clickCell);
        let divElOld = document.getElementById(clickCell)
        let childDivElOld = divElOld.firstChild;
        if (+childDivElOld.value.length === +length) {
            if (index + a !== b) {
                let divEl = document.getElementById(`${arr[index + a]}`)
                let childDivEl = divEl.firstChild;
                childDivEl.focus();
            }
        }
    }
}

document.addEventListener('click', event => {
    activeCell( event.target.dataset.cellType);
    enteredWord = questionNumber;
})

buttonCheck.addEventListener('click',check);

crosswordContainer.addEventListener("focusin", (event) => {
    clickCell = event.target.parentNode.id;
    activeCell(event.target.dataset.cellType);
});

document.body.addEventListener('keydown', (e) => {

    switch (e.key)
    {
        case 'ArrowUp' :
            cursorMovement(0,-1);
            break;
        case 'ArrowDown' :
            cursorMovement(0,1);
            break;
        case 'ArrowRight' :
            cursorMovement(1,0);
            break;
        case 'ArrowLeft' :
            cursorMovement(-1,0);
            break;
        case 'Backspace' :
            cursorMovementWord(-1, -1, 0);
            break;
        default :
            if (e.key !== 'Delete') {
                if (clickCell !== undefined && questionNumber !== undefined) {
                    cursorMovementWord(1, wordCoordinates[`${enteredWord}`].length,
                        document.getElementById(clickCell).firstChild.getAttribute('maxlength'));
                }
            }
    }
});

buttonClear.addEventListener('click',clear);


