let hostSet = undefined;
let score = undefined;
let creatorName = undefined;
let answerSet = undefined;
const scoreBoard = document.querySelector(".scoreboard");
const answerTitle = document.querySelector(".answer-list__tag-line");
const questionAnswer = document.querySelector(".answer-list");

window.onload = () => {
  storeInVar();
  showScore();
  showAnswers();
  console.log(hostSet);
};

const storeInVar = () => {
  hostSet = JSON.parse(sessionStorage.getItem("hostSet"));
  score = Number(sessionStorage.getItem("score"));
  creatorName = sessionStorage.getItem("creatorName");
  answerSet = Array(sessionStorage.getItem("solverSet").split(","));
  console.log(answerSet);
};

const showScore = () => {
  const h2 = document.createElement("h2");
  h2.innerHTML = score;
  if (score == 0) {
    h2.style.color = "red";
  }
  scoreBoard.appendChild(h2);
};

const showAnswers = () => {
  answerTitle.innerHTML =
    "Answers of " + creatorName + "'s quiz are as follows!";
  const help = document.createElement("p");
  help.innerHTML = "(Red: wrong answer & Green: right answer)";
  answerTitle.appendChild(help);
  for (var i = 0; i < hostSet.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = `Q.${i + 1} ${hostSet[i].question}`;
    const questionDiv = document.createElement("div");
    questionDiv.appendChild(p);
    questionDiv.classList.add("answer-list__question");

    const answerDiv = document.createElement("div");
    const answerImgDiv = document.createElement("div");
    answerImgDiv.style.background = `url("../img/q${ hostSet[i].questionID + 1}/option${
      hostSet[i].answer + 1
    }.jpg")`;
    answerImgDiv.classList.add("image");
    answerImgDiv.style.backgroundSize = "cover";
    answerImgDiv.style.backgroundPosition = "center";
    answerDiv.appendChild(answerImgDiv);
    answerDiv.classList.add("answer-list__answer");

    const answerCardDiv = document.createElement("div");
    answerCardDiv.appendChild(questionDiv);
    answerCardDiv.appendChild(answerDiv);
    answerCardDiv.classList.add("answer-list__answer-card");

      for(let j=0;j<answerSet.length;j++) {
        if (
          Number(answerSet[j][0]) === hostSet[i].questionID &&
          Number(answerSet[j][1]) === hostSet[i].answer
        ) {
          answerCardDiv.style.background = "green";
         }
       }
    questionAnswer.appendChild(answerCardDiv);
  }
};
