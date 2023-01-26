/* ==================== VARIÁVEIS GLOBAIS ====================== */
let numberQuestions = 0;
let numberAnswers = 0;
let numberCorrect = 0;
let levels = [];
let allQuizzes = [];
let idCurrentQuizz = 0;

let newQuizz = {};

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
    startScreen2(idCurrentQuizz);
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
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${qual}`);
    idCurrentQuizz = qual;
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

        if (arrAnswers.length === 2) {
            quizScreen.innerHTML +=
                `<div class="question">
              <div class="question-title">
                  <p>${arrQuestions[i].title}</p>
              </div>
              <div class="answer-container-2">
                  <div class="answer ${arrAnswers[0].isCorrectAnswer}" onclick="selectAnswer(this)">
                      <img src="${arrAnswers[0].image}">
                      <p>${arrAnswers[0].text}</p>
                  </div>
                  <div class="answer ${arrAnswers[1].isCorrectAnswer}" onclick="selectAnswer(this)">
                      <img src="${arrAnswers[1].image}">
                      <p>${arrAnswers[1].text}</p>
                  </div>
              </div>
          </div>`;
        }

        if (arrAnswers.length === 3) {
            quizScreen.innerHTML +=
                `<div class="question">
              <div class="question-title">
                  <p>${arrQuestions[i].title}</p>
              </div>
              <div class="answer-container-3-4">
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
              </div>
          </div>`;
        }

        if (arrAnswers.length === 4) {
            quizScreen.innerHTML +=
                `<div class="question">
              <div class="question-title">
                  <p>${arrQuestions[i].title}</p>
              </div>
              <div class="answer-container-3-4">
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
        }

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
    let url;
    try {
        url = new URL(imageUrl);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function showError(error) {
    alert(`Invalid quizz: ${error}`);
    document.querySelector("#quizztitle").value = "";
    document.querySelector("#quizzimg").value = "";
    document.querySelector("#quizzquestions").value = "";
    document.querySelector("#quizzlevels").value = "";
}

function QuizzConfig(){
    let quizztitle = document.querySelector("#quizztitle").value;
    let quizzimg = document.querySelector("#quizzimg").value;
    let quizzquestions = document.querySelector("#quizzquestions").value;
    let quizzlevels = document.querySelector("#quizzlevels").value;

    quizzquestions = Number(quizzquestions);
    quizzlevels = Number(quizzlevels);

   if(!(quizztitle.length >= 20 && quizztitle.length <= 65)) {
    showError("Título do Quiz Inválido");
    return false;
   }
   if(validateImageUrl(quizzimg)===false){
    showError("Imagem Não é um URL");
    return false;
   }
   if(quizzquestions < 3){
    showError("Número de Perguntas Inválido");
    return false;
   }
   if(quizzlevels < 2){
    showError("Número de Níveis Inválido");
    return false;
   }else{
    return true;
   }
}

function proceedpage(){
    if(QuizzConfig() === true){
        newQuizz.title = document.querySelector("#quizztitle").value;
        newQuizz.image = document.querySelector("#quizzimg").value;
        newQuizz.questions = [];
        newQuizz.levels = [];
        console.log(newQuizz);
        document.querySelector('.screennumberthree').classList.add('hidden');
        document.querySelector('.screennumberfour').classList.remove('hidden');
        showInputsQuestions();
    }
}


//  screen number three - create quiz - end // 



// screen number four - create questions - outset // 

function showInputsQuestions() {

    const numQuestions = Number(document.querySelector("#quizzquestions").value);

    for(let i = 0; i<numQuestions; i++){
        if(i===0){
        document.querySelector('.Questions').innerHTML +=
        `<div class="subcontainer">
        <div class="QuestionNumber">
          <div class="QuestionWindow">
            <div class="ToClick">
              <h3>Pergunta ${i+1}</h3>
              <ion-icon class = "hidden" name="create-outline"></ion-icon>
            </div>
            <div class="QuestionConfig">
              <input id="questionTitle" placeholder="Texto da pergunta" type="text" />
              <input id="questionColor" placeholder="Cor de fundo da pergunta" type="text" />
            </div>
          </div>
        </div>
        <div class="QuizzAnswers">
          <h3>Resposta correta</h3>
          <input id="correctAnswer" placeholder="Resposta correta" type="text" />
          <input id="imageCorrectAnswer" placeholder="URL da imagem" type="url" />
        </div>
        <div class="WrongAnswers">
          <h3>Respostas incorretas</h3>
          <input id="wrongAnswer1" placeholder="Resposta incorreta 1" type="text" />
          <input id="imagewrongAnswer1" placeholder="URL da imagem 1" type="url" />
          <input id="wrongAnswer2" placeholder="Resposta incorreta 2" type="text" />
          <input id="imagewrongAnswer2" placeholder="URL da imagem 2" type="url" />
          <input id="wrongAnswer3" placeholder="Resposta incorreta 3" type="text" />
          <input id="imagewrongAnswer3" placeholder="URL da imagem 3" type="url" />
        </div>
        </div>`;
        }else{
        document.querySelector('.Questions').innerHTML +=
        `<div class="subcontainer" onclick="openQuestion(this)">
            <div class="QuestionNumber">
                <div class="QuestionWindow">
                    <div class="ToClick">
                        <h3>Pergunta ${i+1}</h3>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>
                <div class="hidden">
                    <div class="QuestionConfig">
                        <input id="questionTitle" placeholder="Texto da pergunta" type="text" />
                        <input id="questionColor" placeholder="Cor de fundo da pergunta" type="text" />
                    </div>
                </div>
            </div>
        </div>
        <div class=hidden>
            <div class="QuizzAnswers">
                <h3>Resposta correta</h3>
                <input id="correctAnswer" placeholder="Resposta correta" type="text" />
                <input id="imageCorrectAnswer" placeholder="URL da imagem" type="url" />
            </div>
            <div class="WrongAnswers">
                <h3>Respostas incorretas</h3>
                <input id="wrongAnswer1" placeholder="Resposta incorreta 1" type="text" />
                <input id="imagewrongAnswer1" placeholder="URL da imagem 1" type="url" />
                <input id="wrongAnswer2" placeholder="Resposta incorreta 2" type="text" />
                <input id="imagewrongAnswer2" placeholder="URL da imagem 2" type="url" />
                <input id="wrongAnswer3" placeholder="Resposta incorreta 3" type="text" />
                <input id="imagewrongAnswer3" placeholder="URL da imagem 3" type="url" />
            </div>
        </div>
        </div>`;
        }
    }
}

function openQuestion(qual){
    if(qual.classList.contains('markedQ'))
        return;
    qual.querySelector('.hidden').classList.remove('hidden');
    qual.querySelector('.hidden').classList.remove('hidden');
    qual.querySelector('ion-icon').classList.add('hidden');
    qual.classList.add('markedQ');
}

function proceedToLevels(){
    const allQuestions = document.querySelectorAll('.subcontainer');
    for(let i=0; i<allQuestions.length; i++){
        if((allQuestions[i].querySelector('#questionTitle').value).length < 20){
            alert("Preencha os dados corretamente");
            return;
        }
        if((allQuestions[i].querySelector('#questionColor').value).length !== 7 ||
            (allQuestions[i].querySelector('#questionColor').value).charAt(0)!=='#'){
            alert("Preencha os dados corretamente");
            return;
        }
        if((allQuestions[i].querySelector('#correctAnswer').value) === ""){
            alert("Preencha os dados corretamente");
            return;
        }
        if(validateImageUrl(allQuestions[i].querySelector('#imageCorrectAnswer').value) === false){
            alert("Preencha os dados corretamente");
            return;
        }
        if((allQuestions[i].querySelector('#wrongAnswer1').value) === ""){
            alert("Preencha os dados corretamente");
            return;
        }
        if(validateImageUrl(allQuestions[i].querySelector('#imagewrongAnswer1').value) === false){
            alert("Preencha os dados corretamente");
            return;
        }
    }
    for(let i=0; i<allQuestions.length; i++){
        let questObj = {title:allQuestions[i].querySelector('#questionTitle').value,
                            color:allQuestions[i].querySelector('#questionColor').value};

        let answersArr = [];
        answersArr.push({text:allQuestions[i].querySelector('#correctAnswer').value, image:allQuestions[i].querySelector('#imageCorrectAnswer').value, isCorrectAnswer: true});
        for(let j=1; j<=3; j++){
            if(allQuestions[i].querySelector(`#wrongAnswer${j}`).value !== "" && validateImageUrl(allQuestions[i].querySelector(`#imagewrongAnswer${j}`).value)===true){
                answersArr.push({text:allQuestions[i].querySelector(`#wrongAnswer${j}`).value, image:allQuestions[i].querySelector(`#imagewrongAnswer${j}`).value, isCorrectAnswer: false});
            }
        }
        questObj.answers = answersArr;
        newQuizz.questions.push(questObj);
    }
    console.log(newQuizz);
    document.querySelector('.screennumberfour').classList.add('hidden');
    document.querySelector('.screennumberfive').classList.remove('hidden');
    showInputsLevels();
}
 //  screen number four - create questions - end //



//  screen number five - create levels - outset // 

function showInputsLevels(){
    const numLevels = Number(document.querySelector("#quizzlevels").value);
    for(let i = 0; i<numLevels; i++){}
}
//  screen number five - create levels - end // 



//  screen number six - end of quiz creation - outset //  
//  screen number six - end of quiz creation - end // 
