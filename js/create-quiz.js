//for creating
let creatorName = "";
const db = firebase.database();
const button = document.getElementById("btn");
const input = document.getElementById("questions");
const list = document.getElementById("selected-questions-list");
const options = document.getElementById("options");
const blackScreen = document.getElementById("behind-screen");
const whitescreen = document.getElementById("alert");
const submit = document.getElementById("submit");
let creatorId = undefined;
let userQuestionSet = [];
const pageTransition = document.querySelector(".screen");

// for sharing
const shareLabel = document.querySelector(".container__share-link");
const copyButton = document.getElementById("copy");
const copyLog = document.querySelector(".container__share-copy-log");
const containerQuestion = document.querySelector(".container__question");
const containerAnswer = document.querySelector(".container__answer");
const containerAddButton = document.querySelector(".container__add-button");
const containerList = document.querySelector(".container__list");
const containerSubmitButton = document.querySelector(
  ".container__submit-button"
);
const containerShare = document.querySelector(".container__share");

window.onload = function () {
  setPositions();
  let myURL = document.location.href;
  creatorName = CryptoJS.AES.decrypt(myURL.split("?")[1], "413576").toString(
    CryptoJS.enc.Utf8
  );
  showOptions(
    Number(input.value),
    questionSet[Number(input.value)].options.length
  );
  setQuestionOptions();
  pageTransition.classList.add("page-transition");
};

const hideContainers = () => {
  containerQuestion.style.display = "none";
  containerAnswer.style.display = "none";
  containerAddButton.style.display = "none";
  containerList.style.display = "none";
  containerSubmitButton.style.display = "none";
  containerShare.style.display = "block";
  pageTransition.classList.add("page-transition");
};

const createQuestionSet = () => {
  //send the data to firebase
  if (userQuestionSet.length == 0) {
    blackScreen.style.visibility = "visible";
    whitescreen.style.visibility = "visible";
    whitescreen.innerHTML = "Please select atlest one question to continue!";
  } else {
    creatorId = db.ref("/creators").push({ creator_name: creatorName }).key;
    db.ref("/creators/" + creatorId)
      .child("total_questions")
      .set(userQuestionSet.length);
    db.ref("/creators/" + creatorId)
      .child("question-list")
      .set(userQuestionSet);
    pageTransition.classList.remove("page-transition");
    setTimeout(() => {
      shareLabel.value = myWebAddress + "/redirect/home-page.html?" + creatorId;
      hideContainers();
    }, 1000);
  }
};

const setQuestionOptions = () => {
  for (var i = 0; i < questionSet.length; i++) {
    var option = document.createElement("option");
    option.value = questionSet[i].questionID;
    option.innerHTML = questionSet[i].question;
    input.appendChild(option);
  }
};

const clearList = () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

const showList = (set) => {
  for (var i = 0; i < set.length; i++) {
    const que = document.createElement("li");
    const ans = document.createElement("li");
    que.innerHTML = `🌹. ${set[i].question}`;
    ans.innerText = `-> ${
      questionSet[set[i].questionID].options[set[i].answer]
    }`;
    list.appendChild(que);
    list.appendChild(ans);
  }
};

const clearOptions = () => {
  //clear options
  while (options.firstChild) {
    options.removeChild(options.firstChild);
  }
};

const showOptions = (questionNo, size) => {
  for (var i = 0; i < size; i++) {
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("id", `option${i}`);
    radio.setAttribute("name", "option");
    radio.value = `${i}`;
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

const addQuestion = function () {
  var check = false;
  for (const part of document.querySelectorAll(
    '.radio-container input[type="radio"]'
  )) {
    if (part.checked) {
      check = true;
    }
  }
  if (!check) {
    blackScreen.style.visibility = "visible";
    whitescreen.style.visibility = "visible";
    whitescreen.innerHTML = "Please select one option to continue!";
  } else {
    clearList();
    var found = false;
    var inputValue = Number(input.value);
    var newQuestionSet = {
      questionID: inputValue,
      question: questionSet[inputValue].question,
    };
    for (var i = 0; i < userQuestionSet.length; i++) {
      if (userQuestionSet[i].questionID === inputValue) {
        found = true;
        var answer;
        for (const rb of document.querySelectorAll(
          '.radio-container input[type="radio"]'
        )) {
          if (rb.checked) {
            answer = rb.value;
          }
        }
        userQuestionSet[i].answer = Number(answer);
      }
    }
    if (!found) {
      var answer;
      for (const rb of document.querySelectorAll(
        '.radio-container input[type="radio"]'
      )) {
        if (rb.checked) {
          answer = rb.value;
        }
      }
      newQuestionSet.answer = Number(answer);
      userQuestionSet.push(newQuestionSet);
    }
    showList(userQuestionSet);
  }
};

button.addEventListener("click", addQuestion);
input.addEventListener("change", () => {
  clearOptions();
  showOptions(
    Number(input.value),
    questionSet[Number(input.value)].options.length
  );
});

blackScreen.addEventListener("click", () => {
  if (blackScreen.style.visibility === "visible") {
    blackScreen.style.visibility = "hidden";
    whitescreen.style.visibility = "hidden";
  }
});

submit.addEventListener("click", createQuestionSet);

copyButton.addEventListener("click", () => {
  shareLabel.select();
  shareLabel.setSelectionRange(0, 99999);

  document.execCommand("copy");

  copyLog.style.visibility = "visible";
  setTimeout(() => {
    copyLog.style.visibility = "hidden";
  }, 2000);
});
