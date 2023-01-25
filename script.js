/* ==================== VARIÁVEIS GLOBAIS ====================== */
let numberQuestions = 0;
let numberAnswers = 0;
let numberCorrect = 0;
let levels = [];

// screen number one - quiz list - outset --> //  
//  screen number one - quiz list - end --> // 


 
//  screen number two - play the quiz - outset // 
function finishCheck(){
    const quizScreen = document.querySelector('.screennumbertwo');
    const finalScore = Math.round((numberCorrect/numberQuestions)*100);
    let qualLevel = -1;
    for(let i = levels.length-1; i>=0; i--){
        if(levels[i].minValue <= finalScore){
            qualLevel = i;
            break;
        }
    }
    quizScreen.innerHTML += 
    `<div class = "gameScore">
        <div class = "scoreTitle">
            <p>${finalScore}% de acerto: ${levels[qualLevel].title}</p>
        </div>
        <div class="scoreContainer">
            <img src="${levels[qualLevel].image}">
            <p>${levels[qualLevel].text}</p>
        </div>
    </div>`;
    document.querySelector('.gameScore').scrollIntoView();
};

function selectAnswer(resposta){
    if(resposta.parentNode.classList.contains('marked'))
        return;
    resposta.parentNode.classList.add('marked');
    const todasAsRespostas = (resposta.parentNode).querySelectorAll('.answer');
    if(resposta.classList.contains('true'))
        numberCorrect++;
    for(let i = 0; i<todasAsRespostas.length; i++){
        if(todasAsRespostas.item(i).classList.contains('true')){
            todasAsRespostas.item(i).querySelector('p').style.color = "#009C22";
        }else{
            todasAsRespostas.item(i).querySelector('p').style.color = "#FF4B4B";
        }
        if(todasAsRespostas.item(i)!==resposta)
            todasAsRespostas.item(i).style.opacity = "0.3";
    }
    numberAnswers++;
    if(numberAnswers === numberQuestions){
        setTimeout(finishCheck, 2000);
    }else{
        setTimeout(`document.querySelector('.question .answer-container:not(.marked)').parentNode.scrollIntoView()`, 2000);
    }
}

function startScreen2(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1");
    promise.then(successScreen2);
    promise.catch(errorScreen2);
}

function successScreen2(dados){
    console.log("DEU CERTO!!!");
    console.log(dados);
    const quizScreen = document.querySelector('.screennumbertwo')
    levels = dados.data.levels;

    quizScreen.innerHTML += 
    `<div class="img-title">
        <img src="${dados.data.image}">
        <p>${dados.data.title}</p>
    </div>`;

    const arrQuestions = dados.data.questions;
    numberQuestions = arrQuestions.length;
    for(let i = 0; i<arrQuestions.length; i++){
        const arrAnswers = arrQuestions[i].answers;
        for (let i = arrAnswers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let aux = arrAnswers[i];
            arrAnswers[i] = arrAnswers[j];
            arrAnswers[j] = aux;
        }

        quizScreen.innerHTML +=
        `<div class="question">
            <div class="question-title">
                <p>${arrQuestions[i].title}</p>
            </div>
            <div class="answer-container">
                <div class="answer ${arrAnswers[0].isCorrectAnswer}" onclick="selectAnswer(this)">
                    <img src="${arrAnswers[0].image}">
                    <p>${arrAnswers[0].text}</p>
                </div>
                <div class="answer ${arrAnswers[1].isCorrectAnswer}" onclick="selectAnswer(this)">
                    <img src="${arrAnswers[1].image}">
                    <p>${arrAnswers[1].text}</p>
                </div>
                <div class="answer ${arrAnswers[2].isCorrectAnswer}" onclick="selectAnswer(this)">
                    <img src="${arrAnswers[2].image}">
                    <p>${arrAnswers[2].text}</p>
                </div>
                <div class="answer ${arrAnswers[3].isCorrectAnswer}" onclick="selectAnswer(this)">
                    <img src="${arrAnswers[3].image}">
                    <p>${arrAnswers[3].text}</p>
                </div>
            </div>
        </div>`;

        document.querySelector(`.question:last-child .question-title`).style.backgroundColor = arrQuestions[i].color;
    }
}

function errorScreen2(dados){
    console.log("DEU ERRADO!!!");
    console.log(dados);
}

//  screen number two - play the quiz - end // 



 //  screen number three - create quiz - outset // 
//  screen number three - create quiz - end // 



// screen number four - create questions - outset // 
//  screen number four - create questions - end // 



//  screen number five - create levels - outset // 
//  screen number five - create levels - end // 



//  screen number six - end of quiz creation - outset //  
//  screen number six - end of quiz creation - end // 