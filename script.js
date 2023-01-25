// screen number one - quiz list - outset --> //  
//  screen number one - quiz list - end --> // 


 
//  screen number two - play the quiz - outset // 
function startScreen2(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1");
    promise.then(successScreen2);
    promise.catch(errorScreen2);
}

function successScreen2(dados){
    console.log("DEU CERTO!!!");
    console.log(dados);
    const quizScreen = document.querySelector('.screennumbertwo')

    quizScreen.innerHTML += 
    `<div class="img-title">
        <img src="${dados.data.image}">
        <p>${dados.data.title}</p>
    </div>`;

    const arrQuestions = dados.data.questions;
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
                <div class="answer">
                    <img src="${arrAnswers[0].image}">
                    <p>${arrAnswers[0].text}</p>
                </div>
                <div class="answer">
                    <img src="${arrAnswers[1].image}">
                    <p>${arrAnswers[1].text}</p>
                </div>
                <div class="answer">
                    <img src="${arrAnswers[2].image}">
                    <p>${arrAnswers[2].text}</p>
                </div>
                <div class="answer">
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