const button = document.getElementById("create-quiz");
const pageTransition = document.querySelector(".screen");

window.onload = () => {
  setPositions();
  pageTransition.classList.add("page-transition");
};

button.addEventListener("click", () => {
  pageTransition.classList.remove("page-transition");
  window.location.href = "../redirect/home-page.html";
});
