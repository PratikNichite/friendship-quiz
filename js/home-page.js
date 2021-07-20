const blackScreen = document.getElementById("behind-screen");
const inputField = document.getElementById("username");
const button = document.getElementById("submit");
const whitescreen = document.getElementById("alert");
let creatorId = undefined;
const title = document.getElementById("title-quiz");
const pageTransition = document.querySelector(".screen");
var status = "create";
const scoreList = document.getElementById("scores");
const db = firebase.database();
var creatorName = undefined;

window.onload = function () {
  setPositions();
  inputField.setAttribute("autocomplete", "off");
  let myURL = document.location.href;
  creatorId = myURL.split("?")[1];
  if (creatorId !== undefined) {
    updateScores();
    const ref = db.ref("/creators/" + creatorId + "/creator_name");
    ref.on("value", (snap) => {
      creatorName = snap.val();
      title.innerText = "Solve " + creatorName + "'s Quiz";
      button.value = "Solve";
      status = "solve";
    });
  } else {
    document.querySelector(".score-list").style.display = "none";
    status = "create";
  }
  pageTransition.classList.add("page-transition");
};

const updateScores = () => {
  const ref = db.ref("/creators/" + creatorId + "/solved_by");
  ref.on("value", fetchData, errorFetching);
};

const fetchData = (data) => {
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild);
  }

  if (data.val() !== null) {
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    td1.innerHTML = "Date & Time";
    td2.innerHTML = "Name";
    td3.innerHTML = "Score";
    const tr = document.createElement("tr");
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    scoreList.appendChild(tr);
    for (const [key, solver] of Object.entries(data.val())) {
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      td1.innerHTML = solver.solver_date_time;
      td2.innerHTML = solver.solver_name;
      td3.innerHTML = solver.solver_score;
      const tr = document.createElement("tr");
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      scoreList.appendChild(tr);
    }
  } else {
    const td = document.createElement("td");
    td.innerHTML = "Nobody has solved yet!";
    const tr = document.createElement("tr");
    tr.appendChild(td);
    scoreList.appendChild(tr);
  }
};

const errorFetching = () => {
  //blah
};

const enc = function () {
  return CryptoJS.AES.encrypt(inputField.value, "413576");
};

button.addEventListener("click", () => {
  if (inputField.value === "") {
    blackScreen.style.visibility = "visible";
    whitescreen.style.visibility = "visible";
  } else if (status === "solve") {
    //change title on home page
    const input = enc();
    window.location.href = "../redirect/solve.html?" + input + "&" + creatorId;
  } else if (status === "create") {
    const input = enc();
    pageTransition.classList.remove("page-transition");
    window.location.href = "../redirect/create-quiz.html?" + input;
  }
});

blackScreen.addEventListener("click", () => {
  if (blackScreen.style.visibility === "visible") {
    blackScreen.style.visibility = "hidden";
    whitescreen.style.visibility = "hidden";
  }
});
