const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const questionContainer = document.querySelector(".quiz-container__question");
const answerContainer = document.querySelector(".quiz-container__answer");
let solverName = undefined;
let creatorId = undefined;
const db = firebase.database();
let databaseCollection = undefined;
let solverQuestionSet = undefined;
const options = document.getElementById("options");
const blackScreen = document.getElementById("behind-screen");
const whitescreen = document.getElementById("alert");
var currentQuestion = 0;
var score = 0;
var answerSet = [];
const pageTransition = document.querySelector(".screen");
const errorLoading = document.querySelector(".error-loading-container");
var creatorName = undefined;
const scoreBoard = document.querySelector(".scoreboard");
const answerTitle = document.querySelector(".answer-list__tag-line");
const questionAnswer = document.querySelector(".answer-list");

window.onload = function () {
  setPositions();
  const myURL = window.location.href;
  const info = myURL.split("?")[1];
  solverName = CryptoJS.AES.decrypt(info.split("&")[0], "413576").toString(
    CryptoJS.enc.Utf8
  );
  creatorId = info.split("&")[1];
  const ref = db.ref("/creators/" + creatorId);
  ref.on("value", (snap) => {
    databaseCollection = snap.val();
    if (databaseCollection !== null) {
      solverQuestionSet = databaseCollection["question-list"];
      creatorName = databaseCollection.creator_name;
      checkPrevButton();
      checkNextButton();
      loadQuestionAnswer(
        solverQuestionSet[0].questionID,
        questionSet[solverQuestionSet[0].questionID].options.length
      );
      pageTransition.classList.add("page-transition");
    } else {
      pageTransition.classList.add("page-transition");
      errorLoading.classList.add("display-error");
    }
  });
};

const sendScore = () => {
  const date = new Date();
  const currentDateTime =
    date.getDate() +
    "/" +
    date.getMonth() +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  db.ref("/creators/" + creatorId + "/solved_by").push({
    solver_date_time: currentDateTime,
    solver_name: solverName,
    solver_score: score,
  });
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

  for (var i = 0; i < solverQuestionSet.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = `Q.${i + 1} ${solverQuestionSet[i].question}`;
    const questionDiv = document.createElement("div");
    questionDiv.appendChild(p);
    questionDiv.classList.add("answer-list__question");

    const answerDiv = document.createElement("div");
    const answerImgDiv = document.createElement("div");
    answerImgDiv.style.background = `url("../img/q${
      solverQuestionSet[i].questionID + 1
    }/option${solverQuestionSet[i].answer + 1}.jpg")`;
    answerImgDiv.classList.add("image");
    answerImgDiv.style.backgroundSize = "cover";
    answerImgDiv.style.backgroundPosition = "center";
    answerDiv.appendChild(answerImgDiv);
    answerDiv.classList.add("answer-list__answer");

    const answerCardDiv = document.createElement("div");
    answerCardDiv.appendChild(questionDiv);
    answerCardDiv.appendChild(answerDiv);
    answerCardDiv.classList.add("answer-list__answer-card");

    for (let j = 0; j < answerSet.length; j++) {
      if (
        Number(answerSet[j][0]) === solverQuestionSet[i].questionID &&
        Number(answerSet[j][1]) === solverQuestionSet[i].answer
      ) {
        answerCardDiv.style.background = "green";
      }
    }
    questionAnswer.appendChild(answerCardDiv);
  }
};

const clearOptions = () => {
  //clear options
  while (options.firstChild) {
    options.removeChild(options.firstChild);
  }
};

const checkPrevButton = () => {
  if (currentQuestion > 0) {
    prevButton.disabled = false;
  } else {
    prevButton.disabled = true;
  }
  if (currentQuestion + 1 !== solverQuestionSet.length) {
    nextButton.innerHTML = "Next";
  }
};

const checkNextButton = () => {
  if (currentQuestion + 1 === solverQuestionSet.length) {
    nextButton.innerHTML = "submit";
  }
};

const checkOptions = (question) => {
  for (const part of document.querySelectorAll(
    '.radio-container input[type="radio"]'
  )) {
    if (part.checked) {
      check = true;
    }
  }
};

const adjustSolution = (part) => {
  var found = false;
  if (answerSet.length === 0) {
    answerSet.push([
      solverQuestionSet[currentQuestion].questionID,
      Number(part.value),
      currentQuestion,
    ]);
  } else {
    for (const obj of answerSet) {
      if (obj[0] === solverQuestionSet[currentQuestion].questionID) {
        found = true;
        obj[1] = Number(part.value);
      }
    }
    if (found === false) {
      answerSet.push([
        solverQuestionSet[currentQuestion].questionID,
        Number(part.value),
        currentQuestion,
      ]);
    }
  }
};

const saveOption = (cquestion) => {
  var found = false;
  for (const part of document.querySelectorAll(
    '.radio-container input[type="radio"]'
  )) {
    if (part.checked) {
      adjustSolution(part);
    }
  }
};

const calcScore = () => {
  for (var i = 0; i < answerSet.length; i++) {
    for (var j = 0; j < solverQuestionSet.length; j++) {
      if (
        solverQuestionSet[j].questionID === answerSet[i][0] &&
        solverQuestionSet[j].answer === answerSet[i][1]
      ) {
        score = score + 1;
      }
    }
  }
};

const QuestionModifier = (questionNo) => {
  var newQuestion =
    "Q." + (currentQuestion + 1) + " " + questionSet[questionNo].question;
  newQuestion = newQuestion.replace("do you", "does " + creatorName);
  newQuestion = newQuestion.replace("your", creatorName + "'s");
  newQuestion = newQuestion.replace("you", creatorName);
  return newQuestion;
};

const loadQuestionAnswer = (questionNo, size) => {
  questionContainer.innerHTML = QuestionModifier(questionNo);

  for (var i = 0; i < size; i++) {
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("id", `option${i}`);
    radio.setAttribute("name", "option");
    radio.value = `${i}`;
    for (var j = 0; j < answerSet.length; j++) {
      if (
        answerSet[j][0] === solverQuestionSet[currentQuestion].questionID &&
        currentQuestion === answerSet[j][2] &&
        i === answerSet[j][1]
      ) {
        radio.setAttribute("checked", "checked");
      }
    }
    const label = document.createElement("label");
    label.setAttribute("for", `option${i}`);
    label.setAttribute("class", "radio-label");
    label.style.backgroundImage = `url("../img/q${questionNo + 1}/option${
      i + 1
    }.jpg")`;
    const div = document.createElement("div");
    div.setAttribute("class", "radio-container");
    div.appendChild(radio);
    div.appendChild(label);
    const elem = document.createElement("li");
    elem.appendChild(div);
    options.appendChild(elem);
  }
};

nextButton.addEventListener("click", () => {
  if (currentQuestion < solverQuestionSet.length - 1) {
    saveOption(currentQuestion);
    currentQuestion = currentQuestion + 1;
    clearOptions();
    loadQuestionAnswer(
      solverQuestionSet[currentQuestion].questionID,
      questionSet[solverQuestionSet[currentQuestion].questionID].options.length
    );
  } else {
    //show backdrop error
    saveOption(currentQuestion);
    if (answerSet.length === solverQuestionSet.length) {
      pageTransition.classList.remove("page-transition");
      setTimeout(() => {
        calcScore();
        sendScore();
        clearOptions();
        showScore();
        showAnswers();
        document.querySelector(".solver-screen").style.display = "none";
        document.querySelector(".answer-screen").style.display = "block";
      }, 1000);
    } else {
      blackScreen.style.visibility = "visible";
      whitescreen.style.visibility = "visible";
      whitescreen.innerHTML = "Please solve all the questions to submit!";
    }
  }
  checkNextButton();
  checkPrevButton();
});

prevButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    saveOption(currentQuestion);
    currentQuestion = currentQuestion - 1;

    clearOptions();
    loadQuestionAnswer(
      solverQuestionSet[currentQuestion].questionID,
      questionSet[solverQuestionSet[currentQuestion].questionID].options.length
    );
  }
  checkNextButton();
  checkPrevButton();
});

blackScreen.addEventListener("click", () => {
  if (blackScreen.style.visibility === "visible") {
    blackScreen.style.visibility = "hidden";
    whitescreen.style.visibility = "hidden";
  }
});
