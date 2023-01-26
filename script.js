/* ==================== VARIÁVEIS GLOBAIS ====================== */
let numberQuestions = 0;
let numberAnswers = 0;
let numberCorrect = 0;
let levels = [];
let allQuizzes = [];

// screen number one - quiz list - outset --> //  

function startScreen1() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(successScreen1);
    promise.catch(errorScreen1);
}

function errorScreen1(response) {
    console.log("DEU ERRADO!!!");
    console.log(response);
}

function successScreen1(response) {
    console.log("DEU CERTO!!!");
    console.log(response);

    allQuizzes = response.data;

    listAllQuizes();
}

function listAllQuizes() {
    const quizzes = document.querySelector('.all-quizzes .quizzes');

    quizzes.innerHTML = '';

    for (let i = 0; i < allQuizzes.length; i++) {

        const template = `
        <div class="quizz" onclick="startScreen2(${allQuizzes[i].id})">
            <img src="${allQuizzes[i].image}" />
            <h2 class="quizz-title">${allQuizzes[i].title}</h2>
          </div>
        `

        quizzes.innerHTML = quizzes.innerHTML + template;
    }


}

function goToCreateQuiz() {
    const screen1 = document.querySelector('.screennumberone');
    screen1.classList.add('hidden');

    const screen3 = document.querySelector('.screennumberthree');
    screen3.classList.remove('hidden');

}

startScreen1();

//  screen number one - quiz list - end --> // 



//  screen number two - play the quiz - outset // 
function quizzReinit() {
    numberQuestions = 0;
    numberAnswers = 0;
    numberCorrect = 0;
    levels = [];
    document.querySelector('.screennumbertwo').scrollIntoView();
    startScreen2();
}

function backHome() {
    numberQuestions = 0;
    numberAnswers = 0;
    numberCorrect = 0;
    levels = [];
    document.querySelector('.screennumbertwo').classList.add('hidden');
    document.querySelector('.screennumberone').classList.remove('hidden');
    document.querySelector('.screennumberone').scrollIntoView();
    startScreen1();
}

function finishCheck() {
    const quizScreen = document.querySelector('.screennumbertwo');
    const finalScore = Math.round((numberCorrect / numberQuestions) * 100);
    let qualLevel = -1;
    for (let i = levels.length - 1; i >= 0; i--) {
        if (levels[i].minValue <= finalScore) {
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

    quizScreen.innerHTML +=
        `<div class="buttons">
        <button class="buttonReinit" onclick="quizzReinit()">Reiniciar Quizz</button>
        <button class="buttonBackHome" onclick="backHome()">Voltar pra home</button>
    </div>`;
};

function selectAnswer(resposta) {
    if (resposta.parentNode.classList.contains('marked'))
        return;
    resposta.parentNode.classList.add('marked');
    const todasAsRespostas = (resposta.parentNode).querySelectorAll('.answer');
    if (resposta.classList.contains('true'))
        numberCorrect++;
    for (let i = 0; i < todasAsRespostas.length; i++) {
        if (todasAsRespostas.item(i).classList.contains('true')) {
            todasAsRespostas.item(i).querySelector('p').style.color = "#009C22";
        } else {
            todasAsRespostas.item(i).querySelector('p').style.color = "#FF4B4B";
        }
        if (todasAsRespostas.item(i) !== resposta)
            todasAsRespostas.item(i).style.opacity = "0.3";
    }
    numberAnswers++;
    if (numberAnswers === numberQuestions) {
        setTimeout(finishCheck, 2000);
    } else {
        setTimeout(`document.querySelector('.question .answer-container:not(.marked)').parentNode.scrollIntoView()`, 2000);
    }
}

function startScreen2(qual) {
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/2`);
    promise.then(successScreen2);
    promise.catch(errorScreen2);
}

function successScreen2(dados) {
    console.log("DEU CERTO!!!");
    console.log(dados);

    const quizScreen = document.querySelector('.screennumbertwo');
    levels = dados.data.levels;

    document.querySelector('.screennumberone').classList.add('hidden');
    quizScreen.classList.remove('hidden');

    quizScreen.innerHTML =
        `<header class="title-screen" onclick="startScreen2()">
        <h1>BuzzQuizz</h1>
    </header>`;

    quizScreen.querySelector('header').scrollIntoView();

    quizScreen.innerHTML +=
        `<div class="img-title">
        <img src="${dados.data.image}">
        <p>${dados.data.title}</p>
    </div>`;

    const arrQuestions = dados.data.questions;
    numberQuestions = arrQuestions.length;
    for (let i = 0; i < arrQuestions.length; i++) {
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

function errorScreen2(dados) {
    console.log("DEU ERRADO!!!");
    console.log(dados);
}

//  screen number two - play the quiz - end // 



//  screen number three - create quiz - outset // 


function validateImageUrl(imageUrl) {
    if (
        !imageUrl ||
        !(imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
    ) {
        return false;
    }

    return true;
}

function validateQuizz(quizz) {
    if (!quizz.title || quizz.title.length < 20 || quizz.title.length > 65) {
        showError("Invalid quizz title");
        return false;
    }
    if (!validateImageUrl(quizz.image)) {
        showError("Invalid quizz image url");
        return false;
    }
    if (!quizz.questions || quizz.questions.length < 3) {
        showError("Not enough questions");
        return false;
    }
    if (!quizz.levels || quizz.levels.length < 2) {
        showError("Not enough levels");
        return false;
    }
}

function valuesforcreation(
    titlescreenthree,
    imageUrlscreenthree,
    numberOfQuestionsscreenthree,
    numberOfLevelsscreenthree
) {
    numberOfLevelsscreenthree = Number(numberOfLevelsscreenthree);
    numberOfQuestionsscreenthree = Number(numberOfQuestionsscreenthree);

    if (!titlescreenthree || titlescreenthree.length < 20 || titlescreenthree.length > 65) {
        showError("Invalid quizz title");
        return false;
    }
    if (!validateImageUrl(imageUrlscreenthree)) {
        showError("Invalid quizz image url");
        return false;
    }
    if (!numberOfQuestionsscreenthree || numberOfQuestionsscreenthree < 3) {
        showError("Not enough questions");
        return false;
    }
    if (!numberOfLevelsscreenthree || numberOfLevelsscreenthree < 2) {
        showError("Not enough levels");
        return false;
    }

    return true;
}

function proceedpage() {
    const quizztitle = document.querySelector("#quizztitle");
    const quizzimg = document.querySelector("#quizzimg");
    const quizzquestions = document.querySelector("#quizzquestions");
    const quizzlevels = document.querySelector("#quizzlevels");

    if (
        valuesforcreation(
            quizztitle.value,
            quizzimg.value,
            quizzquestions.value,
            quizzlevels.value
        )
    ) {
        const question = {
            title: quizztitle.value,
            image: quizzimg.value,
            numberOfQuestions: Number(quizzquestions.value),
            numberOfLevels: Number(quizzlevels.value),
        };
        // a preencher //
    } else {
        alert("Quizz Inválido");
    }
}


//  screen number three - create quiz - end // 



// screen number four - create questions - outset // 



//  screen number four - create questions - end // 



//  screen number five - create levels - outset // 
//  screen number five - create levels - end // 



//  screen number six - end of quiz creation - outset //  
//  screen number six - end of quiz creation - end // 