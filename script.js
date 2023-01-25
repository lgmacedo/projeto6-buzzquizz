// screen number one - quiz list - outset --> //  
//  screen number one - quiz list - end --> // 


 
//  screen number two - play the quiz - outset // 
function iniciaPagina2(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1");
    promise.then(sucessoPag2);
    promise.catch(erroPag2);
}

function sucessoPag2(dados){
    console.log("DEU CERTO!!!");
    console.log(dados);
    document.querySelector('.screennumbertwo .img-title p').innerHTML = dados.data.title;
    document.querySelector('.screennumbertwo .img-title img').src = dados.data.image;
}

function erroPag2(dados){
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